/**
 * MedVirtual Ad Production site generator.
 *
 * Writes 8 primary pages (Dashboard, Approved Creative, New Ad Ideas, Aspect
 * Ratios, Competitor Wall, Animated Video, Prompts & Copy, Production Handoff)
 * plus thin meta-refresh redirects for every retired Creative Handoff page.
 *
 * Hard rules:
 *   - Never generates or edits image files. Text / HTML / CSS only.
 *   - Only uses the existing APPROVED_MASTERS masterImage paths.
 *   - Missing formats always render literal "AWAITING DESIGN" placeholders —
 *     never a fake / stretched preview.
 *   - No pink anywhere in site chrome or copy.
 *
 * Run: npm run generate:vma
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  VMA_META,
  VIDEO_SCENES_15S,
  REMOTION_COMPONENTS,
  REMOTION_COMPOSITIONS,
  REMOTION_PLAYBOOK,
  CAPCUT_TEMPLATES,
  CHATGPT_PROMPTS,
  VIDEO_PROMPTS,
  COPY_EN,
  COPY_ES,
  CLAIMS,
  IDEA_CATEGORIES,
  CONCEPT_BATCH_STRUCTURE,
  CHATGPT_WORKFLOW,
} from './vma-site-data.mjs';
import { IDEA_SPARK_CONCEPTS, IDEA_SPARK_NOTE } from './idea-concepts-data.mjs';
import {
  APPROVED_MASTERS,
  COLOR_DIRECTION,
  FORMAT_SPECS,
  VIDEO_OUTPUTS_PER_MASTER,
  VIDEO_STORYBOARD,
  DASHBOARD_CLAIMS,
  HANDOFF_QA,
  CURRENT_META_FORM,
  PINK_REFERENCE_COMPETITOR_IDS,
  HISTORY_NOTES,
  presentFormatsSummary,
  formatMatrixCells,
  GRAPHICS_BUILD_ORDER,
  GRAPHICS_VARIATION_ORDER,
  GRAPHICS_PAUSED,
  WINNING_MASTER_NUMBER,
  GRAPHICS_DO,
  GRAPHICS_DONT,
  WHAT_WE_NEED_NOW,
  MASTER_NOTE,
  ASPECT_RATIO_HANDOFF_CHECKLIST,
  FILE_NAMING,
} from './vma-approved-masters.mjs';
import {
  COMPETITOR_ADS,
  COMPETITOR_META,
  WALL_LIVE_SOURCE_IDS,
  WALL_STATIC_CREATIVES,
  BLOCKED_COMPETITOR_IMAGES,
  adLibraryUrl,
} from './competitor-ads-data.mjs';
import { loadLiveSnapshots } from './scrape-ad-library-helpers.mjs';
import { GRAPHICS_REQUEST_EMAIL } from './creative-hopper-data.mjs';
import { writeGraphicsKit } from './generate-graphics-kit.mjs';
import {
  WINNING_NOTE,
  ACTIVE_REQUEST_NOTE,
  MONDAY_REQUEST,
  GREEN_MOTION_BRIEF,
  DELIVERABLES_STATIC,
  DELIVERABLES_MOTION,
  CONCEPT_VARIATIONS,
  TEAM_HANDOFF_LINKS,
  SITE_BASE,
} from './production-library-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function imageExists(webPath) {
  if (!webPath || BLOCKED_COMPETITOR_IMAGES.has(webPath)) return false;
  const disk = path.join(PUBLIC, webPath.replace(/^\//, ''));
  return fs.existsSync(disk);
}

/**
 * One card per company. Prefer curated static/featured over live duplicates.
 * Only cards with real image files are included.
 */
function companyKey(name) {
  const n = String(name || '')
    .toLowerCase()
    .replace(/[—–].*$/, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (n.startsWith('commure')) return 'commure';
  if (n.startsWith('hello rache')) return 'hello rache';
  if (n.startsWith('weave')) return 'weave';
  if (n.startsWith('almost friday')) return 'almost friday';
  if (n.startsWith('my mountain')) return 'my mountain mover';
  if (n.startsWith('my medical')) return 'my medical va';
  return n;
}

function collectCompetitorWallCards() {
  const live = loadLiveSnapshots();
  const byId = Object.fromEntries(COMPETITOR_ADS.map((a) => [a.id, a]));
  const seenImages = new Set();
  const seenCompanies = new Set();
  const cards = [];

  function pushCard(card) {
    if (!card?.image || !imageExists(card.image) || seenImages.has(card.image)) return;
    const key = companyKey(card.name);
    if (!key || seenCompanies.has(key)) return;
    seenImages.add(card.image);
    seenCompanies.add(key);
    cards.push(card);
  }

  // Curated static first (featured new companies + best of known), then live fills gaps only
  for (const creative of WALL_STATIC_CREATIVES) {
    const pink = PINK_REFERENCE_COMPETITOR_IDS.has(creative.id) || /hello\s*rache/i.test(creative.name);
    pushCard({
      id: creative.id,
      name: creative.name,
      category: creative.category,
      featured: Boolean(creative.featured),
      whyWatch: creative.whyWatch,
      offer: creative.fingerprint?.hookStyle || '—',
      visual: creative.fingerprint?.visual || '—',
      steal: creative.steal,
      reject: creative.reject,
      adLibraryQuery: creative.adLibraryQuery,
      libraryId: '',
      image: creative.image,
      pink,
      source: 'static',
    });
  }

  for (const sourceId of WALL_LIVE_SOURCE_IDS) {
    const seed = byId[sourceId] || { id: sourceId, name: sourceId, adLibraryQuery: sourceId };
    const ads = live.sources?.[sourceId]?.ads || [];
    for (const ad of ads) {
      const name = ad.advertiser || seed.name || sourceId;
      const pink =
        PINK_REFERENCE_COMPETITOR_IDS.has(sourceId) ||
        /hello\s*rache|my medical va/i.test(name);
      pushCard({
        id: `${sourceId}-${ad.libraryId || ad.index || ad.image}`,
        name,
        category: seed.category || 'virtual-staffing',
        featured: false,
        whyWatch: ad.headline || ad.primaryText || seed.whyWatch || 'Live Meta Ad Library creative',
        offer: ad.headline || ad.description || seed.fingerprint?.hookStyle || '—',
        visual: seed.fingerprint?.visual || 'Live Meta creative',
        steal: seed.steal || 'Study hierarchy and offer clarity.',
        reject: seed.reject || 'Do not copy layout, color system, badges, or talent.',
        adLibraryQuery: seed.adLibraryQuery || name,
        libraryId: ad.libraryId || '',
        image: ad.image,
        pink,
        source: 'live',
      });
    }
  }

  // Featured first, then medical / VA staffing, then adjacent software
  const rank = (c) => {
    if (c.category === 'virtual-staffing') return 0;
    if (/hello\s*rache|medical va|mountain mover|edge|snappy|portiva|cure|psyphy|tactical|assist|wishup|medva|almost friday/i.test(c.name))
      return 0;
    if (c.category === 'practice-saas') return 2;
    return 1;
  };
  cards.sort(
    (a, b) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      rank(a) - rank(b) ||
      a.name.localeCompare(b.name),
  );

  return {
    cards,
    updatedAt: live.updatedAt || null,
  };
}

let filesWritten = 0;

function write(name, html) {
  fs.writeFileSync(path.join(PUBLIC, name), html);
  filesWritten += 1;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Inline line icons (calm, single-stroke, currentColor) ───────────────────

const ICON_PATHS = {
  approved:
    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  target:
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  formats:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  links:
    '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  eye:
    '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  idea:
    '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
  ratio:
    '<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>',
  search:
    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  prompt:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  handoff:
    '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  video:
    '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
};

function icon(name) {
  const p = ICON_PATHS[name];
  if (!p) return '';
  return `<span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg></span>`;
}

// ─── Design system (calm site chrome — white / navy / teal / light blue) ─────

const PAGE_CSS = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: #0B1F3A;
    background: #F7FAFC;
    line-height: 1.5;
  }
  a { color: #077999; }
  a:hover { color: #00B2E2; }
  main { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1.15rem 4.5rem; }
  h1, h2, h3 { color: #0B1F3A; letter-spacing: -0.02em; }
  h1 { font-size: clamp(1.55rem, 3.5vw, 2.1rem); margin: 0 0 0.35rem; }
  h2 { font-size: 1.15rem; margin: 0 0 0.5rem; }
  h3 { font-size: 1rem; margin: 0 0 0.35rem; }
  .banner {
    margin: 0 0 1.35rem;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #D6E4EC;
    border-left: 4px solid #077999;
    font-size: 0.9rem;
    color: #0B1F3A;
  }
  .banner strong { color: #077999; }
  .banner .sub { display: block; color: #4A6275; margin-top: 0.25rem; font-weight: 400; }
  .hero { margin-bottom: 1.5rem; }
  .hero p, .lede { margin: 0; max-width: 46rem; color: #4A6275; }
  section { margin-top: 2rem; }
  section > h2 { padding-bottom: 0.35rem; border-bottom: 1px solid #E2EBF1; }
  .note {
    margin: 0.75rem 0 1rem;
    padding: 0.7rem 0.85rem;
    border-radius: 8px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    font-size: 0.86rem;
  }
  .callout-rule {
    margin: 1rem 0 1.5rem;
    padding: 0.9rem 1.1rem;
    border-radius: 10px;
    background: #FDEDED;
    border: 2px solid #B42318;
    color: #7F1D1D;
    font-weight: 800;
    font-size: 0.92rem;
    letter-spacing: 0.01em;
  }
  .pill {
    display: inline-block;
    padding: 0.14rem 0.55rem;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    border: 1px solid transparent;
    vertical-align: middle;
  }
  .s-approved, .s-approved-creative-baseline, .s-primary-feed-format {
    background: #E6F7F4; color: #0F766E; border-color: #99D5CD;
  }
  .s-awaiting-design {
    background: #FFF8E8; color: #A16207; border-color: #F0D78C;
  }
  .s-ai-draft {
    background: #E6F7F4; color: #0D546B; border-color: #7FCBD6;
  }
  .s-image-needed, .s-pending {
    background: #EEF2F6; color: #475569; border-color: #CBD5E1;
  }
  .s-rejected, .s-do-not-use {
    background: #FEECEC; color: #B91C1C; border-color: #FECACA;
  }
  .masters-grid {
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  .master-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .master-card__media {
    background: #E8EEF2;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .master-card__media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .master-card--lg .master-card__media { min-height: 220px; }
  .master-card--md .master-card__media { min-height: 160px; }
  .master-card__body { padding: 0.85rem 0.95rem 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; }
  .master-card__meta { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #077999; }
  .master-card h3 { margin: 0; font-size: 1.02rem; }
  .master-card p { margin: 0; font-size: 0.82rem; color: #4A6275; }
  .master-card .dl {
    margin-top: auto;
    padding-top: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
  }
  .format-row {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    margin: 0.75rem 0 1.5rem;
  }
  .format-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    overflow: hidden;
    font-size: 0.8rem;
  }
  .format-card__preview {
    background: #EEF2F6;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 110px;
    padding: 0.4rem;
  }
  .format-card__preview img {
    max-width: 100%;
    max-height: 160px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }
  .format-card__preview[data-ratio="1x1"] { aspect-ratio: 1 / 1; }
  .format-card__preview[data-ratio="4x5"] { aspect-ratio: 4 / 5; }
  .format-card__preview[data-ratio="9x16"] { aspect-ratio: 9 / 16; max-height: 200px; }
  .format-card__preview[data-ratio="1\\.91x1"] { aspect-ratio: 1.91 / 1; }
  .format-placeholder {
    text-align: center;
    padding: 0.6rem;
    color: #64748B;
    font-size: 0.72rem;
    line-height: 1.35;
  }
  .format-placeholder strong { display: block; color: #A16207; margin-bottom: 0.25rem; font-size: 0.76rem; letter-spacing: 0.03em; }
  .format-card__body { padding: 0.55rem 0.65rem 0.7rem; }
  .format-card__body b { display: block; color: #0B1F3A; }
  .format-explain {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-left: 4px solid #077999;
    border-radius: 12px;
    padding: 1.1rem 1.3rem;
    margin: 1rem 0;
  }
  .format-explain h3 { margin-top: 0.3rem; font-size: 1.15rem; }
  .size-strip {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: center;
    gap: 1.1rem 1.4rem;
    padding: 1.25rem 1rem 1.4rem;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    margin: 0.85rem 0 1.25rem;
  }
  .size-strip__item { text-align: center; max-width: 9.5rem; }
  .size-strip__frame {
    margin: 0 auto 0.55rem;
    border: 2px solid #077999;
    border-radius: 8px;
    background: linear-gradient(160deg, #EEF6FA 0%, #D6E4EC 100%);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.65);
  }
  .size-strip__item[data-id="1x1"] .size-strip__frame { width: 84px; height: 84px; }
  .size-strip__item[data-id="4x5"] .size-strip__frame { width: 84px; height: 105px; }
  .size-strip__item[data-id="9x16"] .size-strip__frame { width: 68px; height: 120px; }
  .size-strip__item[data-id="1.91x1"] .size-strip__frame { width: 120px; height: 63px; }
  .size-strip__item strong { display: block; font-size: 0.9rem; color: #0B1F3A; }
  .size-strip__item span { display: block; font-size: 0.72rem; color: #4A6275; margin-top: 0.15rem; }
  .size-strip__item .chip { margin-top: 0.35rem; }
  .example-hero {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: minmax(220px, 340px) 1fr;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    padding: 1.15rem;
    margin: 0.85rem 0 1.5rem;
  }
  .example-hero__media {
    background: #E8EEF2;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 1 / 1;
  }
  .example-hero__media img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .example-hero__points { display: grid; gap: 0.55rem; }
  .example-hero__points .soft-card { padding: 0.7rem 0.85rem; }
  .example-hero__points h3 { margin: 0 0 0.2rem; font-size: 0.95rem; }
  .ratio-guide {
    display: grid;
    gap: 1.15rem;
    grid-template-columns: minmax(150px, 210px) 1fr;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    padding: 1.1rem 1.2rem;
    margin: 0.9rem 0;
  }
  .ratio-guide__visual { display: flex; flex-direction: column; align-items: center; gap: 0.55rem; }
  .wire {
    position: relative;
    width: 100%;
    max-width: 180px;
    background: #F0F5F8;
    border: 2px solid #077999;
    border-radius: 10px;
    overflow: hidden;
  }
  .wire[data-ratio="1x1"] { aspect-ratio: 1 / 1; }
  .wire[data-ratio="4x5"] { aspect-ratio: 4 / 5; }
  .wire[data-ratio="9x16"] { aspect-ratio: 9 / 16; max-width: 140px; }
  .wire[data-ratio="1.91x1"] { aspect-ratio: 1.91 / 1; max-width: 220px; }
  .wire-zone {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.15rem;
    border-radius: 5px;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1.15;
    color: #0B1F3A;
    background: rgba(0, 178, 226, 0.22);
    border: 1px dashed #077999;
  }
  .wire-zone[data-id="talent"] { background: rgba(11, 31, 58, 0.12); border-color: #0B1F3A; }
  .wire-zone[data-id="badge"] { background: rgba(184, 240, 0, 0.28); border-color: #077999; color: #0B1F3A; }
  .wire-zone[data-id="safe-top"],
  .wire-zone[data-id="safe-bottom"] {
    background: repeating-linear-gradient(-45deg, #FEECEC, #FEECEC 4px, #fff 4px, #fff 8px);
    border-color: #B42318;
    color: #7F1D1D;
    font-size: 0.58rem;
  }
  .ratio-guide__copy h3 { margin: 0 0 0.2rem; }
  .ratio-guide__copy .dims { font-size: 0.78rem; color: #4A6275; margin: 0 0 0.55rem; }
  .ratio-guide__thumb {
    width: 100%;
    max-width: 180px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #D6E4EC;
    background: #EEF2F6;
  }
  .ratio-guide__thumb img { width: 100%; height: auto; display: block; }
  .await-board {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .await-board .soft-card img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    background: #EEF2F6;
    border-radius: 8px;
    display: block;
    margin-bottom: 0.55rem;
  }
  .spark-grid {
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    margin-top: 0.85rem;
  }
  .mock-grid {
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    margin-top: 0.85rem;
  }
  .mock-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .mock-card__media { background: #0B1F3A; aspect-ratio: 4 / 5; }
  .mock-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .mock-card__body { padding: 0.9rem 1rem 1.05rem; display: flex; flex-direction: column; gap: 0.35rem; }
  .mock-card__tag {
    align-self: flex-start;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #077999;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
  }
  .mock-card__body h3 { margin: 0; font-size: 1.2rem; }
  .mock-card__body p { margin: 0; font-size: 0.98rem; color: #33475B; }
  @media (max-width: 720px) {
    .mock-grid { grid-template-columns: 1fr; }
    .mock-card__body h3 { font-size: 1.4rem; }
    .mock-card__body p { font-size: 1.08rem; }
  }
  .spark-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .spark-card__media {
    background: #0B1F3A;
    aspect-ratio: 1 / 1;
  }
  .spark-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .spark-card__body { padding: 1rem 1.1rem 1.15rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
  .spark-card__meta {
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #077999;
  }
  .spark-card__headline { margin: 0; font-size: 1.3rem; line-height: 1.2; color: #0B1F3A; }
  .spark-card__angle { margin: 0; font-size: 0.98rem; line-height: 1.45; color: #33475B; }
  .spark-card .chip { font-size: 0.82rem; padding: 0.22rem 0.6rem; align-self: flex-start; }
  .spark-card__spark {
    margin-top: auto;
    padding: 0.7rem 0.8rem;
    border-radius: 8px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    font-size: 0.92rem;
    line-height: 1.4;
    font-weight: 650;
  }
  .feedback-ui {
    margin-top: 0.35rem;
    padding: 0.7rem;
    border: 1px solid #D6E4EC;
    border-radius: 9px;
    background: #F7FAFB;
  }
  .feedback-ui__vote { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; }
  .feedback-ui__vote strong { margin-right: 0.25rem; font-size: 0.78rem; color: #33475B; }
  .feedback-ui button {
    border: 1px solid #B9CAD4; border-radius: 7px; background: #fff; padding: 0.36rem 0.55rem;
    font: inherit; font-size: 0.75rem; font-weight: 750; cursor: pointer;
  }
  .feedback-ui button.selected[data-vote="up"] { background: #DFF5E8; border-color: #45A66D; }
  .feedback-ui button.selected[data-vote="down"] { background: #FFE4E4; border-color: #D65353; }
  .feedback-ui label { display: grid; gap: 0.2rem; margin-top: 0.45rem; font-size: 0.7rem; font-weight: 750; color: #4A6275; }
  .feedback-ui textarea {
    width: 100%; box-sizing: border-box; resize: vertical; border: 1px solid #CBD5E1;
    border-radius: 7px; padding: 0.45rem; font: inherit; font-size: 0.78rem;
  }
  .feedback-ui small { display: block; margin-top: 0.3rem; color: #6A7D89; font-size: 0.66rem; }
  .feedback-rejected {
    margin-top: 1rem; padding: 0.75rem; border: 1px solid #D3A3A3; border-radius: 10px;
    background: #FFF7F7;
  }
  .feedback-rejected summary { cursor: pointer; font-weight: 800; }
  .feedback-rejected__item { display: flex; justify-content: space-between; gap: 0.6rem; padding-top: 0.55rem; }
  .feedback-rejected__item p { margin: 0.15rem 0 0; color: #6B3A3A; font-size: 0.78rem; }
  @media (max-width: 720px) {
    .example-hero, .ratio-guide { grid-template-columns: 1fr; }
    .ratio-guide__visual { flex-direction: row; flex-wrap: wrap; justify-content: center; }
    .spark-grid { grid-template-columns: 1fr; gap: 1.25rem; }
    .spark-card__meta { font-size: 0.9rem; }
    .spark-card__headline { font-size: 1.5rem; }
    .spark-card__angle { font-size: 1.08rem; }
    .spark-card .chip { font-size: 0.92rem; padding: 0.28rem 0.7rem; }
    .spark-card__spark { font-size: 1.02rem; }
  }
  .approved-detail {
    display: grid;
    grid-template-columns: minmax(260px, 380px) 1fr;
    gap: 1.5rem;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    padding: 1.25rem;
    margin-top: 1.25rem;
  }
  .approved-detail__media {
    background: #E8EEF2;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 1 / 1;
  }
  .approved-detail__media img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .approved-detail__grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .ico {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 0;
  }
  .section-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .section-head .ico { color: #077999; }
  .primary-task {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
    background: #ffffff;
    border: 1px solid #D6E4EC;
    border-left: 4px solid #077999;
    border-radius: 12px;
    padding: 1rem 1.15rem;
    margin: 0.75rem 0 1rem;
  }
  .primary-task .ico { color: #077999; margin-top: 0.1rem; }
  .primary-task__label {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #077999;
    margin: 0 0 0.15rem;
  }
  .primary-task__text { margin: 0; font-size: 0.98rem; font-weight: 700; color: #0B1F3A; }
  .primary-task__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.65rem;
    padding: 0.55rem 1rem;
    border-radius: 10px;
    background: #B8F000;
    color: #0B1F3A !important;
    text-decoration: none;
    font-weight: 800;
    font-size: 0.92rem;
  }
  .primary-task__cta:hover { filter: brightness(1.05); }
  .badge-new {
    font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    color: #fff; background: #077999; border-radius: 999px; padding: 0.15rem 0.5rem;
  }
  .studio-cta {
    background: linear-gradient(160deg,#0B1F3A 0%,#0d3350 100%);
    border-radius: 14px; padding: 1.4rem 1.5rem; margin: 0.75rem 0 1.25rem; color: #fff;
  }
  .studio-cta__lede { margin: 0 0 0.6rem; font-size: 1.02rem; line-height: 1.5; color: #eaf3f8; }
  .studio-cta__lede b { color: #fff; }
  .studio-cta .note { color: #a9c4d3; margin: 0 0 1rem; }
  .studio-cta__btn {
    display: inline-block; background: #00B2E2; color: #04121f; font-weight: 800;
    padding: 0.7rem 1.2rem; border-radius: 10px; text-decoration: none; font-size: 0.98rem;
  }
  .studio-cta__btn:hover { filter: brightness(1.08); }
  .rule-chips { display: flex; flex-wrap: wrap; gap: 0.4rem 0.5rem; margin: 0.35rem 0 0; }
  .rule-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #0D546B;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    border-radius: 999px;
    padding: 0.28rem 0.7rem;
  }
  .rule-chip .ico svg { width: 15px; height: 15px; }
  .quick-links {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  .quick-links a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.6rem;
    text-align: left;
    min-height: 3.4rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: #077999;
    color: #fff !important;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.92rem;
  }
  .quick-links a:hover { background: #0D546B; }
  .queue-grid, .claim-grid, .comp-grid, .copy-grid, .prompt-grid, .cat-grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  .pr-grid {
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    margin-top: 0.75rem;
  }
  .pr-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .pr-card__media { background: #0B1F3A; aspect-ratio: 4 / 5; }
  .pr-card__media.square { aspect-ratio: 1 / 1; }
  .pr-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pr-card__body { padding: 0.85rem 0.95rem 1rem; display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
  .pr-card__tag {
    align-self: flex-start;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #077999;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    border-radius: 999px;
    padding: 0.18rem 0.55rem;
  }
  .pr-card__body h3 { margin: 0; font-size: 1.1rem; }
  .pr-card__body p { margin: 0; font-size: 0.92rem; color: #4A6275; }
  .pr-card details { margin-top: 0.35rem; }
  .pr-card summary {
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 700;
    color: #077999;
    list-style: none;
  }
  .pr-card summary::-webkit-details-marker { display: none; }
  .pr-card .prompt-body {
    margin-top: 0.5rem;
    padding: 0.65rem 0.75rem;
    background: #F5F8FA;
    border-radius: 8px;
    font-size: 0.8rem;
    color: #33475B;
    white-space: pre-wrap;
    line-height: 1.45;
    max-height: 12rem;
    overflow: auto;
  }
  .pr-card .pr-actions { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.45rem; }
  .copy-picks { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  .copy-pick {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    padding: 0.85rem 0.95rem;
  }
  .copy-pick h3 { margin: 0 0 0.45rem; font-size: 0.95rem; }
  .copy-pick .line {
    display: flex; gap: 0.4rem; align-items: flex-start;
    margin: 0.35rem 0; font-size: 0.88rem; color: #0B1F3A;
  }
  .copy-pick .line .copy-btn { flex-shrink: 0; margin-top: 0; }
  .soft-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    padding: 0.9rem 1rem;
  }
  .soft-card p { margin: 0.25rem 0; font-size: 0.86rem; color: #4A6275; }
  .checklist { list-style: none; margin: 0.5rem 0 0; padding: 0; }
  .checklist li {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    padding: 0.45rem 0;
    border-bottom: 1px solid #E8EEF2;
    font-size: 0.9rem;
  }
  .checklist li:last-child { border-bottom: 0; }
  .checklist input { margin-top: 0.2rem; }
  ul.clean { margin: 0.4rem 0 0; padding-left: 1.15rem; color: #4A6275; font-size: 0.88rem; }
  ul.clean li { margin: 0.2rem 0; }
  .chip {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.12rem 0.45rem;
    border-radius: 6px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    margin: 0.1rem 0.15rem 0 0;
  }
  .comp-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .comp-card.incomplete { opacity: 0.7; border-style: dashed; }
  .comp-card__media {
    background: #EEF2F6;
    aspect-ratio: 4 / 5;
    max-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .comp-card__media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .comp-card__body { padding: 0.85rem 0.95rem 1rem; font-size: 0.9rem; }
  .comp-card__body h3 { margin: 0 0 0.25rem; font-size: 1.05rem; }
  .comp-card__body .why { font-weight: 600; color: #33475B; margin: 0.2rem 0 0; font-size: 0.92rem; }
  .comp-card__body .mini { margin: 0.4rem 0 0; color: #4A6275; font-size: 0.86rem; }
  .comp-card__body .mini b { color: #0B1F3A; }
  .comp-more { margin-top: 0.6rem; }
  .comp-more summary {
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 700;
    color: #077999;
    list-style: none;
  }
  .comp-more summary::-webkit-details-marker { display: none; }
  .comp-more summary::before { content: "＋ "; font-weight: 700; }
  .comp-more[open] summary::before { content: "－ "; }
  .pink-ref {
    display: inline-block;
    margin-bottom: 0.35rem;
    font-size: 0.72rem;
    font-weight: 800;
    color: #0D546B;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    border-radius: 6px;
    padding: 0.2rem 0.45rem;
  }
  .thumb-row { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0.75rem 0; }
  .thumb-row a, .thumb-row span {
    display: block;
    width: 88px;
    height: 88px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #D6E4EC;
    background: #EEF2F6;
  }
  .thumb-row img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .job-box {
    background: #fff;
    border: 2px solid #077999;
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
  }
  .job-box h2 { margin-top: 0; }
  .job-steps { counter-reset: step; list-style: none; margin: 0.75rem 0 0; padding: 0; }
  .job-steps li {
    counter-increment: step;
    position: relative;
    padding: 0.55rem 0.55rem 0.55rem 2.4rem;
    border-bottom: 1px solid #E8EEF2;
    font-size: 0.92rem;
  }
  .job-steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 999px;
    background: #077999;
    color: #fff;
    font-weight: 800;
    font-size: 0.78rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .two-cols { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .do-list li::marker { color: #077999; }
  .dont-list li::marker { color: #B42318; }
  .matrix { width: 100%; border-collapse: collapse; font-size: 0.8rem; margin-top: 0.5rem; }
  .matrix th, .matrix td { border: 1px solid #D6E4EC; padding: 0.45rem 0.5rem; text-align: center; background: #fff; }
  .matrix th { background: #F0F5F8; color: #4A6275; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .matrix td.rowhead { text-align: left; font-weight: 700; color: #0B1F3A; }
  .storyboard {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    margin: 0.75rem 0;
  }
  .storyboard .beat {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-top: 3px solid #077999;
    border-radius: 8px;
    padding: 0.55rem 0.65rem;
    font-size: 0.8rem;
  }
  .storyboard .beat b { display: block; color: #0B1F3A; font-size: 0.78rem; }
  .storyboard .beat span { color: #4A6275; font-size: 0.72rem; }
  .tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.85rem 0 0.5rem; }
  .tabs label, .tabs button {
    font: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    color: #0B1F3A;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
  }
  .tabs label:hover, .tabs button:hover, .tabs button.active, .tabs input:checked + label {
    background: #077999;
    color: #fff;
    border-color: #077999;
  }
  .tab-panels .tab-panel { display: none; }
  .tab-panels .tab-panel.active { display: block; }
  main details.block, .block details.block {
    margin: 0.65rem 0;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    padding: 0.65rem 0.9rem;
  }
  main details.block > summary {
    cursor: pointer;
    font-weight: 700;
    color: #0B1F3A;
    list-style: none;
  }
  main details.block > summary::-webkit-details-marker { display: none; }
  main details.block[open] > summary { margin-bottom: 0.55rem; }
  .copytext {
    display: block;
    background: #F0F5F8;
    border: 1px solid #D6E4EC;
    border-radius: 8px;
    padding: 0.55rem 0.7rem;
    font-size: 0.82rem;
    color: #0B1F3A;
    white-space: pre-wrap;
    margin-top: 0.35rem;
  }
  .copy-btn {
    font: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    background: #077999;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 0.28rem 0.6rem;
    margin-top: 0.4rem;
  }
  .copy-btn:hover { background: #0D546B; }
  .copy-btn.copied { background: #0F766E; }
  .swatch-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.5rem 0; }
  .swatch-chip {
    font-size: 0.78rem;
    padding: 0.25rem 0.55rem;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #D6E4EC;
  }
  .concept-form {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
  }
  .concept-form label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: #0D546B;
  }
  .concept-form input,
  .concept-form select,
  .concept-form textarea {
    font: inherit;
    font-size: 0.85rem;
    padding: 0.4rem 0.55rem;
    border: 1px solid #D6E4EC;
    border-radius: 7px;
    background: #F7FAFC;
    color: #0B1F3A;
  }
  .concept-form textarea { resize: vertical; min-height: 3rem; }
  .concept-form .full { grid-column: 1 / -1; }
  .concept-form button[type="submit"] {
    grid-column: 1 / -1;
    justify-self: start;
    font: inherit;
    font-weight: 800;
    font-size: 0.88rem;
    padding: 0.6rem 1.3rem;
    border: none;
    border-radius: 999px;
    background: #077999;
    color: #fff;
    cursor: pointer;
  }
  .concept-form button[type="submit"]:hover { background: #0D546B; }
  .foot {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #D6E4EC;
    color: #64748B;
    font-size: 0.76rem;
  }
  @media (max-width: 640px) {
    main { padding: 1.1rem 0.85rem 3.5rem; }
    .masters-grid { grid-template-columns: 1fr 1fr; }
    .master-card--lg .master-card__media { min-height: 140px; }
    .approved-detail { grid-template-columns: 1fr; }
  }
`;

const PAGE_SCRIPT = `
<script>
(function(){
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.copy-btn');
    if(!btn) return;
    var text = btn.getAttribute('data-copy') || '';
    navigator.clipboard.writeText(text).then(function(){
      var old = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = old; btn.classList.remove('copied'); }, 1400);
    });
  });
  document.querySelectorAll('[data-tabs]').forEach(function(root){
    var buttons = root.querySelectorAll('[data-tab]');
    var panels = root.querySelectorAll('.tab-panel');
    function activate(id){
      buttons.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab') === id); });
      panels.forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-panel') === id); });
    }
    buttons.forEach(function(b){
      b.addEventListener('click', function(){ activate(b.getAttribute('data-tab')); });
    });
    var hash = (location.hash || '').replace(/^#/, '');
    if(hash && root.querySelector('[data-panel="'+hash+'"]')) activate(hash);
    else {
      var first = buttons[0];
      if(first) activate(first.getAttribute('data-tab'));
    }
    window.addEventListener('hashchange', function(){
      var h = (location.hash || '').replace(/^#/, '');
      if(h && root.querySelector('[data-panel="'+h+'"]')) activate(h);
    });
  });
  document.querySelectorAll('[data-persist]').forEach(function(el){
    var k = 'vma-'+el.getAttribute('data-persist');
    try {
      var saved = localStorage.getItem(k);
      if(saved !== null){
        if(el.type === 'checkbox') el.checked = saved === '1';
        else el.value = saved;
      }
    } catch(e){}
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function(){
      try {
        localStorage.setItem(k, el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value);
      } catch(e){}
    });
  });
})();
</script>`;

// ─── Shared helpers ──────────────────────────────────────────────────────────

function statusBadge(status) {
  const raw = String(status ?? '');
  const cls =
    's-' +
    raw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  return `<span class="pill ${cls}">${esc(raw)}</span>`;
}

function copyBlock(text) {
  return `<span class="copytext">${esc(text)}</span><button type="button" class="copy-btn" data-copy="${esc(text)}">Copy</button>`;
}

function masterCard(master, { size = 'lg' } = {}) {
  const formats = presentFormatsSummary(master);
  const serviceChips = master.services.map((s) => `<span class="chip">${esc(s)}</span>`).join('');
  return `<article class="master-card master-card--${esc(size)}">
  <div class="master-card__media">
    <img src="${esc(master.masterImage)}" alt="${esc(master.name)} approved master 1:1" width="1080" height="1080" loading="lazy" />
  </div>
  <div class="master-card__body">
    <div class="master-card__meta">VMA-${esc(master.number)} · ${esc(master.name)}</div>
    <h3>${esc(master.headline)}</h3>
    <p>${esc(master.angle)}</p>
    <p><b>Color family:</b> ${esc(master.colorFamily)}</p>
    <p>${serviceChips}</p>
    <p><b>Offer / badge:</b> ${esc(master.offerOrBadge)}</p>
    <p><b>Formats available:</b> ${esc(formats.availableLabel)}</p>
    <p>${statusBadge(master.status)}</p>
    <a class="dl" href="${esc(master.masterImage)}" download>Download 1:1 master</a>
  </div>
</article>`;
}

function mastersGrid(size = 'lg') {
  return `<div class="masters-grid">${APPROVED_MASTERS.map((m) => masterCard(m, { size })).join('')}</div>`;
}

function formatRow(master) {
  const cards = master.formats
    .map((f) => {
      if (f.path) {
        return `<div class="format-card">
  <div class="format-card__preview" data-ratio="${esc(f.formatId)}">
    <img src="${esc(f.path)}" alt="${esc(master.name)} ${esc(f.label)}" loading="lazy" />
  </div>
  <div class="format-card__body">
    <b>${esc(f.label)} · ${esc(f.dims)}</b>
    <div>${statusBadge(f.status)}</div>
    <div style="margin-top:0.25rem;color:#4A6275;font-size:0.72rem">${esc(f.placement)}</div>
  </div>
</div>`;
      }
      return `<div class="format-card">
  <div class="format-card__preview" data-ratio="${esc(f.formatId)}">
    <div class="format-placeholder">
      <strong>AWAITING DESIGN</strong>
      ${esc(f.expectedFilename)}<br />${esc(f.dims)}
    </div>
  </div>
  <div class="format-card__body">
    <b>${esc(f.label)} · ${esc(f.dims)}</b>
    <div>${statusBadge('Awaiting Design')}</div>
    <div style="margin-top:0.25rem;color:#4A6275;font-size:0.72rem">${esc(f.layoutNote)}</div>
  </div>
</div>`;
    })
    .join('');
  return `<div class="format-row">${cards}</div>`;
}

function page({ activeId, title, pageTitle, pageSubtitle, subnav, activeSubHref, body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} · MedVirtual</title>
  <style>${HEADER_CSS}${PAGE_CSS}</style>
</head>
<body>
  ${renderDocHeader({ activeId, pageTitle, pageSubtitle, subnav, activeSubHref })}
  <main>
    <div class="banner"><strong>${esc(VMA_META.banner)}</strong><span class="sub">${esc(VMA_META.bannerSub)}</span></div>
    ${body}
    <p class="foot">MedVirtual Ad Production · No pink · Reviewed ${esc(VMA_META.reviewDateDisplay)}.</p>
  </main>
  ${PAGE_SCRIPT}
</body>
</html>`;
}

function renderRedirect(to) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${esc(to)}" />
  <link rel="canonical" href="${esc(to)}" />
  <title>Redirecting…</title>
</head>
<body>
  <p>Moved to <a href="${esc(to)}">${esc(to)}</a>.</p>
</body>
</html>`;
}

// ─── 1. Dashboard (studio.html) ──────────────────────────────────────────────

function renderStudio() {
  const rules = WHAT_WE_NEED_NOW.slice(1);
  const ruleChips = rules
    .map((r) => `<span class="rule-chip">${icon('approved')}${esc(r)}</span>`)
    .join('');
  const winner = APPROVED_MASTERS.find((m) => m.number === WINNING_MASTER_NUMBER);
  const pausedList = GRAPHICS_PAUSED.map((n) => `VMA-${n}`).join(', ');

  const formatCards = FORMAT_SPECS.map(
    (f) => `<div class="soft-card">
  <h3>${esc(f.label)} · ${esc(f.dims)}</h3>
  <p>${esc(f.placement)}</p>
  ${f.priorityLabel ? `<p>${statusBadge(f.priorityLabel)}</p>` : ''}
</div>`,
  ).join('');

  const deliverables = DELIVERABLES_STATIC.map(
    (d) => `<li><code>${esc(d.filename)}</code> · ${esc(d.dims)}</li>`,
  ).join('');
  const motionDeliverables = DELIVERABLES_MOTION.map(
    (d) => `<li><code>${esc(d.filename)}</code> · ${esc(d.duration)} · ${esc(d.dims)}</li>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Dashboard</h1>
      <p>Production library for the Philippines team — <b>VMA-04 green person only</b>. Rebuild in your own software; this site is not an editor.</p>
    </div>

    <section id="what-we-need">
      <h2 class="section-head">${icon('target')} Do This Next</h2>
      <div class="primary-task">
        ${icon('formats')}
        <div>
          <p class="primary-task__label">Winning direction — pause all other requests</p>
          <p class="primary-task__text">${esc(WINNING_NOTE)}</p>
          <p class="note" style="margin-top:0.35rem">${esc(ACTIVE_REQUEST_NOTE)}</p>
          <a class="primary-task__cta" href="/graphics-kit.html#04-4x5">Open Component Library → VMA-04 · 4:5</a>
          <p class="lede" style="margin-top:0.35rem"><b>Paused:</b> ${esc(pausedList)} — do not start new work on these.</p>
        </div>
      </div>
      <div class="rule-chips">${ruleChips}</div>
    </section>

    <section id="winning-master">
      <h2 class="section-head">${icon('approved')} Current Winner</h2>
      <p class="lede">${statusBadge('Winning Direction')} · VMA-04 HIPAA Green — green-scrub admin producing leads more efficiently than custom video.</p>
      ${winner ? masterCard(winner, { size: 'lg' }) : ''}
      <p style="margin-top:0.75rem"><a class="dl" href="/graphics-kit.html#04-4x5">Open full component library →</a></p>
    </section>

    <section id="deliverables">
      <h2 class="section-head">${icon('formats')} What to deliver</h2>
      <div class="two-cols">
        <div class="soft-card">
          <h3>Static PNGs + source</h3>
          <ul class="clean">${deliverables}</ul>
          <p class="note">Plus editable PSD / AI / Figma for each.</p>
        </div>
        <div class="soft-card">
          <h3>Motion MP4s (make the static move)</h3>
          <ul class="clean">${motionDeliverables}</ul>
          <p class="note"><a href="/vma-video.html#green-motion">Read motion brief →</a></p>
        </div>
      </div>
    </section>

    <section id="required-formats">
      <h2 class="section-head">${icon('formats')} Meta sizes</h2>
      <div class="queue-grid">${formatCards}</div>
      <div class="callout-rule">Composition reference on the site — rebuild each canvas in Photoshop / Figma / AE / CapCut. Never stretch the square.</div>
    </section>

    <section id="quick-links">
      <h2 class="section-head">${icon('links')} Quick Links</h2>
      <div class="quick-links">
        <a href="/graphics-kit.html#04-4x5">${icon('formats')} Component Library</a>
        <a href="/vma-handoff.html#monday-request">${icon('target')} Monday request</a>
        <a href="/vma-approved.html">${icon('eye')} Winners</a>
        <a href="/vma-static.html">${icon('ratio')} Static Production</a>
        <a href="/vma-video.html">${icon('video')} Animated Video</a>
        <a href="/ideas.html">${icon('idea')} Concept Review</a>
      </div>
    </section>`;

  return page({
    activeId: 'studio',
    title: 'Dashboard',
    pageTitle: 'Dashboard',
    pageSubtitle: 'VMA-04 green person · component library · deliverables · what is paused.',
    body,
  });
}

// ─── 2. Approved Creative (vma-approved.html) ────────────────────────────────

function approvedDetailBlock(master) {
  const why = master.whyItWorks.map((x) => `<li>${esc(x)}</li>`).join('');
  const may = master.whatMayChange.map((x) => `<li>${esc(x)}</li>`).join('');
  const stay = master.whatShouldStay.map((x) => `<li>${esc(x)}</li>`).join('');
  const notCopy = master.whatNotCopy.map((x) => `<li>${esc(x)}</li>`).join('');

  return `<article class="approved-detail" id="master-${esc(master.id)}">
  <div class="approved-detail__media">
    <img src="${esc(master.masterImage)}" alt="${esc(master.name)} approved master 1:1" width="1080" height="1080" loading="lazy" />
  </div>
  <div>
    <div class="master-card__meta">VMA-${esc(master.number)} · ${esc(master.name)}</div>
    <h2>${esc(master.headline)}</h2>
    <p class="lede">${esc(master.angle)}</p>
    <p style="margin-top:0.35rem">${statusBadge(master.status)}</p>
    <div class="approved-detail__grid">
      <div>
        <h3>Why it works</h3>
        <ul class="clean">${why}</ul>
      </div>
      <div>
        <h3>What may change</h3>
        <ul class="clean">${may}</ul>
      </div>
      <div>
        <h3>What should stay</h3>
        <ul class="clean">${stay}</ul>
      </div>
      <div>
        <h3>What should not be copied</h3>
        <ul class="clean">${notCopy}</ul>
      </div>
    </div>
    <p style="margin-top:0.75rem"><a class="dl" href="${esc(master.masterImage)}" download>Download 1:1 master</a></p>
  </div>
</article>`;
}

function renderApproved() {
  const winner = APPROVED_MASTERS.find((m) => m.number === WINNING_MASTER_NUMBER);
  const variations = GRAPHICS_VARIATION_ORDER.map((n) => APPROVED_MASTERS.find((m) => m.number === n)).filter(Boolean);
  const paused = GRAPHICS_PAUSED.map((n) => APPROVED_MASTERS.find((m) => m.number === n)).filter(Boolean);
  const grounding = COLOR_DIRECTION.grounding.map((g) => `<span class="swatch-chip">${esc(g)}</span>`).join('');
  const accents = COLOR_DIRECTION.accents.map((a) => `<span class="swatch-chip">${esc(a)}</span>`).join('');
  const forbidden = COLOR_DIRECTION.forbidden.map((f) => `<span class="swatch-chip">${esc(f)}</span>`).join('');

  const body = `
    <div class="hero">
      <h1>Performance Winners</h1>
      <p>${esc(WINNING_NOTE)}</p>
      <p class="lede">${statusBadge('Winning Direction')} · Statics are outperforming longer custom video — stay close to this look.</p>
    </div>

    <section id="winner">
      <h2 class="section-head">${icon('approved')} VMA-04 · HIPAA Green</h2>
      ${winner ? approvedDetailBlock(winner) : ''}
      <p><a class="dl" href="/graphics-kit.html#04-4x5">Open Component Library for all pieces →</a></p>
    </section>

    ${variations.length ? `<section id="variations">
      <h2 class="section-head">${icon('idea')} Approved variations (same green person)</h2>
      <p class="lede">Only when explicitly briefed — e.g. Spanish badge instead of HIPAA on VMA-01.</p>
      ${variations.map((m) => approvedDetailBlock(m)).join('')}
    </section>` : ''}

    <section id="paused">
      <h2 class="section-head">${icon('search')} Paused — do not assign</h2>
      <p class="lede">Cobalt and Signal Yellow are on hold. Archive reference only.</p>
      <div class="masters-grid">${paused.map((m) => masterCard(m, { size: 'sm' })).join('')}</div>
    </section>

    <details class="block">
      <summary>Color direction (all concepts)</summary>
      <p>${esc(COLOR_DIRECTION.summary)}</p>
      <p><b>Grounding:</b> ${grounding}</p>
      <p><b>Accents:</b> ${accents}</p>
      <p><b>Forbidden:</b> ${forbidden}</p>
    </details>`;

  return page({
    activeId: 'vma-approved',
    title: 'Performance Winners',
    pageTitle: 'Performance Winners',
    pageSubtitle: 'VMA-04 green person · variations · paused concepts.',
    body,
  });
}

// ─── 3. Concept Review (ideas.html) ────────────────────────────────────────────

function ideaCategoryCard(cat) {
  const examples = cat.examples.map((e) => `<span class="chip">${esc(e)}</span>`).join('');
  return `<div class="soft-card">
  <h3>${esc(cat.title)}</h3>
  <div>${examples}</div>
</div>`;
}

const CONCEPT_BUILDER_SCRIPT = `
<script>
(function(){
  var form = document.getElementById('concept-builder-form');
  if(!form) return;
  var outIds = { brief: 'output-brief', prompt: 'output-prompt', designer: 'output-designer', ratios: 'output-ratios' };
  var copyIds = { brief: 'copy-brief', prompt: 'copy-prompt', designer: 'copy-designer', ratios: 'copy-ratios' };
  function val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function setOut(key, text){
    var out = document.getElementById(outIds[key]);
    var btn = document.getElementById(copyIds[key]);
    if(out) out.textContent = text;
    if(btn) btn.setAttribute('data-copy', text);
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var number = val('c-number') || 'VMA-NEW';
    var role = val('c-role') || 'Virtual Medical Admin';
    var audience = val('c-audience');
    var headline = val('c-headline') || 'HIRE A VIRTUAL MEDICAL ADMIN';
    var supporting = val('c-supporting');
    var benefits = [val('c-benefit1'), val('c-benefit2'), val('c-benefit3'), val('c-benefit4')].filter(Boolean);
    var offer = val('c-offer');
    var cta = val('c-cta') || 'Learn More';
    var talent = val('c-talent');
    var scrub = val('c-scrub');
    var bg = val('c-bg');
    var accent = val('c-accent');
    var language = val('c-language') || 'English';
    var format = val('c-format') || '1:1, 4:5, 9:16, 1.91:1';
    var animation = val('c-animation') || 'Static first';
    var claim = val('c-claim') || 'No new claims';

    var brief = [
      'Concept: ' + number,
      'Role: ' + role,
      'Audience: ' + (audience || '—'),
      'Headline: ' + headline,
      'Supporting line: ' + (supporting || '—'),
      'Benefits: ' + (benefits.join(' · ') || '—'),
      'Offer: ' + (offer || '—'),
      'CTA: ' + cta,
      'Talent direction: ' + (talent || '—'),
      'Colors: scrub ' + (scrub || '—') + ' · background ' + (bg || '—') + ' · accent ' + (accent || '—'),
      'Language: ' + language,
      'Format(s): ' + format,
      'Animation potential: ' + animation,
      'Claim status: ' + claim,
      'Rules: No pink. MedVirtual only (never MedVirtual.ai). Dedicated full-time staff — not a call center.'
    ].join('\\n');

    var prompt = 'Full-image Meta ad plate for a healthcare staffing ad. Bold, high-contrast, mobile-first direct response. Color story: background ' + (bg || 'approved family') + ', accent ' + (accent || 'approved accent') + '. Subject: a credible, warm virtual medical administrator, ' + (scrub || 'approved color') + ' scrub top, framed to one side, clean studio lighting, high contrast. Leave clean negative space for the headline "' + headline + '" and the benefits ' + (benefits.join(', ') || 'TBD') + ' to be added by a designer. NO pink, magenta, rose, or fuchsia anywhere. No baked-in headline text, no misspelled text, no watermarks, no fake logos or compliance badges, no call-center headset, no physician white coat, no patient data.';

    var designer = [
      'Build in: ' + format,
      'Rebuild the layout per canvas — do not stretch or simply crop the square.',
      'Keep the headline large and mobile-readable.',
      'Keep 3–4 benefits scannable.',
      'Offer / claim: ' + (claim.toLowerCase().indexOf('approved') === 0 ? (offer || 'per brief') : 'Do not publish until this claim is approved'),
      'Animation potential: ' + animation,
      'File naming: MV_VMA_[NUMBER]_[NAME]_[RATIO].png'
    ].join('\\n');

    var ratios = 'Suggested aspect ratios: 1:1 (1080×1080) · 4:5 (1080×1350, primary feed) · 9:16 (1080×1920, Stories/Reels) · 1.91:1 (1200×628, link ads / form covers).';

    setOut('brief', brief);
    setOut('prompt', prompt);
    setOut('designer', designer);
    setOut('ratios', ratios);
  });
})();
</script>`;

function sparkCard(concept) {
  return `<article class="spark-card" id="${esc(concept.id)}" data-feedback-item="idea:${esc(concept.id)}" data-feedback-name="${esc(concept.title)}">
  <div class="spark-card__media">
    <img src="${esc(concept.image)}" alt="${esc(concept.title)} spark concept" width="1080" height="1080" loading="lazy" />
  </div>
  <div class="spark-card__body">
    <div class="spark-card__meta">Spark ${esc(concept.number)} · ${esc(concept.title)}</div>
    <h3 class="spark-card__headline">${esc(concept.headline)}</h3>
    <p class="spark-card__angle">${esc(concept.angle)}</p>
    <span class="chip">${esc(concept.colorStory)}</span>
    <div class="spark-card__spark">${esc(concept.spark)}</div>
    <div class="feedback-ui">
      <div class="feedback-ui__vote"><strong>Does this work?</strong><button type="button" data-vote="up">👍 Works</button><button type="button" data-vote="down">👎 Remove</button></div>
      <label>Note<textarea rows="2" placeholder="What works? What should change?"></textarea></label>
      <small>Thumbs down hides this concept. Feedback stays saved in this browser.</small>
    </div>
  </div>
</article>`;
}

const IDEAS_FEEDBACK_SCRIPT = `
<script>
(function () {
  var KEY = 'mv_creative_feedback_v1';
  var cards = Array.from(document.querySelectorAll('[data-feedback-item^="idea:"]'));
  var tray = document.getElementById('ideas-rejected');
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; }
  }
  function write(data) { localStorage.setItem(KEY, JSON.stringify(data)); }
  function update(id, patch, rerender) {
    var data = read();
    data[id] = Object.assign({}, data[id] || {}, patch, { updatedAt: new Date().toISOString() });
    write(data);
    if (rerender !== false) render();
  }
  function render() {
    var data = read();
    var rejected = [];
    cards.forEach(function (card) {
      var id = card.dataset.feedbackItem;
      var value = data[id] || {};
      card.hidden = value.vote === 'down';
      if (card.hidden) rejected.push({ id: id, name: card.dataset.feedbackName, note: value.note || '' });
      card.querySelectorAll('[data-vote]').forEach(function (button) {
        button.classList.toggle('selected', button.dataset.vote === value.vote);
      });
      var note = card.querySelector('textarea');
      if (note && document.activeElement !== note) note.value = value.note || '';
    });
    if (!tray) return;
    if (!rejected.length) { tray.innerHTML = ''; return; }
    tray.innerHTML = '<details class="feedback-rejected"><summary>Rejected concepts (' + rejected.length + ')</summary>' +
      rejected.map(function (item) {
        return '<div class="feedback-rejected__item"><div><strong>' + item.name.replace(/</g, '&lt;') + '</strong>' +
          (item.note ? '<p>' + item.note.replace(/</g, '&lt;') + '</p>' : '') +
          '</div><button type="button" data-restore="' + item.id + '">Restore</button></div>';
      }).join('') + '</details>';
    tray.querySelectorAll('[data-restore]').forEach(function (button) {
      button.addEventListener('click', function () {
        var next = read(); delete next[button.dataset.restore]; write(next); render();
      });
    });
  }
  cards.forEach(function (card) {
    var id = card.dataset.feedbackItem;
    card.querySelectorAll('[data-vote]').forEach(function (button) {
      button.addEventListener('click', function () { update(id, { vote: button.dataset.vote }); });
    });
    var note = card.querySelector('textarea');
    if (note) note.addEventListener('input', function () { update(id, { note: note.value }, false); });
  });
  render();
})();
</script>`;

function renderIdeas() {
  const sparks = IDEA_SPARK_CONCEPTS.map((c) => sparkCard(c)).join('');
  const categories = IDEA_CATEGORIES.map((c) => ideaCategoryCard(c)).join('');
  const batchStructure = CONCEPT_BATCH_STRUCTURE.map(
    (b) => `<div class="soft-card"><h3>${esc(b.count)} — ${esc(b.label)}</h3></div>`,
  ).join('');
  const totalConcepts = CONCEPT_BATCH_STRUCTURE.reduce((sum, b) => sum + b.count, 0);

  const mockupCards = CONCEPT_VARIATIONS.filter((v) => v.thumb)
    .map(
      (v) => `<article class="spark-card" data-feedback-item="concept:${esc(v.id)}">
  <button type="button" class="spark-card__img" data-lightbox="${esc(v.thumb)}">
    <img src="${esc(v.thumb)}" alt="${esc(v.name)}" loading="lazy" />
  </button>
  <div class="spark-card__body">
    <h3>${esc(v.name)}</h3>
    <p>${statusBadge(v.status)}</p>
    <p class="note">${esc(v.note)}</p>
    <div class="feedback-ui" data-feedback-for="concept:${esc(v.id)}"></div>
  </div>
</article>`,
    )
    .join('');

  const body = `
    <div class="hero">
      <h1>Concept Review</h1>
      <p><b>Not production.</b> Thumbs up/down + notes on experiments only. Approved production assets live in the <a href="/graphics-kit.html">Component Library</a>.</p>
      <p class="lede">Current winner: <b>VMA-04 green person</b> — new concepts should stay visually close unless explicitly testing a new direction.</p>
    </div>

    <section id="mockup-review">
      <h2 class="section-head">${icon('idea')} Scroll-stopping variations (review)</h2>
      <p class="note">AI-generated mockups for direction tests — 👍 develop · 👎 archive. Production team rebuilds winners from Component Library pieces.</p>
      <div class="spark-grid">${mockupCards}</div>
      <div id="ideas-rejected"></div>
    </section>

    <section id="spark-gallery">
      <h2 class="section-head">${icon('idea')} Spark gallery</h2>
      <p class="note">${esc(IDEA_SPARK_NOTE)}</p>
      <div class="spark-grid">${sparks}</div>
    </section>

    <details class="block" id="batch-archive">
      <summary>Idea batch structure (paused — green person priority)</summary>
      <p class="lede">Finish VMA-04 production wave before starting new 15–20 concept batches.</p>
      <div class="queue-grid">${batchStructure}</div>
      <h3 style="margin-top:1.25rem">Copy-paste batch request (when resumed)</h3>
      ${copyBlock(VMA_META.conceptBatchRequest)}
    </details>

    <details class="block" id="categories">
      <summary>Idea categories (reference)</summary>
      <div class="cat-grid">${categories}</div>
    </details>

    <details class="block" id="concept-builder">
      <summary>Concept Builder — turn a spark into a brief + prompt</summary>
      <form id="concept-builder-form" class="concept-form">
        <label>Concept number<input type="text" id="c-number" placeholder="VMA-25" /></label>
        <label>Role<input type="text" id="c-role" placeholder="Virtual Medical Admin" /></label>
        <label>Audience<input type="text" id="c-audience" placeholder="Dental practices" /></label>
        <label class="full">Headline<input type="text" id="c-headline" placeholder="HIRE A VIRTUAL MEDICAL ADMIN" /></label>
        <label class="full">Supporting line<input type="text" id="c-supporting" placeholder="Dedicated full-time virtual staff who join your team." /></label>
        <label>Benefit 1<input type="text" id="c-benefit1" /></label>
        <label>Benefit 2<input type="text" id="c-benefit2" /></label>
        <label>Benefit 3<input type="text" id="c-benefit3" /></label>
        <label>Benefit 4<input type="text" id="c-benefit4" /></label>
        <label>Offer<input type="text" id="c-offer" placeholder="No published offer" /></label>
        <label>CTA<input type="text" id="c-cta" placeholder="Learn More" /></label>
        <label class="full">Talent direction<textarea id="c-talent" placeholder="Credible, warm virtual medical administrator..."></textarea></label>
        <label>Scrub color<input type="text" id="c-scrub" placeholder="Cobalt blue" /></label>
        <label>Background color<input type="text" id="c-bg" placeholder="Deep navy" /></label>
        <label>Accent color<input type="text" id="c-accent" placeholder="Cyan" /></label>
        <label>Language
          <select id="c-language">
            <option>English</option>
            <option>Spanish</option>
            <option>Bilingual</option>
          </select>
        </label>
        <label>Format
          <select id="c-format">
            <option>1:1, 4:5, 9:16, 1.91:1</option>
            <option>1:1</option>
            <option>4:5</option>
            <option>9:16</option>
            <option>1.91:1</option>
          </select>
        </label>
        <label>Animation potential
          <select id="c-animation">
            <option>Static first</option>
            <option>Strong 6s candidate</option>
            <option>Strong 15s candidate</option>
            <option>Low priority</option>
          </select>
        </label>
        <label>Claim status
          <select id="c-claim">
            <option>No new claims</option>
            <option>Pending leadership</option>
            <option>Pending compliance</option>
            <option>Approved</option>
          </select>
        </label>
        <button type="submit">Generate Concept</button>
      </form>

      <div class="queue-grid" style="margin-top:1rem">
        <div class="soft-card" style="grid-column:1/-1">
          <h3>Complete concept brief</h3>
          <span class="copytext" id="output-brief">Fill out the form above and click Generate Concept.</span>
          <button type="button" class="copy-btn" id="copy-brief" data-copy="">Copy</button>
        </div>
        <div class="soft-card" style="grid-column:1/-1">
          <h3>ChatGPT image prompt</h3>
          <span class="copytext" id="output-prompt">—</span>
          <button type="button" class="copy-btn" id="copy-prompt" data-copy="">Copy</button>
        </div>
        <div class="soft-card" style="grid-column:1/-1">
          <h3>Designer instructions</h3>
          <span class="copytext" id="output-designer">—</span>
          <button type="button" class="copy-btn" id="copy-designer" data-copy="">Copy</button>
        </div>
        <div class="soft-card" style="grid-column:1/-1">
          <h3>Suggested aspect ratios</h3>
          <span class="copytext" id="output-ratios">—</span>
          <button type="button" class="copy-btn" id="copy-ratios" data-copy="">Copy</button>
        </div>
      </div>
    </details>`;

  return page({
    activeId: 'ideas',
    title: 'Concept Review',
    pageTitle: 'Concept Review',
    pageSubtitle: 'Thumbs up/down on experiments — production lives in Component Library.',
    body: body + CONCEPT_BUILDER_SCRIPT + IDEAS_FEEDBACK_SCRIPT,
  });
}

// ─── 4. Aspect Ratios (vma-static.html) ──────────────────────────────────────

function wireframeFor(spec) {
  const zones = (spec.wireZones || [])
    .map(
      (z) =>
        `<div class="wire-zone" data-id="${esc(z.id)}" style="${esc(z.style)}">${esc(z.label)}</div>`,
    )
    .join('');
  return `<div class="wire" data-ratio="${esc(spec.id)}" aria-hidden="true">${zones}</div>`;
}

function sizeStrip() {
  return `<div class="size-strip" aria-label="Required Meta sizes">
    ${FORMAT_SPECS.map(
      (f) => `<div class="size-strip__item" data-id="${esc(f.id)}">
      <div class="size-strip__frame"></div>
      <strong>${esc(f.friendlyName || f.label)}</strong>
      <span>${esc(f.label)} · ${esc(f.dims)}</span>
      ${f.priorityLabel ? `<span class="chip">${esc(f.priorityLabel)}</span>` : ''}
    </div>`,
    ).join('')}
  </div>`;
}

function formatGuideCard(spec, exampleMaster) {
  const uses = (spec.useCases || []).map((u) => `<li>${esc(u)}</li>`).join('');
  const safe = (spec.safeZones || []).map((s) => `<li>${esc(s)}</li>`).join('');
  const exampleCell = exampleMaster?.formats?.find((f) => f.formatId === spec.id);
  let example;
  if (spec.id === '1x1' && exampleMaster) {
    example = `<div class="ratio-guide__thumb">
          <img src="${esc(exampleMaster.masterImage)}" alt="${esc(exampleMaster.name)} approved square example" loading="lazy" />
        </div>
        <p class="lede" style="font-size:0.78rem;text-align:center;margin:0">Real approved example</p>`;
  } else if (exampleCell?.path) {
    const label = exampleCell.status === 'AI Draft' ? 'AI draft — review before use' : 'Approved example';
    example = `<div class="ratio-guide__thumb">
          <img src="${esc(exampleCell.path)}" alt="${esc(exampleMaster.name)} ${esc(spec.label)} example" loading="lazy" />
        </div>
        <p class="lede" style="font-size:0.78rem;text-align:center;margin:0">${esc(label)}</p>`;
  } else {
    example = `<div class="format-placeholder" style="min-height:4.5rem;border:1px dashed #D6E4EC;border-radius:8px;width:100%;max-width:180px;display:flex;align-items:center;justify-content:center">
          <div><strong>AWAITING DESIGN</strong>No fake preview — rebuild this shape</div>
        </div>`;
  }

  return `<article class="ratio-guide" id="format-${esc(spec.id)}">
  <div class="ratio-guide__visual">
    ${wireframeFor(spec)}
    ${example}
  </div>
  <div class="ratio-guide__copy">
    ${spec.priorityLabel ? `<p>${statusBadge(spec.priorityLabel)}</p>` : ''}
    <h3>${esc(spec.friendlyName || spec.label)}</h3>
    <p class="dims">${esc(spec.label)} · ${esc(spec.dims)} · ${esc(spec.placement)}</p>
    <p><b>${esc(spec.shortTip || '')}</b></p>
    <p class="lede" style="margin-top:0.45rem">${esc(spec.layoutNote)}</p>
    <p style="margin:0.65rem 0 0.2rem;font-size:0.78rem;font-weight:700;color:#4A6275">Where it runs</p>
    <ul class="clean">${uses}</ul>
    ${safe ? `<p style="margin:0.65rem 0 0.2rem;font-size:0.78rem;font-weight:700;color:#4A6275">Keep clear for phone UI</p><ul class="clean">${safe}</ul>` : ''}
  </div>
</article>`;
}

function renderStatic() {
  const exampleMaster =
    APPROVED_MASTERS.find((m) => m.number === WINNING_MASTER_NUMBER) || APPROVED_MASTERS[0];
  const activeMasters = APPROVED_MASTERS.filter((m) => GRAPHICS_BUILD_ORDER.includes(m.number) || GRAPHICS_VARIATION_ORDER.includes(m.number));

  const guides = FORMAT_SPECS.map((f) => formatGuideCard(f, exampleMaster)).join('');

  const examplePoints = [
    ['Huge role headline', '“Virtual Medical Admin” reads instantly on a phone.'],
    ['Person is the hero', 'Face and scrubs stay clear — do not crop them awkwardly in taller or wider sizes.'],
    ['3–4 easy benefits', 'Keep the service list scannable; restack it for every canvas.'],
    ['Offer stays visible', 'Price / badge has to survive Stories safe zones and the wide landscape crop.'],
  ]
    .map(
      ([title, text]) => `<div class="soft-card"><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`,
    )
    .join('');

  const walkthroughRow = formatRow(exampleMaster);

  const handoffChecklist = ASPECT_RATIO_HANDOFF_CHECKLIST.map(
    (item, i) => `<li><input type="checkbox" data-persist="ratio-qa-${i}" /> <span>${esc(item)}</span></li>`,
  ).join('');

  const namingExamples = FILE_NAMING.examples.map((e) => `<li><code>${esc(e)}</code></li>`).join('');

  const body = `
    <div class="hero">
      <h1>Static Production</h1>
      <p><b>VMA-04 green person</b> — all Meta sizes + scroll-stopping variations. Composition references on this site; final PNGs built in your production software.</p>
    </div>

    <div class="banner"><strong>Component Library:</strong><span class="sub"><a href="/graphics-kit.html#04-4x5"><b>Open Component Library</b></a> — person PNG, copy, colors, logos, layout reference per ratio. <b>Do not stretch the square.</b> Cobalt (02) and Signal Yellow (03) are paused.</span></div>

    <div class="banner"><strong>AI drafts below</strong><span class="sub">AI-reframed 4:5, 9:16, and 1.91:1 drafts are <b>reference only</b> — check spelling, faces, hands, safe zones. Designer rebuilds from components.</span></div>

    <section id="sizes-at-a-glance">
      <h2>The four sizes at a glance</h2>
      ${sizeStrip()}
      <div class="callout-rule">Do not stretch or simply crop the square. Rebuild headline, person, benefits, badge, CTA, and logo for every shape.</div>
    </section>

    <section id="example">
      <h2>Start from a real approved example</h2>
      <p class="lede">VMA-04 HIPAA Green — approved square producing leads. Use as clarity bar for every other size.</p>
      <div class="example-hero">
        <div class="example-hero__media">
          <img src="${esc(exampleMaster.masterImage)}" alt="${esc(exampleMaster.name)} approved 1:1 example" width="1080" height="1080" loading="lazy" />
        </div>
        <div class="example-hero__points">
          ${examplePoints}
          <p class="note" style="margin:0">When you build 4:5, 9:16, or landscape, keep this level of clarity — do not invent a fake preview by cropping this file.</p>
        </div>
      </div>
    </section>

    <section id="how-each-size-works">
      <h2>How each size should feel</h2>
      <p class="lede">Wireframes show where things usually go. The square is the approved master; the other shapes now show an <b>AI draft</b> to react to.</p>
      ${guides}
    </section>

    <section id="walkthrough">
      <h2>Example progress — VMA-04 HIPAA Green</h2>
      <p class="note">A crop is not a redesign. Reposition the pieces for each canvas.</p>
      ${walkthroughRow}
    </section>

    <section id="all-masters">
      <h2>Active masters — what’s ready</h2>
      <div class="await-board">${activeMasters.map((m) => {
    const summary = presentFormatsSummary(m);
    return `<div class="soft-card">
  <img src="${esc(m.masterImage)}" alt="${esc(m.name)} 1:1" loading="lazy" />
  <h3>VMA-${esc(m.number)} · ${esc(m.name)}</h3>
  <p><b>Approved:</b> ${esc(summary.approved)}</p>
  <p><b>AI drafts (review):</b> ${esc(summary.drafts)}</p>
  <p><b>Still needed:</b> ${esc(summary.awaiting)}</p>
  <a class="dl" href="/graphics-kit.html#${esc(m.number)}-4x5">Open component library</a>
</div>`;
  }).join('')}</div>
      <details class="block"><summary>Paused masters (reference only)</summary>
      <div class="await-board">${GRAPHICS_PAUSED.map((n) => {
    const m = APPROVED_MASTERS.find((x) => x.number === n);
    if (!m) return '';
    const summary = presentFormatsSummary(m);
    return `<div class="soft-card"><h3>VMA-${esc(m.number)} · ${esc(m.name)} — Paused</h3><p>${esc(summary.approved)} approved · do not assign</p></div>`;
  }).join('')}</div></details>
      <details class="block" style="margin-top:1rem">
        <summary>Full size checklist for every master</summary>
        ${APPROVED_MASTERS.map(
          (m) => `<div style="margin-top:1rem"><h3>VMA-${esc(m.number)} · ${esc(m.name)}</h3>${formatRow(m)}</div>`,
        ).join('')}
      </details>
    </section>

    <details class="block" id="handoff-checklist">
      <summary>Before you deliver — quick checklist</summary>
      <ul class="checklist">${handoffChecklist}</ul>
    </details>

    <details class="block" id="file-naming">
      <summary>File naming (when you export)</summary>
      ${copyBlock(FILE_NAMING.pattern)}
      <ul class="clean" style="margin-top:0.75rem">${namingExamples}</ul>
    </details>`;

  return page({
    activeId: 'vma-static',
    title: 'Static Production',
    pageTitle: 'Static Production',
    pageSubtitle: 'VMA-04 all ratios · AI drafts · filenames · component library links.',
    body,
  });
}

// ─── 5. Competitor Wall (competitors.html) ───────────────────────────────────

function categoryLabel(category) {
  if (category === 'virtual-staffing') return 'Medical / healthcare VA staffing';
  if (category === 'bilingual-staffing') return 'Bilingual virtual staffing';
  if (category === 'practice-saas') return 'Practice ops software (adjacent pain only)';
  return category || '—';
}

function competitorCard(ad) {
  const pink = ad.pink;
  const sourceHref = ad.libraryId
    ? `https://www.facebook.com/ads/library/?id=${encodeURIComponent(ad.libraryId)}`
    : adLibraryUrl(ad.adLibraryQuery);

  return `<article class="comp-card">
  <div class="comp-card__media"><img src="${esc(ad.image)}" alt="${esc(ad.name)} ad reference" loading="lazy" /></div>
  <div class="comp-card__body">
    ${pink ? `<span class="pink-ref">REFERENCE ONLY — NO PINK</span>` : ''}
    <h3>${esc(ad.name)}</h3>
    <p class="why">${esc(ad.whyWatch || '—')}</p>
    <details class="comp-more">
      <summary>Details</summary>
      <p class="mini"><b>Hook</b> ${esc(ad.offer || '—')}</p>
      <p class="mini"><b>Look</b> ${esc(ad.visual || '—')}</p>
      <p class="mini"><b>Steal</b> ${esc(ad.steal || '—')}</p>
      <p class="mini"><b>Don’t copy</b> ${esc(ad.reject || '—')}</p>
      <p class="mini"><a href="${esc(sourceHref)}" target="_blank" rel="noopener">Ad Library source ↗</a></p>
    </details>
  </div>
</article>`;
}

function renderCompetitors() {
  const { cards, updatedAt } = collectCompetitorWallCards();
  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'local image set';

  const body = `
    <div class="hero">
      <h1>Competitor Wall</h1>
      <p>${esc(COMPETITOR_META.intro)}</p>
    </div>
    <p class="note"><b>${cards.length} companies</b> · one card each · updated ${esc(updatedLabel)}. New brands first.</p>

    <section id="wall">
      <div class="comp-grid">${cards.map((a) => competitorCard(a)).join('')}</div>
    </section>`;

  return page({
    activeId: 'competitors',
    title: 'Competitor Wall',
    pageTitle: 'Competitor Wall',
    pageSubtitle: `${cards.length} companies · one card each.`,
    body,
  });
}

// ─── 6. Animated Video (vma-video.html) ──────────────────────────────────────

const VIDEO_SUBNAV = [
  { href: '/motion-concept-lab.html', label: 'Motion Lab' },
  { href: '/vma-video.html', label: 'Specs & handoff' },
];

// In-browser Motion Lab — plays real CSS/JS motion so the team can WATCH the
// techniques (typewriter, slide, fade, zoom, split) at every aspect ratio
// without rendering or downloading a single file.
const MOTION_LAB_CSS = `
  .mlab { margin: 0 0 1.75rem; }
  .mlab .lab-lede { color: #4A6275; max-width: 60rem; margin: 0 0 0.85rem; }
  .mlab-bar {
    display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;
    background: #0B1F3A; border-radius: 12px; padding: 0.65rem 0.75rem; margin-bottom: 1.25rem;
  }
  .mlab-bar .grp { display: flex; gap: 0.3rem; align-items: center; }
  .mlab-bar .glabel { color: #9DB6C6; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 0.15rem; }
  .mlab-bar .spacer { flex: 1; }
  .rbtn {
    font: inherit; font-size: 0.78rem; font-weight: 700; cursor: pointer;
    border: 1px solid #2A4A62; background: #0F2A44; color: #DCEAF3;
    border-radius: 999px; padding: 0.35rem 0.7rem; line-height: 1;
  }
  .rbtn:hover { border-color: #4B84A6; }
  .rbtn.primary { background: #00B2E2; border-color: #00B2E2; color: #05263a; }
  .rbtn.on { background: #C6F135; border-color: #C6F135; color: #10261a; }
  .mlab-grid { display: grid; gap: 1.35rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  .mlab-card { background: #fff; border: 1px solid #D6E4EC; border-radius: 16px; padding: 1rem 1rem 0.85rem; }
  .mlab-card .tech {
    display: inline-block; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
    color: #077999; background: #EEF6FA; border: 1px solid #C5DCE8; border-radius: 999px; padding: 0.2rem 0.55rem;
  }
  .mlab-card h3 { margin: 0.45rem 0 0.15rem; font-size: 1.1rem; }
  .mlab-card .desc { margin: 0 0 0.75rem; font-size: 0.86rem; color: #4A6275; }
  .stage-wrap { display: flex; justify-content: center; background: #0B1F3A; border-radius: 12px; padding: 14px; }
  .mlab-stage {
    position: relative; container-type: size; overflow: hidden; border-radius: 8px;
    background: #0B1F3A; width: 100%; font-family: ${BRAND.fonts.family};
  }
  .mlab-stage[data-ratio="1x1"] { aspect-ratio: 1 / 1; max-width: 420px; }
  .mlab-stage[data-ratio="4x5"] { aspect-ratio: 4 / 5; max-width: 360px; }
  .mlab-stage[data-ratio="9x16"] { aspect-ratio: 9 / 16; max-width: 290px; }
  .mlab-stage[data-ratio="1.91x1"] { aspect-ratio: 1.91 / 1; max-width: 540px; }
  .mlab-stage .layer { position: absolute; inset: 0; }
  .mlab-stage.paused * { animation-play-state: paused !important; }
  .mlab-ctrls { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: center; margin-top: 0.75rem; }
  .mlab-ctrls .rsep { width: 1px; height: 18px; background: #D6E4EC; margin: 0 0.25rem; }
  .mlab-ctrls .rbtn { border-color: #CBD9E2; background: #fff; color: #0D546B; }
  .mlab-ctrls .rbtn.primary { background: #077999; border-color: #077999; color: #fff; }
  .mlab-ctrls .rbtn.on { background: #0D546B; border-color: #0D546B; color: #fff; }

  /* shared stage bits */
  .stg-pad { position: absolute; inset: 9% 8%; display: flex; flex-direction: column; justify-content: center; gap: 3.5cqmin; }
  .stg-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .stg-scrim-b { background: linear-gradient(to top, rgba(5,15,30,0.85), rgba(5,15,30,0) 55%); }
  .kicker { font-size: 3.8cqmin; font-weight: 800; letter-spacing: 0.09em; text-transform: uppercase; color: #7CE0FF; }
  .headline { font-size: 10cqmin; font-weight: 800; line-height: 1.03; color: #fff; }
  .type-caret { color: #C6F135; font-weight: 700; }
  .chip { align-self: flex-start; font-size: 3.6cqmin; font-weight: 800; padding: 0.5em 0.8em; border-radius: 0.6em; }
  .chip-lime { background: #C6F135; color: #10261a; }
  .lower { position: absolute; left: 6%; right: 6%; bottom: 8%; }
  .lower span { display: inline-block; background: #00B2E2; color: #05263a; font-weight: 800; font-size: 4.4cqmin; padding: 0.4em 0.7em; border-radius: 0.5em; }
  .stg-words { position: absolute; inset: 0 8%; display: flex; flex-direction: column; justify-content: center; gap: 1.5cqmin; }
  .word { font-size: 12cqmin; font-weight: 800; color: #fff; line-height: 1.02; }
  .word-lime { color: #C6F135; }
  .stg-left-scrim { background: linear-gradient(to right, rgba(6,16,32,0.92) 45%, rgba(6,16,32,0) 78%); }
  .split-scene { position: absolute; inset: 0; }
  .split-left, .split-right { position: absolute; top: 0; bottom: 0; width: 50%; display: grid; place-items: center; }
  .split-left { left: 0; background: #E4002B; }
  .split-right { right: 0; background: #0E7C66; }
  .split-left span, .split-right span { font-size: 12cqmin; font-weight: 800; color: #fff; letter-spacing: 0.02em; }
  .stamp {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(0);
    background: #F4C400; color: #0B1F3A; font-size: 10cqmin; font-weight: 800;
    padding: 0.25em 0.5em; border-radius: 0.2em; border: 0.5cqmin solid #0B1F3A; z-index: 3;
  }

  /* animations only run while .playing */
  .mlab-stage.playing .stg-grad { animation: mlZoomIn 6s ease-out both; }
  .mlab-stage.playing .kicker { animation: mlFadeUp 0.6s ease 0.15s both; }
  .mlab-stage.playing .chip { animation: mlFadeUp 0.6s ease 3.4s both; }
  .mlab-stage.playing .type-caret { animation: mlBlink 0.7s step-end infinite; }
  .mlab-stage.playing .stg-photo.kb { animation: mlKenBurns 6s ease-out both; }
  .mlab-stage.playing .stg-photo.kbout { animation: mlKenBurnsOut 6s ease-out both; }
  .mlab-stage.playing .stg-scrim-b { animation: mlFade 0.8s ease 0.6s both; }
  .mlab-stage.playing .lower { animation: mlFadeUp 0.7s ease 1.3s both; }
  .mlab-stage.playing .stg-photo.slide { animation: mlSlideInOut 6s ease both; }
  .mlab-stage.playing .word.w1 { animation: mlSlideL 0.55s cubic-bezier(.2,.8,.2,1) 0.25s both; }
  .mlab-stage.playing .word.w2 { animation: mlSlideL 0.55s cubic-bezier(.2,.8,.2,1) 0.7s both; }
  .mlab-stage.playing .word.w3 { animation: mlSlideL 0.55s cubic-bezier(.2,.8,.2,1) 1.15s both; }
  .mlab-stage.playing .split-left span { animation: mlPop 0.5s 0.25s both; }
  .mlab-stage.playing .split-right { animation: mlWipe 0.6s cubic-bezier(.2,.8,.2,1) 1.7s both; }
  .mlab-stage.playing .split-right span { animation: mlPop 0.5s 2s both; }
  .mlab-stage.playing .split-scene { animation: mlPunch 0.6s ease 3.2s both; }
  .mlab-stage.playing .stamp { animation: mlStamp 0.55s cubic-bezier(.2,1.5,.4,1) 3.7s both; }

  @keyframes mlFadeUp { from { opacity: 0; transform: translateY(2.5cqmin); } to { opacity: 1; transform: none; } }
  @keyframes mlFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes mlBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes mlZoomIn { from { transform: scale(1.02); } to { transform: scale(1.12); } }
  @keyframes mlKenBurns { from { transform: scale(1) translate(0,0); } to { transform: scale(1.16) translate(-2%,-2%); } }
  @keyframes mlKenBurnsOut { from { transform: scale(1.16); } to { transform: scale(1.0); } }
  @keyframes mlSlideL { from { opacity: 0; transform: translateX(-34cqmin); } to { opacity: 1; transform: none; } }
  @keyframes mlSlideInOut { 0% { transform: translateX(108%); } 22% { transform: translateX(0); } 78% { transform: translateX(0); } 100% { transform: translateX(-108%); } }
  @keyframes mlWipe { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes mlPop { from { opacity: 0; transform: translateY(3cqmin) scale(0.92); } to { opacity: 1; transform: none; } }
  @keyframes mlPunch { 0% { transform: scale(1); } 45% { transform: scale(1.13); } 100% { transform: scale(1.05); } }
  @keyframes mlStamp { from { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(-14deg); } to { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(-7deg); } }
  @media (prefers-reduced-motion: reduce) { .mlab-stage * { animation-duration: 0.001s !important; } }
`;

function motionCard({ tech, title, desc, ratio, total, vo, layers }) {
  const ratios = [
    ['1x1', '1:1'],
    ['4x5', '4:5'],
    ['9x16', '9:16'],
    ['1.91x1', '1.91:1'],
  ];
  const ratioBtns = ratios
    .map(([r, label]) => `<button class="rbtn ratio${r === ratio ? ' on' : ''}" data-ratio-set="${r}">${label}</button>`)
    .join('');
  return `<div class="mlab-card">
    <span class="tech">${esc(tech)}</span>
    <h3>${esc(title)}</h3>
    <p class="desc">${esc(desc)}</p>
    <div class="stage-wrap">
      <div class="mlab-stage" data-ratio="${ratio}" data-total="${total}" data-vo="${esc(vo)}">${layers}</div>
    </div>
    <div class="mlab-ctrls">
      <button class="rbtn primary" data-act="play">Play</button>
      <button class="rbtn" data-act="replay">Replay</button>
      <span class="rsep"></span>
      ${ratioBtns}
    </div>
  </div>`;
}

function motionLab() {
  const cardType = motionCard({
    tech: 'Typewriter · gentle fade · slow zoom',
    title: 'Type-on hook',
    desc: 'Headline types out over a slow drifting background, then the CTA gently rises in.',
    ratio: '4x5',
    total: 6000,
    vo: 'Front desk overloaded? Hire a virtual medical admin.',
    layers: `<div class="layer stg-grad" style="background:linear-gradient(135deg,#0B1F3A,#0A3D91)"></div>
      <div class="stg-pad">
        <div class="kicker">Front desk overloaded?</div>
        <div class="headline"><span data-typetext data-full="Stop missing patient calls." data-start="700" data-dur="2100"></span><span class="type-caret">|</span></div>
        <div class="chip chip-lime">Hire a Virtual Medical Admin →</div>
      </div>`,
  });

  const cardSlide = motionCard({
    tech: 'Words slide in · human layer slides across',
    title: 'Slide build',
    desc: 'Headline, transparent human PNG, benefits, icons, and CTA move independently.',
    ratio: '4x5',
    total: 6000,
    vo: 'Dedicated. Trained. Yours.',
    layers: `<div class="layer" style="background:#0B1F3A"></div>
      <div class="layer stg-photo slide"><img src="/assets/graphics-kit/options/green-person-a-brunette-bun.png" alt="Isolated virtual medical admin layer" style="object-fit:contain;object-position:right bottom" /></div>
      <div class="layer stg-left-scrim"></div>
      <div class="stg-words">
        <div class="word w1">Dedicated.</div>
        <div class="word w2">Trained.</div>
        <div class="word w3 word-lime">Yours.</div>
      </div>`,
  });

  return `
    <style>${MOTION_LAB_CSS}</style>
    <section id="motion-lab" class="mlab">
      <h2 class="section-head">${icon('video')} Motion Lab — watch in your browser</h2>
      <p class="lab-lede">These play live in the page (code-driven, no render, no download) so we can react fast. Each shows a core Meta-ad motion technique. Switch any clip between all four aspect ratios. This is a capability check, not a finished spot — direction welcome.</p>
      <div class="mlab-bar">
        <span class="glabel">All clips</span>
        <div class="grp"><button class="rbtn primary" id="mlab-play-all">▶ Play all</button><button class="rbtn" id="mlab-pause-all">❚❚ Pause</button></div>
        <span class="glabel" style="margin-left:0.6rem">Ratio</span>
        <div class="grp">
          <button class="rbtn" data-ratio-all="1x1">1:1</button>
          <button class="rbtn on" data-ratio-all="4x5">4:5</button>
          <button class="rbtn" data-ratio-all="9x16">9:16</button>
          <button class="rbtn" data-ratio-all="1.91x1">1.91:1</button>
        </div>
        <span class="spacer"></span>
        <button class="rbtn" id="mlab-vo">Voiceover: Off</button>
      </div>
      <div class="mlab-grid">
        ${cardType}
        ${cardSlide}
      </div>
    </section>`;
}

const MOTION_LAB_JS = `
<script>
(function(){
  var stages = [];
  var voiceOn = false;
  function speakFor(stage){
    if (!voiceOn) return;
    if (!('speechSynthesis' in window)) return;
    var line = stage.el.getAttribute('data-vo');
    if (!line) return;
    try { window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(line); u.rate = 1; window.speechSynthesis.speak(u); } catch (e) {}
  }
  function Stage(el){
    this.el = el;
    this.total = parseInt(el.getAttribute('data-total'), 10) || 6000;
    this.t = 0; this.playing = false; this.raf = null; this.last = 0;
    this.typers = [];
    var nodes = el.querySelectorAll('[data-typetext]');
    for (var i = 0; i < nodes.length; i++){
      var n = nodes[i];
      this.typers.push({ node: n, full: n.getAttribute('data-full') || '', start: parseInt(n.getAttribute('data-start'), 10) || 0, dur: parseInt(n.getAttribute('data-dur'), 10) || 1200 });
    }
    this.tick = this.tick.bind(this);
    this.resetTypers();
  }
  Stage.prototype.resetTypers = function(){ for (var i = 0; i < this.typers.length; i++){ this.typers[i].node.textContent = ''; } };
  Stage.prototype.updateTypers = function(t){
    for (var i = 0; i < this.typers.length; i++){
      var ty = this.typers[i];
      var p = (t - ty.start) / ty.dur; if (p < 0) p = 0; if (p > 1) p = 1;
      var chars = Math.round(p * ty.full.length);
      var cur = ty.full.slice(0, chars);
      if (ty.node.textContent !== cur) ty.node.textContent = cur;
    }
  };
  Stage.prototype.hardStart = function(){
    this.el.classList.remove('playing'); this.el.classList.remove('paused');
    void this.el.offsetWidth;
    this.el.classList.add('playing');
    this.t = 0; this.resetTypers();
  };
  Stage.prototype.play = function(){
    if (this.playing) return;
    if (!this.el.classList.contains('playing')) this.hardStart();
    this.el.classList.remove('paused');
    this.playing = true; this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  };
  Stage.prototype.pause = function(){ this.playing = false; if (this.raf) cancelAnimationFrame(this.raf); this.el.classList.add('paused'); };
  Stage.prototype.toggle = function(){ if (this.playing) this.pause(); else this.play(); };
  Stage.prototype.replay = function(){ this.hardStart(); this.el.classList.remove('paused'); this.playing = true; this.last = performance.now(); this.raf = requestAnimationFrame(this.tick); speakFor(this); };
  Stage.prototype.tick = function(now){
    if (!this.playing) return;
    var dt = now - this.last; this.last = now; this.t += dt;
    if (this.t >= this.total){ this.hardStart(); speakFor(this); }
    this.updateTypers(this.t);
    this.raf = requestAnimationFrame(this.tick);
  };
  Stage.prototype.setRatio = function(r){
    this.el.setAttribute('data-ratio', r);
    var imgs = this.el.querySelectorAll('[data-src-base]');
    for (var i = 0; i < imgs.length; i++){ imgs[i].src = imgs[i].getAttribute('data-src-base') + r + '.png'; }
  };
  function setAllPlayLabels(txt){ var b = document.querySelectorAll('[data-act="play"]'); for (var i = 0; i < b.length; i++) b[i].textContent = txt; }
  document.addEventListener('DOMContentLoaded', function(){
    var stageEls = document.querySelectorAll('.mlab-stage');
    for (var i = 0; i < stageEls.length; i++){
      (function(el){
        var s = new Stage(el); stages.push(s);
        var card = el.closest('.mlab-card');
        var playBtn = card.querySelector('[data-act="play"]');
        var replayBtn = card.querySelector('[data-act="replay"]');
        if (playBtn) playBtn.addEventListener('click', function(){ s.toggle(); playBtn.textContent = s.playing ? 'Pause' : 'Play'; });
        if (replayBtn) replayBtn.addEventListener('click', function(){ s.replay(); if (playBtn) playBtn.textContent = 'Pause'; });
        var rbtns = card.querySelectorAll('[data-ratio-set]');
        for (var j = 0; j < rbtns.length; j++){
          (function(btn){
            btn.addEventListener('click', function(){
              for (var k = 0; k < rbtns.length; k++) rbtns[k].classList.remove('on');
              btn.classList.add('on');
              s.setRatio(btn.getAttribute('data-ratio-set')); s.replay();
              if (playBtn) playBtn.textContent = 'Pause';
            });
          })(rbtns[j]);
        }
      })(stageEls[i]);
    }
    var playAll = document.getElementById('mlab-play-all');
    var pauseAll = document.getElementById('mlab-pause-all');
    var voToggle = document.getElementById('mlab-vo');
    var ratioAll = document.querySelectorAll('[data-ratio-all]');
    if (playAll) playAll.addEventListener('click', function(){ for (var i = 0; i < stages.length; i++) stages[i].replay(); setAllPlayLabels('Pause'); });
    if (pauseAll) pauseAll.addEventListener('click', function(){ if ('speechSynthesis' in window) window.speechSynthesis.cancel(); for (var i = 0; i < stages.length; i++) stages[i].pause(); setAllPlayLabels('Play'); });
    if (voToggle) voToggle.addEventListener('click', function(){ voiceOn = !voiceOn; voToggle.classList.toggle('on', voiceOn); voToggle.textContent = voiceOn ? 'Voiceover: On' : 'Voiceover: Off'; if (!voiceOn && 'speechSynthesis' in window) window.speechSynthesis.cancel(); });
    for (var i = 0; i < ratioAll.length; i++){
      (function(btn){
        btn.addEventListener('click', function(){
          for (var k = 0; k < ratioAll.length; k++) ratioAll[k].classList.remove('on');
          btn.classList.add('on');
          var r = btn.getAttribute('data-ratio-all');
          for (var s = 0; s < stages.length; s++){ stages[s].setRatio(r); stages[s].replay(); }
          var cardRb = document.querySelectorAll('[data-ratio-set]');
          for (var m = 0; m < cardRb.length; m++) cardRb[m].classList.toggle('on', cardRb[m].getAttribute('data-ratio-set') === r);
          setAllPlayLabels('Pause');
        });
      })(ratioAll[i]);
    }
    for (var i = 0; i < stages.length; i++) stages[i].play();
    setAllPlayLabels('Pause');
  });
})();
</script>`;

function renderVideo() {
  const winner = APPROVED_MASTERS.find((m) => m.number === WINNING_MASTER_NUMBER);
  const motionSeq = GREEN_MOTION_BRIEF.sequence
    .map((s) => `<li><b>${esc(s.time)}</b> — ${esc(s.action)}</li>`)
    .join('');
  const motionAllowed = GREEN_MOTION_BRIEF.motionAllowed.map((m) => `<li>${esc(m)}</li>`).join('');
  const motionAvoid = GREEN_MOTION_BRIEF.motionAvoid.map((m) => `<li>${esc(m)}</li>`).join('');
  const motionDeliverables = DELIVERABLES_MOTION.map(
    (d) => `<div class="soft-card">
  <h3>${esc(d.label)}</h3>
  <p>${esc(d.dims)} · ${esc(d.duration)} · ${esc(d.format)}</p>
  <p>Filename: <code>${esc(d.filename)}</code></p>
  <p class="note">${esc(d.sound)} · ${esc(d.firstFrame)}</p>
</div>`,
  ).join('');

  const outputsPerMaster = winner
    ? `<div class="soft-card">
  <div class="thumb-row"><a href="${esc(winner.masterImage)}"><img src="${esc(winner.masterImage)}" alt="${esc(winner.name)}" loading="lazy" /></a></div>
  <h3>VMA-04 · ${esc(winner.name)} — motion targets</h3>
  <ul class="clean">${VIDEO_OUTPUTS_PER_MASTER.map((o) => `<li><b>${esc(o.label)}</b> — ${esc(o.purpose)}</li>`).join('')}</ul>
</div>`
    : '';

  const story = VIDEO_STORYBOARD.map(
    (s) => `<div class="beat"><b>${esc(s.scene)}</b><span>${esc(s.timing)}</span><div>${esc(s.note)}</div></div>`,
  ).join('');

  const sceneHint = (VIDEO_SCENES_15S?.structure || [])
    .map((x) => x.label)
    .filter(Boolean)
    .join(' → ');

  const remotionComps = REMOTION_COMPOSITIONS.map(
    (c) => `<div class="soft-card">
  <h3>${esc(c.name)}</h3>
  <p>${esc(c.duration)} · ${esc(c.frames)}f @ ${esc(c.fps)}fps</p>
  <p>${esc(c.purpose)}</p>
  <p>${(c.uses || []).map((u) => `<span class="chip">${esc(u)}</span>`).join('')}</p>
</div>`,
  ).join('');

  const remotionInputs = REMOTION_COMPONENTS.map(
    (c) => `<div class="soft-card"><h3>${esc(c.name)}</h3><p>${esc(c.purpose)}</p><p><span class="chip">${esc(c.props)}</span></p></div>`,
  ).join('');

  const playbook = (REMOTION_PLAYBOOK.steps || []).map((s) => `<li>${esc(s)}</li>`).join('');

  const capcut = CAPCUT_TEMPLATES.map(
    (t) => `<div class="soft-card">
  <h3>${esc(t.name)}</h3>
  <p>${esc(t.duration)} · ${(t.aspectRatios || []).join(', ')}</p>
  <p>${esc(t.exportSpec)}</p>
  <p>${esc(t.colorNote)}</p>
</div>`,
  ).join('');

  const prompts = VIDEO_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.duration)} · ${esc(p.colorFamily)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Animated Video</h1>
      <p><b>Make the winning static move.</b> Motion brief + components — editors finish in CapCut, After Effects, or Premiere. Not a browser animation studio.</p>
    </div>

    <section id="green-motion" class="primary-task">
      <h2 class="section-head">${icon('video')} Green-person motion brief</h2>
      <p class="lede">${esc(GREEN_MOTION_BRIEF.principle)} · ${esc(GREEN_MOTION_BRIEF.duration)}</p>
      <div class="two-cols">
        <div class="soft-card">
          <h3>Sequence</h3>
          <ol class="clean">${motionSeq}</ol>
        </div>
        <div class="soft-card">
          <h3>Layers that may move independently</h3>
          <p>${GREEN_MOTION_BRIEF.independentLayers.map((l) => `<span class="chip">${esc(l)}</span>`).join('')}</p>
          <h3 style="margin-top:0.75rem">Do</h3>
          <ul class="clean">${motionAllowed}</ul>
          <h3>Avoid</h3>
          <ul class="clean dont-list">${motionAvoid}</ul>
        </div>
      </div>
      <p style="margin-top:0.75rem"><a class="dl" href="/graphics-kit.html">Download motion components →</a> · <a class="dl" href="/motion-concept-lab.html">Preview in Motion Lab (reference only)</a></p>
    </section>

    <section id="motion-deliverables">
      <h2 class="section-head">${icon('formats')} Video deliverables</h2>
      <div class="queue-grid">${motionDeliverables}</div>
      ${outputsPerMaster}
    </section>

    <section id="motion-lab-entry">
      <h2 class="section-head">${icon('video')} Motion Concept Lab (preview)</h2>
      <p class="lede">Browser preview only — not final export. Use specs below for MP4 delivery.</p>
      <div class="quick-links">
        <a href="/motion-concept-lab.html" class="primary-link">${icon('video')} Open Motion Concept Lab</a>
        <a href="/graphics-kit.html#04-4x5">${icon('formats')} Component Library</a>
      </div>
    </section>

    <section id="sound-specs">
      <h2 class="section-head">${icon('video')} Sound, voice &amp; Meta specs</h2>
      <p class="lede">The clips above are silent by design (Meta plays muted first — always caption-first). Toggle <b>Voiceover</b> to hear a rough browser text-to-speech read; that's a preview only. Real options below.</p>
      <div class="queue-grid">
        <div class="soft-card">
          <h3>Human-quality voiceover</h3>
          <ul class="clean">
            <li><b>ElevenLabs</b> — most natural; English + Spanish, cloned or stock voices.</li>
            <li><b>OpenAI TTS</b> (gpt-4o-mini-tts) — fast, cheap, good for scratch VO.</li>
            <li><b>Azure / Google Neural</b> — enterprise, many Spanish locales.</li>
            <li><b>Browser TTS</b> (used here) — free, instant, robotic — preview only.</li>
          </ul>
        </div>
        <div class="soft-card">
          <h3>Music &amp; SFX (licensed)</h3>
          <ul class="clean">
            <li><b>Meta Sound Collection</b> — free, cleared for Meta ads.</li>
            <li><b>Artlist / Epidemic Sound</b> — subscription, broad library.</li>
            <li>Keep beds subtle; design so the ad works with sound OFF.</li>
            <li>Add whoosh/tick SFX on each transition to sell the motion.</li>
          </ul>
        </div>
        <div class="soft-card">
          <h3>Meta video specs (2026)</h3>
          <ul class="clean">
            <li><b>Feed</b> 4:5 · 1080×1350 · 15–30s sweet spot.</li>
            <li><b>Reels / Stories</b> 9:16 · 1080×1920 · 6–15s.</li>
            <li><b>Square</b> 1:1 · 1080×1080 (Marketplace / carousel).</li>
            <li>Hook in the first 2s. H.264 MP4, ≤4GB, 30fps.</li>
          </ul>
        </div>
        <div class="soft-card">
          <h3>9:16 safe zone</h3>
          <ul class="clean">
            <li>Keep text/logos out of the top ~250px (handle/close).</li>
            <li>And the bottom ~340–670px (caption + CTA button).</li>
            <li>Design key content in the center band.</li>
            <li>One 9:16 master covers both Reels and Stories.</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="masters">
      <h2 class="section-head">${icon('approved')} Source: approved masters</h2>
      ${mastersGrid('md')}
    </section>

    <section id="outputs">
      <h2>Recommended Outputs Per Master</h2>
      <div class="queue-grid">${outputsPerMaster}</div>
    </section>

    <section id="storyboard">
      <h2>Five-Scene Storyboard</h2>
      <div class="storyboard">${story}</div>
      ${sceneHint ? `<p class="lede">Reference beat string: ${esc(sceneHint)}</p>` : ''}
    </section>

    <section data-tabs id="production">
      <h2>Production Paths</h2>
      <div class="tabs">
        <button type="button" class="active" data-tab="overview">Overview</button>
        <button type="button" data-tab="remotion">Remotion</button>
        <button type="button" data-tab="capcut">CapCut</button>
        <button type="button" data-tab="prompts">Video Prompts</button>
      </div>
      <div class="tab-panels">
        <div class="tab-panel active" data-panel="overview" id="overview">
          <p class="lede">Animate the approved hierarchy: hook → role clarity → benefits → offer/CTA. Prefer 6s / 10s / 15s cuts from each master after static QA.</p>
          <ul class="clean">${(REMOTION_PLAYBOOK.rules || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        </div>
        <div class="tab-panel" data-panel="remotion" id="remotion">
          <p class="lede">${esc(REMOTION_PLAYBOOK.studioCmd)} · ${esc(REMOTION_PLAYBOOK.entryFile)}</p>
          <ul class="clean">${playbook}</ul>
          <h3 style="margin-top:1rem">Compositions</h3>
          <div class="queue-grid">${remotionComps}</div>
          <details class="block"><summary>Component inputs</summary>
            <div class="queue-grid">${remotionInputs}</div>
          </details>
        </div>
        <div class="tab-panel" data-panel="capcut" id="capcut">
          <div class="queue-grid">${capcut}</div>
        </div>
        <div class="tab-panel" data-panel="prompts" id="prompts">
          <div class="prompt-grid">${prompts}</div>
        </div>
      </div>
    </section>
    `;

  return page({
    activeId: 'vma-video',
    title: 'Animated Video',
    pageTitle: 'Animated Video',
    pageSubtitle: 'Make the winning static move — motion brief · deliverables · preview lab.',
    subnav: VIDEO_SUBNAV,
    activeSubHref: '/vma-video.html',
    body,
  });
}

// ─── 7. Prompts & Copy (vma-chatgpt.html) ────────────────────────────────────

function promptResultCard(item, { square = false } = {}) {
  const prompt = item.prompt || '';
  const tag = item.tag || item.category || item.colorStory || 'Prompt → result';
  const hook = item.hook || item.angle || item.spark || '';
  return `<article class="pr-card">
  <div class="pr-card__media${square ? ' square' : ''}">
    <img src="${esc(item.image)}" alt="${esc(item.title || item.headline)} result" loading="lazy" />
  </div>
  <div class="pr-card__body">
    <span class="pr-card__tag">${esc(tag)}</span>
    <h3>${esc(item.title || item.headline)}</h3>
    ${hook ? `<p>${esc(hook)}</p>` : ''}
    <div class="pr-actions">
      <button type="button" class="copy-btn" data-copy="${esc(prompt)}">Copy prompt</button>
    </div>
    <details>
      <summary>Show prompt</summary>
      <div class="prompt-body">${esc(prompt)}</div>
    </details>
  </div>
</article>`;
}

function copyPickCard(pack, langLabel) {
  const headlines = (pack.headlines || []).slice(0, 3);
  const primaries = (pack.primaryTexts || []).slice(0, 2);
  const lines = [
    ...headlines.map((h) => ({ label: 'H', text: h })),
    ...primaries.map((p) => ({ label: 'P', text: p })),
  ];
  return `<div class="copy-pick">
  <h3>${esc(pack.name)} · ${esc(langLabel)}</h3>
  ${lines
    .map(
      (l) => `<div class="line"><button type="button" class="copy-btn" data-copy="${esc(l.text)}">Copy</button><span><b>${esc(l.label)}</b> ${esc(l.text)}</span></div>`,
    )
    .join('')}
</div>`;
}

function renderCopyPackFull(packs, langLabel) {
  return packs
    .map((pack) => {
      const sections = [
        ['Primary texts', pack.primaryTexts],
        ['Headlines', pack.headlines],
        ['Descriptions', pack.descriptions],
        ['CTAs', pack.ctas],
      ]
        .filter(([, rows]) => Array.isArray(rows) && rows.length)
        .map(
          ([title, rows]) => `<details class="block"><summary>${esc(title)} (${rows.length})</summary>
  ${rows.map((line) => `<div style="margin:0.45rem 0">${copyBlock(line)}</div>`).join('')}
</details>`,
        )
        .join('');
      return `<div class="soft-card" style="grid-column:1/-1">
  <h3>${esc(pack.name)} · ${esc(langLabel)}</h3>
  ${sections}
</div>`;
    })
    .join('');
}

function renderChatgpt() {
  // Visual proof first — people won't read a prompt wall. Show what it made.
  const sparkResults = IDEA_SPARK_CONCEPTS.map((c) => promptResultCard(c, { square: true })).join('');

  const copyEnPicks = COPY_EN.slice(0, 4).map((p) => copyPickCard(p, 'EN')).join('');
  const copyEsPicks = (COPY_ES || []).slice(0, 3).map((p) => copyPickCard(p, 'ES')).join('');

  const fullImageBank = CHATGPT_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.conceptNumber)} · ${esc(p.colorFamily)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const fullVideoBank = VIDEO_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.duration)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const qaLine = (VMA_META.chatgptQaChecks || []).slice(0, 6).join(' · ');

  const body = `
    <div class="hero">
      <h1>Prompts &amp; Copy</h1>
      <p><b>See the result first.</b> Copy the prompt that made it. Long banks stay collapsed below for when you need them.</p>
    </div>

    <p class="note">Before anything ships: spelling · no pink · claims · Spanish · logos · hands. ${esc(qaLine)}</p>

    <section id="prompt-results">
      <h2 class="section-head">${icon('idea')} Prompt → result</h2>
      <p class="lede">These images were generated from the prompts underneath. Open / copy a prompt when you want a similar swing — not a launch-ready ad.</p>
      <div class="pr-grid">${sparkResults}</div>
    </section>

    <section id="video-prompts">
      <h2 class="section-head">${icon('video')} Video motion</h2>
      <p class="lede">Don't guess from a wall of video prompts. Watch the Motion Lab, then steal the technique you like.</p>
      <div class="quick-links">
        <a href="/motion-concept-lab.html">${icon('video')} Open Motion Lab — watch in browser</a>
        <a href="/ideas.html#spark-gallery">${icon('idea')} Spark stills that animate well</a>
      </div>
      <details class="block" style="margin-top:1rem">
        <summary>Full video prompt bank (${VIDEO_PROMPTS.length}) — text only</summary>
        <p class="note">No rendered preview for these yet. Use Motion Lab for the visual, these for CapCut / Remotion wording.</p>
        <div class="prompt-grid">${fullVideoBank}</div>
      </details>
    </section>

    <section id="quick-copy">
      <h2 class="section-head">${icon('prompt')} Quick copy picks</h2>
      <p class="lede">A few headlines and primary texts you can steal into Meta. Full packs collapsed under each language.</p>
      <h3 style="margin:0.75rem 0 0.35rem;font-size:1rem">English</h3>
      <div class="copy-picks">${copyEnPicks}</div>
      <details class="block" style="margin-top:0.75rem">
        <summary>Full English copy bank</summary>
        <div class="copy-grid">${renderCopyPackFull(COPY_EN, 'EN')}</div>
      </details>
      <h3 style="margin:1.25rem 0 0.35rem;font-size:1rem">Spanish</h3>
      <div class="copy-picks">${copyEsPicks}</div>
      <details class="block" style="margin-top:0.75rem">
        <summary>Full Spanish copy bank</summary>
        <div class="copy-grid">${renderCopyPackFull(COPY_ES, 'ES')}</div>
      </details>
    </section>

    <section id="full-image-bank">
      <details class="block">
        <summary>Full image prompt bank (${CHATGPT_PROMPTS.length}) — no preview images</summary>
        <p class="note">Older production prompts without generated plates. Prefer Prompt → result above when you can.</p>
        <div class="prompt-grid">${fullImageBank}</div>
      </details>
      <details class="block">
        <summary>ChatGPT workflow (8 steps)</summary>
        <ol class="clean">${CHATGPT_WORKFLOW.map((s) => `<li><b>${esc(s.title)}</b> — ${esc(s.instruction)}</li>`).join('')}</ol>
      </details>
    </section>`;

  return page({
    activeId: 'vma-chatgpt',
    title: 'Prompts & Copy',
    pageTitle: 'Prompts & Copy',
    pageSubtitle: 'See the result · copy the prompt.',
    body,
  });
}

// ─── 8. Production Handoff (vma-handoff.html) ────────────────────────────────

function claimStatusSimple(status) {
  const s = String(status || '').toLowerCase();
  if (s.includes('reject') || s.includes('do not')) return 'Rejected';
  if (s.includes('approved') || s.includes('confirmed')) return 'Approved';
  return 'Pending';
}

/** First FORMAT_SPECS size that still has Awaiting Design on any master. */
function nextPriorityWaveSpec() {
  for (const spec of FORMAT_SPECS) {
    const anyAwaiting = APPROVED_MASTERS.some((m) => {
      const cell = m.formats.find((f) => f.formatId === spec.id);
      return cell && cell.status !== 'Approved';
    });
    if (anyAwaiting) return spec;
  }
  return null;
}

function nextSizeAfter(spec) {
  if (!spec) return null;
  const idx = FORMAT_SPECS.findIndex((f) => f.id === spec.id);
  return idx >= 0 && idx < FORMAT_SPECS.length - 1 ? FORMAT_SPECS[idx + 1] : null;
}

function renderHandoff() {
  const byNumber = Object.fromEntries(APPROVED_MASTERS.map((m) => [m.number, m]));
  const ordered = GRAPHICS_BUILD_ORDER.map((n) => byNumber[n]).filter(Boolean);
  const waveSpec = nextPriorityWaveSpec();
  const followingSpec = nextSizeAfter(waveSpec);

  const waveCards = waveSpec
    ? ordered
        .map((m, i) => {
          const cell = m.formats.find((f) => f.formatId === waveSpec.id);
          const status = cell?.status || 'Awaiting Design';
          return `<div class="soft-card">
  <div class="master-card__meta">Build order ${i + 1} · VMA-${esc(m.number)}</div>
  <h3>${esc(m.name)}</h3>
  <p>Target: <b>${esc(waveSpec.label)}</b> · ${esc(waveSpec.dims)}</p>
  <p>Filename: <code>${esc(cell?.expectedFilename || `${m.stem}_${waveSpec.id}.png`)}</code></p>
  <p>${statusBadge(status)}</p>
  <a class="dl" href="/graphics-kit.html#${esc(m.number)}-${esc(waveSpec?.id || '4x5')}">Open component kit →</a>
  <a class="dl" href="${esc(m.masterImage)}" target="_blank" rel="noopener">Open master</a>
</div>`;
        })
        .join('')
    : `<div class="soft-card"><p>All four sizes are approved for every master. Pick up Later work (idea batch) or video.</p></div>`;

  const sizeChips = FORMAT_SPECS.map((f) => `<span class="chip">${esc(f.dims)} (${esc(f.label)})</span>`).join('');

  const matrix = formatMatrixCells();
  const matrixHead = FORMAT_SPECS.map(
    (f) => `<th>${esc(f.label)}<br /><span style="font-weight:500;text-transform:none;letter-spacing:0">${esc(f.dims)}</span></th>`,
  ).join('');
  const matrixRows = matrix
    .map((row) => {
      const cells = row.cells.map((c) => `<td>${statusBadge(c.displayStatus)}</td>`).join('');
      return `<tr><td class="rowhead">VMA-${esc(row.master.number)}<br />${esc(row.master.name)}</td>${cells}</tr>`;
    })
    .join('');

  const dashClaims = DASHBOARD_CLAIMS.map((c) => {
    const full = CLAIMS.find((x) => x.id === c.id);
    const simple = claimStatusSimple(c.status);
    return `<div class="soft-card">
  <h3>${esc(c.label)}</h3>
  <p>${statusBadge(simple)}</p>
  ${full ? `<p style="font-size:0.78rem;color:#4A6275">${esc(full.notes || full.status)}</p>` : ''}
</div>`;
  }).join('');

  const qa = HANDOFF_QA.map(
    (item, i) => `<li><input type="checkbox" data-persist="handoff-qa-${i}" /> <span>${esc(item)}</span></li>`,
  ).join('');

  const dos = GRAPHICS_DO.map((d) => `<li>${esc(d)}</li>`).join('');
  const donts = GRAPHICS_DONT.map((d) => `<li>${esc(d)}</li>`).join('');

  const form = CURRENT_META_FORM;
  const formFields = (form.requiredFields || []).map((f) => `<span class="chip">${esc(f)}</span>`).join('');
  const answers = (form.routingAnswers || []).map((a) => `<li>${esc(a)}</li>`).join('');

  const waveLabel = waveSpec
    ? `${waveSpec.label} / ${waveSpec.dims}`
    : 'all sizes complete';
  const nextWaveHint = followingSpec
    ? `After this wave: ${followingSpec.label} (${followingSpec.dims}), then the next size — still one wave at a time.`
    : 'After this wave: idea factory or video — still one finish line at a time.';

  const steps = waveSpec
    ? `<ol class="job-steps">
      <li>Open <a href="/graphics-kit.html#04-${esc(waveSpec.id)}">Component Library</a> — download person PNG, logos, copy text, colors.</li>
      <li>Rebuild VMA-04 for <b>${esc(waveLabel)}</b> in Photoshop / Illustrator / Figma — never stretch the square.</li>
      <li>Keep locked copy: headline, benefits, HIPAA badge, offer as approved.</li>
      <li><b>No pink</b> · <b>MedVirtual</b> only — never MedVirtual.ai.</li>
      <li>Export PNG at <b>${esc(waveSpec.dims)}</b> — filename on card below.</li>
      <li>Save editable source (PSD / AI / Figma).</li>
      <li>Optional: 6s motion MP4 — <a href="/vma-video.html#green-motion">see motion brief</a>.</li>
      <li>Submit via <a href="#monday-request">Monday request</a> · run QA checklist below.</li>
    </ol>`
    : `<p>VMA-04 wave complete for this size — pick up motion or concept review.</p>`;

  const monday = MONDAY_REQUEST;
  const teamLinks = TEAM_HANDOFF_LINKS.map(
    (l) => `<div class="soft-card">
  <p class="master-card__meta">Step ${l.step}</p>
  <h3><a href="${esc(SITE_BASE + l.path)}" target="_blank" rel="noopener">${esc(l.label)}</a></h3>
  <p>${esc(l.note)}</p>
  <p><code style="font-size:0.78rem;word-break:break-all">${esc(SITE_BASE + l.path)}</code></p>
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Production Handoff</h1>
      <p>Monday.com request · deliverables · QA — for the Philippines graphics and video team.</p>
      <p class="lede"><b>VMA-04 green person only.</b> Pause Cobalt (02) and Signal Yellow (03). Rebuild from the <a href="/graphics-kit.html">Component Library</a> in your production software.</p>
    </div>

    <div class="banner"><strong>Which ad is the winner?</strong><span class="sub">${esc(ACTIVE_REQUEST_NOTE)}</span></div>

    <section id="already-submitted">
      <h2 class="section-head">${icon('idea')} Already have an open Monday ticket?</h2>
      <div class="soft-card">
        <p>If you submitted a request titled <b>VMA-01 Spanish Green</b> or any earlier green-person ticket, <b>pause that work</b>. The winning ad is now <b>VMA-04 HIPAA Green</b> — same green-scrub person, different badge and layout.</p>
        <p>Everything you need is on this site. Start at <a href="/graphics-kit.html#04-4x5">Component Library → VMA-04 · 4:5</a>.</p>
        <p class="note">If your ticket title still says VMA-01, ask George for a one-line update on Monday — or submit a short follow-up note pointing to this Handoff page.</p>
      </div>
    </section>

    <section id="monday-request">
      <h2 class="section-head">${icon('target')} Monday.com graphics request</h2>
      <p class="lede">Copy into the <a href="${esc(monday.formUrl)}" target="_blank" rel="noopener">Graphics Request Form</a>. Everything needed is linked below.</p>
      <div class="queue-grid" style="margin-bottom:1rem">${teamLinks}</div>
      <div class="soft-card">
        <p><b>Brand:</b> ${esc(monday.fields.brand)}</p>
        <p><b>Type of Request:</b> ${esc(monday.fields.type)}</p>
        <p><b>Title of Request:</b> <code>${esc(monday.fields.title)}</code></p>
        <p><b>Description (copy all):</b></p>
        ${copyBlock(monday.fields.description)}
        <p><b>References / inspo:</b> ${esc(monday.fields.references)}</p>
        <p style="margin-top:0.75rem"><a class="dl" href="${esc(monday.formUrl)}" target="_blank" rel="noopener">Open Monday form →</a></p>
      </div>
    </section>

    <section id="priority-now">
      <h2 class="section-head">${icon('target')} Do this first</h2>
      <div class="primary-task" style="margin-bottom:1rem">
        <span class="ico" aria-hidden="true">${icon('formats')}</span>
        <div>
          <p class="primary-task__label">Component Library — start here</p>
          <p class="primary-task__text"><a href="/graphics-kit.html"><b>Open Component Library</b></a> — inspect every piece · download originals · copy text/colors · see layout reference per ratio.</p>
          <a class="primary-task__cta" href="/graphics-kit.html#04-4x5">VMA-04 · 4:5 →</a>
        </div>
      </div>
      <div class="job-box">
        <p style="font-size:1.05rem"><b>Build VMA-04 at ${esc(waveLabel)}.</b></p>
        <p>Active: ${GRAPHICS_BUILD_ORDER.map((n) => `<b>VMA-${esc(n)}</b>`).join('')}${GRAPHICS_VARIATION_ORDER.length ? ` · Variation when briefed: ${GRAPHICS_VARIATION_ORDER.map((n) => `<b>VMA-${esc(n)}</b>`).join('')}` : ''}</p>
        <p class="note"><b>Paused:</b> ${GRAPHICS_PAUSED.map((n) => `VMA-${n}`).join(', ')}</p>
        ${steps}
      </div>
    </section>

    <section id="jobs">
      <h2 class="section-head">${icon('formats')} Files to make this wave</h2>
      <p class="lede">Rebuild at ${esc(waveSpec ? waveSpec.dims : 'the target size')} — composition reference only on the site.</p>
      <div class="queue-grid">${waveCards}</div>
    </section>

    <section id="rules">
      <h2 class="section-head">${icon('approved')} Keep it on-brand</h2>
      <div class="callout-rule">Most important: <b>never use pink</b> · logo is <b>MedVirtual</b>, never MedVirtual.ai · rebuild each size, don’t stretch.</div>
      <div class="two-cols">
        <div class="soft-card"><h3>Please do</h3><ul class="clean do-list">${dos}</ul></div>
        <div class="soft-card"><h3>Please don’t</h3><ul class="clean dont-list">${donts}</ul></div>
      </div>
    </section>

    <section id="qa">
      <h2 class="section-head">${icon('eye')} Quick check before you send</h2>
      <p class="lede">Tick these off — it saves a review round-trip.</p>
      <ul class="checklist">${qa}</ul>
    </section>

    <section id="done">
      <h2 class="section-head">${icon('approved')} What “finished” looks like</h2>
      <div class="soft-card">
        <ul class="clean">
          <li>4 PNGs at the right size (${esc(waveSpec ? waveSpec.dims : 'n/a')}) with the correct filenames</li>
          <li>An editable source file (PSD / AI / Figma)</li>
          <li>Quick check ticked off</li>
          <li>Sent in for review</li>
        </ul>
        <p class="note">“Finished” is one complete size wave — not every cell in the big matrix turned green.</p>
      </div>
    </section>

    <section id="whats-next">
      <h2 class="section-head">${icon('idea')} What’s next</h2>
      <div class="soft-card">
        <p>${esc(nextWaveHint)}</p>
        <p class="note">Prefer finishing one clean wave over starting lots of new concepts. Roughly one wave per person before picking up new work — a guide, not a timesheet.</p>
      </div>
    </section>

    <section id="more">
      <h2 class="section-head">${icon('links')} More reference (optional)</h2>
      <p class="lede">You don’t need these for the job above — open only if you want more detail.</p>

      <details class="block" id="matrix">
        <summary>Full size backlog (status matrix)</summary>
        <p class="lede">Green = approved. Teal = AI draft (review). Yellow = still to design.</p>
        <table class="matrix">
          <thead><tr><th>Concept</th>${matrixHead}</tr></thead>
          <tbody>${matrixRows}</tbody>
        </table>
      </details>

      <details class="block" id="request">
        <summary>Later: new idea batch + multi-size builds</summary>
        <div class="job-box">
          <p><b>Later request:</b> 15–20 new concepts (see <a href="/ideas.html">New Ad Ideas</a>).</p>
          <p><b>After review:</b> build the strongest concepts in all 4 sizes:</p>
          <div style="margin:0.5rem 0">${sizeChips}</div>
          <p class="note">Each concept that moves forward ships in all 4 sizes plus an editable source file.</p>
        </div>
      </details>

      <details class="block" id="claims">
        <summary>Claims status (don’t invent claims)</summary>
        <div class="claim-grid">${dashClaims}</div>
        <p class="note">Only use claims marked approved. Detailed tracking lives in the team spreadsheet.</p>
      </details>

      <details class="block" id="ops-upload">
        <summary>Ops only — Meta upload pack</summary>
        <p class="note">Not the designer job. If uploading the existing 1:1 pack is faster today: <a href="/exports/meta-upload-ready-vma/README_UPLOAD_NOW.md">Meta upload-ready pack</a>.</p>
      </details>

      <details class="block" id="form">
        <summary>Ops only — current Meta lead form</summary>
        <div class="soft-card">
          <h3>${esc(form.name)}</h3>
          <p><b>Intro:</b> ${esc(form.introHeadline)} — ${esc(form.introDescription)}</p>
          <p><b>Routing:</b> ${esc(form.routingQuestion)}</p>
          <ul class="clean">${answers}</ul>
          <p style="margin-top:0.5rem">${formFields}</p>
          <p>${esc(form.privacyMessage)}</p>
          <p><b>End:</b> ${esc(form.endHeadline)} — ${esc(form.endDescription)}</p>
          <p><a href="${esc(form.demoLink)}" target="_blank" rel="noopener">${esc(form.demoCta)}</a></p>
        </div>
      </details>
    </section>

    <section id="approval">
      <p class="note">Questions on any card? Email George at <a href="mailto:${esc(GRAPHICS_REQUEST_EMAIL)}?subject=${encodeURIComponent('Production Handoff question')}">${esc(GRAPHICS_REQUEST_EMAIL)}</a>. Approval and delivery status are tracked in the team spreadsheet.</p>
    </section>`;

  return page({
    activeId: 'vma-handoff',
    title: 'Production Handoff',
    pageTitle: 'Production Handoff',
    pageSubtitle: 'What to build next · how we want it done.',
    body,
  });
}

// ─── Redirects ───────────────────────────────────────────────────────────────

const REDIRECTS = [
  { from: 'vma-history.html', to: '/studio.html' },
  { from: 'direct-response.html', to: '/vma-approved.html' },
  // Old lab / reference pages (teal header era) → active VMA site
  { from: 'producer-lab.html', to: '/studio.html' },
  { from: 'raw-assets.html', to: '/vma-approved.html' },
  { from: 'asset-hub.html', to: '/vma-approved.html' },
  { from: 'graphic-request-brief.html', to: '/vma-handoff.html' },
  { from: 'creative-concept-lab.html', to: '/ideas.html' },
  { from: 'mockup-sandbox.html', to: '/ideas.html' },
  { from: 'template-test-board.html', to: '/vma-approved.html' },
  { from: 'medvirtual-brand-guide.html', to: '/vma-approved.html' },
  { from: 'marketing-library.html', to: '/competitors.html' },
  { from: 'image-variation-review.html', to: '/ideas.html' },
  { from: 'real-people-creative.html', to: '/studio.html' },
  { from: 'real-people-assets.html', to: '/studio.html' },
  { from: 'saas-prop-templates.html', to: '/studio.html' },
  { from: 'role-offer-templates.html', to: '/studio.html' },
  { from: 'meta-launch-1.html', to: '/studio.html' },
  { from: 'meta-launch-2.html', to: '/studio.html' },
  { from: 'meta-launch-build-pack.html', to: '/studio.html' },
  { from: 'facebook-ad-copy.html', to: '/vma-chatgpt.html' },
  { from: 'dr-creative-board.html', to: '/ideas.html' },
  { from: 'contact-sheet-landing-page-images.html', to: '/vma-approved.html' },
  { from: 'contact-sheet-all-9x16.html', to: '/vma-static.html' },
  { from: 'contact-sheet-all-4x5.html', to: '/vma-static.html' },
  { from: 'contact-sheet-ai-images.html', to: '/ideas.html' },
  { from: 'contact-sheet-best-candidates.html', to: '/ideas.html' },
  // Consolidated VMA ops pages → handoff / video / prompts
  { from: 'video-production.html', to: '/motion-concept-lab.html' },
  { from: 'vma-remotion.html', to: '/vma-video.html#remotion' },
  { from: 'vma-capcut.html', to: '/vma-video.html#capcut' },
  { from: 'vma-copy-en.html', to: '/vma-chatgpt.html#english' },
  { from: 'vma-copy-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'vma-form.html', to: '/vma-handoff.html#form' },
  { from: 'vma-campaign.html', to: '/vma-handoff.html' },
  { from: 'vma-claims.html', to: '/vma-handoff.html#claims' },
  { from: 'vma-qa.html', to: '/vma-handoff.html#qa' },
  { from: 'vma-queue.html', to: '/vma-handoff.html#matrix' },
  { from: 'vma-approval.html', to: '/vma-handoff.html#approval' },
  // Legacy dr-* → consolidated VMA pages
  { from: 'dr-concepts-en.html', to: '/ideas.html' },
  { from: 'dr-concepts-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'dr-concepts-roles.html', to: '/ideas.html' },
  { from: 'dr-image-prompts.html', to: '/vma-chatgpt.html#images' },
  { from: 'dr-form.html', to: '/vma-handoff.html#form' },
  { from: 'dr-offers.html', to: '/vma-handoff.html' },
  { from: 'dr-claims.html', to: '/vma-handoff.html#claims' },
  { from: 'dr-production-queue.html', to: '/vma-handoff.html#matrix' },
  { from: 'dr-qa-checklist.html', to: '/vma-handoff.html#qa' },
  { from: 'dr-campaign-plan.html', to: '/vma-handoff.html' },
  { from: 'dr-copy-matrix.html', to: '/vma-chatgpt.html#english' },
  { from: 'dr-copy-en.html', to: '/vma-chatgpt.html#english' },
  { from: 'dr-copy-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'dr-approval.html', to: '/vma-handoff.html#approval' },
  { from: 'dr-superseded.html', to: '/studio.html' },
  { from: 'dr-reference-analysis.html', to: '/competitors.html' },
  { from: 'dr-design-system.html', to: '/vma-approved.html' },
  { from: 'dr-color-board.html', to: '/vma-approved.html' },
];

// ─── Write all pages ─────────────────────────────────────────────────────────

const primary = [
  ['studio.html', renderStudio()],
  ['vma-approved.html', renderApproved()],
  ['ideas.html', renderIdeas()],
  ['vma-static.html', renderStatic()],
  ['competitors.html', renderCompetitors()],
  ['vma-video.html', renderVideo()],
  ['vma-chatgpt.html', renderChatgpt()],
  ['vma-handoff.html', renderHandoff()],
];

for (const [name, html] of primary) write(name, html);
writeGraphicsKit();
for (const r of REDIRECTS) write(r.from, renderRedirect(r.to));

// Root entry — never serve the old Creative Handoff React app
const ROOT = path.join(__dirname, '..');
fs.writeFileSync(
  path.join(ROOT, 'index.html'),
  renderRedirect('/studio.html').replace(
    '<title>Redirecting…</title>',
    '<title>MedVirtual Ad Production</title>',
  ),
);
filesWritten += 1;

console.log(
  `Ad Production site generated · ${primary.length} primary pages + ${REDIRECTS.length} redirects · ${filesWritten} files total.`,
);
