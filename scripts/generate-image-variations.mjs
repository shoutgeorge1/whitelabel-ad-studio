/**
 * George-approved crop shortlist only.
 * Everything else is deleted from the review board.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { HEADER_CSS, IMAGE_SUBNAV, renderDocHeader } from './shared-doc-header.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(PUBLIC, 'assets');

const TARGETS = {
  '4x5': { w: 1080, h: 1350, folder: 'feed-4x5' },
  '9x16': { w: 1080, h: 1920, folder: 'story-9x16' },
  '1x1': { w: 1080, h: 1080, folder: 'square-1x1' },
};

/**
 * Designer-facing shortlist. subjectSide is based on the visible crop composition
 * (not only filename). Headshots are generated for secondary pages but excluded
 * from the Image Selection Board.
 */
const APPROVED = [
  // Person LEFT — copy on right + top
  { id: 'AI_003', file: 'ai-generated-03.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.22, focalY: 0.3, label: 'Follow-Up', subjectSide: 'left', status: 'recommended' },
  { id: 'AI_009', file: 'ai-generated-09.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.22, focalY: 0.3, label: 'Scheduling', subjectSide: 'left', status: 'recommended' },
  { id: 'AI_010', file: 'ai-generated-10.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.22, focalY: 0.3, label: 'Front Desk', subjectSide: 'left', status: 'recommended' },
  { id: 'AI_003', file: 'ai-generated-03.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.35, focalY: 0.32, label: 'Follow-Up', subjectSide: 'left', status: 'recommended' },
  { id: 'AI_009', file: 'ai-generated-09.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_LEFT', focalX: 0.28, focalY: 0.3, label: 'Scheduling', subjectSide: 'left', status: 'alternate' },
  { id: 'AI_009', file: 'ai-generated-09.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.35, focalY: 0.32, label: 'Scheduling', subjectSide: 'left', status: 'alternate' },
  { id: 'AI_010', file: 'ai-generated-10.png', folder: 'ai-images', ratio: '4x5', cropType: 'SUBJECT_LEFT', focalX: 0.28, focalY: 0.32, label: 'Front Desk', subjectSide: 'left', status: 'alternate' },
  { id: 'AI_006', file: 'ai-generated-06.png', folder: 'ai-images', ratio: '1x1', cropType: 'SUBJECT_CENTER', focalX: 0.28, focalY: 0.32, label: 'Scheduling', subjectSide: 'left', status: 'alternate' },
  { id: 'AI_015', file: 'ai-generated-15.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.28, focalY: 0.28, label: 'Front Desk', subjectSide: 'left', status: 'recommended' },
  { id: 'AI_015', file: 'ai-generated-15.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_LEFT', focalX: 0.28, focalY: 0.26, label: 'Front Desk', subjectSide: 'left', status: 'recommended' },

  // Person RIGHT — copy on left + top (verified against rendered crops)
  { id: 'AI_004', file: 'ai-generated-04.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_RIGHT', focalX: 0.72, focalY: 0.28, label: 'Workflow', subjectSide: 'right', status: 'recommended' },
  { id: 'AI_004', file: 'ai-generated-04.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_RIGHT', focalX: 0.72, focalY: 0.28, label: 'Workflow', subjectSide: 'right', status: 'alternate' },
  { id: 'AI_004', file: 'ai-generated-04.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.68, focalY: 0.32, label: 'Workflow', subjectSide: 'right', status: 'alternate' },
  { id: 'AI_007', file: 'ai-generated-07.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.35, focalY: 0.32, label: 'Workflow', subjectSide: 'right', status: 'alternate' },
  { id: 'AI_013', file: 'ai-generated-13.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_RIGHT', focalX: 0.68, focalY: 0.28, label: 'Medical Assistant', subjectSide: 'right', status: 'recommended' },
  { id: 'AI_013', file: 'ai-generated-13.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_RIGHT', focalX: 0.7, focalY: 0.26, label: 'Medical Assistant', subjectSide: 'right', status: 'alternate' },
  { id: 'AI_014', file: 'ai-generated-14.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_RIGHT', focalX: 0.68, focalY: 0.28, label: 'Workflow', subjectSide: 'right', status: 'hold' },
  { id: 'AI_014', file: 'ai-generated-14.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_RIGHT', focalX: 0.7, focalY: 0.26, label: 'Workflow', subjectSide: 'right', status: 'hold' },

  // AI_008 reads as person-right with open left/top (not a true center crop)
  { id: 'AI_008', file: 'ai-generated-08.png', folder: 'ai-images', ratio: '4x5', cropType: 'SUBJECT_CENTER', focalX: 0.55, focalY: 0.42, label: 'Payroll Pressure', subjectSide: 'right', status: 'alternate' },
];

/** Landing page headshots — kept off the selection board; still generated for archive contact sheet */
const HEADSHOTS = [
  { id: 'LP_001', file: 'assistant.avif', label: 'Front Desk Backup' },
  { id: 'LP_002', file: 'biller.avif', label: 'Payroll Pressure' },
  { id: 'LP_003', file: 'casecoord.avif', label: 'Follow-Up' },
  { id: 'LP_004', file: 'general.avif', label: 'Staffing Gap' },
  { id: 'LP_005', file: 'nurse.avif', label: 'Follow-Up' },
];

function displayName(itemOrVar) {
  const id = String(itemOrVar.sourceId || itemOrVar.id || '');
  const num = id.replace(/^AI_0?/, '').replace(/^LP_0?/, '') || id;
  const label = itemOrVar.placeholderLabel || itemOrVar.label || 'Source';
  return `Image ${num} — ${label}`;
}

function copyZoneLine(side) {
  if (side === 'right') return 'Copy zone: Left side + top';
  if (side === 'center') return 'Copy zone: Open top band';
  return 'Copy zone: Right side + top';
}

function ratioBadge(ratio) {
  if (ratio === '9x16') return '9:16 Stories';
  if (ratio === '1x1') return '1:1 Square';
  return '4:5 Feed';
}

function positionBadge(side) {
  if (side === 'right') return 'Person Right';
  if (side === 'center') return 'Person Center';
  return 'Person Left';
}

function statusBadge(status) {
  if (status === 'recommended') return 'Recommended';
  if (status === 'hold') return 'Hold';
  return 'Alternate';
}

const approvedKey = (item) => `${item.id}|${item.ratio}|${item.cropType}`;
const APPROVED_BY_KEY = Object.fromEntries(APPROVED.map((a) => [approvedKey(a), a]));

const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/image-inventory.json'), 'utf8'));
const videoMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/video-production-metadata.json'), 'utf8'));
const sourceById = Object.fromEntries(inventory.sources.map((s) => [s.id, s]));

function getVideoFields(source) {
  if (!source?.id) return {};
  const defaults = videoMeta.familyDefaults[source.family] || {};
  const v = source.video || {};
  return {
    static_use: v.static_use ?? defaults.static_use ?? 'yes',
    remotion_use: v.remotion_use ?? defaults.remotion_use ?? 'medium',
    veo_video_use: v.veo_video_use ?? defaults.veo_video_use ?? 'low',
    editor_use: v.editor_use ?? defaults.editor_use ?? 'medium',
    best_video_format: v.best_video_format ?? defaults.best_video_format ?? 'voiceover',
    recommended_angle: v.recommended_angle ?? source.placeholderLabel,
    recommended_script_style: v.recommended_script_style ?? defaults.recommended_script_style ?? '',
    video_editor_notes: v.video_editor_notes ?? defaults.video_editor_notes ?? '',
    veo_prompt_notes: v.veo_prompt_notes ?? defaults.veo_prompt_notes ?? '',
    compliance_risks: v.compliance_risks ?? defaults.compliance_risks ?? [],
    do_not_use_for: v.do_not_use_for ?? defaults.do_not_use_for ?? [],
    veo_prompt_potential: ['high', 'medium'].includes(v.veo_video_use ?? defaults.veo_video_use) ? 'yes' : 'no',
  };
}

function cropExtract(meta, targetW, targetH, focalX = 0.5, focalY = 0.35) {
  const targetAspect = targetW / targetH;
  const { width: srcW, height: srcH } = meta;
  const srcAspect = srcW / srcH;
  let cropW, cropH, cropX, cropY;
  if (srcAspect > targetAspect) {
    cropH = srcH;
    cropW = Math.round(srcH * targetAspect);
    cropX = Math.round((srcW - cropW) * focalX);
    cropY = 0;
  } else {
    cropW = srcW;
    cropH = Math.round(srcW / targetAspect);
    cropX = 0;
    cropY = Math.round((srcH - cropH) * focalY);
  }
  return { left: cropX, top: cropY, width: cropW, height: cropH };
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cleanExportFolders() {
  for (const { folder } of Object.values(TARGETS)) {
    const dir = path.join(PUBLIC, 'exports/image-tests', folder);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.png')) fs.unlinkSync(path.join(dir, f));
    }
  }
}

async function renderApprovedCrop(item) {
  const inputPath = path.join(ASSETS, item.folder, item.file);
  const meta = await sharp(inputPath).metadata();
  const { w: targetW, h: targetH, folder } = TARGETS[item.ratio];
  const varId = `IMG_${item.id}_${item.ratio.toUpperCase()}_${item.cropType}`;
  const outName = `${varId}.png`;
  const outPath = path.join(PUBLIC, 'exports/image-tests', folder, outName);
  const extract = cropExtract(meta, targetW, targetH, item.focalX, item.focalY);
  await sharp(inputPath).extract(extract).resize(targetW, targetH).png({ quality: 90 }).toFile(outPath);

  const source = sourceById[item.id] || {};
  const side = item.subjectSide;
  return {
    variationId: varId,
    sourceId: item.id,
    sourceFile: item.file,
    sourceType: 'AI-generated',
    family: source.family || '',
    boardSection: side === 'right' ? 'person_right' : side === 'center' ? 'person_center' : 'person_left',
    subjectSide: side,
    textZone: copyZoneLine(side),
    copyZone: copyZoneLine(side),
    displayName: displayName(item),
    status: item.status || 'alternate',
    aspectRatio: item.ratio,
    cropType: item.cropType,
    cropLabel: `${item.ratio}/${item.cropType.toLowerCase().replace(/_/g, '/')}`,
    candidateRating: item.status === 'recommended' ? 'A' : item.status === 'hold' ? 'C' : 'B',
    placeholderLabel: item.label,
    recommendedUse: copyZoneLine(side),
    owned: false,
    warnings: [],
    previewPath: `/exports/image-tests/${folder}/${outName}`,
    video: getVideoFields(source),
    sourceFolder: item.folder,
  };
}

/**
 * Headshot flush to bottom of white canvas — no white gap under portrait.
 * Source LP shots sit low in-frame; crop out top headroom so the face reads higher.
 */
async function renderHeadshotTextSpace(item, layout) {
  const inputPath = path.join(ASSETS, 'landing-page-images', item.file);
  const { w: targetW, h: targetH, folder } = TARGETS[layout.ratio];
  const varId = `IMG_${item.id}_${layout.ratio.toUpperCase()}_${layout.cropType}`;
  const outName = `${varId}.png`;
  const outPath = path.join(PUBLIC, 'exports/image-tests', folder, outName);

  const meta = await sharp(inputPath).metadata();
  const srcW = meta.width;
  const srcH = meta.height;
  // Zoom in + bias down: LP masters leave empty white above the head
  const zoom = layout.sourceZoom ?? 0.78;
  const cropSize = Math.round(Math.min(srcW, srcH) * zoom);
  const cropLeft = Math.round((srcW - cropSize) / 2);
  const cropTop = Math.round((srcH - cropSize) * (layout.sourceFocalY ?? 0.72));

  const portraitSize = Math.round(Math.min(targetW, targetH) * layout.portraitScale);
  const portraitBuf = await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
    .resize(portraitSize, portraitSize, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const left = Math.round((targetW - portraitSize) / 2);
  const top = targetH - portraitSize; // flush bottom — no white underneath

  await sharp({
    create: { width: targetW, height: targetH, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([{ input: portraitBuf, left, top }])
    .png({ quality: 90 })
    .toFile(outPath);

  const source = sourceById[item.id] || {};
  return {
    variationId: varId,
    sourceId: item.id,
    sourceFile: item.file,
    sourceType: 'Landing page image',
    family: 'landing_headshot',
    boardSection: 'usable_later',
    subjectSide: 'center',
    textZone: 'White band above head — do not cover face',
    aspectRatio: layout.ratio,
    cropType: layout.cropType,
    cropLabel: `${layout.ratio}/white/text-above`,
    candidateRating: 'B',
    placeholderLabel: item.label,
    recommendedUse: 'Flush bottom on white — put hook in top white band',
    owned: true,
    warnings: ['Usable later — text above head only'],
    previewPath: `/exports/image-tests/${folder}/${outName}`,
    video: getVideoFields(source),
    sourceFolder: 'landing-page-images',
  };
}

function enrichBoardItem(v) {
  const key = `${v.sourceId}|${v.aspectRatio}|${v.cropType}`;
  const src = APPROVED_BY_KEY[key];
  const side = src?.subjectSide || v.subjectSide || 'left';
  const label = src?.label || v.placeholderLabel || 'Source';
  const status = src?.status || v.status || 'alternate';
  return {
    ...v,
    subjectSide: side,
    boardSection: side === 'right' ? 'person_right' : side === 'center' ? 'person_center' : 'person_left',
    placeholderLabel: label,
    status,
    displayName: displayName({ id: v.sourceId, sourceId: v.sourceId, label, placeholderLabel: label }),
    copyZone: copyZoneLine(side),
    textZone: copyZoneLine(side),
    recommendedUse: copyZoneLine(side),
  };
}

const BOARD_CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--mv-font);
    background: var(--mv-neutral-blue);
    color: var(--mv-ink);
    line-height: 1.45;
  }
  body.modal-open { overflow: hidden; }
  .wrap { max-width: 1120px; margin: 0 auto; padding: 1.1rem 1.15rem 3rem; overflow-x: hidden; }
  .hero {
    background: var(--mv-deep-teal); color: #fff; border-radius: 14px;
    padding: 1.15rem 1.25rem; margin-bottom: 0.9rem;
  }
  .hero h2 { font-size: 1.35rem; font-weight: 700; margin-bottom: 0.3rem; }
  .hero p { font-size: 0.92rem; color: #d7eaf2; font-weight: 400; max-width: 62ch; }
  .hero .clarify { font-size: 0.8rem; color: #b8d4e0; margin-top: 0.4rem; }
  .counts {
    display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.75rem;
  }
  .counts span {
    font-size: 0.74rem; font-weight: 600; padding: 0.28rem 0.55rem; border-radius: 6px;
    background: rgba(0,178,226,0.18); border: 1px solid rgba(39,230,250,0.3); color: #c9f4fb;
  }
  .designer-note {
    background: #fffbeb; border: 1px solid #fcd34d; border-left: 4px solid #f59e0b;
    border-radius: 10px; padding: 0.75rem 0.9rem; margin-bottom: 0.9rem;
    font-size: 0.88rem; color: #78350f; font-weight: 500;
  }
  .guide {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; margin-bottom: 1rem;
  }
  @media (max-width: 720px) { .guide { grid-template-columns: 1fr; } }
  .guide-card {
    background: #fff; border: 1px solid #d7e3f0; border-radius: 10px; padding: 0.8rem 0.9rem;
  }
  .guide-card h3 { font-size: 0.92rem; font-weight: 700; color: var(--mv-deep-teal); margin-bottom: 0.25rem; }
  .guide-card p { font-size: 0.82rem; color: #3d4f5f; font-weight: 400; }
  .filters {
    display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.85rem; align-items: center;
  }
  .filters .label {
    font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    color: #5a6b78; margin-right: 0.15rem;
  }
  .chip {
    border: 1px solid #d7e3f0; background: #fff; color: var(--mv-deep-teal);
    font-size: 0.78rem; font-weight: 600; padding: 0.35rem 0.7rem; border-radius: 999px;
    cursor: pointer; font-family: var(--mv-font);
  }
  .chip.is-active { background: var(--mv-primary); color: #fff; border-color: var(--mv-primary); }
  .section { margin-bottom: 1.35rem; }
  .section-head { margin-bottom: 0.7rem; }
  .section-head h2 {
    font-size: 1.05rem; font-weight: 700; color: var(--mv-deep-teal);
  }
  .section-head p { font-size: 0.84rem; color: #5a6b78; margin-top: 0.2rem; font-weight: 400; }
  .grid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.85rem;
  }
  .grid.grid-rec { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @media (max-width: 960px) {
    .grid, .grid.grid-rec { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 560px) {
    .grid, .grid.grid-rec { grid-template-columns: 1fr; }
  }
  .card {
    background: #fff; border: 1px solid #d7e3f0; border-radius: 12px; overflow: hidden;
    display: flex; flex-direction: column; min-height: 100%;
  }
  .card[hidden] { display: none !important; }
  .card-img {
    background: #e8f0f5; display: grid; place-items: center;
    aspect-ratio: 4 / 5; padding: 0.45rem; cursor: zoom-in; border: 0; width: 100%;
  }
  .card[data-ratio="1x1"] .card-img { aspect-ratio: 1 / 1; }
  .card[data-ratio="9x16"] .card-img { aspect-ratio: 9 / 16; max-height: 420px; }
  .card-img img {
    width: 100%; height: 100%; object-fit: contain; display: block;
  }
  .card-body { padding: 0.75rem 0.8rem 0.9rem; display: grid; gap: 0.4rem; }
  .card-title { font-size: 0.95rem; font-weight: 700; color: var(--mv-ink); line-height: 1.25; }
  .badges { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .badge {
    font-size: 0.68rem; font-weight: 700; padding: 0.18rem 0.45rem; border-radius: 999px;
    background: #e8f8fc; color: var(--mv-primary); border: 1px solid #9fdff0;
  }
  .badge.side { background: var(--mv-neutral-warm); color: var(--mv-deep-teal); border-color: #e5e0c8; }
  .badge.status-recommended { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
  .badge.status-alternate { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
  .badge.status-hold { background: #fff7ed; color: #c2410c; border-color: #fdba74; }
  .copy-line { font-size: 0.82rem; color: #3d4f5f; font-weight: 500; }
  .lightbox {
    position: fixed; inset: 0; background: rgba(13,84,107,0.92); display: none;
    align-items: center; justify-content: center; z-index: 80; padding: 1rem;
  }
  .lightbox.open { display: flex; }
  .lightbox-panel {
    background: #fff; border-radius: 12px; max-width: min(920px, 100%);
    max-height: 94vh; overflow: auto; padding: 1rem; width: 100%;
  }
  .lightbox-panel img {
    display: block; margin: 0 auto 0.85rem; max-width: 100%; max-height: 68vh;
    width: auto; height: auto; object-fit: contain; border-radius: 8px; background: #e8f0f5;
  }
  .lightbox-meta h3 { font-size: 1.1rem; font-weight: 700; color: var(--mv-deep-teal); }
  .lightbox-meta .id { font-size: 0.72rem; color: #8090a0; margin: 0.25rem 0 0.45rem; word-break: break-all; }
  .lightbox-meta p { font-size: 0.86rem; color: #3d4f5f; margin: 0.2rem 0; }
  .lightbox-close {
    position: sticky; top: 0; float: right; background: var(--mv-deep-teal); color: #fff;
    border: 0; border-radius: 8px; font-weight: 700; padding: 0.4rem 0.7rem; cursor: pointer;
    font-family: var(--mv-font);
  }
`;

function renderSelectionCard(v) {
  const status = v.status || 'alternate';
  return `<article class="card" data-ratio="${esc(v.aspectRatio)}" data-side="${esc(v.subjectSide)}" data-status="${esc(status)}">
    <button type="button" class="card-img preview-hit"
      data-preview="${esc(v.previewPath)}"
      data-name="${esc(v.displayName)}"
      data-id="${esc(v.variationId)}"
      data-ratio-label="${esc(ratioBadge(v.aspectRatio))}"
      data-side-label="${esc(positionBadge(v.subjectSide))}"
      data-copy="${esc(v.copyZone)}"
      aria-label="Preview ${esc(v.displayName)}">
      <img src="${esc(v.previewPath)}" alt="${esc(v.displayName)}" loading="lazy" decoding="async" />
    </button>
    <div class="card-body">
      <h3 class="card-title">${esc(v.displayName)}</h3>
      <div class="badges">
        <span class="badge">${esc(ratioBadge(v.aspectRatio))}</span>
        <span class="badge side">${esc(positionBadge(v.subjectSide))}</span>
        <span class="badge status-${esc(status)}">${esc(statusBadge(status))}</span>
      </div>
      <p class="copy-line">${esc(v.copyZone)}</p>
    </div>
  </article>`;
}

function renderContactCard(v) {
  return renderSelectionCard(v);
}

function lightboxAndScript() {
  return `
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image preview">
    <div class="lightbox-panel">
      <button type="button" class="lightbox-close" id="lightbox-close">Close</button>
      <img id="lightbox-img" alt="" />
      <div class="lightbox-meta">
        <h3 id="lightbox-name"></h3>
        <p class="id" id="lightbox-id"></p>
        <p id="lightbox-ratio"></p>
        <p id="lightbox-side"></p>
        <p id="lightbox-copy"></p>
      </div>
    </div>
  </div>
  <script>
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    function openPreview(btn) {
      lbImg.src = btn.getAttribute('data-preview') || '';
      lbImg.alt = btn.getAttribute('data-name') || '';
      document.getElementById('lightbox-name').textContent = btn.getAttribute('data-name') || '';
      document.getElementById('lightbox-id').textContent = btn.getAttribute('data-id') || '';
      document.getElementById('lightbox-ratio').textContent = 'Ratio: ' + (btn.getAttribute('data-ratio-label') || '');
      document.getElementById('lightbox-side').textContent = 'Subject: ' + (btn.getAttribute('data-side-label') || '');
      document.getElementById('lightbox-copy').textContent = btn.getAttribute('data-copy') || '';
      lb.classList.add('open');
      document.body.classList.add('modal-open');
    }
    function closePreview() {
      lb.classList.remove('open');
      document.body.classList.remove('modal-open');
      lbImg.removeAttribute('src');
    }
    document.querySelectorAll('.preview-hit').forEach((btn) => {
      btn.addEventListener('click', () => openPreview(btn));
    });
    document.getElementById('lightbox-close').addEventListener('click', closePreview);
    lb.addEventListener('click', (e) => { if (e.target === lb) closePreview(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePreview(); });

    const ratioChips = document.querySelectorAll('[data-filter-ratio]');
    const sideChips = document.querySelectorAll('[data-filter-side]');
    let ratio = 'all';
    let side = 'all';
    function applyFilters() {
      document.querySelectorAll('.card[data-ratio]').forEach((card) => {
        const okRatio = ratio === 'all' || card.getAttribute('data-ratio') === ratio;
        const okSide = side === 'all' || card.getAttribute('data-side') === side;
        card.hidden = !(okRatio && okSide);
      });
      ratioChips.forEach((c) => c.classList.toggle('is-active', c.getAttribute('data-filter-ratio') === ratio));
      sideChips.forEach((c) => c.classList.toggle('is-active', c.getAttribute('data-filter-side') === side));
    }
    ratioChips.forEach((chip) => chip.addEventListener('click', () => {
      ratio = chip.getAttribute('data-filter-ratio');
      applyFilters();
    }));
    sideChips.forEach((chip) => chip.addEventListener('click', () => {
      side = chip.getAttribute('data-filter-side');
      applyFilters();
    }));
  </script>`;
}

function renderSelectionBoard(aiItems) {
  const left = aiItems.filter((v) => v.boardSection === 'person_left');
  const right = aiItems.filter((v) => v.boardSection === 'person_right');
  const center = aiItems.filter((v) => v.boardSection === 'person_center');
  const recommended = aiItems.filter((v) => v.status === 'recommended');
  const total = aiItems.length;

  const sectionsHtml = [
    {
      key: 'left',
      title: 'Person Left',
      subtitle: 'Use the open right side for copy.',
      items: left,
    },
    {
      key: 'right',
      title: 'Person Right',
      subtitle: 'Use the open left side for copy.',
      items: right,
    },
    {
      key: 'center',
      title: 'Person Center',
      subtitle: 'Use only when the top band remains open.',
      items: center,
    },
  ]
    .filter((s) => s.items.length > 0)
    .map(
      (s) => `<section class="section" id="sec-${s.key}">
      <div class="section-head"><h2>${esc(s.title)}</h2><p>${esc(s.subtitle)}</p></div>
      <div class="grid">${s.items.map(renderSelectionCard).join('')}</div>
    </section>`,
    )
    .join('');

  const header = renderDocHeader({
    activeId: 'images',
    pageTitle: 'Image Selection Board',
    pageSubtitle: 'Choose the strongest image based on subject position and available copy space.',
    subnav: IMAGE_SUBNAV,
    activeSubHref: '/image-variation-review.html',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Image Selection Board — MedVirtual</title>
  <style>${BOARD_CSS}</style>
</head>
<body>
  ${header}
  <div class="wrap">
    <header class="hero">
      <h2>Image Selection Board</h2>
      <p>Choose the strongest image based on subject position and available copy space.</p>
      <p class="clarify">Final typography and graphic treatment will be completed by the design team.</p>
      <div class="counts">
        <span>${total} usable crops</span>
        <span>Person Left: ${left.length}</span>
        <span>Person Right: ${right.length}</span>
        ${center.length ? `<span>Person Center: ${center.length}</span>` : ''}
        <span>Recommended first: ${recommended.length}</span>
      </div>
    </header>

    <div class="designer-note">
      Choose the image first. Then place the headline in the open space opposite the person. Do not cover faces, hands, laptops, or important workplace details.
    </div>

    <div class="guide">
      <div class="guide-card"><h3>Person Left</h3><p>Headline and support copy go on the right.</p></div>
      <div class="guide-card"><h3>Person Right</h3><p>Headline and support copy go on the left.</p></div>
      <div class="guide-card"><h3>Person Center</h3><p>Use only when there is clear open space above or around the subject.</p></div>
    </div>

    <div class="filters" role="group" aria-label="Filters">
      <span class="label">Ratio</span>
      <button type="button" class="chip is-active" data-filter-ratio="all">All</button>
      <button type="button" class="chip" data-filter-ratio="4x5">4:5 Feed</button>
      <button type="button" class="chip" data-filter-ratio="1x1">1:1 Square</button>
      <button type="button" class="chip" data-filter-ratio="9x16">9:16 Stories / Reels</button>
      <span class="label" style="margin-left:0.5rem">Position</span>
      <button type="button" class="chip is-active" data-filter-side="all">All positions</button>
      <button type="button" class="chip" data-filter-side="left">Person Left</button>
      <button type="button" class="chip" data-filter-side="right">Person Right</button>
      <button type="button" class="chip" data-filter-side="center">Person Center</button>
    </div>

    <section class="section" id="recommended-first">
      <div class="section-head">
        <h2>Recommended First Images</h2>
        <p>Start here — strongest crops for initial production.</p>
      </div>
      <div class="grid grid-rec">${recommended.map(renderSelectionCard).join('')}</div>
    </section>

    <section class="section" id="all-usable">
      <div class="section-head">
        <h2>All Usable Images</h2>
        <p>Full gallery by subject position. Alternates and hold crops stay below the recommended set.</p>
      </div>
    </section>
    ${sectionsHtml}
  </div>
  ${lightboxAndScript()}
</body>
</html>`;
}

function renderSimpleContactPage(title, subtitle, items, activeSubHref) {
  const header = renderDocHeader({
    activeId: 'images',
    pageTitle: title,
    pageSubtitle: subtitle,
    subnav: IMAGE_SUBNAV,
    activeSubHref,
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} — MedVirtual</title>
  <style>${BOARD_CSS}</style>
</head>
<body>
  ${header}
  <div class="wrap">
    <header class="hero">
      <h2>${esc(title)}</h2>
      <p>${esc(subtitle)}</p>
      <div class="counts"><span>${items.length} crops</span></div>
    </header>
    <div class="grid">${items.map(renderContactCard).join('')}</div>
  </div>
  ${lightboxAndScript()}
</body>
</html>`;
}

async function writeBoardsFromKept(kept) {
  const enriched = kept.map(enrichBoardItem);
  const aiItems = enriched.filter((v) => v.boardSection !== 'usable_later' && !String(v.sourceId || '').startsWith('LP_'));
  const later = enriched.filter((v) => v.boardSection === 'usable_later' || String(v.sourceId || '').startsWith('LP_'));
  const left = aiItems.filter((v) => v.boardSection === 'person_left');
  const right = aiItems.filter((v) => v.boardSection === 'person_right');
  const center = aiItems.filter((v) => v.boardSection === 'person_center');

  fs.writeFileSync(path.join(PUBLIC, 'image-variation-review.html'), renderSelectionBoard(aiItems));

  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-best-candidates.html'),
    renderSimpleContactPage('Approved AI Crops', 'Usable AI crops by subject position', aiItems, '/contact-sheet-best-candidates.html'),
  );
  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-all-4x5.html'),
    renderSimpleContactPage(
      '4:5 Feed Crops',
      'Approved 4:5 crops for Facebook / Instagram Feed',
      aiItems.filter((v) => v.aspectRatio === '4x5'),
      '/contact-sheet-all-4x5.html',
    ),
  );
  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-all-9x16.html'),
    renderSimpleContactPage(
      '9:16 Stories / Reels Crops',
      'Approved 9:16 crops for Stories and Reels',
      aiItems.filter((v) => v.aspectRatio === '9x16'),
      '/contact-sheet-all-9x16.html',
    ),
  );
  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-landing-page-images.html'),
    renderSimpleContactPage(
      'Headshot archive',
      'Not recommended for current ad production — archived reference only',
      later,
      '/contact-sheet-best-candidates.html',
    ),
  );
  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-ai-images.html'),
    renderSimpleContactPage('Approved AI Crops', 'Designer shortlist', aiItems, '/contact-sheet-best-candidates.html'),
  );

  spawnSync('node', [path.join(__dirname, 'generate-asset-hub.mjs')], { stdio: 'inherit' });
  return { left, right, center, later, approved: aiItems, sections: [] };
}

async function main() {
  const htmlOnly = process.argv.includes('--html-only');

  if (htmlOnly) {
    const catalogPath = path.join(PUBLIC, 'exports/image-tests/variations-catalog.json');
    if (!fs.existsSync(catalogPath)) {
      console.error('No variations-catalog.json — run full generate:images first.');
      process.exit(1);
    }
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const kept = (catalog.kept || []).map(enrichBoardItem);
    const { left, right, center, later, approved } = await writeBoardsFromKept(kept);
    fs.writeFileSync(
      catalogPath,
      JSON.stringify(
        {
          ...catalog,
          generatedAt: new Date().toISOString(),
          kept,
          summary: {
            personLeft: left.length,
            personRight: right.length,
            personCenter: center.length,
            headshots: later.length,
            totalVisible: approved.length,
            total: kept.length,
            textRule: 'Choose the image first. Place copy opposite the person.',
          },
        },
        null,
        2,
      ),
    );
    console.log(`Image boards refreshed from catalog (HTML only). Visible: ${approved.length}`);
    return;
  }

  console.log('Cleaning old crops...');
  cleanExportFolders();

  const kept = [];

  console.log('Rendering George-approved AI crops...');
  for (const item of APPROVED) {
    kept.push(await renderApprovedCrop(item));
  }

  // One layout per headshot: 4:5 flush-bottom (best for Meta feed + text above)
  console.log('Rendering headshots flush-bottom on white...');
  for (const hs of HEADSHOTS) {
    kept.push(
      await renderHeadshotTextSpace(hs, {
        ratio: '4x5',
        cropType: 'WHITE_TEXT_TOP',
        portraitScale: 0.82,
        sourceZoom: 0.86,
        sourceFocalY: 0.55,
      }),
    );
  }

  const { left, right, center, later } = await writeBoardsFromKept(kept);

  const catalog = {
    generatedAt: new Date().toISOString(),
    mode: 'george-approved-by-subject-side',
    kept,
    rejected: [],
    summary: {
      personLeft: left.length,
      personRight: right.length,
      personCenter: center.length,
      headshots: later.length,
      total: kept.length,
      textRule: 'Most images: put hook on top line. Person-left → text right. Person-right → text left. Center → text in top blank band.',
    },
  };

  fs.writeFileSync(
    path.join(PUBLIC, 'exports/image-tests/variations-catalog.json'),
    JSON.stringify(catalog, null, 2),
  );

  fs.writeFileSync(
    path.join(ROOT, 'image-variation-pass.md'),
    `# Image Selection Board

Generated: ${new Date().toISOString().slice(0, 10)}

Designer-facing shortlist. Headshots are excluded from the visible selection board.

## Placement rule

Choose the image first. Place the headline in the open space opposite the person.

| Subject side | Copy zone |
|--------------|-----------|
| Left | Right side + top |
| Right | Left side + top |
| Center | Open top band only |

## Visible board counts

- Person LEFT: ${left.length}
- Person RIGHT: ${right.length}
- Person CENTER: ${center.length}
- Headshots (archived, not on board): ${later.length}

Review: http://localhost:5173/image-variation-review.html
`,
  );

  console.log(`\nBoard: Left ${left.length} | Right ${right.length} | Center ${center.length} (headshots archived: ${later.length})`);
  console.log('Review: http://localhost:5173/image-variation-review.html');

  spawnSync('node', ['scripts/generate-handoff-docs.mjs'], { cwd: ROOT, stdio: 'inherit' });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
