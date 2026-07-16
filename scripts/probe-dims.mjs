import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function dims(dir, ext) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(ext));
  for (const f of files) {
    const m = await sharp(path.join(dir, f)).metadata();
    console.log(f, `${m.width}x${m.height}`);
  }
}

console.log('=== AI ===');
await dims('public/assets/ai-images', '.png');
console.log('=== LP ===');
await dims('public/assets/landing-page-images', '.avif');
