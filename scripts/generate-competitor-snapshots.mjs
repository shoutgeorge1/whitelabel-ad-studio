/**
 * Build Facebook-style reference frames from public competitor creative.
 * These are visual sparks for designers — always pair with Ad Library links for live Meta ads.
 * npm run generate:competitor-snaps
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'assets', 'competitors');
fs.mkdirSync(OUT, { recursive: true });

/** Public marketing / LP imagery (not claimed as live Ads Manager creative) */
const SOURCES = [
  {
    id: 'hello-rache',
    name: 'Hello Rache',
    hook: 'Get the help your practice needs.',
    local: path.join(OUT, 'hello-rache-landing.jpg'),
    url: null,
  },
  {
    id: 'weave',
    name: 'Weave',
    hook: 'Never miss another call.',
    url: 'https://www.getweave.com/wp-content/uploads/2023/08/weave-og-image.png',
  },
  {
    id: 'nexhealth',
    name: 'NexHealth',
    hook: 'Patient experience, reimagined.',
    url: 'https://www.nexhealth.com/favicon.ico',
  },
  {
    id: 'zocdoc',
    name: 'Zocdoc',
    hook: 'Book. See. Feel better.',
    url: 'https://www.zocdoc.com/static/images/og-image.png',
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MedVirtualHandoff/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function makeFrame({ id, name, hook, imageBuf }) {
  const W = 1080;
  const H = 1350;
  const chrome = 88;
  const footer = 120;

  let photo;
  try {
    photo = await sharp(imageBuf)
      .resize(W, H - chrome - footer, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 86 })
      .toBuffer();
  } catch {
    photo = await sharp({
      create: {
        width: W,
        height: H - chrome - footer,
        channels: 3,
        background: { r: 7, g: 121, b: 153 },
      },
    })
      .jpeg()
      .toBuffer();
  }

  const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${chrome}" fill="#ffffff"/>
  <circle cx="52" cy="${chrome / 2}" r="28" fill="#077999"/>
  <text x="52" y="${chrome / 2 + 7}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${escapeXml(name.slice(0, 1))}</text>
  <text x="96" y="${chrome / 2 - 6}" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#161511">${escapeXml(name)}</text>
  <text x="96" y="${chrome / 2 + 22}" font-family="Arial, sans-serif" font-size="20" fill="#64748b">Sponsored · Reference creative</text>
  <rect y="${H - footer}" width="${W}" height="${footer}" fill="#ffffff"/>
  <text x="40" y="${H - footer + 48}" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#161511">${escapeXml(hook)}</text>
  <text x="40" y="${H - 28}" font-family="Arial, sans-serif" font-size="22" fill="#077999">Open Ad Library for live Meta ads →</text>
</svg>`);

  const outPath = path.join(OUT, `${id}.jpg`);
  await sharp({
    create: { width: W, height: H, channels: 3, background: '#ffffff' },
  })
    .composite([
      { input: photo, top: chrome, left: 0 },
      { input: await sharp(overlay).png().toBuffer(), top: 0, left: 0 },
    ])
    .jpeg({ quality: 88 })
    .toFile(outPath);

  console.log('Wrote', outPath);
  return `/assets/competitors/${id}.jpg`;
}

async function main() {
  const results = {};
  for (const src of SOURCES) {
    try {
      let buf;
      if (src.local && fs.existsSync(src.local)) buf = fs.readFileSync(src.local);
      else if (src.url) buf = await fetchBuffer(src.url);
      else continue;
      results[src.id] = await makeFrame({ ...src, imageBuf: buf });
    } catch (err) {
      console.warn('Skip', src.id, err.message);
    }
  }

  // Soft placeholders for remaining IDs without sources
  const leftovers = [
    { id: 'time-doc', name: 'TimeDoc', hook: 'Care management, elevated.' },
    { id: 'carerev', name: 'CareRev', hook: 'Clinician flexibility, on demand.' },
    { id: 'patientpop', name: 'PatientPop', hook: 'Grow your practice online.' },
    { id: 'generic-va-commodity', name: 'Hire VAs cluster', hook: 'Familiar teal headset ads everywhere.' },
  ];
  for (const src of leftovers) {
    const buf = await sharp({
      create: {
        width: 1080,
        height: 900,
        channels: 3,
        background: { r: 13, g: 84, b: 107 },
      },
    })
      .composite([
        {
          input: Buffer.from(`<?xml version="1.0"?><svg width="1080" height="900" xmlns="http://www.w3.org/2000/svg">
            <text x="540" y="420" text-anchor="middle" font-family="Arial" font-size="48" font-weight="700" fill="#ffffff">${escapeXml(src.name)}</text>
            <text x="540" y="490" text-anchor="middle" font-family="Arial" font-size="28" fill="#27E6FA">Drop a live Ad Library screenshot here</text>
          </svg>`),
          top: 0,
          left: 0,
        },
      ])
      .jpeg()
      .toBuffer();
    results[src.id] = await makeFrame({ ...src, imageBuf: buf });
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
