/**
 * Legacy /facebook-ad-copy.html → redirect to Creative Brief (single handoff).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const ROOT = path.join(__dirname, '..');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=/graphic-request-brief.html" />
  <link rel="canonical" href="/graphic-request-brief.html" />
  <title>Moved — Creative Brief</title>
  <style>
    body { font-family: var(--mv-font); background: #f1f5f9; color: #0f172a;
      display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
    a { color: var(--mv-primary); font-weight: 700; }
    p { max-width: 36ch; line-height: 1.45; }
  </style>
</head>
<body>
  <p>Ad Copy lives on the <a href="/graphic-request-brief.html">Creative Brief</a> now.</p>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'facebook-ad-copy.html'), html);
fs.writeFileSync(
  path.join(ROOT, 'facebook-ad-copy.md'),
  `# Ad Copy → Creative Brief

Ad Copy is merged into the Creative Brief (art + Meta package on one page).

https://medvirtual-ad-content-doc.vercel.app/graphic-request-brief.html
`,
);
console.log('facebook-ad-copy.html → redirect to graphic-request-brief.html');
