/**
 * Retired — old Creative Handoff page. Redirect only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TO = '/studio.html';
const FILE = process.argv[2] || 'asset-hub.html';
const DIR = process.argv[3] === 'root' ? ROOT : path.join(ROOT, 'public');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${TO}" />
  <link rel="canonical" href="${TO}" />
  <title>Redirecting…</title>
</head>
<body>
  <p>Moved to <a href="${TO}">${TO}</a>.</p>
</body>
</html>`;

fs.writeFileSync(path.join(DIR, FILE), html);
console.log(`${FILE} → redirect to ${TO} (old Creative Handoff retired)`);
