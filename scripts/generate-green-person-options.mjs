/**
 * Generate transparent "green girl" person options that match the approved
 * VMA-04 HIPAA Green winning master as closely as possible.
 *
 * Output → public/assets/graphics-kit/options/green-person-*.png (transparent)
 * Run: node --env-file=.env.local scripts/generate-green-person-options.mjs [id]
 */
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import sharp from 'sharp';

const OUT_DIR = 'public/assets/graphics-kit/options';
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE =
  'Isolated waist-up studio portrait of a warm, friendly, attractive female virtual medical administrator, late 20s to early 30s, genuine bright natural smile showing teeth, looking at the camera. She wears a clean medium-green medical scrub top (V-neck). Photoreal commercial advertising quality, even soft studio key light, crisp clean edges. Subject centered against a perfectly flat, evenly lit, pure bright chroma-blue (#0000FF) background with no gradient and no shadows on the backdrop. No headset, no stethoscope, no white coat, no laptop, no desk, no text, no badge, no logo, no jewelry logos, no watermark. NO pink, magenta, rose, or fuchsia.';

async function chromaKeyBlue(buf) {
  const keyed = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = keyed.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // Key only strongly blue backdrop pixels; green scrubs and skin are safe.
    const dominance = b - Math.max(r, g);
    const alpha = dominance > 70 && b > 120 ? Math.max(0, 255 - (dominance - 70) * 4) : 255;
    pixels[i + 3] = alpha;
  }
  return sharp(pixels, {
    raw: { width: keyed.info.width, height: keyed.info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

const OPTIONS = [
  {
    id: 'green-person-a-brunette-bun',
    prompt:
      BASE +
      ' Latina woman with dark brown hair pulled up in a neat low bun with a few soft face-framing strands, light warm makeup, healthy glowing skin. Confident approachable expression. Matches an upscale healthcare brand.',
  },
  {
    id: 'green-person-b-brunette-down',
    prompt:
      BASE +
      ' Latina woman with long dark brown wavy hair worn down over one shoulder, subtle warm highlights, natural makeup, radiant confident smile. Youthful, polished, trustworthy.',
  },
  {
    id: 'green-person-c-blonde',
    prompt:
      BASE +
      ' Caucasian woman with shoulder-length blonde hair worn softly down, light natural makeup, bright warm confident smile, fresh polished professional look.',
  },
];

async function main() {
  const filter = String(process.argv[2] || '').toLowerCase();
  const client = new OpenAI();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  const targets = OPTIONS.filter((p) => !filter || p.id.includes(filter));
  let ok = 0;

  for (const person of targets) {
    const started = Date.now();
    try {
      const result = await client.images.generate({
        model,
        prompt: person.prompt,
        size: '1024x1536',
        quality: 'high',
        n: 1,
      });
      const b64 = result.data?.[0]?.b64_json;
      if (!b64) throw new Error('empty image response');
      const output = await chromaKeyBlue(Buffer.from(b64, 'base64'));
      fs.writeFileSync(path.join(OUT_DIR, `${person.id}.png`), output);
      ok += 1;
      console.log(`OK  ${person.id}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
    } catch (error) {
      console.error(`ERR ${person.id}: ${String(error?.message || error).slice(0, 240)}`);
    }
  }

  console.log(`DONE — ${ok}/${targets.length} green-person options generated.`);
}

main();
