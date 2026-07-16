/**
 * Generate NEW spark concepts for the New Ad Ideas page in the winning style:
 * photoreal virtual medical admin + one clear role headline + a few benefit
 * chips + one CTA, with FEWER words. On-brand (no pink, MedVirtual colors,
 * "Hire a Virtual [X] Admin"). Concept plates for review — a designer finalizes.
 *
 * Reads prompts straight from scripts/idea-concepts-data.mjs so the page and the
 * generated images always match.
 *
 * Output → public/assets/idea-concepts/<idea-##-name>.png  (1080x1080, 1:1)
 * Run: node --env-file=.env.local scripts/generate-idea-sparks.mjs [number-or-id]
 *   e.g. node --env-file=.env.local scripts/generate-idea-sparks.mjs 11
 *        node --env-file=.env.local scripts/generate-idea-sparks.mjs spark-14
 */
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import sharp from 'sharp';
import { IDEA_SPARK_CONCEPTS } from './idea-concepts-data.mjs';

const OUT_DIR = 'public/assets/idea-concepts';
fs.mkdirSync(OUT_DIR, { recursive: true });

// Only the new-wave concepts (11+). Older sparks 01–10 already exist and are approved.
const NEW_FROM = 11;

async function toSquare(buf) {
  // Center-crop/resize to exact 1:1 (1080x1080) to match existing spark cards.
  const W = 1080;
  const H = 1080;
  const meta = await sharp(buf).metadata();
  const side = Math.min(meta.width, meta.height);
  const left = Math.round((meta.width - side) / 2);
  const top = Math.round((meta.height - side) / 2);
  return sharp(buf).extract({ left, top, width: side, height: side }).resize(W, H).png().toBuffer();
}

function fileFor(concept) {
  // image path is /assets/idea-concepts/<name>.png
  return path.basename(concept.image);
}

async function main() {
  const filter = (process.argv[2] || '').toLowerCase();
  const client = new OpenAI();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';

  const targets = IDEA_SPARK_CONCEPTS.filter((c) => {
    const n = Number(c.number);
    if (Number.isFinite(n) && n < NEW_FROM) return false;
    if (!c.prompt || !c.image) return false;
    if (!filter) return true;
    return c.id.includes(filter) || String(c.number) === filter;
  });

  let ok = 0;
  for (const concept of targets) {
    const t0 = Date.now();
    try {
      const res = await client.images.generate({
        model,
        prompt: concept.prompt,
        size: '1024x1024',
        quality: 'medium',
        n: 1,
      });
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error('empty response');
      const final = await toSquare(Buffer.from(b64, 'base64'));
      fs.writeFileSync(path.join(OUT_DIR, fileFor(concept)), final);
      ok += 1;
      console.log(`OK  ${concept.id}  ${fileFor(concept)}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    } catch (err) {
      console.log(`ERR ${concept.id}: ${String(err?.message || err).slice(0, 200)}`);
    }
  }
  console.log(`\nDONE — ${ok}/${targets.length} spark concepts generated.`);
}

main();
