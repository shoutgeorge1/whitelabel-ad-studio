/**
 * AI Asset Foundry is retired — redirect to New Ad Ideas.
 * npm run generate:foundry
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TO = '/ideas.html';

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

fs.writeFileSync(path.join(ROOT, 'ai-asset-foundry.html'), html);
console.log('ai-asset-foundry.html → redirect to ideas.html');
