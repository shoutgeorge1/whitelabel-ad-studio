/**
 * Ingest a Meta Ad Library CDP extract JSON into live-snapshots.json + image files.
 *
 * Usage:
 *   node scripts/ingest-live-scrape.mjs --id=weave --file=tmp/weave.json [--prefer=Weave]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  LIVE_DIR,
  LIVE_JSON,
  loadLiveSnapshots,
  saveLiveSnapshots,
  normalizeAd,
} from './scrape-ad-library-helpers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function arg(name, fallback = null) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const id = arg('id');
const file = arg('file');
const prefer = arg('prefer'); // optional advertiser substring filter
const maxAds = Number(arg('max', '4'));

if (!id || !file) {
  console.error('Need --id= and --file=');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
let ads = Array.isArray(raw.ads) ? [...raw.ads] : [];
if (prefer) {
  const pref = ads.filter((a) =>
    String(a.advertiser || '').toLowerCase().includes(prefer.toLowerCase()),
  );
  if (pref.length) ads = pref;
}
ads = ads.slice(0, maxAds);
const imgs = Array.isArray(raw.imgs) ? raw.imgs : [];

fs.mkdirSync(LIVE_DIR, { recursive: true });

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MedVirtualAdWall/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

const liveAds = [];
for (let i = 0; i < ads.length; i++) {
  const ad = ads[i];
  const imgMeta = imgs[i] || imgs[0];
  let imagePath = null;
  if (imgMeta?.src) {
    const fname = `${id}-${i + 1}.jpg`;
    const dest = path.join(LIVE_DIR, fname);
    try {
      const bytes = await download(imgMeta.src, dest);
      imagePath = `/assets/competitors/live/${fname}`;
      console.log(`img ${fname} ${bytes}b`);
    } catch (e) {
      console.warn(`img fail ${i + 1}:`, e.message);
    }
  }
  liveAds.push(normalizeAd(ad, id, i, imagePath));
}

const data = loadLiveSnapshots();
data.updatedAt = new Date().toISOString();
data.sources = data.sources || {};
data.sources[id] = {
  query: raw.query || id,
  scrapedAt: new Date().toISOString(),
  ads: liveAds,
};
saveLiveSnapshots(data);
console.log(`Saved ${liveAds.length} ads for ${id} → ${path.relative(process.cwd(), LIVE_JSON)}`);
