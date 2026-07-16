/**
 * Retired — template board → Approved Creative.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const TO = '/vma-approved.html';

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

fs.writeFileSync(path.join(PUBLIC, 'template-test-board.html'), html);
console.log('template-test-board.html → redirect to vma-approved.html');
