/**
 * Graphics Component Kit — interactive page for Philippines resize team.
 * Each piece visible, clickable, inspectable before download.
 *
 * Run via: npm run generate:vma
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { buildGraphicsKitPayload } from './graphics-kit-data.mjs';
import { GRAPHICS_BUILD_ORDER } from './vma-approved-masters.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'graphics-kit.html');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderGraphicsKit() {
  const data = buildGraphicsKitPayload();
  const dataJson = JSON.stringify(data).replace(/</g, '\\u003c');

  const body = `
    <div class="hero kit-hero">
      <h1>Component Library</h1>
      <p><b>Production handoff — not an editor.</b> ${esc(data.winningNote || '')}</p>
      <p class="lede">Inspect · open · download every piece. Copy text and hex colors. Layout mock = <strong>composition reference only</strong> — rebuild in Photoshop / Illustrator / Figma / CapCut / AE.</p>
      <div class="kit-alert kit-alert--win">✅ Winner: <b>VMA-04 HIPAA Green</b> — not VMA-01 Spanish Green. ${esc(data.activeRequestNote || '')}</div>
      <div class="kit-alert">⛔ Paused: VMA-02 Cobalt · VMA-03 Signal Yellow — do not start new work</div>
      <div class="kit-quickstart">
        <strong>Jump to your job:</strong>
        <div class="kit-quickstart__links" id="quickstartLinks"></div>
      </div>
      <details class="kit-assets" open>
        <summary>Shared files — open or right-click save (no hunting)</summary>
        <ul class="kit-assets__list" id="sharedAssetList"></ul>
      </details>
      <div class="kit-order">Active: <b>VMA-04</b>${GRAPHICS_BUILD_ORDER.length > 1 ? ' → ' + GRAPHICS_BUILD_ORDER.slice(1).map((n) => 'VMA-' + n).join(' → ') : ''} · Variation when briefed: VMA-01 · Start <b>4:5</b></div>
    </div>

    <section class="kit-prod" id="kit-deliverables">
      <h2>Production deliverables</h2>
      <div class="kit-prod__grid" id="deliverablesPanel"></div>
    </section>

    <div class="kit-toolbar">
      <label>Master
        <select id="masterSelect"></select>
      </label>
      <label>Target size
        <select id="ratioSelect"></select>
      </label>
    </div>

    <div id="kitWorkspace"></div>

    <div id="inspectModal" class="inspect-modal" hidden>
      <div class="inspect-modal__backdrop" data-close></div>
      <div class="inspect-modal__panel" role="dialog" aria-modal="true">
        <button type="button" class="inspect-modal__close" data-close aria-label="Close">×</button>
        <h2 id="inspectTitle"></h2>
        <p id="inspectHint" class="inspect-hint"></p>
        <div id="inspectPreview" class="inspect-preview"></div>
        <ul id="inspectSpecs" class="inspect-specs"></ul>
        <div id="inspectActions" class="inspect-actions"></div>
      </div>
    </div>

    <script type="application/json" id="kitData">${dataJson}</script>
    <script>
    (function () {
      const DATA = JSON.parse(document.getElementById('kitData').textContent);
      const workspace = document.getElementById('kitWorkspace');
      const masterSelect = document.getElementById('masterSelect');
      const ratioSelect = document.getElementById('ratioSelect');
      const modal = document.getElementById('inspectModal');

      DATA.masters.forEach((m) => {
        const opt = document.createElement('option');
        opt.value = m.number;
        opt.textContent = 'VMA-' + m.number + ' · ' + m.name;
        masterSelect.appendChild(opt);
      });
      DATA.ratios.forEach((r) => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = DATA.ratioMeta[r].label + ' · ' + DATA.ratioMeta[r].dims;
        ratioSelect.appendChild(opt);
      });
      masterSelect.value = DATA.buildOrder[0] || '04';
      ratioSelect.value = '4x5';

      const quickstart = document.getElementById('quickstartLinks');
      quickstart.innerHTML = DATA.buildOrder.map((n) =>
        '<a href="#' + n + '-4x5" class="kit-jump">VMA-' + n + ' · 4:5</a>'
      ).join('');

      const assetList = document.getElementById('sharedAssetList');
      const logos = (DATA.logoAssets || []);
      const shared = (DATA.sharedAssets || []);
      assetList.innerHTML = [...logos, ...shared.filter((a) => !logos.find((l) => l.href === a.href))]
        .map((a) => '<li><a href="' + a.href + '" target="_blank" rel="noopener">' + a.label + '</a></li>').join('');

      const delPanel = document.getElementById('deliverablesPanel');
      if (delPanel) {
        const staticHtml = (DATA.deliverablesStatic || []).map((d) =>
          '<div class="kit-del"><strong>' + d.ratio + '</strong><code>' + d.filename + '</code><span>' + d.dims + '</span></div>'
        ).join('');
        const motionHtml = (DATA.deliverablesMotion || []).map((d) =>
          '<div class="kit-del"><strong>' + d.label + '</strong><code>' + d.filename + '</code><span>' + d.dims + ' · ' + d.duration + '</span></div>'
        ).join('');
        delPanel.innerHTML = '<div><h3>Static PNGs</h3>' + staticHtml + '</div><div><h3>Motion MP4s</h3>' + motionHtml + '</div>';
      }

      function master() { return DATA.masters.find((m) => m.number === masterSelect.value); }
      function ratio() { return ratioSelect.value; }

      function benefitIcon() {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7"/></svg>';
      }

      function renderMock(m, r, meta) {
        const t = m.theme;
        const L = DATA.layouts[r];
        const rm = DATA.ratioMeta[r];
        if (!L) return '';
        const hl = m.headlineLines.map((line, i) =>
          '<div style="color:' + (i === 1 ? t.accent : t.ink) + '">' + line + '</div>'
        ).join('');
        const chips = m.components.find((c) => c.id === 'benefits');
        const items = chips ? chips.items : [];
        const chipHtml = items.map((item) =>
          '<div class="mock-chip" style="background:' + (t.chipBg || 'rgba(255,255,255,0.1)') + ';border-color:' + t.chipBorder + ';color:' + (t.chipInk || t.ink) + '">' + benefitIcon() + '<span>' + item + '</span></div>'
        ).join('');
        const price = m.components.find((c) => c.id === 'offer');
        const trust = m.components.find((c) => c.id === 'trust');
        const person = m.components.find((c) => c.id === 'person');
        const p = L.person;
        const personBox = Object.entries(p).map(([k,v]) => k + ':' + (typeof v === 'number' ? v + 'px' : v)).join(';');
        const personSrc = person ? person.src : '';
        return '<div class="mock-stage" style="width:' + rm.w + 'px;height:' + rm.h + 'px;background:' + t.bg + '">' +
          '<div class="mock-panel" style="background:' + t.panel + '"></div>' +
          (person ? '<img class="mock-person mock-person--transparent" src="' + personSrc + '" style="' + personBox + '" alt="Person layer (transparent)" />' : '') +
          '<img class="mock-logo" src="/assets/brand/medvirtual/logo-white.svg" style="left:' + L.logo.left + 'px;top:' + L.logo.top + 'px;height:' + L.logo.h + 'px" alt="" />' +
          '<div class="mock-headline" style="left:' + L.headline.left + 'px;top:' + L.headline.top + 'px;width:' + L.headline.width + 'px;font-size:' + L.headline.size + 'px;line-height:' + L.headline.lh + '">' + hl + '</div>' +
          '<div class="mock-sub" style="left:' + L.subhead.left + 'px;top:' + L.subhead.top + 'px;width:' + L.subhead.width + 'px;font-size:' + L.subhead.size + 'px;color:' + t.ink + '99">' + m.subhead + '</div>' +
          '<div class="mock-benefits" style="left:' + L.benefits.left + 'px;top:' + L.benefits.top + 'px;width:' + L.benefits.width + 'px;font-size:' + L.benefits.size + 'px;gap:' + L.benefits.gap + 'px">' + chipHtml + '</div>' +
          (price ? '<div class="mock-price" style="' + (L.price.right != null ? 'right:' + L.price.right + 'px' : 'left:' + L.price.left + 'px') + ';top:' + L.price.top + 'px;font-size:' + L.price.size + 'px;background:' + t.priceBg + ';color:' + (t.priceInk || '#fff') + '">' + price.text + '</div>' : '') +
          (trust ? '<div class="mock-trust" style="left:' + L.trust.left + 'px;top:' + L.trust.top + 'px;font-size:' + L.trust.size + 'px;border-color:' + t.accent + '">' + trust.text + '</div>' : '') +
        '</div>';
      }

      function componentTile(c) {
        let thumb = '';
        if (c.type === 'person') {
          thumb = '<div class="thumb-checker"><img src="' + c.src + '" alt="" loading="lazy" /></div>';
        } else if (c.type === 'scrub') {
          thumb = '<div class="thumb-scrub" style="background:' + c.scrubColor + '"><span>Scrub</span></div>';
        } else if (c.type === 'image') thumb = '<img src="' + c.src + '" alt="" loading="lazy" />';
        else if (c.type === 'colors') thumb = '<div class="swatch-row">' + c.swatches.map((s) => '<span style="background:' + s.hex + '" title="' + s.name + '"></span>').join('') + '</div>';
        else if (c.type === 'list') thumb = '<ul class="mini-list">' + c.items.slice(0, 2).map((i) => '<li>' + i + '</li>').join('') + '<li>…</li></ul>';
        else thumb = '<div class="mini-text">' + (c.lines ? c.lines.join(' ') : c.text || '') + '</div>';
        return '<button type="button" class="comp-tile" data-comp="' + c.id + '">' +
          '<div class="comp-tile__thumb">' + thumb + '</div>' +
          '<strong>' + c.label + '</strong>' +
          '<span>Click to inspect</span></button>';
      }

      function render() {
        const m = master();
        const r = ratio();
        const meta = DATA.ratioMeta[r];
        const fmt = m.formats[r];
        const square = m.formats['1x1'];
        const scaler = Math.min(1, (workspace.clientWidth - 40) / meta.w, 520 / meta.h);

        workspace.innerHTML =
          '<section class="kit-master" id="master-' + m.number + '">' +
            '<div class="kit-master__head"><h2>VMA-' + m.number + ' · ' + m.name + (m.isWinner ? ' <span class="tag tag-live">WINNING DIRECTION</span>' : '') + '</h2>' +
            '<p class="note">' + m.productionNote + '</p></div>' +

            '<div class="kit-square-ref">' +
              '<div><span class="tag tag-live">1:1 · LIVE ON META</span><h3>Approved square — your reference</h3>' +
              '<p>Match this energy. Open full size to see every detail.</p>' +
              '<button type="button" class="btn-link inspect-img" data-src="' + square.path + '">Inspect square master</button></div>' +
              '<button type="button" class="square-btn inspect-img" data-src="' + square.path + '">' +
              '<img src="' + square.path + '" alt="Approved 1:1" loading="lazy" /></button></div>' +

            '<div class="kit-job" id="' + m.number + '-' + r + '">' +
              '<div class="kit-job__head"><h3>Build: ' + meta.label + ' <span>' + meta.dims + '</span></h3>' +
              '<p>' + meta.layoutNote + '</p>' +
              '<p>Filename: <code>' + fmt.expectedFilename + '</code> · Status: <b>' + fmt.status + '</b></p></div>' +

              '<div class="kit-split">' +
                '<div class="kit-pieces"><h4>Pieces of the puzzle</h4><p class="note">Click any piece — inspect before you download.</p>' +
                  '<div class="comp-grid">' + m.components.map(componentTile).join('') + '</div></div>' +

                '<div class="kit-target"><h4>Layout mock (composition reference only)</h4>' +
                  '<p class="note">Rebuild in your production software — not a final export from this page.</p>' +
                  '<div class="mock-scaler" style="transform:scale(' + scaler + ');width:' + (meta.w * scaler) + 'px;height:' + (meta.h * scaler) + 'px">' +
                    renderMock(m, r, meta) + '</div>' +
                  '<h4 style="margin-top:1.25rem">AI draft reference</h4>' +
                  '<p class="note">Draft only — check spelling, hands, safe zones. You rebuild properly using components above.</p>' +
                  (fmt.path
                    ? '<button type="button" class="draft-btn inspect-img" data-src="' + fmt.path + '"><img src="' + fmt.path + '" alt="AI draft ' + meta.label + '" loading="lazy" /><span>Click to inspect draft</span></button>'
                    : '<div class="awaiting">Awaiting design — use components + mock to build this size.</div>') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</section>';

        workspace.querySelectorAll('.comp-tile').forEach((btn) => {
          btn.addEventListener('click', () => openComponent(m.components.find((c) => c.id === btn.getAttribute('data-comp'))));
        });
        workspace.querySelectorAll('.inspect-img').forEach((btn) => {
          btn.addEventListener('click', () => openImage(btn.getAttribute('data-src'), 'Full image'));
        });
        workspace.querySelectorAll('.kit-jump').forEach((a) => {
          a.addEventListener('click', (e) => {
            const id = a.getAttribute('href').replace('#', '');
            const parts = id.split('-');
            masterSelect.value = parts[0];
            ratioSelect.value = parts.slice(1).join('-');
            render();
            e.preventDefault();
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      }

      function openImage(src, title) {
        document.getElementById('inspectTitle').textContent = title;
        document.getElementById('inspectHint').textContent = 'Pinch-zoom on mobile · right-click save if you need the file';
        document.getElementById('inspectPreview').innerHTML = '<img src="' + src + '" alt="" />';
        document.getElementById('inspectSpecs').innerHTML = '';
        document.getElementById('inspectActions').innerHTML = '<a href="' + src + '" target="_blank" rel="noopener">Open in new tab</a>';
        modal.hidden = false;
      }

      function openComponent(c) {
        if (!c) return;
        document.getElementById('inspectTitle').textContent = c.label;
        document.getElementById('inspectHint').textContent = c.hint || '';
        const prev = document.getElementById('inspectPreview');
        const specs = document.getElementById('inspectSpecs');
        const actions = document.getElementById('inspectActions');
        specs.innerHTML = (c.specs || []).map((s) => '<li>' + s + '</li>').join('');
        if (c.type === 'person') {
          const optionsHtml = (c.options || []).length
            ? '<div class="inspect-options"><p><b>Person options</b> — default matches approved master; alternates for variations:</p><ul>' +
              c.options.map((o) => '<li><a href="' + o.href + '" target="_blank" rel="noopener">' + o.label + '</a></li>').join('') +
              '</ul></div>'
            : '';
          prev.innerHTML = '<div class="inspect-dual">' +
            '<div><small>Transparent PNG (use this)</small><div class="thumb-checker inspect-checker"><img src="' + c.src + '" alt="" /></div></div>' +
            '<div><small>Reference crop from live 1:1</small><img src="' + c.refSrc + '" alt="" /></div>' +
            '</div>' + optionsHtml;
          const optionLinks = (c.options || []).map((o) =>
            '<a href="' + o.href + '" target="_blank" rel="noopener">' + o.label + '</a>'
          ).join(' ');
          actions.innerHTML = '<a href="' + c.src + '" target="_blank" rel="noopener">Open default PNG</a> ' +
            '<a href="' + c.refSrc + '" target="_blank" rel="noopener">Open reference crop</a>' +
            (optionLinks ? ' ' + optionLinks : '');
        } else if (c.type === 'scrub') {
          prev.innerHTML = '<div class="swatch-grid"><div><span style="background:' + c.scrubColor + '"></span><strong>Scrub color</strong><code>' + c.scrubColor + '</code></div></div>' +
            '<p class="inspect-hint">Apply to the transparent person layer — hue/saturation or color overlay. Do not bake into a flat export unless final.</p>';
          actions.innerHTML = '';
        } else if (c.type === 'image') {
          prev.innerHTML = '<img src="' + c.src + '" alt="" />';
          actions.innerHTML = '<a href="' + c.src + '" target="_blank" rel="noopener">Open image in new tab</a>';
        } else if (c.type === 'colors') {
          prev.innerHTML = '<div class="swatch-grid">' + c.swatches.map((s) =>
            '<div><span style="background:' + s.hex + '"></span><strong>' + s.name + '</strong><code>' + s.hex + '</code></div>'
          ).join('') + '</div>';
          actions.innerHTML = '';
        } else if (c.type === 'list') {
          prev.innerHTML = '<ul class="inspect-list">' + c.items.map((i) => '<li>' + i + '</li>').join('') + '</ul>';
          actions.innerHTML = '<button type="button" class="copy-btn" data-copy="' + c.items.join('\\n') + '">Copy all lines</button>';
        } else if (c.lines) {
          prev.innerHTML = '<div class="inspect-lines">' + c.lines.map((l, i) =>
            '<div><small>Line ' + (i+1) + (i === c.accentLine ? ' (accent)' : '') + '</small><strong>' + l + '</strong></div>'
          ).join('') + '</div>';
          actions.innerHTML = '<button type="button" class="copy-btn" data-copy="' + c.lines.join('\\n') + '">Copy headline</button>';
        } else {
          prev.innerHTML = '<p class="inspect-text">' + (c.text || '') + '</p>';
          actions.innerHTML = '<button type="button" class="copy-btn" data-copy="' + (c.text || '') + '">Copy text</button>';
        }
        actions.querySelectorAll('.copy-btn').forEach((b) => {
          b.addEventListener('click', () => {
            navigator.clipboard.writeText(b.getAttribute('data-copy'));
            b.textContent = 'Copied!';
          });
        });
        modal.hidden = false;
      }

      modal.querySelectorAll('[data-close]').forEach((el) => {
        el.addEventListener('click', () => { modal.hidden = true; });
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.hidden = true; });

      masterSelect.addEventListener('change', render);
      ratioSelect.addEventListener('change', render);
      window.addEventListener('resize', render);
      const hash = location.hash.replace('#', '');
      if (hash) {
        const parts = hash.split('-');
        const num = parts[0];
        const rat = parts.slice(1).join('-');
        if (DATA.masters.find((x) => x.number === num)) masterSelect.value = num;
        if (DATA.ratioMeta[rat]) ratioSelect.value = rat;
      }
      render();
    })();
    </script>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Graphics Component Kit · MedVirtual</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    ${HEADER_CSS}
    main { max-width: 1180px; margin: 0 auto; padding: 1.25rem 1.25rem 4rem; font-family: "Be Vietnam Pro", system-ui, sans-serif; color: #0B1F3A; }
    .kit-hero { margin-bottom: 1rem; }
    .kit-hero h1 { margin: 0 0 0.5rem; font-size: 1.75rem; }
    .kit-alert { margin: 0.65rem 0; padding: 0.55rem 0.85rem; background: #FFF4E5; border: 1px solid #E8C99A; border-radius: 8px; font-weight: 700; font-size: 0.88rem; color: #6B4E16; }
    .kit-alert--win { background: #E8F8EC; border-color: #7BCF8E; color: #1A5C2E; font-weight: 600; }
    .inspect-options { margin-top: 0.85rem; font-size: 0.88rem; }
    .inspect-options ul { margin: 0.35rem 0 0; padding-left: 1.1rem; }
    .kit-prod { margin: 1rem 0; padding: 1rem; background: #fff; border: 1px solid #D6E4EC; border-radius: 12px; }
    .kit-prod h2 { margin: 0 0 0.75rem; font-size: 1.1rem; }
    .kit-prod__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
    .kit-del { display: grid; gap: 0.2rem; padding: 0.5rem 0; border-bottom: 1px solid #EEF3F7; font-size: 0.85rem; }
    .kit-del code { font-size: 0.78rem; }
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 0.75rem;
      margin: 0.85rem 0; padding: 0.75rem 1rem; background: #F0F5FF; border: 1px solid #D6E4EC; border-radius: 10px;
    }
    .kit-quickstart strong { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; color: #077999; }
    .kit-quickstart__links { display: flex; flex-wrap: wrap; gap: 0.45rem; }
    .kit-jump {
      display: inline-block; padding: 0.4rem 0.75rem; border-radius: 8px; background: #B8F000; color: #0B1F3A;
      font-weight: 800; font-size: 0.82rem; text-decoration: none;
    }
    .kit-jump:hover { filter: brightness(1.05); }
    .kit-assets { margin: 0.75rem 0; background: #fff; border: 1px solid #D6E4EC; border-radius: 10px; padding: 0.65rem 1rem; }
    .kit-assets summary { cursor: pointer; font-weight: 800; color: #0B1F3A; }
    .kit-assets__list { margin: 0.5rem 0 0; padding-left: 1.1rem; color: #4A6275; font-size: 0.9rem; }
    .kit-assets__list a { color: #077999; font-weight: 700; }
    .kit-order { margin-top: 0.75rem; font-size: 0.92rem; color: #4A6275; }
    .kit-toolbar { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .kit-toolbar label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #4A6275; }
    .kit-toolbar select { display: block; margin-top: 0.25rem; font: inherit; padding: 0.45rem 0.6rem; border-radius: 8px; border: 1px solid #D6E4EC; min-width: 200px; }
    .kit-master__head h2 { margin: 0 0 0.35rem; }
    .kit-square-ref {
      display: grid; grid-template-columns: 1fr 200px; gap: 1rem; align-items: center;
      background: #fff; border: 1px solid #D6E4EC; border-left: 4px solid #22C55E; border-radius: 12px;
      padding: 1rem 1.15rem; margin-bottom: 1.25rem;
    }
    .tag { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 999px; }
    .tag-live { background: #dcfce7; color: #166534; }
    .square-btn { border: none; padding: 0; background: none; cursor: zoom-in; border-radius: 8px; overflow: hidden; }
    .square-btn img { width: 200px; height: 200px; object-fit: cover; display: block; }
    .btn-link { font: inherit; font-weight: 700; color: #077999; background: none; border: none; cursor: pointer; padding: 0; text-decoration: underline; }
    .kit-job { background: #fff; border: 1px solid #D6E4EC; border-radius: 14px; padding: 1.15rem; }
    .kit-job__head h3 { margin: 0 0 0.35rem; }
    .kit-job__head h3 span { color: #077999; font-weight: 700; }
    .kit-split { display: grid; grid-template-columns: 300px 1fr; gap: 1.25rem; margin-top: 1rem; }
    @media (max-width: 900px) { .kit-split { grid-template-columns: 1fr; } .kit-square-ref { grid-template-columns: 1fr; } }
    .comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; }
    .comp-tile {
      text-align: left; font: inherit; cursor: pointer; background: #F4F8FB; border: 1px solid #D6E4EC;
      border-radius: 10px; padding: 0.55rem; transition: border-color 0.15s, box-shadow 0.15s;
    }
    .comp-tile:hover { border-color: #077999; box-shadow: 0 4px 14px rgba(7,121,153,0.12); }
    .comp-tile strong { display: block; font-size: 0.82rem; margin-top: 0.35rem; }
    .comp-tile span { font-size: 0.7rem; color: #6a7682; }
    .comp-tile__thumb { height: 72px; overflow: hidden; border-radius: 6px; background: #0B1F3A; display: flex; align-items: center; justify-content: center; }
    .comp-tile__thumb img { max-height: 100%; max-width: 100%; object-fit: contain; }
    .mini-list { margin: 0; padding-left: 1rem; font-size: 0.68rem; color: #fff; }
    .mini-text { font-size: 0.65rem; font-weight: 800; color: #fff; text-transform: uppercase; padding: 0.25rem; line-height: 1.2; }
    .swatch-row { display: flex; gap: 4px; }
    .swatch-row span { width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); }
    .mock-scaler { transform-origin: top left; overflow: hidden; margin-bottom: 0.5rem; }
    .mock-stage { position: relative; overflow: hidden; font-family: "Be Vietnam Pro", sans-serif; transform-origin: top left; }
    .mock-panel { position: absolute; inset: 0; opacity: 0.9; }
    .mock-person { position: absolute; object-fit: contain; object-position: bottom center; }
    .mock-person--transparent { background: repeating-conic-gradient(#D6E4EC 0% 25%, #fff 0% 50%) 50% / 12px 12px; }
    .thumb-checker { background: repeating-conic-gradient(#D6E4EC 0% 25%, #fff 0% 50%) 50% / 10px 10px; border-radius: 8px; overflow: hidden; min-height: 72px; display: flex; align-items: flex-end; justify-content: center; }
    .thumb-checker img { max-width: 100%; max-height: 88px; object-fit: contain; }
    .thumb-scrub { border-radius: 8px; min-height: 72px; display: flex; align-items: center; justify-content: center; color: #0B1F3A; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .inspect-dual { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left; }
    .inspect-dual small { color: #6a7682; display: block; margin-bottom: 0.35rem; font-size: 0.78rem; }
    .inspect-checker img { max-height: 42vh; }
    .inspect-dual img { max-width: 100%; border-radius: 8px; }
    .mock-logo { position: absolute; }
    .mock-headline { position: absolute; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; }
    .mock-sub { position: absolute; font-weight: 600; }
    .mock-benefits { position: absolute; display: flex; flex-direction: column; }
    .mock-chip { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; border: 1px solid; font-weight: 700; }
    .mock-price { position: absolute; font-weight: 900; padding: 12px 20px; border-radius: 12px; }
    .mock-trust { position: absolute; font-weight: 800; padding: 8px 14px; border-radius: 999px; border: 2px solid; background: rgba(0,0,0,0.35); color: #fff; }
    .draft-btn { display: block; width: 100%; max-width: 360px; border: none; padding: 0; background: none; cursor: zoom-in; position: relative; border-radius: 10px; overflow: hidden; }
    .draft-btn img { width: 100%; display: block; }
    .draft-btn span { position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 6px; }
    .awaiting { padding: 2rem; background: #F4F8FB; border: 2px dashed #D6E4EC; border-radius: 10px; color: #6a7682; text-align: center; }
    .inspect-modal[hidden] { display: none; }
    .inspect-modal { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .inspect-modal__backdrop { position: absolute; inset: 0; background: rgba(6,16,28,0.82); }
    .inspect-modal__panel {
      position: relative; background: #fff; border-radius: 14px; max-width: min(920px, 96vw); max-height: 90vh;
      overflow: auto; padding: 1.25rem 1.35rem; box-shadow: 0 24px 60px rgba(0,0,0,0.35);
    }
    .inspect-modal__close { position: absolute; top: 0.5rem; right: 0.65rem; border: none; background: none; font-size: 1.75rem; cursor: pointer; color: #4A6275; line-height: 1; }
    .inspect-preview { margin: 0.75rem 0; text-align: center; }
    .inspect-preview img { max-width: 100%; max-height: 55vh; object-fit: contain; border-radius: 8px; background: #0B1F3A; }
    .inspect-hint { color: #6a7682; font-size: 0.88rem; margin: 0; }
    .inspect-specs { color: #4A6275; font-size: 0.85rem; }
    .inspect-lines div { margin-bottom: 0.65rem; }
    .inspect-lines small { color: #6a7682; display: block; }
    .inspect-lines strong { font-size: 1.35rem; display: block; }
    .inspect-list { font-size: 1rem; line-height: 1.6; }
    .inspect-text { font-size: 1.1rem; font-weight: 700; }
    .swatch-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem; }
    .swatch-grid div { text-align: center; }
    .swatch-grid span { display: block; height: 64px; border-radius: 10px; margin-bottom: 0.35rem; border: 1px solid #D6E4EC; }
    .inspect-actions a, .copy-btn { font: inherit; font-weight: 800; color: #077999; background: #F0F5FF; border: 1px solid #D6E4EC; padding: 0.5rem 0.85rem; border-radius: 8px; cursor: pointer; text-decoration: none; display: inline-block; }
    .note { color: #6a7682; font-size: 0.88rem; }
    code { font-size: 0.85em; background: #F4F8FB; padding: 0.1rem 0.35rem; border-radius: 4px; }
  </style>
</head>
<body>
  ${renderDocHeader({ activeId: 'graphics-kit', pageTitle: 'Component Library', pageSubtitle: 'VMA-04 green person · download components · composition reference — not an editor.' })}
  <main>${body}</main>
</body>
</html>`;
}

export function writeGraphicsKit() {
  fs.writeFileSync(OUT, renderGraphicsKit());
  console.log('Graphics Component Kit written → public/graphics-kit.html');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeGraphicsKit();
}
