/**
 * Import second brand dump (logos, fonts, video, private docs).
 *
 * Usage: node scripts/import-brand-pack.mjs [sourceDir]
 * Default: .tmp-brand-upload
 *
 * Rules:
 * - Official logos/fonts → public/assets/brand/medvirtual/
 * - Giant video/MOV/.ai → .local-masters/ (gitignored)
 * - GTM / SDR / xlsx / process docs → _private/ (gitignored, never linked for download)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, '.tmp-brand-upload'));
const BRAND_DIR = path.join(ROOT, 'public', 'assets', 'brand', 'medvirtual');
const FONTS_DIR = path.join(BRAND_DIR, 'fonts');
const MASTERS = path.join(ROOT, '.local-masters');
const PRIVATE = path.join(ROOT, '_private', 'brand-uploads');
const MANIFEST = path.join(ROOT, 'public', 'exports', 'brand-pack-manifest.json');

function ensure(d) {
  fs.mkdirSync(d, { recursive: true });
}

function copy(src, dest) {
  ensure(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return dest;
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function findOne(subdir, exts) {
  const base = path.join(SRC, subdir);
  return walk(base).find((f) => exts.includes(path.extname(f).toLowerCase()));
}

function findAll(subdir, exts) {
  return walk(path.join(SRC, subdir)).filter((f) => exts.includes(path.extname(f).toLowerCase()));
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Source missing:', SRC);
    process.exit(1);
  }

  ensure(FONTS_DIR);
  ensure(path.join(MASTERS, 'video'));
  ensure(path.join(MASTERS, 'illustrator'));
  ensure(path.join(MASTERS, 'animated'));
  ensure(PRIVATE);

  const actions = [];

  // Fonts — fill missing Be Vietnam weights (CSS still uses Regular/Medium/Bold primarily)
  for (const f of findAll('fonts', ['.ttf'])) {
    const name = path.basename(f);
    const dest = path.join(FONTS_DIR, name);
    const existed = fs.existsSync(dest);
    copy(f, dest);
    actions.push({
      kind: 'font',
      file: name,
      dest: `/assets/brand/medvirtual/fonts/${name}`,
      status: existed ? 'updated' : 'added',
    });
  }

  // Official SVGs — verify match, keep canonical names
  const svgColoredAll = findAll('svg', ['.svg']);
  for (const f of svgColoredAll) {
    const isWhite = /white/i.test(path.basename(f));
    const destName = isWhite ? 'logo-white.svg' : 'logo-colored.svg';
    const dest = path.join(BRAND_DIR, destName);
    const same = fs.existsSync(dest) && fs.readFileSync(dest).equals(fs.readFileSync(f));
    if (!same) copy(f, dest);
    actions.push({
      kind: 'logo-svg',
      file: path.basename(f),
      dest: `/assets/brand/medvirtual/${destName}`,
      status: same ? 'unchanged-match' : 'updated',
    });
  }

  // PNG logomark on black
  const png = findOne('pngs', ['.png']);
  if (png) {
    const dest = path.join(BRAND_DIR, 'logomark-on-black.png');
    await sharp(png, { failOn: 'none' })
      .rotate()
      .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    actions.push({
      kind: 'logo-png',
      file: path.basename(png),
      dest: '/assets/brand/medvirtual/logomark-on-black.png',
      status: 'added',
    });
  }

  // Illustrator masters
  for (const f of [...findAll('ai', ['.ai']), ...findAll('vector', ['.ai'])]) {
    const dest = path.join(MASTERS, 'illustrator', path.basename(f).replace(/\s+/g, '-').toLowerCase());
    copy(f, dest);
    actions.push({
      kind: 'illustrator-master',
      file: path.basename(f),
      dest: path.relative(ROOT, dest).replace(/\\/g, '/'),
      status: 'local-master-only',
      note: 'Not linked publicly (.ai)',
    });
  }

  // Video / animated — local only (too large for git/Vercel)
  for (const f of findAll('video', ['.mp4', '.mov'])) {
    const dest = path.join(MASTERS, 'video', path.basename(f));
    copy(f, dest);
    actions.push({
      kind: 'video-master',
      file: path.basename(f),
      dest: path.relative(ROOT, dest).replace(/\\/g, '/'),
      sizeMb: +(fs.statSync(f).size / 1e6).toFixed(1),
      status: 'local-master-only',
      note: 'Intro Zoom MP4 — keep local; do not commit',
    });
  }
  for (const f of findAll('animated', ['.mov', '.mp4'])) {
    const dest = path.join(MASTERS, 'animated', path.basename(f).replace(/\s+/g, '-'));
    copy(f, dest);
    actions.push({
      kind: 'animated-master',
      file: path.basename(f),
      dest: path.relative(ROOT, dest).replace(/\\/g, '/'),
      sizeMb: +(fs.statSync(f).size / 1e6).toFixed(1),
      status: 'local-master-only',
      note: 'Animation source — local only',
    });
  }

  // Private docs / spreadsheets — never public
  for (const f of [...findAll('docs', ['.docx', '.doc']), ...findAll('xlsx', ['.xlsx', '.xls', '.csv'])]) {
    const dest = path.join(PRIVATE, path.basename(f));
    copy(f, dest);
    actions.push({
      kind: 'private',
      file: path.basename(f),
      dest: path.relative(ROOT, dest).replace(/\\/g, '/'),
      status: 'private-gitignored',
      note: 'Internal only — not exposed on Asset Hub / Marketing Library',
    });
  }

  const manifest = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: 'Brand dump 2026-07-13 (fonts, SVG/PNG logos, Approved.ai, Vector, Animated MOV, Intro Zoom MP4, GTM/SDR docs)',
    policy: [
      'Public brand logos/fonts only under /assets/brand/medvirtual/',
      'Video + Illustrator masters in .local-masters/ (gitignored)',
      'GTM Strategy, Meta export xlsx, SDR intake, email signature SOP → _private/brand-uploads/',
      'Duplicate Intro Zoom MP4 (1) was identical — imported once',
    ],
    actions,
    counts: actions.reduce((acc, a) => {
      acc[a.kind] = (acc[a.kind] || 0) + 1;
      return acc;
    }, {}),
  };

  ensure(path.dirname(MANIFEST));
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log('Wrote', MANIFEST);
  console.log(manifest.counts);
  for (const a of actions) {
    console.log(`- [${a.status}] ${a.kind}: ${a.file}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
