/**
 * Direct-Response Meta review boards (July 14, 2026 review).
 * Bold, high-contrast review UI — dark panels + electric lime/yellow/cyan/blue/green accents.
 * No pink/magenta/fuchsia anywhere in this design system. Red is a utility color reserved
 * for error / warning / "approval required" stamps only.
 * Regenerate: npm run generate:direct-response
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  DR_META,
  DR_NAV,
  COLOR_FAMILIES,
  CREATIVE_CONCEPTS,
  LAYOUT_SYSTEMS,
  BADGE_STYLES,
  CLAIMS,
  CLAIM_STATUSES,
  IMAGE_PROMPTS,
  COMPLETION_SCREENS,
  OFFER_CONCEPTS,
  CAMPAIGN_PLAN,
  QA_CHECKLIST,
  SUPERSEDED,
  PRODUCTION_STATUSES,
  TALENT_DIRECTION,
  VISUAL_SPEC,
  CTA_OPTIONS,
  FORMS,
  getPriorityColorTest,
  getPriorityQueue,
  getClaimsForConcept,
} from './direct-response-strategy-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const COLOR_BY_ID = Object.fromEntries(COLOR_FAMILIES.map((c) => [c.id, c]));

const ACCENT_ROTATION = ['#00E5FF', '#B8F000', '#FFE600', '#1D4ED8', '#22C55E', '#E10600'];

function productionStatusClass(status) {
  const s = String(status || '');
  if (s === 'Approved for launch') return 'chip--ok';
  if (s === 'Rejected') return 'chip--danger';
  if (s === 'Exported' || s === 'On hold' || s === 'Draft') return 'chip--muted';
  if (s.includes('Ready for design') || s.includes('layout review')) return 'chip--cyan';
  if (s.includes('Ready for copy')) return 'chip--yellow';
  if (s.includes('Ready for image')) return 'chip--lime';
  if (s.includes('Ready for Chris') || s.includes('export')) return 'chip--green';
  return 'chip--muted';
}

function claimStatusClass(status) {
  if (status === 'Confirmed' || status === 'Approved for launch') return 'chip--ok';
  if (status === 'Pending confirmation') return 'chip--pending';
  if (status === 'Not approved' || status === 'Rejected') return 'chip--danger';
  return 'chip--muted';
}

function abbreviate(str, max = 24) {
  if (!str) return '';
  const quoted = String(str).match(/"([^"]+)"/);
  const base = quoted ? quoted[1] : String(str).split('—')[0].trim();
  return base.length > max ? `${base.slice(0, max - 1)}…` : base;
}

function copyBtn(text, label = 'Copy') {
  return `<button type="button" class="copy-btn" data-copy="${esc(text)}">${esc(label)}</button>`;
}

function claimChips(concept) {
  const claims = getClaimsForConcept(concept);
  if (!claims.length) return '';
  return `<div class="claims-inline">${claims
    .map((c) => `<span class="chip ${claimStatusClass(c.status)}" title="${esc(c.notes)}">${esc(c.label)}: ${esc(c.status)}</span>`)
    .join('')}</div>`;
}

// ─── Mock ad comp ────────────────────────────────────────────────────────────

function mockAd(concept) {
  const family = COLOR_BY_ID[concept.colorFamilyId] || {};
  const bg = concept.backgroundColor || family.background || '#0A0A0A';
  const accent = concept.accentColor || family.accent || '#00E5FF';
  const scrub = concept.wardrobeColor || concept.scrubColor || family.scrubColor || accent;
  const fg = family.headlineColor || family.foreground || '#FFFFFF';
  const bulletColor = family.bulletColor || fg;
  const ctaBg = family.ctaBg || accent;
  const ctaText = family.ctaText || '#0A0A0A';
  const bullets = (concept.bullets || []).slice(0, 4);
  const showPrice = concept.priceTreatment && !/^omit/i.test(concept.priceTreatment);
  const priceLabel = showPrice ? abbreviate(concept.priceTreatment) : '';
  return `<div class="mockad" style="background:${esc(bg)};">
    ${priceLabel ? `<span class="mockad__price" style="background:${esc(accent)};color:${esc(ctaText)}">${esc(priceLabel)}</span>` : ''}
    <div class="mockad__copy">
      <h4 style="color:${esc(fg)}">${esc(concept.headline)}</h4>
      <ul class="mockad__chips">
        ${bullets.map((b) => `<li style="color:${esc(bulletColor)}"><span class="mockad__dot" style="background:${esc(accent)}"></span>${esc(b)}</li>`).join('')}
      </ul>
      <span class="mockad__cta" style="background:${esc(ctaBg)};color:${esc(ctaText)}">${esc(concept.cta)}</span>
    </div>
    <div class="mockad__talent">
      <div class="mockad__panel" style="background:${esc(accent)}"></div>
      <div class="mockad__figure" style="--scrub:${esc(scrub)}"></div>
    </div>
  </div>`;
}

function conceptCard(concept) {
  return `<article class="concept-card" data-number="${esc(concept.number)}" data-group="${esc(concept.group)}" data-lang="${esc(concept.language)}" data-color="${esc(concept.colorFamilyId)}" data-status="${esc(concept.status)}">
    ${mockAd(concept)}
    <div class="concept-card__body">
      <div class="eyebrow">${esc(concept.number)} · ${esc(concept.groupLabel)}${concept.culturalTreatment ? ` · ${esc(concept.culturalTreatment)}` : ''}</div>
      <h3>${esc(concept.workingName)}</h3>
      <span class="chip ${productionStatusClass(concept.status)}">${esc(concept.status)}</span>
      <dl class="dl-grid">
        <div><dt>Headline</dt><dd>${esc(concept.headline)}</dd></div>
        <div><dt>Layout</dt><dd>${esc(concept.layoutId)} · ${esc(concept.badgeType)}</dd></div>
        <div><dt>Audience</dt><dd>${esc(concept.audience)}</dd></div>
        <div><dt>Hypothesis</dt><dd>${esc(concept.hypothesis || '—')}</dd></div>
        <div><dt>Formats</dt><dd>${concept.formats.map((f) => `<span class="format-tag">${esc(f)}</span>`).join(' ')}</dd></div>
      </dl>
      ${claimChips(concept)}
      ${concept.approvalNotes ? `<p class="card-note">${esc(concept.approvalNotes)}</p>` : ''}
    </div>
  </article>`;
}

function copyPackBlock(concept) {
  return `<article class="copy-block" data-group="${esc(concept.group)}" data-lang="${esc(concept.language)}" data-color="${esc(concept.colorFamilyId)}" data-status="${esc(concept.status)}">
    <div class="copy-block__head">
      <div>
        <div class="eyebrow">${esc(concept.number)} · ${esc(concept.groupLabel)}</div>
        <h3>${esc(concept.workingName)}</h3>
      </div>
      <span class="chip ${productionStatusClass(concept.status)}">${esc(concept.status)}</span>
    </div>
    <p class="lede"><strong>Audience:</strong> ${esc(concept.audience)} · <strong>Form:</strong> ${esc(concept.formId)} · <strong>CTA:</strong> ${esc(concept.cta)} <span class="muted">(alt: ${esc(concept.alternateCta)})</span></p>
    <div class="copy-cols">
      <div><h4>Primary text (5) ${copyBtn(concept.primaryTexts.join('\n'), 'Copy all')}</h4><ol>${concept.primaryTexts.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
      <div><h4>Headlines (5) ${copyBtn(concept.headlines.join('\n'), 'Copy all')}</h4><ol>${concept.headlines.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
      <div><h4>Descriptions (5) ${copyBtn(concept.descriptions.join('\n'), 'Copy all')}</h4><ol>${concept.descriptions.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
    </div>
    ${claimChips(concept)}
    ${concept.claimStatusNote ? `<p class="banner banner--warn">${esc(concept.claimStatusNote)}</p>` : ''}
  </article>`;
}

function imagePromptBlock(prompt) {
  const cropRows = Object.entries(prompt.cropInstructions)
    .map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`)
    .join('');
  return `<article class="prompt-block" data-concept="${esc(prompt.conceptNumber)}">
    <div class="copy-block__head">
      <div><div class="eyebrow">${esc(prompt.conceptNumber)}</div><h3>${esc(prompt.title)}</h3></div>
    </div>
    <div class="prompt-section">
      <h4>Background &amp; talent prompt ${copyBtn(prompt.backgroundTalentPrompt)}</h4>
      <p class="prompt-text">${esc(prompt.backgroundTalentPrompt)}</p>
    </div>
    <div class="prompt-section">
      <h4>Designer overlay spec ${copyBtn(prompt.designerOverlaySpec)}</h4>
      <p class="prompt-text">${esc(prompt.designerOverlaySpec)}</p>
    </div>
    <div class="prompt-section">
      <h4>Negative prompt ${copyBtn(prompt.negativePrompt)}</h4>
      <p class="prompt-text">${esc(prompt.negativePrompt)}</p>
    </div>
    <div class="copy-cols">
      <div>
        <h4>Approved copy</h4>
        <ul class="clean">
          <li><strong>Headline:</strong> ${esc(prompt.approvedCopy.headline)}</li>
          <li><strong>Bullets:</strong> ${esc(prompt.approvedCopy.bullets.join(' · '))}</li>
          <li><strong>Price:</strong> ${esc(prompt.approvedCopy.price)}</li>
          <li><strong>Trust:</strong> ${esc(prompt.approvedCopy.trust)}</li>
          <li><strong>CTA:</strong> ${esc(prompt.approvedCopy.cta)}</li>
        </ul>
      </div>
      <div><h4>Crop instructions</h4><ul class="clean">${cropRows}</ul></div>
      <div><h4>QA checklist</h4><ul class="clean">${prompt.qaChecklist.map((q) => `<li>${esc(q)}</li>`).join('')}</ul></div>
    </div>
  </article>`;
}

// ─── Layout wireframes (design system page) ─────────────────────────────────

const WIREFRAME_CLASS = {
  'layout-a': 'wf--a',
  'layout-b': 'wf--b',
  'layout-c': 'wf--c',
  'layout-d': 'wf--d',
  'layout-e': 'wf--e',
  'layout-f': 'wf--f',
};

function layoutWireframe(layout, accent) {
  const cls = WIREFRAME_CLASS[layout.id] || 'wf--a';
  return `<div class="wireframe ${cls}" style="--wf-accent:${esc(accent)}">
    <div class="wf-head">HEADLINE</div>
    <div class="wf-bullets">✓ TASK &nbsp; ✓ TASK &nbsp; ✓ TASK</div>
    <div class="wf-badge">$</div>
    <div class="wf-talent">TALENT</div>
    <div class="wf-cta">CTA</div>
  </div>`;
}

function layoutCard(layout, i) {
  const accent = ACCENT_ROTATION[i % ACCENT_ROTATION.length];
  return `<article class="card layout-card">
    ${layoutWireframe(layout, accent)}
    <h3>${esc(layout.name)}</h3>
    <p>${esc(layout.description)}</p>
    <div class="dl-grid">
      <div><dt>Formats</dt><dd>${layout.formats.map((f) => `<span class="format-tag">${esc(f)}</span>`).join(' ')}</dd></div>
      <div><dt>Notes</dt><dd>${esc(layout.notes)}</dd></div>
    </div>
  </article>`;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const PAGE_CSS = `
${HEADER_CSS}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: ${BRAND.fonts.family};
  color: #E2E8F0;
  background:
    radial-gradient(ellipse 70% 40% at 100% 0%, rgba(0,229,255,0.10), transparent 55%),
    radial-gradient(ellipse 60% 35% at 0% 100%, rgba(184,240,0,0.08), transparent 55%),
    #0A0E14;
  line-height: 1.55;
}
main { max-width: 1180px; margin: 0 auto; padding: 1.4rem 1.1rem 4.5rem; }
a { color: #00E5FF; }
code { background: rgba(255,255,255,0.08); padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.85em; color: #B8F000; }
.eyebrow {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #00E5FF;
  margin-bottom: 0.2rem;
}
.muted { color: #64748b; font-weight: 400; }

/* Current-direction banner strip — every page */
.banner-strip {
  background: linear-gradient(120deg, #05070c, #101827 60%, #0a1420);
  border: 1px solid rgba(0,229,255,0.35);
  border-radius: 14px;
  padding: 1rem 1.15rem;
  margin: 0 0 1.3rem;
}
.banner-strip__title {
  font-size: 0.92rem;
  font-weight: 900;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #B8F000;
  margin: 0;
}
.banner-strip__sub { margin: 0.35rem 0 0; color: #cbd5e1; font-size: 0.86rem; max-width: 60rem; }

.badge-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0 0 1rem; }
.badge {
  display: inline-block;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  border: 1px solid transparent;
}
.badge--current { background: rgba(184,240,0,0.14); color: #B8F000; border-color: rgba(184,240,0,0.4); }
.badge--warn { background: rgba(255,230,0,0.14); color: #FFE600; border-color: rgba(255,230,0,0.4); }
.badge--danger { background: rgba(220,38,38,0.14); color: #f87171; border-color: rgba(220,38,38,0.45); }
.badge--muted { background: rgba(148,163,184,0.14); color: #94a3b8; border-color: rgba(148,163,184,0.3); }

.hero h1 { margin: 0 0 0.4rem; font-size: clamp(1.6rem, 3.6vw, 2.3rem); letter-spacing: -0.02em; color: #fff; }
.hero p { margin: 0 0 0.9rem; max-width: 52rem; color: #94a3b8; }

.banner {
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.1);
  border-left: 4px solid #00E5FF;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  margin: 0 0 1.1rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}
.banner--warn { border-left-color: #FFE600; }
.banner--danger { border-left-color: #DC2626; color: #fecaca; }
.banner--ok { border-left-color: #22C55E; }
.banner strong { color: #fff; }

.section { margin: 1.8rem 0; }
.section h2 { margin: 0 0 0.6rem; font-size: 1.22rem; letter-spacing: -0.01em; color: #fff; }
.section h3 { margin: 1.1rem 0 0.4rem; font-size: 1.02rem; color: #f1f5f9; }
.lede { margin: 0 0 0.9rem; color: #94a3b8; font-size: 0.94rem; max-width: 56rem; }

.grid { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
.card {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
  padding: 1rem 1.05rem;
  text-decoration: none;
  color: inherit;
}
a.card:hover { border-color: #00E5FF; }
.card h3 { margin: 0 0 0.3rem; font-size: 1rem; color: #fff; }
.card p { margin: 0; font-size: 0.86rem; color: #94a3b8; }
.card .meta {
  margin-top: 0.55rem;
  font-size: 0.7rem;
  font-weight: 800;
  color: #B8F000;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

ul.clean { margin: 0.4rem 0 0; padding-left: 1.15rem; color: #cbd5e1; }
ul.clean li { margin: 0.3rem 0; }

.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0.8rem 0; border-radius: 12px; }
table.data {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.83rem;
  background: #111827;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  min-width: 640px;
  color: #cbd5e1;
}
table.data th, table.data td {
  text-align: left;
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  vertical-align: top;
}
table.data th {
  background: #0a0e14;
  color: #B8F000;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  position: sticky;
  top: 0;
}
table.data tr:last-child td { border-bottom: none; }
table.data tr.is-priority td:first-child { border-left: 3px solid #00E5FF; }

.chip {
  display: inline-block;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  border: 1px solid transparent;
  white-space: nowrap;
}
.chip--ok { background: rgba(34,197,94,0.16); color: #4ade80; border-color: rgba(34,197,94,0.4); }
.chip--pending { background: rgba(255,230,0,0.15); color: #FFE600; border-color: rgba(255,230,0,0.4); }
.chip--danger { background: rgba(220,38,38,0.16); color: #f87171; border-color: rgba(220,38,38,0.45); }
.chip--cyan { background: rgba(0,229,255,0.14); color: #00E5FF; border-color: rgba(0,229,255,0.4); }
.chip--lime { background: rgba(184,240,0,0.16); color: #B8F000; border-color: rgba(184,240,0,0.4); }
.chip--yellow { background: rgba(255,230,0,0.15); color: #FFE600; border-color: rgba(255,230,0,0.4); }
.chip--blue { background: rgba(29,78,216,0.24); color: #93c5fd; border-color: rgba(29,78,216,0.55); }
.chip--green { background: rgba(34,197,94,0.16); color: #4ade80; border-color: rgba(34,197,94,0.4); }
.chip--muted { background: rgba(148,163,184,0.14); color: #94a3b8; border-color: rgba(148,163,184,0.3); }
.claims-inline { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.6rem 0 0; }

.filters { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.8rem 0 1.1rem; align-items: center; }
.filters button {
  border: 1px solid rgba(255,255,255,0.14);
  background: #111827;
  border-radius: 999px;
  padding: 0.38rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
  font-family: inherit;
  color: #cbd5e1;
}
.filters button.active { background: #00E5FF; border-color: #00E5FF; color: #0A0E14; }
.filters select {
  border: 1px solid rgba(255,255,255,0.14);
  background: #111827;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 0.38rem 0.6rem;
  font-size: 0.78rem;
  font-family: inherit;
}
.filters label { font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; }

.copy-btn {
  background: #1a2333;
  border: 1px solid rgba(255,255,255,0.16);
  color: #cbd5e1;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.22rem 0.55rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  margin-left: 0.4rem;
  vertical-align: middle;
}
.copy-btn:hover { border-color: #00E5FF; color: #00E5FF; }
.copy-btn.copied { border-color: #22C55E; color: #4ade80; }

.concept-cards { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.concept-card {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.concept-card[hidden] { display: none; }
.concept-card__body { padding: 0.9rem 1rem 1.05rem; }
.concept-card__body h3 { margin: 0 0 0.3rem; font-size: 1rem; color: #fff; }
.dl-grid { margin: 0.6rem 0 0; display: grid; gap: 0.32rem; font-size: 0.8rem; }
.dl-grid dt { font-weight: 700; color: #64748b; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.04em; }
.dl-grid dd { margin: 0; color: #cbd5e1; }
.card-note { margin: 0.6rem 0 0; font-size: 0.78rem; color: #fbbf24; }
.format-tag {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 800;
  background: rgba(255,255,255,0.08);
  color: #cbd5e1;
  padding: 0.14rem 0.42rem;
  border-radius: 5px;
  margin: 0 0.15rem 0.15rem 0;
}

/* Mock ad comp — dark plate + vertical accent panel + abstract talent figure */
.mockad {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  min-height: 220px;
  position: relative;
  overflow: hidden;
}
.mockad__price {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  z-index: 3;
  font-size: 0.6rem;
  font-weight: 850;
  letter-spacing: 0.02em;
  padding: 0.24rem 0.55rem;
  border-radius: 3px;
  transform: rotate(-4deg);
}
.mockad__copy { padding: 1.6rem 0.9rem 0.9rem; display: flex; flex-direction: column; gap: 0.4rem; justify-content: center; z-index: 2; }
.mockad__copy h4 { margin: 0; font-size: 0.86rem; line-height: 1.22; text-transform: uppercase; font-weight: 850; letter-spacing: -0.01em; }
.mockad__chips { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.22rem; }
.mockad__chips li { font-size: 0.64rem; font-weight: 750; display: flex; align-items: center; gap: 0.35rem; }
.mockad__dot { width: 7px; height: 7px; border-radius: 2px; flex-shrink: 0; }
.mockad__cta { align-self: flex-start; margin-top: 0.3rem; font-size: 0.62rem; font-weight: 850; padding: 0.32rem 0.65rem; border-radius: 999px; }
.mockad__talent { position: relative; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
.mockad__panel { position: absolute; top: 0; right: 0; bottom: 0; width: 38%; opacity: 0.9; }
.mockad__figure {
  position: relative;
  z-index: 1;
  width: 60%;
  height: 88%;
  border-radius: 42% 42% 6% 6% / 30% 30% 6% 6%;
  background: linear-gradient(180deg, #f0d3b8 0 26%, var(--scrub, #22C55E) 26% 100%);
  box-shadow: 0 10px 26px rgba(0,0,0,0.4);
}
.mockad__figure::after {
  content: '';
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 36%;
  height: 15%;
  border-radius: 50%;
  background: #5b3a2e;
  opacity: 0.32;
}

.color-swatch {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 0.9rem;
  align-items: start;
  background: #111827;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
  padding: 1rem;
}
.swatch { width: 92px; height: 92px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.14); }
.color-swatch h3 { margin: 0 0 0.4rem; color: #fff; }
.color-swatch--optional { opacity: 0.72; border-style: dashed; }

.copy-block { background: #111827; border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 1.05rem 1.1rem; margin-bottom: 0.9rem; }
.copy-block[hidden] { display: none; }
.copy-block__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.6rem; flex-wrap: wrap; }
.copy-block h3 { margin: 0 0 0.35rem; color: #fff; }
.copy-cols { display: grid; gap: 0.8rem; grid-template-columns: repeat(3, 1fr); }
.copy-cols h4 { margin: 0 0 0.4rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
.copy-cols ol { margin: 0; padding-left: 1.1rem; font-size: 0.85rem; color: #cbd5e1; }
@media (max-width: 860px) { .copy-cols { grid-template-columns: 1fr; } }

.prompt-block { background: #111827; border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 1.05rem 1.1rem; margin-bottom: 0.9rem; }
.prompt-block h3 { color: #fff; margin: 0 0 0.35rem; }
.prompt-section { margin: 0.7rem 0; }
.prompt-section h4 { margin: 0 0 0.3rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.04em; color: #00E5FF; }
.prompt-text { margin: 0; font-size: 0.85rem; color: #cbd5e1; background: #0a0e14; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 0.65rem 0.75rem; }

.field-table td.req { font-weight: 700; color: #f87171; }
.field-table td.opt { color: #64748b; }

.approval-stamp {
  display: inline-block;
  margin: 0 0 0.6rem;
  padding: 0.35rem 0.7rem;
  border: 2px solid #DC2626;
  background: rgba(220,38,38,0.08);
  color: #f87171;
  font-weight: 850;
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-radius: 6px;
  transform: rotate(-2deg);
}

.check-list { list-style: none; margin: 0; padding: 0; }
.check-list li {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  margin: 0.4rem 0;
  display: grid;
  grid-template-columns: 1.4rem 1fr;
  gap: 0.55rem;
  align-items: start;
  font-size: 0.9rem;
  color: #cbd5e1;
}
.check-list li.is-done { border-color: rgba(34,197,94,0.5); background: rgba(34,197,94,0.06); }
.check-list li.is-done label { color: #94a3b8; text-decoration: line-through; }
.check-list input { margin-top: 0.2rem; accent-color: #00E5FF; }
.qa-progress {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin: 0.7rem 0 1.1rem;
}
.qa-progress__bar { height: 100%; background: linear-gradient(90deg, #B8F000, #00E5FF); width: 0%; transition: width 0.2s; }
.qa-progress__label { font-size: 0.78rem; color: #94a3b8; margin: 0 0 0.4rem; }

.do-dont { display: grid; gap: 0.8rem; grid-template-columns: 1fr 1fr; }
@media (max-width: 700px) { .do-dont { grid-template-columns: 1fr; } }
.do-dont .card h3 { color: #4ade80; }
.do-dont .card.bad h3 { color: #f87171; }

.formats { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.formats span { font-size: 0.66rem; font-weight: 800; background: rgba(255,255,255,0.08); color: #cbd5e1; padding: 0.15rem 0.42rem; border-radius: 5px; }

/* Layout wireframes */
.layout-card { display: flex; flex-direction: column; gap: 0.6rem; }
.layout-card h3 { color: #fff; }
.wireframe {
  display: grid;
  gap: 0.4rem;
  min-height: 180px;
  border-radius: 10px;
  padding: 0.6rem;
  background: #0a0e14;
  border: 1px solid rgba(255,255,255,0.09);
}
.wf-head, .wf-bullets, .wf-badge, .wf-talent, .wf-cta {
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #0a0e14;
  padding: 0.3rem;
  text-align: center;
}
.wf-head { background: var(--wf-accent, #00E5FF); grid-area: head; }
.wf-bullets { background: rgba(255,255,255,0.12); color: #e2e8f0; grid-area: bullets; }
.wf-badge { background: var(--wf-accent, #00E5FF); grid-area: badge; opacity: 0.85; }
.wf-talent { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px dashed rgba(255,255,255,0.2); grid-area: talent; }
.wf-cta { background: #fff; grid-area: cta; }
.wf--a { grid-template-columns: 1.2fr 0.8fr; grid-template-rows: auto auto auto auto; grid-template-areas: "head talent" "bullets talent" "badge talent" "cta talent"; }
.wf--b { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto auto auto; grid-template-areas: "talent talent" "head head" "bullets bullets" "cta badge"; }
.wf--c { grid-template-columns: 1.2fr 0.8fr; grid-template-rows: auto auto auto auto; grid-template-areas: "badge badge" "head talent" "bullets talent" "cta talent"; }
.wf--c .wf-badge { min-height: 2.2rem; font-size: 0.75rem; }
.wf--d { grid-template-columns: 0.7fr 1.3fr; grid-template-rows: auto auto auto auto; grid-template-areas: "head head" "badge bullets" "talent bullets" "cta cta"; }
.wf--e { grid-template-columns: 0.9fr 1.1fr; grid-template-rows: auto auto auto auto; grid-template-areas: "head head" "bullets talent" "bullets talent" "cta badge"; }
.wf--f { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto auto auto; grid-template-areas: "head head" "head head" "talent talent" "cta badge"; }

/* Reference analysis */
.ref-card { background: #111827; border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 1rem; }
.ref-card img { width: 100%; border-radius: 10px; display: block; background: #0a0e14; min-height: 220px; object-fit: cover; }
.ref-card .ref-label {
  display: inline-block;
  margin-top: 0.6rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #FFE600;
  background: rgba(255,230,0,0.12);
  border: 1px solid rgba(255,230,0,0.35);
  padding: 0.24rem 0.55rem;
  border-radius: 6px;
}
.ref-card .ref-notes { margin: 0.6rem 0 0; color: #94a3b8; font-size: 0.87rem; }
.ref-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  border-radius: 10px;
  background: #0a0e14;
  border: 1px dashed rgba(255,255,255,0.16);
  color: #64748b;
  font-size: 0.78rem;
  text-align: center;
  padding: 1rem;
}
.ref-side { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

details.collapse { background: #111827; border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 0.85rem 1rem; margin-bottom: 0.85rem; }
details.collapse summary { cursor: pointer; font-weight: 750; color: #fff; }
details.collapse[open] summary { color: #00E5FF; }
`;

// ─── Page shell ──────────────────────────────────────────────────────────────

function pageShell({ activeId, title, subtitle, body, extraScript = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} · MedVirtual Direct Response</title>
  <style>${PAGE_CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId,
    pageTitle: title,
    pageSubtitle: subtitle,
    subnav: DR_NAV.map(({ href, label }) => ({ href, label })),
    activeSubHref: DR_NAV.find((n) => n.id === activeId)?.href,
  })}
  <main>
    <div class="banner-strip">
      <p class="banner-strip__title">${esc(DR_META.bannerTitle)}</p>
      <p class="banner-strip__sub">${esc(DR_META.bannerSub)}</p>
    </div>
    ${body}
  </main>
  ${BASE_SCRIPT}
  ${extraScript}
</body>
</html>`;
}

const BASE_SCRIPT = `<script>
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var text = btn.getAttribute('data-copy') || '';
    var original = btn.textContent;
    function done() {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function () { btn.textContent = original; btn.classList.remove('copied'); }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {});
    }
  });

  window.mvAttachFilters = function (barSelector, itemSelector) {
    var buttons = document.querySelectorAll(barSelector + ' button');
    var items = document.querySelectorAll(itemSelector);
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        items.forEach(function (item) {
          if (f === 'all') { item.hidden = false; return; }
          var parts = f.split(':');
          item.hidden = item.getAttribute('data-' + parts[0]) !== parts[1];
        });
      });
    });
  };

  window.mvAttachSelectFilters = function (selectSelector, itemSelector) {
    var selects = document.querySelectorAll(selectSelector);
    var items = document.querySelectorAll(itemSelector);
    function apply() {
      var active = {};
      selects.forEach(function (s) {
        if (s.value) active[s.getAttribute('data-key')] = s.value;
      });
      items.forEach(function (item) {
        var visible = Object.keys(active).every(function (k) {
          return item.getAttribute('data-' + k) === active[k];
        });
        item.hidden = !visible;
      });
    }
    selects.forEach(function (s) { s.addEventListener('change', apply); });
  };
})();
</script>`;

// ─── Write helpers ───────────────────────────────────────────────────────────

let writtenCount = 0;

function write(name, html) {
  fs.writeFileSync(path.join(PUBLIC, name), html);
  writtenCount += 1;
  console.log('Wrote', name);
}

function writeRedirect(name, targetHref, label) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${esc(targetHref)}" />
  <link rel="canonical" href="${esc(targetHref)}" />
  <title>Moved · MedVirtual Direct Response</title>
  <style>
    body { font-family: ${BRAND.fonts.family}; background: #0A0E14; color: #E2E8F0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
    a { color: #00E5FF; font-weight: 700; }
    p { max-width: 26rem; padding: 0 1.2rem; }
  </style>
</head>
<body>
  <p>This page moved to <a href="${esc(targetHref)}">${esc(label || targetHref)}</a>. Redirecting…</p>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC, name), html);
  writtenCount += 1;
  console.log('Wrote redirect', name, '→', targetHref);
}

// ══════════════════════════════════════════════════════════════════════════
// 1. direct-response.html — Current Meta Direction hub
// ══════════════════════════════════════════════════════════════════════════

write(
  'direct-response.html',
  pageShell({
    activeId: 'dr-overview',
    title: 'Current Meta Direction',
    subtitle: `Direct-response campaign review — ${DR_META.reviewDateDisplay}`,
    body: `
    <div class="badge-row">
      <span class="badge badge--current">${esc(DR_META.status)}</span>
      <span class="badge badge--warn">Supersedes teal SaaS / no-people primary</span>
      <span class="badge badge--danger">No pink</span>
    </div>
    <header class="hero">
      <h1>${esc(DR_META.coreHeadlineEn)}</h1>
      <p>Bold, high-contrast, human-led ads. Large headline left · 3–5 task bullets · credible medical admin right · vivid color · mobile-first. Logo optional. Objective: leads and booked staffing conversations.</p>
    </header>
    <section class="section">
      <h2>Every review board</h2>
      <p class="lede">One data source keeps copy, concepts, claims, and status aligned across every board below.</p>
      <div class="grid">
        ${DR_NAV.map(
          (n) => `<a class="card" href="${esc(n.href)}"><h3>${esc(n.label)}</h3><p>Open this review board.</p><div class="meta">${esc(n.id)}</div></a>`,
        ).join('')}
      </div>
    </section>
    <section class="section">
      <h2>Priority color test (DR-01..06)</h2>
      <p class="lede">Identical message, talent, bullets, badge, CTA, and layout — color is the only variable.</p>
      <div class="concept-cards">${getPriorityColorTest().map(conceptCard).join('')}</div>
    </section>
    <section class="section">
      <h2>First production queue (top 12 by priority)</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>#</th><th>Name</th><th>Headline</th><th>Color</th><th>Status</th></tr></thead>
        <tbody>
          ${getPriorityQueue()
            .map(
              (c) => `<tr>
              <td>${esc(c.number)}</td>
              <td>${esc(c.workingName)}</td>
              <td>${esc(c.headline)}</td>
              <td><code>${esc(c.backgroundColor)}</code></td>
              <td><span class="chip ${productionStatusClass(c.status)}">${esc(c.status)}</span></td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table></div>
    </section>
    <section class="section">
      <h2>Guardrails</h2>
      <ul class="clean">${DR_META.guardrails.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
    </section>
    <section class="section">
      <h2>Not deleted — archived</h2>
      <p class="lede">${esc(SUPERSEDED.summary)}</p>
      <p><a href="/dr-superseded.html">Read superseded direction →</a> · <a href="/saas-prop-templates.html">SaaS Prop board (archive)</a> · <a href="/role-offer-templates.html">Role-Offer</a> · <a href="/real-people-creative.html">Real People</a></p>
    </section>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 2. dr-reference-analysis.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-reference-analysis.html',
  pageShell({
    activeId: 'dr-reference',
    title: 'Reference Ad Analysis',
    subtitle: 'External creative reference — visual benchmark only, not final MedVirtual creative.',
    body: `
    <div class="badge-row">
      <span class="badge badge--warn">Structure benchmark only</span>
      <span class="badge badge--danger">Do not copy pink</span>
    </div>
    <header class="hero">
      <h1>External creative reference — visual benchmark only.</h1>
      <p>These third-party ads informed layout structure and hierarchy testing — never color, brand, or copy. Pink, magenta, rose, and fuchsia are explicitly excluded from the MedVirtual creative system regardless of what a reference used.</p>
    </header>
    <section class="section">
      <h2>Side-by-side analysis</h2>
      <div class="ref-side">
        ${DR_META.externalRefs
          .map(
            (r) => `
          <article class="ref-card">
            <img src="${esc(r.src)}" alt="${esc(r.label)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ref-fallback',textContent:'Reference image not yet uploaded — ${esc(r.id)}'}))" />
            <span class="ref-label">${esc(r.label)}</span>
            <p class="ref-notes">${esc(r.notes)}</p>
          </article>`,
          )
          .join('')}
      </div>
    </section>
    <section class="section">
      <h2>Reference principles — structure worth learning from</h2>
      <ul class="clean">${DR_META.referencePrinciples.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    </section>
    <section class="section">
      <h2>Do not copy</h2>
      <p class="banner banner--danger"><strong>Pink, magenta, hot pink, rose, and fuchsia are forbidden</strong> — reference ads used pink; that informed structure only, never MedVirtual color.</p>
      <ul class="clean">${DR_META.doNotCopy.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    </section>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 3. dr-design-system.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-design-system.html',
  pageShell({
    activeId: 'dr-design',
    title: 'DR Design System',
    subtitle: 'Visual hierarchy, layout systems A–F, badge styles, talent direction, and reject criteria.',
    body: `
    <header class="hero">
      <h1>Design system</h1>
      <p>Original MedVirtual shapes, not a pixel-clone of any reference. Six layout systems cover the format range; pick one and hold it constant while testing color or message.</p>
    </header>
    <section class="section">
      <h2>Hierarchy</h2>
      <ul class="clean">${VISUAL_SPEC.hierarchy.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <h3>Mobile type</h3>
      <ul class="clean">${VISUAL_SPEC.mobileType.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <h3>Safe zones, placement, contrast</h3>
      <ul class="clean">
        ${VISUAL_SPEC.safeZones.map((h) => `<li>${esc(h)}</li>`).join('')}
        <li><strong>Person:</strong> ${esc(VISUAL_SPEC.personPlacement)}</li>
        <li><strong>Bullets:</strong> ${esc(VISUAL_SPEC.bulletSpacing)}</li>
        <li><strong>CTA:</strong> ${esc(VISUAL_SPEC.ctaPlacement)}</li>
        <li><strong>Contrast:</strong> ${esc(VISUAL_SPEC.contrast)}</li>
      </ul>
    </section>
    <section class="section">
      <h2>Layout systems A–F</h2>
      <div class="grid">${LAYOUT_SYSTEMS.map((l, i) => layoutCard(l, i)).join('')}</div>
    </section>
    <section class="section">
      <h2>Badge styles</h2>
      <div class="grid">
        ${BADGE_STYLES.map((b) => `<div class="card"><h3>${esc(b.name)}</h3><p>${esc(b.description)}</p></div>`).join('')}
      </div>
    </section>
    <section class="section">
      <h2>Talent direction</h2>
      <p class="lede"><strong>${esc(TALENT_DIRECTION.role)}.</strong> ${esc(TALENT_DIRECTION.look)}. ${esc(TALENT_DIRECTION.wardrobe)} ${esc(TALENT_DIRECTION.framing)}.</p>
      <h3>Wardrobe tests</h3>
      <ul class="clean">${TALENT_DIRECTION.wardrobeTests.map((t) => `<li><strong>${esc(t.label)}:</strong> ${esc(t.notes)}</li>`).join('')}</ul>
      <h3>Pose variations</h3>
      <ul class="clean">${TALENT_DIRECTION.poseVariations.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <div class="do-dont">
        <div class="card"><h3>Do</h3><ul class="clean">${TALENT_DIRECTION.do.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
        <div class="card bad"><h3>Avoid</h3><ul class="clean">${TALENT_DIRECTION.avoid.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
      </div>
    </section>
    <section class="section">
      <h2>CTA options</h2>
      <div class="grid">
        <div class="card"><h3>Primary</h3><p>EN: ${esc(CTA_OPTIONS.primary.en)} · ES: ${esc(CTA_OPTIONS.primary.es)}</p></div>
        <div class="card"><h3>Alternate</h3><p>EN: ${esc(CTA_OPTIONS.alternate.en)} · ES: ${esc(CTA_OPTIONS.alternate.es)}</p></div>
      </div>
    </section>
    <section class="section">
      <h2>Overall do / do not</h2>
      <div class="do-dont">
        <div class="card"><h3>Do</h3><ul class="clean">${VISUAL_SPEC.goods.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
        <div class="card bad"><h3>Do not</h3><ul class="clean">${VISUAL_SPEC.bads.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
      </div>
      <h3>Reject on sight</h3>
      <p class="banner banner--danger">${VISUAL_SPEC.rejectCriteria.map((r) => esc(r)).join(' · ')}</p>
    </section>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 4. dr-color-board.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-color-board.html',
  pageShell({
    activeId: 'dr-color',
    title: 'Color Testing Board',
    subtitle: 'Same core message — isolate color as the test variable. No pink.',
    body: `
    <div class="badge-row">
      <span class="badge badge--current">Color testing</span>
      <span class="badge badge--danger">No pink</span>
      <span class="badge badge--muted">Purple lower priority</span>
    </div>
    <header class="hero">
      <h1>Bold color families</h1>
      <p>MedVirtual teal is no longer mandatory for every ad. Use saturated, high-contrast plates and avoid muddy, dark, dirty, muted, or beige-heavy backgrounds. Avoid prison-jumpsuit orange scrub color.</p>
    </header>
    <p class="banner">Core message locked for the color test set: <strong>${esc(DR_META.coreHeadlineEn)}</strong> with the same general admin bullets, layout, badge, and CTA.</p>
    <section class="section">
      <h2>All color families</h2>
      <div class="grid" style="grid-template-columns:1fr;">
        ${COLOR_FAMILIES.map(
          (c) => `
          <div class="color-swatch ${c.optional ? 'color-swatch--optional' : ''}">
            <div class="swatch" style="background:${esc(c.background)}"></div>
            <div>
              <h3>${esc(c.priority)}. ${esc(c.name)}${c.optional ? ' <span class="chip chip--muted">Optional</span>' : ''}${c.badgeOnly ? ' <span class="chip chip--muted">Badge only</span>' : ''}</h3>
              <ul class="clean">
                <li><strong>Background:</strong> <code>${esc(c.background)}</code> / alt <code>${esc(c.backgroundAlt)}</code></li>
                <li><strong>Accent:</strong> <code>${esc(c.accent)}</code> · secondary <code>${esc(c.secondary)}</code></li>
                <li><strong>Headline:</strong> <code>${esc(c.headlineColor)}</code> · bullets <code>${esc(c.bulletColor)}</code></li>
                <li><strong>CTA:</strong> bg <code>${esc(c.ctaBg)}</code> · text <code>${esc(c.ctaText)}</code></li>
                <li><strong>Scrubs:</strong> <code>${esc(c.scrubColor)}</code> — ${esc(c.scrubNote)}</li>
                <li><strong>Contrast strategy:</strong> ${esc(c.contrastStrategy)}</li>
                <li><strong>Avoid:</strong> ${esc(c.avoid)}</li>
                <li><strong>Forbidden:</strong> ${esc(c.forbiddenNote)}</li>
              </ul>
            </div>
          </div>`,
        ).join('')}
      </div>
    </section>
    <section class="section">
      <h2>Matched set — DR-01..06 side by side</h2>
      <p class="lede">Same message, talent, bullets, badge, CTA, and layout across all six priority colors.</p>
      <div class="concept-cards">${getPriorityColorTest().map(conceptCard).join('')}</div>
    </section>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 5. dr-concepts-en.html
// ══════════════════════════════════════════════════════════════════════════

const englishConcepts = CREATIVE_CONCEPTS.filter((c) => c.language === 'en');

write(
  'dr-concepts-en.html',
  pageShell({
    activeId: 'dr-concepts-en',
    title: 'English Concepts',
    subtitle: 'Core offer, pain, role-specific, and offer/value concepts in English — filterable by group, color, and status.',
    body: `
    <header class="hero">
      <h1>English creative concepts</h1>
      <p>Primary focus: Core Offer (group 1), Pain (group 2), and Offer/Value (group 5). Role-specific concepts (group 3) also live on their own board.</p>
    </header>
    <div class="filters" id="en-filters" role="toolbar" aria-label="Filter concepts">
      <button type="button" class="active" data-filter="all">All (${englishConcepts.length})</button>
      <button type="button" data-filter="group:1">Core Offer</button>
      <button type="button" data-filter="group:2">Pain</button>
      <button type="button" data-filter="group:3">Role Specific</button>
      <button type="button" data-filter="group:5">Offer / Value</button>
      <button type="button" data-filter="status:Ready for design">Ready for design</button>
    </div>
    <div class="concept-cards" id="en-cards">${englishConcepts.map(conceptCard).join('')}</div>
    <p><a href="/dr-concepts-roles.html">Open the dedicated role-specific board →</a></p>`,
    extraScript: `<script>mvAttachFilters('#en-filters', '#en-cards .concept-card');</script>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 6. dr-concepts-es.html
// ══════════════════════════════════════════════════════════════════════════

const spanishConcepts = CREATIVE_CONCEPTS.filter((c) => c.language === 'es' || c.language === 'bilingual');

write(
  'dr-concepts-es.html',
  pageShell({
    activeId: 'dr-concepts-es',
    title: 'Spanish & Bilingual',
    subtitle: 'Natural Spanish — not literal machine translation. Flag cue is an optional test only.',
    body: `
    <div class="badge-row"><span class="badge badge--current">Spanish creative</span></div>
    <header class="hero">
      <h1>Spanish-language &amp; bilingual creative</h1>
      <p>Headline: <strong>${esc(DR_META.coreHeadlineEs)}</strong>. Do not make nationality assumptions about the worker or the viewer. A tasteful flag element may be tested as a campaign visual — never a universal brand mark.</p>
    </header>
    <div class="filters" id="es-filters" role="toolbar" aria-label="Filter concepts">
      <button type="button" class="active" data-filter="all">All (${spanishConcepts.length})</button>
      <button type="button" data-filter="lang:es">Spanish</button>
      <button type="button" data-filter="lang:bilingual">Bilingual</button>
    </div>
    <div class="concept-cards" id="es-cards">${spanishConcepts.map(conceptCard).join('')}</div>
    <section class="section">
      <h2>Cultural treatment notes</h2>
      <ul class="clean">
        ${spanishConcepts
          .filter((c) => c.culturalTreatment)
          .map((c) => `<li><strong>${esc(c.number)} (${esc(c.culturalTreatment)}):</strong> ${esc(c.approvalNotes || c.hypothesis)}</li>`)
          .join('')}
        <li>No nationality assumptions about the talent or the viewer.</li>
        <li>Optional flag cue is a campaign test only, never a permanent brand system element.</li>
      </ul>
    </section>`,
    extraScript: `<script>mvAttachFilters('#es-filters', '#es-cards .concept-card');</script>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 7. dr-concepts-roles.html
// ══════════════════════════════════════════════════════════════════════════

const roleConcepts = CREATIVE_CONCEPTS.filter((c) => c.group === 3);

write(
  'dr-concepts-roles.html',
  pageShell({
    activeId: 'dr-concepts-roles',
    title: 'Role-Specific Board',
    subtitle: 'Dental, billing, scheduling, insurance, intake, preauthorization, and reception concepts.',
    body: `
    <header class="hero">
      <h1>Role-specific concepts</h1>
      <p>Same visual system, narrower message. Qualify warmer, higher-intent traffic after the color winner emerges from the core offer test.</p>
    </header>
    <div class="concept-cards">${roleConcepts.map(conceptCard).join('')}</div>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 8. dr-image-prompts.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-image-prompts.html',
  pageShell({
    activeId: 'dr-prompts',
    title: 'Image Prompt Library',
    subtitle: 'Background/talent prompt, designer overlay spec, negative prompt, crop instructions, and QA per concept.',
    body: `
    <header class="hero">
      <h1>Image prompt library</h1>
      <p>Photo generation covers background and talent only. All headline, bullet, badge, and CTA text is designer-added afterward — never baked into the AI image.</p>
    </header>
    ${IMAGE_PROMPTS.map(imagePromptBlock).join('')}`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 9. dr-copy-matrix.html
// ══════════════════════════════════════════════════════════════════════════

const GROUP_LABELS = CREATIVE_CONCEPTS.reduce((map, c) => {
  map[c.group] = c.groupLabel;
  return map;
}, {});

write(
  'dr-copy-matrix.html',
  pageShell({
    activeId: 'dr-copy',
    title: 'Meta Copy Matrix',
    subtitle: 'Five primary texts, five headlines, five descriptions, CTA, audience, form, and claims per concept.',
    body: `
    <header class="hero">
      <h1>Meta copy matrix</h1>
      <p>Every concept below is launch-ready copy — populate Meta ad fields directly. Claims still pending confirmation are flagged inline.</p>
    </header>
    <div class="filters" id="copy-filters">
      <label for="copy-group">Group</label>
      <select id="copy-group" data-key="group">
        <option value="">All groups</option>
        ${Object.entries(GROUP_LABELS)
          .map(([g, label]) => `<option value="${esc(g)}">${esc(label)}</option>`)
          .join('')}
      </select>
      <label for="copy-lang">Language</label>
      <select id="copy-lang" data-key="lang">
        <option value="">All languages</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="bilingual">Bilingual</option>
      </select>
    </div>
    <div id="copy-list">${CREATIVE_CONCEPTS.slice().sort((a, b) => a.priority - b.priority).map(copyPackBlock).join('')}</div>`,
    extraScript: `<script>mvAttachSelectFilters('#copy-filters select', '#copy-list .copy-block');</script>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 10. dr-form.html
// ══════════════════════════════════════════════════════════════════════════

function formFieldRows(fields) {
  return fields
    .map(
      (f) => `<tr>
      <td>${esc(f.name)}</td>
      <td class="${f.required ? 'req' : 'opt'}">${f.required ? 'Required' : 'Optional'}</td>
      <td>${esc(f.type)}</td>
    </tr>`,
    )
    .join('');
}

function formCard(form) {
  return `<article class="card">
    <h3>${esc(form.name)}</h3>
    <p>${esc(form.objective)}</p>
    <div class="table-wrap"><table class="data field-table">
      <thead><tr><th>Field</th><th>Required?</th><th>Type / notes</th></tr></thead>
      <tbody>${formFieldRows(form.fields)}</tbody>
    </table></div>
  </article>`;
}

write(
  'dr-form.html',
  pageShell({
    activeId: 'dr-form',
    title: 'Low-Friction Form',
    subtitle: 'Lead volume first — enough data for follow-up. Legal approval required before publish.',
    body: `
    <div class="badge-row">
      <span class="badge badge--warn">Legal / compliance approval required</span>
      <span class="badge badge--danger">No SMS verification · No work-email gate</span>
    </div>
    <header class="hero">
      <h1>Instant Form specs</h1>
      <p>Form A is the default launch form for maximum volume. Form B adds light qualification for role-specific concepts.</p>
    </header>
    <p class="banner banner--warn">${esc(FORMS.complianceNote)}</p>
    <section class="section">
      <h2>Rules</h2>
      <ul class="clean">${FORMS.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      <p class="lede">Privacy policy URL: <code>${esc(DR_META.privacyPolicyUrl)}</code></p>
    </section>
    <section class="section">
      <h2>Forms</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr));">
        ${formCard(FORMS.formA)}
        ${formCard(FORMS.formB)}
      </div>
      <h3>Staffing-need options (Form B, optional field)</h3>
      <ul class="clean">${FORMS.staffingNeedOptions.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
    </section>
    <section class="section">
      <h2>Form intro copy — English</h2>
      <div class="grid">
        ${FORMS.introVariations
          .map(
            (v) => `<div class="card"><div class="meta">${esc(v.id)}</div><h3>${esc(v.headline)}</h3><p>${esc(v.body)}</p></div>`,
          )
          .join('')}
      </div>
      <h3>Form intro copy — Spanish</h3>
      <div class="grid">
        ${FORMS.introEs
          .map(
            (v) => `<div class="card"><div class="meta">${esc(v.id)}</div><h3>${esc(v.headline)}</h3><p>${esc(v.body)}</p></div>`,
          )
          .join('')}
      </div>
    </section>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 11. dr-offers.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-offers.html',
  pageShell({
    activeId: 'dr-offers',
    title: 'Completion & Offers',
    subtitle: 'Completion screens must keep selling. Every offer concept is pending leadership approval.',
    body: `
    <header class="hero">
      <h1>Completion screens &amp; offer concepts</h1>
      <p>Do not end on a generic thank-you. Do not present an unapproved offer as currently available.</p>
    </header>
    <section class="section">
      <h2>Completion screen concepts</h2>
      <div class="grid">
        ${COMPLETION_SCREENS.map(
          (s) => `
          <div class="card">
            <div class="meta">${esc(s.label)}</div>
            <h3>${esc(s.headline)}</h3>
            <p>${esc(s.body)}</p>
            <ul class="clean">${s.nextStepBullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
            <p><strong>CTA:</strong> ${esc(s.cta)} → <code>${esc(s.ctaUrl)}</code></p>
            ${s.notes ? `<p class="lede">${esc(s.notes)}</p>` : ''}
          </div>`,
        ).join('')}
      </div>
    </section>
    <section class="section">
      <h2>Offer concepts — approval required</h2>
      <p class="banner banner--danger"><strong>Do not publish until approved by MedVirtual leadership.</strong> Every concept below is labeled pending.</p>
      <div class="grid">
        ${OFFER_CONCEPTS.map(
          (o) => `
          <div class="card">
            <div class="approval-stamp">Pending leadership approval — do not publish</div>
            <h3>${esc(o.name)}</h3>
            <p>${esc(o.description)}</p>
          </div>`,
        ).join('')}
      </div>
    </section>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 12. dr-campaign-plan.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-campaign-plan.html',
  pageShell({
    activeId: 'dr-campaign',
    title: 'Campaign Test Structure',
    subtitle: 'Controlled testing — do not launch everything at once.',
    body: `
    <p class="banner banner--danger"><strong>Spend warning:</strong> ${esc(CAMPAIGN_PLAN.warning)}</p>
    <header class="hero">
      <h1>${esc(CAMPAIGN_PLAN.campaign)}</h1>
      <p>Objective: ${esc(CAMPAIGN_PLAN.objective)}</p>
    </header>
    <section class="section">
      <h2>Ad sets</h2>
      <div class="grid">
        ${CAMPAIGN_PLAN.adSets
          .map(
            (a) => `
          <div class="card">
            <h3>${esc(a.name)}</h3>
            <p>${esc(a.structure)}</p>
            <ul class="clean">${a.creatives.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
          </div>`,
          )
          .join('')}
      </div>
    </section>
    <section class="section">
      <h2>Controls</h2>
      <ul class="clean">${CAMPAIGN_PLAN.controls.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    </section>
    <p><a href="/dr-qa-checklist.html">Open launch QA checklist →</a></p>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 13. dr-qa-checklist.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-qa-checklist.html',
  pageShell({
    activeId: 'dr-qa',
    title: 'Launch QA',
    subtitle: 'Pre-launch verification. Checkboxes are local-only (not synced to a server).',
    body: `
    <header class="hero">
      <h1>Pre-launch QA</h1>
      <p>Complete before aggressive spend. Pair with end-to-end form → CRM → notification testing.</p>
    </header>
    <p class="qa-progress__label" id="qa-progress-label">0 of ${QA_CHECKLIST.length} checked</p>
    <div class="qa-progress"><div class="qa-progress__bar" id="qa-progress-bar"></div></div>
    <ul class="check-list" id="qa-list">
      ${QA_CHECKLIST.map(
        (item, i) => `
        <li id="qa-item-${i}">
          <input type="checkbox" id="qa-${i}" />
          <label for="qa-${i}">${esc(item)}</label>
        </li>`,
      ).join('')}
    </ul>`,
    extraScript: `<script>
(function(){
  var key = 'mv-dr-qa-v2';
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
  var inputs = document.querySelectorAll('#qa-list input');
  var total = inputs.length;
  var bar = document.getElementById('qa-progress-bar');
  var label = document.getElementById('qa-progress-label');
  function refresh() {
    var checked = 0;
    inputs.forEach(function (input) {
      var li = document.getElementById('qa-item-' + input.id.split('-')[1]);
      if (input.checked) { checked += 1; li.classList.add('is-done'); }
      else { li.classList.remove('is-done'); }
    });
    bar.style.width = (total ? (checked / total) * 100 : 0) + '%';
    label.textContent = checked + ' of ' + total + ' checked';
  }
  inputs.forEach(function (input) {
    input.checked = !!saved[input.id];
    input.addEventListener('change', function () {
      saved[input.id] = input.checked;
      localStorage.setItem(key, JSON.stringify(saved));
      refresh();
    });
  });
  refresh();
})();
</script>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 14. dr-claims.html
// ══════════════════════════════════════════════════════════════════════════

function claimUsage(claimId) {
  return CREATIVE_CONCEPTS.filter((c) => c.claimIds.includes(claimId)).map((c) => c.number);
}

const CLAIM_CATEGORIES = [...new Set(CLAIMS.map((c) => c.category))];

write(
  'dr-claims.html',
  pageShell({
    activeId: 'dr-claims',
    title: 'Claims Tracker',
    subtitle: 'Every pricing, compliance, and offer claim with current status and where it appears.',
    body: `
    <header class="hero">
      <h1>Claims tracker</h1>
      <p>No claim ships until it reaches <strong>Confirmed</strong> or <strong>Approved for launch</strong>. Everything else is a hard stop for publish.</p>
    </header>
    <div class="filters" id="claims-filters">
      <label for="claims-category">Category</label>
      <select id="claims-category" data-key="category">
        <option value="">All categories</option>
        ${CLAIM_CATEGORIES.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}
      </select>
      <label for="claims-status">Status</label>
      <select id="claims-status" data-key="status">
        <option value="">All statuses</option>
        ${CLAIM_STATUSES.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('')}
      </select>
    </div>
    <div class="table-wrap"><table class="data" id="claims-table">
      <thead><tr><th>Label</th><th>Claim text</th><th>Category</th><th>Status</th><th>Used on</th><th>Notes</th></tr></thead>
      <tbody>
        ${CLAIMS.map(
          (c) => `<tr data-category="${esc(c.category)}" data-status="${esc(c.status)}">
          <td>${esc(c.label)}</td>
          <td>${esc(c.claimText)}</td>
          <td>${esc(c.category)}</td>
          <td><span class="chip ${claimStatusClass(c.status)}">${esc(c.status)}</span></td>
          <td>${esc(claimUsage(c.id).join(', ') || '—')}</td>
          <td>${esc(c.notes)}</td>
        </tr>`,
        ).join('')}
      </tbody>
    </table></div>`,
    extraScript: `<script>mvAttachSelectFilters('#claims-filters select', '#claims-table tbody tr');</script>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 15. dr-production-queue.html
// ══════════════════════════════════════════════════════════════════════════

const priorityNumbers = new Set(getPriorityQueue().map((c) => c.number));
const sortedQueue = CREATIVE_CONCEPTS.slice().sort((a, b) => a.priority - b.priority);

function queueRow(c) {
  const isPriority = priorityNumbers.has(c.number);
  return `<tr class="${isPriority ? 'is-priority' : ''}" data-group="${esc(c.group)}" data-lang="${esc(c.language)}" data-status="${esc(c.status)}" data-color="${esc(c.colorFamilyId)}">
    <td>${esc(c.priority)}</td>
    <td>${esc(c.number)}${isPriority ? ' <span class="chip chip--cyan">Top 12</span>' : ''}</td>
    <td>${esc(c.workingName)}</td>
    <td>${esc(c.headline)}</td>
    <td>${esc(c.groupLabel)}</td>
    <td><code>${esc(c.colorFamilyId)}</code></td>
    <td>${esc(c.formats.join(', '))}</td>
    <td>${esc(c.formId)}</td>
    <td><span class="chip ${productionStatusClass(c.status)}">${esc(c.status)}</span></td>
  </tr>`;
}

write(
  'dr-production-queue.html',
  pageShell({
    activeId: 'dr-queue',
    title: 'Production Queue',
    subtitle: `${CREATIVE_CONCEPTS.length} concepts sorted by priority — top 12 highlighted.`,
    body: `
    <header class="hero">
      <h1>Production queue</h1>
      <p>Statuses: ${esc(PRODUCTION_STATUSES.join(' · '))}</p>
    </header>
    <p class="banner"><strong>First launch priority:</strong> A01 Electric Lime · A02 Signal Yellow · A03 Cobalt Blue · D01 Spanish core.</p>
    <div class="filters" id="queue-filters">
      <label for="queue-group">Group</label>
      <select id="queue-group" data-key="group">
        <option value="">All groups</option>
        ${Object.entries(GROUP_LABELS).map(([g, label]) => `<option value="${esc(g)}">${esc(label)}</option>`).join('')}
      </select>
      <label for="queue-status">Status</label>
      <select id="queue-status" data-key="status">
        <option value="">All statuses</option>
        ${PRODUCTION_STATUSES.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('')}
      </select>
      <label for="queue-lang">Language</label>
      <select id="queue-lang" data-key="lang">
        <option value="">All languages</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="bilingual">Bilingual</option>
      </select>
    </div>
    <div class="table-wrap"><table class="data" id="queue-table">
      <thead><tr>
        <th>Priority</th><th>#</th><th>Name</th><th>Headline</th><th>Group</th><th>Color</th><th>Formats</th><th>Form</th><th>Status</th>
      </tr></thead>
      <tbody>${sortedQueue.map(queueRow).join('')}</tbody>
    </table></div>
    <section class="section">
      <h2>Top 12 — full copy packs</h2>
      ${getPriorityQueue().map(copyPackBlock).join('')}
    </section>`,
    extraScript: `<script>mvAttachSelectFilters('#queue-filters select', '#queue-table tbody tr');</script>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 16. dr-superseded.html
// ══════════════════════════════════════════════════════════════════════════

write(
  'dr-superseded.html',
  pageShell({
    activeId: 'dr-superseded',
    title: 'Superseded Direction',
    subtitle: 'Archived — not deleted. Direct Response is the current Meta priority.',
    body: `
    <div class="badge-row">
      <span class="badge badge--muted">Superseded direction</span>
      <span class="badge badge--current">DR is current direction</span>
    </div>
    <header class="hero">
      <h1>What changed after the campaign review</h1>
      <p>${esc(SUPERSEDED.summary)}</p>
    </header>
    <ul class="clean">${SUPERSEDED.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    <section class="section">
      <h2>Still available for reference</h2>
      <div class="grid">
        <a class="card" href="/saas-prop-templates.html"><h3>SaaS Prop templates</h3><p>No-people glass/3D — archived as primary Meta DR, kept under Producer Lab.</p></a>
        <a class="card" href="/role-offer-templates.html"><h3>Role-Offer</h3><p>People lane remains a valid system for hire/meet layouts.</p></a>
        <a class="card" href="/real-people-creative.html"><h3>Real People</h3><p>Named Talent Pool boards remain valid for warmer funnel creative.</p></a>
        <a class="card" href="/medvirtual-brand-guide.html"><h3>Brand Guide</h3><p>Brand reference still matters for site/off-Meta; DR may deviate on ad plates.</p></a>
      </div>
    </section>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// 17. dr-approval.html
// ══════════════════════════════════════════════════════════════════════════

const pendingClaims = CLAIMS.filter((c) => c.status !== 'Confirmed' && c.status !== 'Approved for launch');

write(
  'dr-approval.html',
  pageShell({
    activeId: 'dr-approval',
    title: 'Final Approval',
    subtitle: 'Priority concepts and every claim still pending before launch.',
    body: `
    <header class="hero">
      <h1>Final approval board</h1>
      <p>Nothing ships with an unapproved offer, unapproved price/HIPAA badge, or invented placement speed. Track concept status and outstanding claims here.</p>
    </header>
    <section class="section">
      <h2>Claims still pending approval</h2>
      <div class="grid">
        ${pendingClaims.map(
          (c) => `
          <div class="card">
            <div class="approval-stamp">${esc(c.status)}</div>
            <h3>${esc(c.label)}</h3>
            <p>${esc(c.claimText)}</p>
            <p class="lede">${esc(c.notes)}</p>
          </div>`,
        ).join('')}
        <div class="card"><div class="approval-stamp">Approval required</div><h3>Instant Form legal/compliance copy</h3><p>Consent language and publish permission before going live.</p></div>
      </div>
    </section>
    <section class="section">
      <h2>Priority concept tracker (top 12)</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>#</th><th>Concept</th><th>Status</th><th>Claims</th><th>Notes</th></tr></thead>
        <tbody>
          ${getPriorityQueue()
            .map(
              (c) => `<tr>
              <td>${esc(c.number)}</td>
              <td>${esc(c.workingName)}</td>
              <td><span class="chip ${productionStatusClass(c.status)}">${esc(c.status)}</span></td>
              <td>${getClaimsForConcept(c).map((cl) => `<span class="chip ${claimStatusClass(cl.status)}">${esc(cl.label)}</span>`).join(' ') || '—'}</td>
              <td>${esc(c.approvalNotes || '—')}</td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table></div>
    </section>
    <details class="collapse">
      <summary>Full concept tracker (all ${CREATIVE_CONCEPTS.length})</summary>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>#</th><th>Concept</th><th>Group</th><th>Status</th><th>Notes</th></tr></thead>
        <tbody>
          ${sortedQueue
            .map(
              (c) => `<tr>
              <td>${esc(c.number)}</td>
              <td>${esc(c.workingName)}</td>
              <td>${esc(c.groupLabel)}</td>
              <td><span class="chip ${productionStatusClass(c.status)}">${esc(c.status)}</span></td>
              <td>${esc(c.approvalNotes || '—')}</td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table></div>
    </details>
    <p class="banner">Recommended first launch set: <strong>DR-01 · DR-02 · DR-03 · DR-19 (Spanish)</strong> into Broad + Lookalike ad sets after QA passes.</p>`,
  }),
);

// ══════════════════════════════════════════════════════════════════════════
// Redirects — old routes that must keep working
// ══════════════════════════════════════════════════════════════════════════

writeRedirect('dr-creative-board.html', '/dr-concepts-en.html', 'English Concepts');
writeRedirect('dr-copy-en.html', '/dr-copy-matrix.html', 'Meta Copy Matrix');
writeRedirect('dr-copy-es.html', '/dr-concepts-es.html', 'Spanish & Bilingual');

console.log(`Direct Response boards written (${writtenCount} files).`);
