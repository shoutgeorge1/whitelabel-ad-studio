/**
 * Generate BOLD MedVirtual mockup concepts — scroll-stopping, minimal words,
 * split-screen and no-people directions. Original MedVirtual creative (on-brand:
 * no pink, MedVirtual colors, "Hire a Virtual Medical Admin").
 *
 * These are concept mockups for review — baked-in AI text may need a designer pass.
 *
 * Output → public/assets/mockups/<id>.png  (1080x1350, 4:5 primary feed)
 * Run: node --env-file=.env.local scripts/generate-mockup-concepts.mjs [id-substring]
 */
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import sharp from 'sharp';

const OUT_DIR = 'public/assets/mockups';
fs.mkdirSync(OUT_DIR, { recursive: true });

const RULES =
  'Bold, high-contrast, mobile-first direct-response ad. Huge type that stops the scroll. Minimal words, spelled EXACTLY as written, no extra text, no lorem ipsum, no misspellings. NO pink, magenta, rose, or fuchsia anywhere. No watermarks, no fake logos, no compliance badges, no readable patient data.';

const CONCEPTS = [
  {
    id: 'mock-01-giant-type',
    title: 'Giant Type — No People',
    category: 'Typographic',
    hook: 'Pure typography poster. Role screams. No person needed.',
    prompt:
      'A no-people typographic Meta ad on a solid black background. The words "HIRE A VIRTUAL MEDICAL ADMIN" set in enormous heavy bold sans-serif, stacked on four lines, filling the frame edge to edge. "VIRTUAL" is electric lime green, the rest bright white. A small electric-lime tag in the corner reads "$10/hr". High contrast, confident, modern.',
  },
  {
    id: 'mock-02-split-missed-handled',
    title: 'Split — Missed / Handled',
    category: 'Split-screen · No people',
    hook: 'Left problem, right solution. Two words. Instant.',
    prompt:
      'A no-people split-screen Meta ad divided down the middle. LEFT half solid commercial-red background with the single bold white word "MISSED". RIGHT half deep MedVirtual teal background with the single bold white word "HANDLED". Enormous heavy sans-serif type, one word per side, centered. A thin lime divider between halves. Small white line at the bottom center reads "Hire a Virtual Medical Admin". Clean, graphic, high contrast.',
  },
  {
    id: 'mock-03-split-person',
    title: 'Split — Pain to Calm',
    category: 'Split-screen · One person',
    hook: 'Chaos left, calm admin right. Few words.',
    prompt:
      'A split-screen Meta ad. LEFT half deep navy background with bold white text "TOO MANY PATIENT CALLS?" in large heavy sans-serif. RIGHT half shows a calm, credible virtual medical administrator in a cobalt-blue scrub top smiling at a laptop, clean studio lighting. A bright cyan diagonal divides the two halves. Small white text bottom-right reads "We answer. Hire a Virtual Medical Admin". High contrast, mobile-first, no pink.',
  },
  {
    id: 'mock-04-price-hero',
    title: 'Price Hero — No People',
    category: 'Offer-led · No people',
    hook: 'The price is the whole ad.',
    prompt:
      'A no-people offer-led Meta ad on a deep navy background. An enormous "$10" in bold cobalt-blue and white fills most of the frame, with a smaller "/hour" beside it. Below, a compact white line reads "VIRTUAL MEDICAL ADMIN". A thin cyan underline accent. Minimal, punchy, high contrast, huge scale.',
  },
  {
    id: 'mock-05-one-word-backup',
    title: 'One Word — Backup',
    category: 'One-word · No people',
    hook: 'A single word does the work.',
    prompt:
      'A no-people Meta ad on a deep navy background. One enormous bold word "BACKUP." in signal-yellow heavy sans-serif fills the center of the frame. Small white text beneath reads "for your front desk — Hire a Virtual Medical Admin". Bold, minimal, high contrast, scroll-stopping.',
  },
  {
    id: 'mock-06-phone-icon',
    title: 'Icon-Led — No People',
    category: 'Icon-led · No people',
    hook: 'One giant icon, few words.',
    prompt:
      'A no-people icon-led Meta ad on a black background. One giant, clean, glowing high-voltage-cyan line icon of a ringing telephone dominates the center. Bold white text below reads "STOP MISSING PATIENT CALLS". A small lime tag reads "Hire a Virtual Medical Admin". Minimal words, high contrast, modern, scroll-stopping.',
  },
];

async function toFeed(buf) {
  // 1024x1536 portrait -> center-crop/resize to exact 4:5 (1080x1350)
  const W = 1080;
  const H = 1350;
  const meta = await sharp(buf).metadata();
  const targetRatio = W / H;
  const genRatio = meta.width / meta.height;
  let cropW = meta.width;
  let cropH = meta.height;
  if (genRatio > targetRatio) cropW = Math.round(meta.height * targetRatio);
  else if (genRatio < targetRatio) cropH = Math.round(meta.width / targetRatio);
  const left = Math.round((meta.width - cropW) / 2);
  const top = Math.round((meta.height - cropH) / 2);
  return sharp(buf).extract({ left, top, width: cropW, height: cropH }).resize(W, H).png().toBuffer();
}

async function main() {
  const filter = (process.argv[2] || '').toLowerCase();
  const client = new OpenAI();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  let ok = 0;
  const total = CONCEPTS.filter((c) => !filter || c.id.includes(filter)).length;

  for (const concept of CONCEPTS) {
    if (filter && !concept.id.includes(filter)) continue;
    const t0 = Date.now();
    try {
      const res = await client.images.generate({
        model,
        prompt: `${concept.prompt} ${RULES}`,
        size: '1024x1536',
        quality: 'medium',
        n: 1,
      });
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error('empty response');
      const final = await toFeed(Buffer.from(b64, 'base64'));
      fs.writeFileSync(path.join(OUT_DIR, `${concept.id}.png`), final);
      ok += 1;
      console.log(`OK  ${concept.id}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    } catch (err) {
      console.log(`ERR ${concept.id}: ${String(err?.message || err).slice(0, 200)}`);
    }
  }
  console.log(`\nDONE — ${ok}/${total} mockups generated.`);
}

main();
