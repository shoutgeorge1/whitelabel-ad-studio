/**
 * Generate isolated human assets for layered video projects.
 *
 * These are components, not complete ads: no text, badges, logo, UI, or scenery.
 * Output → public/assets/video-elements/people/*.png
 *
 * Run: node --env-file=.env.local scripts/generate-video-elements.mjs [id]
 */
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import sharp from 'sharp';

const OUT_DIR = 'public/assets/video-elements/people';
fs.mkdirSync(OUT_DIR, { recursive: true });

const PEOPLE = [
  {
    id: 'admin-cobalt',
    prompt:
      'Isolated waist-up studio portrait of a warm credible female virtual medical administrator, age 30s, wearing a clean cobalt-blue scrub top, friendly confident expression, slight three-quarter pose, hands naturally visible near waist. Subject centered against a perfectly flat, evenly lit, pure bright chroma-green (#00FF00) background with no gradient and no shadows on the backdrop. Photoreal commercial advertising quality, crisp edge separation, even studio key light. No headset, no stethoscope, no white coat, no jewelry logo, no text, no badge, no props, no furniture, no office, no watermark. NO pink, magenta, rose, or fuchsia.',
  },
  {
    id: 'admin-lime',
    prompt:
      'Isolated waist-up studio portrait of a warm credible female virtual medical administrator, age 40s, wearing a clean vivid-lime-green scrub top, friendly capable expression, slight three-quarter pose, one hand relaxed as if ready to help. Subject centered against a perfectly flat, evenly lit, pure bright chroma-green (#00FF00) background with no gradient and no shadows on the backdrop. Photoreal commercial advertising quality, crisp edge separation, even studio key light. No headset, no stethoscope, no white coat, no jewelry logo, no text, no badge, no props, no furniture, no office, no watermark. NO pink, magenta, rose, or fuchsia.',
  },
];

async function normalize(buf) {
  const keyed = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = keyed.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // Chroma key only strongly green pixels. Keep scrub colors unless green
    // dominates red and blue by a large margin.
    const dominance = g - Math.max(r, b);
    const alpha = dominance > 85 && g > 135 ? Math.max(0, 255 - (dominance - 85) * 3) : 255;
    pixels[i + 3] = alpha;
  }
  return sharp(pixels, {
    raw: { width: keyed.info.width, height: keyed.info.height, channels: 4 },
  })
    .resize(1200, 1600, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  const filter = String(process.argv[2] || '').toLowerCase();
  const client = new OpenAI();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  const targets = PEOPLE.filter((p) => !filter || p.id.includes(filter));
  let ok = 0;

  for (const person of targets) {
    const started = Date.now();
    try {
      const result = await client.images.generate({
        model,
        prompt: person.prompt,
        size: '1024x1536',
        quality: 'medium',
        n: 1,
      });
      const b64 = result.data?.[0]?.b64_json;
      if (!b64) throw new Error('empty image response');
      const output = await normalize(Buffer.from(b64, 'base64'));
      fs.writeFileSync(path.join(OUT_DIR, `${person.id}.png`), output);
      ok += 1;
      console.log(`OK  ${person.id}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
    } catch (error) {
      console.error(`ERR ${person.id}: ${String(error?.message || error).slice(0, 240)}`);
    }
  }

  console.log(`DONE — ${ok}/${targets.length} isolated people generated.`);
}

main();
