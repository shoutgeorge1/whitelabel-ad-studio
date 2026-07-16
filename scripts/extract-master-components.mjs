/**
 * Extract reusable person layers from each approved 1:1 master.
 * Output → public/assets/graphics-kit/person-0X.png
 *
 * Run: node scripts/extract-master-components.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUT = 'public/assets/graphics-kit';
fs.mkdirSync(OUT, { recursive: true });

const MASTERS = [
  {
    id: '01',
    src: 'public/exports/vma-masters/MV_VMA_01_SpanishGreen_SOURCE_1x1.png',
    crop: { leftPct: 0.38, widthPct: 0.62, topPct: 0.08, heightPct: 0.92 },
  },
  {
    id: '02',
    src: 'public/exports/vma-masters/MV_VMA_02_CobaltBlue_SOURCE_1x1.png',
    crop: { leftPct: 0.4, widthPct: 0.6, topPct: 0.05, heightPct: 0.95 },
  },
  {
    id: '03',
    src: 'public/exports/vma-masters/MV_VMA_03_SignalYellow_SOURCE_1x1.png',
    crop: { leftPct: 0.42, widthPct: 0.58, topPct: 0.1, heightPct: 0.9 },
  },
  {
    id: '04',
    src: 'public/exports/vma-masters/MV_VMA_04_HIPAAGreen_SOURCE_1x1.png',
    crop: { leftPct: 0.4, widthPct: 0.6, topPct: 0.08, heightPct: 0.92 },
  },
];

async function cropPerson({ id, src, crop }) {
  const meta = await sharp(src).metadata();
  const left = Math.round(crop.leftPct * meta.width);
  const top = Math.round((crop.topPct ?? 0) * meta.height);
  const width = Math.round(crop.widthPct * meta.width);
  const height = Math.round((crop.heightPct ?? 1) * meta.height);
  const out = path.join(OUT, `person-${id}.png`);
  await sharp(src).extract({ left, top, width, height }).png().toFile(out);
  console.log(`OK  person-${id}.png  ${width}x${height}`);
}

async function main() {
  for (const m of MASTERS) await cropPerson(m);
  console.log('DONE — person components extracted.');
}

main();
