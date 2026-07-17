import JSZip from 'jszip';
import { useEffect, useMemo, useRef, useState } from 'react';

type PlatformId = 'google-display' | 'google-video' | 'meta';
type FormatId = string;

type Crop = {
  x: number;
  y: number;
  zoom: number;
};

type FitMode = 'cover' | 'contain';
type ExportKind = 'image/png' | 'image/jpeg' | 'image/webp';

type SourceInfo = {
  width: number;
  height: number;
  bytes: number;
};

type CropLayout = {
  drawWidth: number;
  drawHeight: number;
  drawX: number;
  drawY: number;
};

type SavedProject = {
  version: 1;
  campaignName: string;
  fileName: string;
  sourceInfo: SourceInfo;
  sourceBlob: Blob;
  platformId: PlatformId;
  selectedId: FormatId;
  crops: Record<FormatId, Crop>;
  motion: boolean;
  showSafeZones: boolean;
  fitMode?: FitMode;
  exportKind?: ExportKind;
};

type Format = {
  id: FormatId;
  label: string;
  placement: string;
  width: number;
  height: number;
  safeZone: 'feed' | 'story' | 'square' | 'landscape' | 'banner' | 'video-wide';
};

type PlatformPack = {
  id: PlatformId;
  label: string;
  shortLabel: string;
  description: string;
  outputLabel: string;
  formats: Format[];
};

const PLATFORM_PACKS: PlatformPack[] = [
  {
    id: 'google-display',
    label: 'Google Display',
    shortLabel: 'Display',
    description: 'Responsive Display, Performance Max, and common uploaded banner sizes.',
    outputLabel: 'Google Display pack',
    formats: [
      { id: 'google-landscape', label: '1.91:1', placement: 'Responsive landscape', width: 1200, height: 628, safeZone: 'landscape' },
      { id: 'google-square', label: '1:1', placement: 'Responsive square', width: 1200, height: 1200, safeZone: 'square' },
      { id: 'google-portrait', label: '4:5', placement: 'Responsive portrait', width: 960, height: 1200, safeZone: 'feed' },
      { id: 'google-medium-rectangle', label: '300×250', placement: 'Medium rectangle', width: 300, height: 250, safeZone: 'banner' },
      { id: 'google-leaderboard', label: '728×90', placement: 'Leaderboard', width: 728, height: 90, safeZone: 'banner' },
      { id: 'google-half-page', label: '300×600', placement: 'Half page', width: 300, height: 600, safeZone: 'banner' },
    ],
  },
  {
    id: 'google-video',
    label: 'Google Video',
    shortLabel: 'Video',
    description: 'YouTube landscape, Shorts vertical, and square video source frames.',
    outputLabel: 'Google Video source pack',
    formats: [
      { id: 'youtube-landscape', label: '16:9', placement: 'YouTube landscape', width: 1920, height: 1080, safeZone: 'video-wide' },
      { id: 'youtube-shorts', label: '9:16', placement: 'YouTube Shorts', width: 1080, height: 1920, safeZone: 'story' },
      { id: 'youtube-square', label: '1:1', placement: 'YouTube square', width: 1080, height: 1080, safeZone: 'square' },
    ],
  },
  {
    id: 'meta',
    label: 'Meta Ads',
    shortLabel: 'Meta',
    description: 'Optional Facebook and Instagram feed, Reels, Stories, and link placements.',
    outputLabel: 'Meta Ads pack',
    formats: [
      { id: 'meta-feed', label: '4:5', placement: 'Feed', width: 1080, height: 1350, safeZone: 'feed' },
      { id: 'meta-story', label: '9:16', placement: 'Stories + Reels', width: 1080, height: 1920, safeZone: 'story' },
      { id: 'meta-square', label: '1:1', placement: 'Square + carousel', width: 1080, height: 1080, safeZone: 'square' },
      { id: 'meta-landscape', label: '1.91:1', placement: 'Link placement', width: 1200, height: 628, safeZone: 'landscape' },
    ],
  },
];

const ALL_FORMATS = PLATFORM_PACKS.flatMap((pack) => pack.formats);

const HERO_PLATFORMS = ['Google', 'Meta', 'TikTok', 'YouTube', 'LinkedIn'] as const;

const DEFAULT_CROP: Crop = { x: 50, y: 50, zoom: 1 };
const PROJECT_DB = 'ad-studio-projects';
const PROJECT_STORE = 'projects';
const LAST_PROJECT_KEY = 'last-project';
const GOOGLE_DISPLAY_SOFT_LIMIT = 150 * 1024;

const EXPORT_OPTIONS: { kind: ExportKind; label: string; extension: string; quality: number }[] = [
  { kind: 'image/png', label: 'PNG', extension: 'png', quality: 1 },
  { kind: 'image/jpeg', label: 'JPG', extension: 'jpg', quality: 0.86 },
  { kind: 'image/webp', label: 'WebP', extension: 'webp', quality: 0.86 },
];

function makeDefaultCrops(): Record<FormatId, Crop> {
  return Object.fromEntries(ALL_FORMATS.map((format) => [format.id, { ...DEFAULT_CROP }]));
}

function openProjectDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROJECT_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PROJECT_STORE)) {
        request.result.createObjectStore(PROJECT_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadSavedProject(): Promise<SavedProject | null> {
  const db = await openProjectDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE, 'readonly');
    const request = transaction.objectStore(PROJECT_STORE).get(LAST_PROJECT_KEY);
    request.onsuccess = () => resolve((request.result as SavedProject | undefined) ?? null);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function saveProject(project: SavedProject) {
  const db = await openProjectDb();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE, 'readwrite');
    transaction.objectStore(PROJECT_STORE).put(project, LAST_PROJECT_KEY);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

async function clearSavedProject() {
  const db = await openProjectDb();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE, 'readwrite');
    transaction.objectStore(PROJECT_STORE).delete(LAST_PROJECT_KEY);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The image could not be loaded.'));
    image.src = src;
  });
}

function getCropLayout(
  sourceWidth: number,
  sourceHeight: number,
  format: Format,
  crop: Crop,
  fitMode: FitMode,
): CropLayout {
  const baseScale =
    fitMode === 'contain'
      ? Math.min(format.width / sourceWidth, format.height / sourceHeight)
      : Math.max(format.width / sourceWidth, format.height / sourceHeight);
  const scale = baseScale * crop.zoom;
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const overflowX = drawWidth - format.width;
  const overflowY = drawHeight - format.height;

  return {
    drawWidth,
    drawHeight,
    drawX: -(overflowX * crop.x) / 100,
    drawY: -(overflowY * crop.y) / 100,
  };
}

function layoutToPreviewStyle(layout: CropLayout, format: Format) {
  return {
    width: `${(layout.drawWidth / format.width) * 100}%`,
    height: `${(layout.drawHeight / format.height) * 100}%`,
    left: `${(layout.drawX / format.width) * 100}%`,
    top: `${(layout.drawY / format.height) * 100}%`,
  };
}

function exportExtension(kind: ExportKind) {
  return EXPORT_OPTIONS.find((option) => option.kind === kind)?.extension ?? 'png';
}

function exportQuality(kind: ExportKind) {
  return EXPORT_OPTIONS.find((option) => option.kind === kind)?.quality ?? 1;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function renderCrop(
  src: string,
  format: Format,
  crop: Crop,
  fitMode: FitMode,
  exportKind: ExportKind,
): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = format.width;
  canvas.height = format.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas export is unavailable.');

  if (fitMode === 'contain' || exportKind === 'image/jpeg') {
    context.fillStyle = '#08111f';
    context.fillRect(0, 0, format.width, format.height);
  }

  const layout = getCropLayout(image.width, image.height, format, crop, fitMode);
  context.drawImage(image, layout.drawX, layout.drawY, layout.drawWidth, layout.drawHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed.'))),
      exportKind,
      exportQuality(exportKind),
    );
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeFileName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'campaign'
  );
}

function sourceNeedsUpscale(source: SourceInfo, format: Format) {
  return Math.max(format.width / source.width, format.height / source.height) > 1;
}

function FormatPreview({
  format,
  imageUrl,
  crop,
  active,
  motion,
  showSafeZones,
  sourceInfo,
  fitMode,
  onSelect,
}: {
  format: Format;
  imageUrl: string | null;
  crop: Crop;
  active: boolean;
  motion: boolean;
  showSafeZones: boolean;
  sourceInfo: SourceInfo | null;
  fitMode: FitMode;
  onSelect: () => void;
}) {
  const ratio = `${format.width} / ${format.height}`;
  const previewStyle =
    imageUrl && sourceInfo
      ? layoutToPreviewStyle(
          getCropLayout(sourceInfo.width, sourceInfo.height, format, crop, fitMode),
          format,
        )
      : undefined;

  return (
    <button
      type="button"
      className={`format-card${active ? ' format-card--active' : ''}`}
      onClick={onSelect}
      aria-pressed={active}
    >
      <span className="format-card__meta">
        <span>
          <strong>{format.label}</strong>
          <small>{format.placement}</small>
        </span>
        <span className="format-card__details">
          <span className="format-card__size">
            {format.width} × {format.height}
          </span>
          {sourceInfo && (
            <span
              className={
                sourceNeedsUpscale(sourceInfo, format)
                  ? 'format-card__check format-card__check--warn'
                  : 'format-card__check'
              }
            >
              {sourceNeedsUpscale(sourceInfo, format) ? 'Upscale' : 'Ready'}
            </span>
          )}
        </span>
      </span>
      <span
        className={`format-card__stage${fitMode === 'contain' ? ' format-card__stage--contain' : ''}`}
        style={{ aspectRatio: ratio }}
      >
        {imageUrl && previewStyle ? (
          <img
            className={`format-card__image${motion ? ' format-card__image--motion' : ''}`}
            src={imageUrl}
            alt=""
            draggable={false}
            style={previewStyle}
          />
        ) : (
          <span className="format-card__empty">
            <span>+</span>
            Your creative
          </span>
        )}
        {showSafeZones && <span className={`safe-zone safe-zone--${format.safeZone}`} aria-hidden="true" />}
      </span>
    </button>
  );
}

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  const [sourceBlob, setSourceBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState('creative');
  const [campaignName, setCampaignName] = useState('Untitled campaign');
  const [platformId, setPlatformId] = useState<PlatformId>('google-display');
  const [selectedId, setSelectedId] = useState<FormatId>('google-landscape');
  const [crops, setCrops] = useState<Record<FormatId, Crop>>(makeDefaultCrops);
  const [motion, setMotion] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [fitMode, setFitMode] = useState<FitMode>('cover');
  const [exportKind, setExportKind] = useState<ExportKind>('image/png');
  const [selectedExportBytes, setSelectedExportBytes] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState('');
  const [heroPlatformIndex, setHeroPlatformIndex] = useState(0);
  const [projectRestored, setProjectRestored] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePack = useMemo(
    () => PLATFORM_PACKS.find((pack) => pack.id === platformId) ?? PLATFORM_PACKS[0],
    [platformId],
  );
  const selectedFormat = useMemo(
    () => activePack.formats.find((format) => format.id === selectedId) ?? activePack.formats[0],
    [activePack, selectedId],
  );
  const selectedCrop = crops[selectedId];
  const selectedNeedsUpscale = sourceInfo ? sourceNeedsUpscale(sourceInfo, selectedFormat) : false;
  const readyFormatCount = sourceInfo
    ? activePack.formats.filter((format) => !sourceNeedsUpscale(sourceInfo, format)).length
    : 0;

  useEffect(
    () => () => {
      if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    },
    [imageUrl],
  );

  useEffect(() => {
    let cancelled = false;
    void loadSavedProject()
      .then((saved) => {
        if (cancelled || !saved || saved.version !== 1) return;
        const savedPack = PLATFORM_PACKS.find((pack) => pack.id === saved.platformId);
        const savedFormat = ALL_FORMATS.find((format) => format.id === saved.selectedId);
        setCampaignName(saved.campaignName);
        setFileName(saved.fileName);
        setSourceInfo(saved.sourceInfo);
        setSourceBlob(saved.sourceBlob);
        setPlatformId(savedPack?.id ?? 'google-display');
        setSelectedId(savedFormat?.id ?? 'google-landscape');
        setCrops({ ...makeDefaultCrops(), ...saved.crops });
        setMotion(saved.motion);
        setShowSafeZones(saved.showSafeZones);
        setFitMode(saved.fitMode === 'contain' ? 'contain' : 'cover');
        setExportKind(
          saved.exportKind === 'image/jpeg' || saved.exportKind === 'image/webp'
            ? saved.exportKind
            : 'image/png',
        );
        setImageUrl(URL.createObjectURL(saved.sourceBlob));
        setStatus('Last campaign restored from this browser.');
      })
      .catch(() => {
        // Storage can be unavailable in private browsing. The editor still works without persistence.
      })
      .finally(() => {
        if (!cancelled) setProjectRestored(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!projectRestored || !sourceBlob || !sourceInfo) return;
    const timer = window.setTimeout(() => {
      void saveProject({
        version: 1,
        campaignName,
        fileName,
        sourceInfo,
        sourceBlob,
        platformId,
        selectedId,
        crops,
        motion,
        showSafeZones,
        fitMode,
        exportKind,
      }).catch(() => {
        // Keep the production workflow usable if browser storage fails.
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [
    campaignName,
    crops,
    exportKind,
    fileName,
    fitMode,
    motion,
    platformId,
    projectRestored,
    selectedId,
    showSafeZones,
    sourceBlob,
    sourceInfo,
  ]);

  useEffect(() => {
    if (!imageUrl) {
      setSelectedExportBytes(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void renderCrop(imageUrl, selectedFormat, selectedCrop, fitMode, exportKind)
        .then((blob) => {
          if (!cancelled) setSelectedExportBytes(blob.size);
        })
        .catch(() => {
          if (!cancelled) setSelectedExportBytes(null);
        });
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [exportKind, fitMode, imageUrl, selectedCrop, selectedFormat]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroPlatformIndex((current) => (current + 1) % HERO_PLATFORMS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  const handleFile = async (file?: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setStatus('Choose a PNG, JPG, or WebP image.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setStatus('Choose an image smaller than 50 MB.');
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    try {
      const image = await loadImage(nextUrl);
      if (image.width < 300 || image.height < 90) {
        URL.revokeObjectURL(nextUrl);
        setStatus('That image is too small for ad production. Choose a larger master.');
        return;
      }
      if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
      setImageUrl(nextUrl);
      setSourceInfo({ width: image.width, height: image.height, bytes: file.size });
      setSourceBlob(file);
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'creative';
      setFileName(baseName);
      if (campaignName === 'Untitled campaign') setCampaignName(baseName.replace(/[-_]+/g, ' '));
      setCrops(makeDefaultCrops());
      setStatus('Creative loaded. Review each placement before export.');
    } catch {
      URL.revokeObjectURL(nextUrl);
      setStatus('The image could not be loaded. Try another PNG, JPG, or WebP.');
    }
  };

  const updateCrop = (key: keyof Crop, value: number) => {
    setCrops((current) => ({
      ...current,
      [selectedId]: { ...current[selectedId], [key]: value },
    }));
  };

  const selectPlatform = (nextId: PlatformId) => {
    const nextPack = PLATFORM_PACKS.find((pack) => pack.id === nextId) ?? PLATFORM_PACKS[0];
    setPlatformId(nextId);
    setSelectedId(nextPack.formats[0].id);
    setMotion(nextId === 'google-video');
    setStatus(`${nextPack.label} selected.`);
  };

  const resetProject = () => {
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setSourceInfo(null);
    setSourceBlob(null);
    setFileName('creative');
    setCampaignName('Untitled campaign');
    setCrops(makeDefaultCrops());
    setStatus('New campaign ready. Upload an approved creative to begin.');
    if (inputRef.current) inputRef.current.value = '';
    void clearSavedProject().catch(() => {
      // Clearing the in-memory project is still sufficient if storage is unavailable.
    });
  };

  const exportFormat = async (format: Format) => {
    if (!imageUrl) return;
    const extension = exportExtension(exportKind);
    const blob = await renderCrop(imageUrl, format, crops[format.id], fitMode, exportKind);
    downloadBlob(
      blob,
      `${safeFileName(campaignName)}_${safeFileName(fileName)}_${format.id}_${format.width}x${format.height}.${extension}`,
    );
    return blob;
  };

  const exportSelected = async () => {
    if (!imageUrl || isExporting) return;
    setIsExporting(true);
    setStatus(`Exporting ${selectedFormat.placement}…`);
    try {
      const blob = await exportFormat(selectedFormat);
      const label = EXPORT_OPTIONS.find((option) => option.kind === exportKind)?.label ?? 'PNG';
      setStatus(
        `${selectedFormat.width} × ${selectedFormat.height} ${label} downloaded${
          blob ? ` · ${formatBytes(blob.size)}` : ''
        }.`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAll = async () => {
    if (!imageUrl || isExporting) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const packSlug = safeFileName(activePack.label);
      const campaignSlug = safeFileName(campaignName);
      const extension = exportExtension(exportKind);
      const sizes: { id: string; bytes: number }[] = [];
      for (const [index, format] of activePack.formats.entries()) {
        setStatus(`Exporting ${index + 1} of ${activePack.formats.length}: ${format.placement}…`);
        const blob = await renderCrop(imageUrl, format, crops[format.id], fitMode, exportKind);
        sizes.push({ id: format.id, bytes: blob.size });
        zip.file(
          `${packSlug}/${campaignSlug}_${safeFileName(fileName)}_${format.id}_${format.width}x${format.height}.${extension}`,
          blob,
        );
      }
      zip.file(
        `${packSlug}/manifest.json`,
        JSON.stringify(
          {
            campaign: campaignName,
            pack: activePack.label,
            source: sourceInfo,
            fitMode,
            exportKind,
            exportedAt: new Date().toISOString(),
            formats: activePack.formats.map((format) => ({
              id: format.id,
              placement: format.placement,
              width: format.width,
              height: format.height,
              crop: crops[format.id],
              bytes: sizes.find((entry) => entry.id === format.id)?.bytes ?? null,
            })),
          },
          null,
          2,
        ),
      );
      setStatus('Compressing campaign pack…');
      const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      downloadBlob(archive, `${campaignSlug}_${packSlug}.zip`);
      const overLimit =
        platformId === 'google-display'
          ? sizes.filter((entry) => entry.bytes > GOOGLE_DISPLAY_SOFT_LIMIT).length
          : 0;
      setStatus(
        overLimit > 0
          ? `${activePack.outputLabel} downloaded as one ZIP. ${overLimit} file${
              overLimit === 1 ? '' : 's'
            } over Google Display’s 150 KB soft limit — try JPG or WebP.`
          : `${activePack.outputLabel} downloaded as one ZIP.`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Campaign pack export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Ad Studio home">
          <span className="brand__mark">AS</span>
          <span>Ad Studio</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href="#workspace">Workbench</a>
          <a href="#how-it-works">Workflow</a>
          <a className="button button--small button--outline" href="#roadmap">
            Roadmap
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Your ad production workbench</p>
            <h1>
              <span className="hero__lead">One master ad.</span>
              <span className="hero__line">
                Every{' '}
                <span className="hero__swap">
                  <span className="hero__swap-sizer" aria-hidden="true">LinkedIn</span>
                  <span className="hero__swap-text" key={HERO_PLATFORMS[heroPlatformIndex]}>
                    {HERO_PLATFORMS[heroPlatformIndex]}
                  </span>
                </span>{' '}
                size.
              </span>
            </h1>
            <p className="hero__lede">
              Turn a finished ad into Google Display and YouTube source packs, with optional Meta
              formats when the campaign needs them.
            </p>
            <div className="hero__actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() => {
                  document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  window.setTimeout(() => inputRef.current?.click(), 280);
                }}
              >
                Start a production pack
              </button>
              <a className="button button--text" href="#workspace">
                Open workbench <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="hero__proof">
              <span>Google Display first</span>
              <span>YouTube + Shorts</span>
              <span>Optional Meta pack</span>
              <span>Placement-safe previews</span>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="orbit orbit--one" />
            <div className="orbit orbit--two" />
            <div className="demo-ad demo-ad--wide">
              <span className="demo-ad__label">1.91:1</span>
              <strong>Your winning idea</strong>
              <span className="demo-ad__cta">Keep it winning →</span>
            </div>
            <div className="demo-ad demo-ad--square">
              <span className="demo-ad__label">1:1</span>
              <strong>Same idea.</strong>
            </div>
            <div className="demo-ad demo-ad--story">
              <span className="demo-ad__label">9:16</span>
              <strong>Built for the placement.</strong>
              <i />
            </div>
            <div className="hero__badge">
              <strong>3</strong>
              <span>production packs</span>
            </div>
          </div>
        </section>

        <section className="workspace" id="workspace">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Production workspace</p>
              <h2>Build the assets you need</h2>
            </div>
            <p>
              Choose a Google or Meta pack, upload the master, and tune every placement independently.
              Your source image stays in this browser.
            </p>
          </div>

          <div className="platform-tabs" role="tablist" aria-label="Production pack">
            {PLATFORM_PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                role="tab"
                aria-selected={pack.id === platformId}
                className={pack.id === platformId ? 'platform-tab platform-tab--active' : 'platform-tab'}
                onClick={() => selectPlatform(pack.id)}
              >
                <span>{pack.label}</span>
                <small>{pack.formats.length} formats</small>
              </button>
            ))}
          </div>
          <div className="pack-summary">
            <span>
              <strong>{activePack.label}</strong>
              <span>{activePack.description}</span>
            </span>
            {sourceInfo && (
              <span className="pack-summary__readiness">
                {readyFormatCount}/{activePack.formats.length} formats at full source resolution
              </span>
            )}
          </div>

          <div className="workspace__panel">
            <aside className="controls">
              <label className="project-field">
                <span className="project-field__header">
                  <span>Campaign name</span>
                  {imageUrl && (
                    <button type="button" onClick={resetProject}>
                      New campaign
                    </button>
                  )}
                </span>
                <input
                  type="text"
                  value={campaignName}
                  maxLength={80}
                  onChange={(event) => setCampaignName(event.target.value)}
                  onBlur={() => {
                    if (!campaignName.trim()) setCampaignName('Untitled campaign');
                  }}
                />
              </label>

              <div
                className={`upload-zone${imageUrl ? ' upload-zone--loaded' : ''}${isDragging ? ' upload-zone--dragging' : ''}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  void handleFile(event.dataTransfer.files[0]);
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => void handleFile(event.target.files?.[0])}
                />
                <button type="button" onClick={() => inputRef.current?.click()}>
                  <span className="upload-zone__icon">↑</span>
                  <strong>{imageUrl ? 'Replace creative' : 'Upload approved creative'}</strong>
                  <small>
                    {sourceInfo
                      ? `${sourceInfo.width} × ${sourceInfo.height} · ${(sourceInfo.bytes / 1024 / 1024).toFixed(1)} MB`
                      : 'PNG, JPG, or WebP · max 50 MB'}
                  </small>
                </button>
              </div>

              <div className="control-group">
                <span className="control-group__title">
                  Adjust {selectedFormat.label} <small>{selectedFormat.placement}</small>
                </span>
                {sourceInfo && (
                  <p className={selectedNeedsUpscale ? 'resolution-note resolution-note--warn' : 'resolution-note'}>
                    {selectedNeedsUpscale
                      ? 'Source will be enlarged for this placement. Export is available, but a larger master will be sharper.'
                      : 'Source resolution is sufficient for this placement.'}
                  </p>
                )}
                <label>
                  <span>Horizontal focus</span>
                  <output>{Math.round(selectedCrop.x)}%</output>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedCrop.x}
                    disabled={!imageUrl}
                    onChange={(event) => updateCrop('x', Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Vertical focus</span>
                  <output>{Math.round(selectedCrop.y)}%</output>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedCrop.y}
                    disabled={!imageUrl}
                    onChange={(event) => updateCrop('y', Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Zoom</span>
                  <output>{selectedCrop.zoom.toFixed(2)}×</output>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.01"
                    value={selectedCrop.zoom}
                    disabled={!imageUrl}
                    onChange={(event) => updateCrop('zoom', Number(event.target.value))}
                  />
                </label>
                <div className="fit-mode" role="group" aria-label="Fit mode">
                  <button
                    type="button"
                    className={fitMode === 'cover' ? 'fit-mode__button fit-mode__button--active' : 'fit-mode__button'}
                    disabled={!imageUrl}
                    onClick={() => setFitMode('cover')}
                  >
                    Cover
                  </button>
                  <button
                    type="button"
                    className={fitMode === 'contain' ? 'fit-mode__button fit-mode__button--active' : 'fit-mode__button'}
                    disabled={!imageUrl}
                    onClick={() => setFitMode('contain')}
                  >
                    Contain
                  </button>
                </div>
                <div className="crop-actions">
                  <button
                    className="reset-button"
                    type="button"
                    disabled={!imageUrl}
                    onClick={() =>
                      setCrops((current) => {
                        const next = { ...current };
                        activePack.formats.forEach((format) => {
                          next[format.id] = { ...selectedCrop };
                        });
                        return next;
                      })
                    }
                  >
                    Apply crop to pack
                  </button>
                  <button
                    className="reset-button"
                    type="button"
                    disabled={!imageUrl}
                    onClick={() =>
                      setCrops((current) => ({ ...current, [selectedId]: { ...DEFAULT_CROP } }))
                    }
                  >
                    Reset this crop
                  </button>
                </div>
              </div>

              <div className="preview-toggles">
                <label className="motion-toggle">
                  <span>
                    <strong>Safe-zone guides</strong>
                    <small>Show placement-safe area</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={showSafeZones}
                    onChange={(event) => setShowSafeZones(event.target.checked)}
                  />
                  <i aria-hidden="true" />
                </label>
                <label className="motion-toggle">
                  <span>
                    <strong>Motion preview</strong>
                    <small>Preview only · exports stay static</small>
                  </span>
                  <input type="checkbox" checked={motion} onChange={(event) => setMotion(event.target.checked)} />
                  <i aria-hidden="true" />
                </label>
              </div>

              <div className="export-actions">
                <div className="export-format" role="group" aria-label="Export file type">
                  {EXPORT_OPTIONS.map((option) => (
                    <button
                      key={option.kind}
                      type="button"
                      className={
                        exportKind === option.kind
                          ? 'export-format__button export-format__button--active'
                          : 'export-format__button'
                      }
                      disabled={!imageUrl || isExporting}
                      onClick={() => setExportKind(option.kind)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {selectedExportBytes !== null && (
                  <p
                    className={
                      platformId === 'google-display' && selectedExportBytes > GOOGLE_DISPLAY_SOFT_LIMIT
                        ? 'export-size export-size--warn'
                        : 'export-size'
                    }
                  >
                    Selected export ≈ {formatBytes(selectedExportBytes)}
                    {platformId === 'google-display' && selectedExportBytes > GOOGLE_DISPLAY_SOFT_LIMIT
                      ? ' · over 150 KB soft limit'
                      : platformId === 'google-display'
                        ? ' · under 150 KB soft limit'
                        : ''}
                  </p>
                )}
                <button
                  className="button button--primary"
                  type="button"
                  disabled={!imageUrl || isExporting}
                  onClick={exportAll}
                >
                  {isExporting ? 'Preparing files…' : `Download ${activePack.shortLabel} ZIP`}
                </button>
                <button
                  className="button button--outline-dark"
                  type="button"
                  disabled={!imageUrl || isExporting}
                  onClick={exportSelected}
                >
                  Download selected
                </button>
                <p role="status">{status || 'No upload required to explore the formats.'}</p>
              </div>
            </aside>

            <div className="format-grid">
              {activePack.formats.map((format) => (
                <FormatPreview
                  key={format.id}
                  format={format}
                  imageUrl={imageUrl}
                  crop={crops[format.id]}
                  active={format.id === selectedId}
                  motion={motion}
                  showSafeZones={showSafeZones}
                  sourceInfo={sourceInfo}
                  fitMode={fitMode}
                  onSelect={() => setSelectedId(format.id)}
                />
              ))}
            </div>
          </div>
          <p className="workspace__note">
            Packs export as one ZIP with exact-size stills, your chosen file type, and a crop
            manifest. Motion is preview-only. Google Video stills come first; MP4 rendering is next.
          </p>
        </section>

        <section className="process" id="how-it-works">
          <div className="section-heading section-heading--light">
            <div>
              <p className="eyebrow">Your repeatable workflow</p>
              <h2>Make the master usable everywhere.</h2>
            </div>
            <p>Built first for your own display and video production, then usable by employees or client teams.</p>
          </div>
          <div className="process__grid">
            <article>
              <span>01</span>
              <h3>Bring the winner</h3>
              <p>Upload the approved ad—not another prompt, template, or half-finished concept.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Adapt with intent</h3>
              <p>Check composition and safe zones format by format instead of trusting a blind crop.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Prepare video</h3>
              <p>Preview pan-and-zoom motion for YouTube, Shorts, and square video source frames.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Launch the pack</h3>
              <p>Download clearly named files for Google Ads, YouTube, or optional Meta placements.</p>
            </article>
          </div>
        </section>

        <section className="pricing" id="roadmap">
          <div className="pricing__copy">
            <p className="eyebrow">Production-first roadmap</p>
            <h2>Useful for you before it is sold to anyone.</h2>
            <p>
              The tool earns its keep by reducing your own production time. Once the workflow is solid,
              employees can run it—and only then does a branded customer product become worth selling.
            </p>
          </div>
          <div className="price-card">
            <span className="price-card__flag">Current build</span>
            <div className="price-card__price">
              <strong>V1</strong>
              <span>internal production tool</span>
            </div>
            <ul>
              <li>Google Display pack with six formats</li>
              <li>YouTube, Shorts, and square video sources</li>
              <li>Optional Meta placement pack</li>
              <li>Independent crop and safe-zone review</li>
              <li>Exact-size, consistently named PNG exports</li>
            </ul>
            <a className="button button--primary" href="#workspace">
              Build an ad pack
            </a>
            <small>Next: saved projects, layout-aware reframing, and real MP4 export.</small>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="/">
          <span className="brand__mark">AS</span>
          <span>Ad Studio</span>
        </a>
        <p>One creative in. A campaign-ready pack out.</p>
        <a href="https://github.com/shoutgeorge1/whitelabel-ad-studio">Built in public →</a>
      </footer>
    </div>
  );
}
