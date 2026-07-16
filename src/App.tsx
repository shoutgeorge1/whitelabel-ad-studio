import { useEffect, useMemo, useRef, useState } from 'react';

type FormatId = 'feed' | 'story' | 'square' | 'landscape';

type Crop = {
  x: number;
  y: number;
  zoom: number;
};

type Format = {
  id: FormatId;
  label: string;
  placement: string;
  width: number;
  height: number;
};

const FORMATS: Format[] = [
  { id: 'feed', label: '4:5', placement: 'Feed', width: 1080, height: 1350 },
  { id: 'story', label: '9:16', placement: 'Stories + Reels', width: 1080, height: 1920 },
  { id: 'square', label: '1:1', placement: 'Square + carousel', width: 1080, height: 1080 },
  { id: 'landscape', label: '1.91:1', placement: 'Link + display', width: 1200, height: 628 },
];

const DEFAULT_CROP: Crop = { x: 50, y: 50, zoom: 1 };

function makeDefaultCrops(): Record<FormatId, Crop> {
  return {
    feed: { ...DEFAULT_CROP },
    story: { ...DEFAULT_CROP },
    square: { ...DEFAULT_CROP },
    landscape: { ...DEFAULT_CROP },
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The image could not be loaded.'));
    image.src = src;
  });
}

async function renderCrop(src: string, format: Format, crop: Crop): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = format.width;
  canvas.height = format.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas export is unavailable.');

  const coverScale = Math.max(format.width / image.width, format.height / image.height);
  const scale = coverScale * crop.zoom;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const overflowX = Math.max(0, drawWidth - format.width);
  const overflowY = Math.max(0, drawHeight - format.height);
  const drawX = -(overflowX * crop.x) / 100;
  const drawY = -(overflowY * crop.y) / 100;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed.'))),
      'image/png',
      1,
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

function FormatPreview({
  format,
  imageUrl,
  crop,
  active,
  motion,
  onSelect,
}: {
  format: Format;
  imageUrl: string | null;
  crop: Crop;
  active: boolean;
  motion: boolean;
  onSelect: () => void;
}) {
  const ratio = `${format.width} / ${format.height}`;

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
        <span className="format-card__size">
          {format.width} × {format.height}
        </span>
      </span>
      <span className="format-card__stage" style={{ aspectRatio: ratio }}>
        {imageUrl ? (
          <span
            className={`format-card__image${motion ? ' format-card__image--motion' : ''}`}
            style={{
              backgroundImage: `url("${imageUrl}")`,
              backgroundPosition: `${crop.x}% ${crop.y}%`,
              transform: `scale(${crop.zoom})`,
            }}
          />
        ) : (
          <span className="format-card__empty">
            <span>+</span>
            Your creative
          </span>
        )}
        <span className={`safe-zone safe-zone--${format.id}`} aria-hidden="true" />
      </span>
    </button>
  );
}

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('creative');
  const [selectedId, setSelectedId] = useState<FormatId>('feed');
  const [crops, setCrops] = useState<Record<FormatId, Crop>>(makeDefaultCrops);
  const [motion, setMotion] = useState(false);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedFormat = useMemo(
    () => FORMATS.find((format) => format.id === selectedId) ?? FORMATS[0],
    [selectedId],
  );
  const selectedCrop = crops[selectedId];

  useEffect(
    () => () => {
      if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    },
    [imageUrl],
  );

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setStatus('Choose a PNG, JPG, or WebP image.');
      return;
    }
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'creative');
    setCrops(makeDefaultCrops());
    setStatus('Creative loaded. Check each placement and adjust the crop.');
  };

  const updateCrop = (key: keyof Crop, value: number) => {
    setCrops((current) => ({
      ...current,
      [selectedId]: { ...current[selectedId], [key]: value },
    }));
  };

  const exportFormat = async (format: Format) => {
    if (!imageUrl) return;
    const blob = await renderCrop(imageUrl, format, crops[format.id]);
    downloadBlob(blob, `${fileName}_${format.width}x${format.height}.png`);
  };

  const exportSelected = async () => {
    if (!imageUrl) return;
    setStatus(`Exporting ${selectedFormat.placement}…`);
    try {
      await exportFormat(selectedFormat);
      setStatus(`${selectedFormat.width} × ${selectedFormat.height} PNG downloaded.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Export failed.');
    }
  };

  const exportAll = async () => {
    if (!imageUrl) return;
    try {
      for (const [index, format] of FORMATS.entries()) {
        setStatus(`Exporting ${index + 1} of ${FORMATS.length}: ${format.placement}…`);
        await exportFormat(format);
        await new Promise((resolve) => window.setTimeout(resolve, 250));
      }
      setStatus('Campaign pack downloaded.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Campaign pack export failed.');
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
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pilot pricing</a>
          <a className="button button--small button--outline" href="mailto:hello@example.com?subject=Ad Studio pilot">
            Join the pilot
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Creative production without the production team</p>
            <h1>
              One approved ad.
              <br />
              <span>Every placement.</span>
            </h1>
            <p className="hero__lede">
              Turn finished creative into feed, story, reel, square, and display assets—with the crop,
              safe zones, and polish checked before launch.
            </p>
            <div className="hero__actions">
              <button className="button button--primary" type="button" onClick={() => inputRef.current?.click()}>
                Try your creative
              </button>
              <a className="button button--text" href="#how-it-works">
                See the workflow <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="hero__proof">
              <span>4 essential formats</span>
              <span>Placement-safe previews</span>
              <span>PNG campaign pack</span>
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
              <strong>4</strong>
              <span>launch-ready files</span>
            </div>
          </div>
        </section>

        <section className="workspace" id="workspace">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Working product preview</p>
              <h2>Build a campaign pack</h2>
            </div>
            <p>
              Upload a finished image, select each format, and tune its crop. Your image stays in
              this browser.
            </p>
          </div>

          <div className="workspace__panel">
            <aside className="controls">
              <div
                className={`upload-zone${imageUrl ? ' upload-zone--loaded' : ''}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFile(event.dataTransfer.files[0]);
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <button type="button" onClick={() => inputRef.current?.click()}>
                  <span className="upload-zone__icon">↑</span>
                  <strong>{imageUrl ? 'Replace creative' : 'Upload approved creative'}</strong>
                  <small>PNG, JPG, or WebP · drag and drop</small>
                </button>
              </div>

              <div className="control-group">
                <span className="control-group__title">
                  Adjust {selectedFormat.label} <small>{selectedFormat.placement}</small>
                </span>
                <label>
                  <span>Horizontal focus</span>
                  <output>{Math.round(selectedCrop.x)}%</output>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedCrop.x}
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
                    onChange={(event) => updateCrop('zoom', Number(event.target.value))}
                  />
                </label>
                <button
                  className="reset-button"
                  type="button"
                  onClick={() =>
                    setCrops((current) => ({ ...current, [selectedId]: { ...DEFAULT_CROP } }))
                  }
                >
                  Reset this crop
                </button>
              </div>

              <label className="motion-toggle">
                <span>
                  <strong>Motion preview</strong>
                  <small>Subtle thumb-stop movement</small>
                </span>
                <input type="checkbox" checked={motion} onChange={(event) => setMotion(event.target.checked)} />
                <i aria-hidden="true" />
              </label>

              <div className="export-actions">
                <button className="button button--primary" type="button" disabled={!imageUrl} onClick={exportAll}>
                  Download campaign pack
                </button>
                <button className="button button--outline-dark" type="button" disabled={!imageUrl} onClick={exportSelected}>
                  Download selected
                </button>
                <p role="status">{status || 'No upload required to explore the formats.'}</p>
              </div>
            </aside>

            <div className="format-grid">
              {FORMATS.map((format) => (
                <FormatPreview
                  key={format.id}
                  format={format}
                  imageUrl={imageUrl}
                  crop={crops[format.id]}
                  active={format.id === selectedId}
                  motion={motion}
                  onSelect={() => setSelectedId(format.id)}
                />
              ))}
            </div>
          </div>
          <p className="workspace__note">
            This beta exports placement-sized crops. Layout-aware AI reframing and MP4 motion export
            are the next production steps—not fake buttons in this preview.
          </p>
        </section>

        <section className="process" id="how-it-works">
          <div className="section-heading section-heading--light">
            <div>
              <p className="eyebrow">The gap we fill</p>
              <h2>AI made the image. We make it usable.</h2>
            </div>
            <p>For founders, media buyers, and lean agencies who have ideas but not a full graphics team.</p>
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
              <h3>Add movement</h3>
              <p>Turn the static winner into short, focused motion without reinventing the creative.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Launch the pack</h3>
              <p>Download clearly named files that are ready for paid-social placement testing.</p>
            </article>
          </div>
        </section>

        <section className="pricing" id="pricing">
          <div className="pricing__copy">
            <p className="eyebrow">Founding customer pilot</p>
            <h2>Sell the outcome before building the empire.</h2>
            <p>
              Start with a high-touch campaign pack. We learn where automation matters while customers
              pay for launch-ready creative—not software promises.
            </p>
          </div>
          <div className="price-card">
            <span className="price-card__flag">Pilot offer</span>
            <div className="price-card__price">
              <strong>$99</strong>
              <span>per approved creative</span>
            </div>
            <ul>
              <li>4 placement-ready static formats</li>
              <li>Safe-zone and legibility review</li>
              <li>1 lightweight motion variation</li>
              <li>One revision round</li>
              <li>48-hour target turnaround</li>
            </ul>
            <a className="button button--primary" href="mailto:hello@example.com?subject=Founding customer campaign pack">
              Request a pilot pack
            </a>
            <small>No subscription. First five customers shape the product.</small>
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
