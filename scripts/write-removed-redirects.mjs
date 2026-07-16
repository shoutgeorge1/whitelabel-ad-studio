import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

const gone = [
  'real-people-creative.html',
  'real-people-assets.html',
  'meta-launch-1.html',
  'meta-launch-2.html',
  'meta-launch-build-pack.html',
  'saas-prop-templates.html',
  'role-offer-templates.html',
];

function html(to = '/studio.html') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${to}" />
  <title>Moved · MedVirtual</title>
  <link rel="canonical" href="${to}" />
</head>
<body style="font-family:system-ui;background:#0a0a0a;color:#fff;padding:2rem">
  <p>This page was removed from the active MedVirtual ad production site (July 2026). <a href="${to}" style="color:#B8F000">Go to Dashboard</a>.</p>
  <p style="color:#a3a3a3;font-size:0.9rem">Previous portrait-profile and SaaS-first directions were removed following the July 2026 campaign review.</p>
</body>
</html>`;
}

for (const f of gone) {
  fs.writeFileSync(path.join(PUBLIC, f), html('/studio.html'));
}
console.log('Wrote', gone.length, 'removed-page redirects → /studio.html');
