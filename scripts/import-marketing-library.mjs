/**
 * Import marketing "Others" pack → public marketing library (web-safe sizes).
 *
 * Usage:
 *   node scripts/import-marketing-library.mjs [sourceDir]
 *
 * Defaults to .tmp-others-upload/Others after unzip.
 * Masters > threshold go to .local-masters/marketing-library (gitignored).
 * Public gallery uses web-optimized PNG/JPEG only (no .ai links).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DEFAULT_SRC = path.join(ROOT, '.tmp-others-upload', 'Others');
const PUBLIC_LIB = path.join(ROOT, 'public', 'assets', 'marketing-library');
const MASTERS = path.join(ROOT, '.local-masters', 'marketing-library');
const CATALOG = path.join(ROOT, 'public', 'exports', 'marketing-library-catalog.json');

const WEB_MAX_EDGE = 1600;
const WEB_JPEG_QUALITY = 82;
const MASTER_COPY_THRESHOLD = 2.5 * 1024 * 1024; // keep full file locally if bigger
const SKIP_EXT = new Set(['.ai']); // not exposed in library UI
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const DOC_EXT = new Set(['.pdf']);

function slugPart(s) {
  return String(s)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80);
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

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function categoryFromRel(rel) {
  const top = rel.split(/[\\/]/)[0] || 'Other';
  const map = {
    'Blog Graphics': 'blog',
    'Headshot Edits': 'headshots',
    'LinkedIn Posts': 'linkedin',
    'MedVirtual - Berry Virtual Logo': 'berry-logo',
    Newsletter: 'newsletter',
    'Print Media': 'print',
    'Social Media Assets': 'social',
    'Website Banners': 'website-banners',
    'Website Thumbnails': 'website-thumbnails',
  };
  return { id: map[top] || slugPart(top), label: top };
}

async function optimizeImage(src, destPngOrJpg) {
  const img = sharp(src, { failOn: 'none', limitInputPixels: false }).rotate();
  const meta = await img.metadata();
  const w = meta.width || WEB_MAX_EDGE;
  const h = meta.height || WEB_MAX_EDGE;
  const needsResize = Math.max(w, h) > WEB_MAX_EDGE;
  let pipeline = sharp(src, { failOn: 'none', limitInputPixels: false }).rotate();
  if (needsResize) {
    pipeline = pipeline.resize({
      width: w >= h ? WEB_MAX_EDGE : null,
      height: h > w ? WEB_MAX_EDGE : null,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }
  const useJpeg = /\.jpe?g$/i.test(src) || (meta.hasAlpha === false && (w * h > 800 * 800));
  if (useJpeg || destPngOrJpg.endsWith('.jpg')) {
    await pipeline.jpeg({ quality: WEB_JPEG_QUALITY, mozjpeg: true }).toFile(destPngOrJpg);
  } else {
    await pipeline.png({ compressionLevel: 9, palette: false }).toFile(destPngOrJpg);
  }
  return fs.statSync(destPngOrJpg).size;
}

async function main() {
  const srcRoot = path.resolve(process.argv[2] || DEFAULT_SRC);
  if (!fs.existsSync(srcRoot)) {
    console.error('Source not found:', srcRoot);
    process.exit(1);
  }

  if (fs.existsSync(PUBLIC_LIB)) fs.rmSync(PUBLIC_LIB, { recursive: true, force: true });
  ensureDir(PUBLIC_LIB);
  ensureDir(MASTERS);
  ensureDir(path.dirname(CATALOG));

  const files = walk(srcRoot);
  const items = [];
  let skipped = 0;

  for (const abs of files) {
    const rel = path.relative(srcRoot, abs);
    const ext = path.extname(abs).toLowerCase();
    const parts = rel.split(/[\\/]/);
    const fileName = parts.pop();
    const doNotUse = parts.some((p) => /^dnu$/i.test(p) || /do[- ]?not[- ]?use/i.test(p));
    const cat = categoryFromRel(rel);
    const slugPath = [...parts.map(slugPart), slugPart(path.basename(fileName, ext))]
      .filter(Boolean)
      .join('/');
    const baseDir = path.join(PUBLIC_LIB, cat.id, path.dirname(slugPath) === '.' ? '' : path.dirname(slugPath));
    ensureDir(baseDir);

    if (SKIP_EXT.has(ext)) {
      skipped += 1;
      const masterDir = path.join(MASTERS, cat.id);
      ensureDir(masterDir);
      const masterName = `${slugPart(path.basename(fileName, ext))}${ext}`;
      fs.copyFileSync(abs, path.join(masterDir, masterName));
      items.push({
        id: `${cat.id}/${slugPath}`,
        category: cat.id,
        categoryLabel: cat.label,
        title: path.basename(fileName, ext),
        originalName: fileName,
        doNotUse,
        kind: 'source-master-only',
        note: 'Illustrator source — not linked in VA library. Local master only.',
        masterLocal: true,
        webPath: null,
        sizeOriginal: fs.statSync(abs).size,
      });
      continue;
    }

    const sizeOriginal = fs.statSync(abs).size;

    if (DOC_EXT.has(ext)) {
      // PDFs can be huge — keep web link only if < 8MB, else local master + note
      const pdfName = `${path.basename(slugPath)}${ext}`;
      const publicPdf = path.join(baseDir, pdfName);
      const masterPdfDir = path.join(MASTERS, cat.id, path.dirname(slugPath) === '.' ? '' : path.dirname(slugPath));
      ensureDir(masterPdfDir);
      fs.copyFileSync(abs, path.join(masterPdfDir, pdfName));
      let webPath = null;
      if (sizeOriginal <= 8 * 1024 * 1024) {
        fs.copyFileSync(abs, publicPdf);
        webPath = `/assets/marketing-library/${cat.id}/${slugPath}${ext}`.replace(/\\/g, '/');
      }
      items.push({
        id: `${cat.id}/${slugPath}`,
        category: cat.id,
        categoryLabel: cat.label,
        title: path.basename(fileName, ext),
        originalName: fileName,
        doNotUse,
        kind: 'pdf',
        webPath,
        masterLocal: true,
        sizeOriginal,
        note:
          webPath == null
            ? 'Large PDF — stored in .local-masters only (too big for web/git).'
            : 'PDF download available.',
      });
      continue;
    }

    if (!IMAGE_EXT.has(ext)) {
      skipped += 1;
      continue;
    }

    const outExt = ext === '.png' && sizeOriginal > 1.2 * 1024 * 1024 ? '.jpg' : ext === '.jpeg' ? '.jpg' : ext;
    const outName = `${path.basename(slugPath)}${outExt}`;
    const outAbs = path.join(baseDir, outName);
    const webPath = `/assets/marketing-library/${cat.id}/${path.dirname(slugPath) === '.' ? '' : `${path.dirname(slugPath).replace(/\\/g, '/')}/`}${outName}`
      .replace(/\/+/g, '/')
      .replace('/./', '/');

    try {
      await optimizeImage(abs, outAbs);
    } catch (e) {
      console.warn('Optimize failed, writing tiny placeholder note (master only):', rel, e.message);
      // Never copy giant originals into public/
      const masterDir = path.join(MASTERS, cat.id, path.dirname(slugPath) === '.' ? '' : path.dirname(slugPath));
      ensureDir(masterDir);
      fs.copyFileSync(abs, path.join(masterDir, fileName));
      items.push({
        id: `${cat.id}/${slugPath}`,
        category: cat.id,
        categoryLabel: cat.label,
        title: path.basename(fileName, ext),
        originalName: fileName,
        doNotUse,
        kind: 'image',
        webPath: null,
        masterLocal: true,
        sizeOriginal,
        note: 'Could not build web preview — full file kept in .local-masters only.',
      });
      continue;
    }

    const sizeWeb = fs.statSync(outAbs).size;
    let masterLocal = false;
    if (sizeOriginal >= MASTER_COPY_THRESHOLD) {
      const masterDir = path.join(MASTERS, cat.id, path.dirname(slugPath) === '.' ? '' : path.dirname(slugPath));
      ensureDir(masterDir);
      fs.copyFileSync(abs, path.join(masterDir, fileName));
      masterLocal = true;
    }

    items.push({
      id: `${cat.id}/${slugPath}`,
      category: cat.id,
      categoryLabel: cat.label,
      title: path.basename(fileName, ext),
      originalName: fileName,
      doNotUse,
      kind: 'image',
      webPath,
      masterLocal,
      sizeOriginal,
      sizeWeb,
    });
    console.log(
      `${doNotUse ? 'DNU ' : ''}${cat.id}/${outName}  ${(sizeOriginal / 1e6).toFixed(1)}MB → ${(sizeWeb / 1e6).toFixed(2)}MB`,
    );
  }

  const byCategory = {};
  for (const it of items) {
    byCategory[it.category] = byCategory[it.category] || {
      id: it.category,
      label: it.categoryLabel,
      count: 0,
      dnu: 0,
    };
    byCategory[it.category].count += 1;
    if (it.doNotUse) byCategory[it.category].dnu += 1;
  }

  const catalog = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: 'Others marketing pack (2026-07-13 upload)',
    policy:
      'Web library is optimized for preview/reference. Full-res print masters live in .local-masters/marketing-library (gitignored). Official Meta brand logos remain under /assets/brand/medvirtual/. Berry co-brand assets are historical — prefer MedVirtual-only for Meta ads.',
    categories: Object.values(byCategory).sort((a, b) => a.label.localeCompare(b.label)),
    items: items.sort((a, b) => a.id.localeCompare(b.id)),
    counts: {
      total: items.length,
      images: items.filter((i) => i.kind === 'image').length,
      pdfs: items.filter((i) => i.kind === 'pdf').length,
      dnu: items.filter((i) => i.doNotUse).length,
      skippedExt: skipped,
    },
  };

  fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2));
  console.log('Wrote', CATALOG);
  console.log('Public lib:', PUBLIC_LIB);
  console.log('Local masters:', MASTERS);
  console.log(catalog.counts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
