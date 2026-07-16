/**
 * Motion Concept Lab — Vite MPA entry with VMA site header.
 * Four Remotion compositions you can watch, tweak, and export stills from.
 *
 * Regenerate: npm run generate:motion-lab
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

await import('./generate-motion-concept-data.mjs');

const VIDEO_SUBNAV = [
  { href: '/motion-concept-lab.html', label: 'Motion Lab' },
  { href: '/vma-video.html', label: 'Specs & handoff' },
];

const css = `
  ${HEADER_CSS}
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Motion Concept Lab · MedVirtual</title>
  <style>${css}
    body {
      margin: 0;
      font-family: ${BRAND.fonts.family};
      color: ${BRAND.colors.ink};
      background:
        radial-gradient(ellipse 70% 40% at 0% 0%, rgba(7,121,153,0.14), transparent 55%),
        #eef3f7;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js"></script>
</head>
<body class="mcl-shell-body">
  ${renderDocHeader({
    activeId: 'vma-video',
    pageTitle: 'Motion Concept Lab',
    pageSubtitle: 'Build elements first. Then watch Type-on Hook + Slide Build in-browser and approve what works.',
    subnav: VIDEO_SUBNAV,
    activeSubHref: '/motion-concept-lab.html',
  })}
  <div id="motion-lab-root"></div>
  <script type="module" src="/src/motion-lab-entry.jsx"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'motion-concept-lab.html'), html);
console.log('Motion Concept Lab written → motion-concept-lab.html');
