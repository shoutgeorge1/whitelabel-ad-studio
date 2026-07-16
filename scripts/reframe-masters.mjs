/**
 * Reframe the four approved 1:1 masters into the three missing Meta aspect ratios.
 *
 *   AI recompose (OpenAI images.edit, gpt-image-*) at the nearest supported
 *   orientation, then sharp center-crop + resize to the EXACT Meta pixel size.
 *
 * Output → public/exports/vma-masters/<stem>_<ratio>.png  (picked up by the site)
 * Raw AI → tmp/reframe-raw/  (for QA)
 * Manifest → tmp/reframe-manifest.json
 *
 * Run: node --env-file=.env.local scripts/reframe-masters.mjs [stem-substring]
 *   Optional arg limits to matching masters (e.g. "Cobalt").
 */
import fs from 'fs';
import path from 'path';
import OpenAI, { toFile } from 'openai';
import sharp from 'sharp';

const OUT_DIR = 'public/exports/vma-masters';
const RAW_DIR = 'tmp/reframe-raw';
fs.mkdirSync(RAW_DIR, { recursive: true });

const NO_PINK = 'NO pink, magenta, rose, or fuchsia anywhere.';
const KEEP_TEXT =
  'Keep all text crisp, legible and correctly spelled. Do not add, remove, or misspell any words.';

const MASTERS = [
  {
    stem: 'MV_VMA_01_SpanishGreen',
    src: 'MV_VMA_01_SpanishGreen_SOURCE_1x1.png',
    preserve:
      'headline "Hire a Virtual Medical Admin"; the four benefits Reception & Admin Support, Insurance Verification, Preauthorization Support, Medical Billing Support; the "Starting at $10/hour" price; the "Spanish Speaking Available" badge; the green-scrub medical admin; lime green, cyan and black colors',
  },
  {
    stem: 'MV_VMA_02_CobaltBlue',
    src: 'MV_VMA_02_CobaltBlue_SOURCE_1x1.png',
    preserve:
      'headline "Hire a Virtual Medical Admin"; the supporting line "Help with calls, scheduling, insurance, and billing"; the four benefit chips Patient Calls, Scheduling, Insurance Verification, Billing Support; the "Starting at $10 /hour" badge; the smiling woman in cobalt-blue scrubs at a laptop; the black panel, cobalt blue and cyan accents; the diagonal split',
  },
  {
    stem: 'MV_VMA_03_SignalYellow',
    src: 'MV_VMA_03_SignalYellow_SOURCE_1x1.png',
    preserve:
      'headline "Hire a Virtual Medical Admin"; the four benefits Answer Patient Calls, Schedule Appointments, Verify Insurance, Support Billing; the "Starting at $10/hour" price; the front-office emphasis; the navy background with signal-yellow accents; the yellow-scrub medical admin',
  },
  {
    stem: 'MV_VMA_04_HIPAAGreen',
    src: 'MV_VMA_04_HIPAAGreen_SOURCE_1x1.png',
    preserve:
      'headline "Hire a Virtual Medical Admin"; the four benefits Reception & Admin Support, Insurance Verification, Preauthorization Support, Medical Billing Support; the "Starting at $10/hour" price; the "HIPAA Compliant" shield badge; white benefit cards; the lime-scrub medical admin; lime green, black and white colors',
  },
];

// gen = the OpenAI edit size we request; target = exact Meta output; crop tells sharp
// which dimension to trim so the gen ratio matches the target ratio before resize.
const RATIOS = [
  {
    id: '4x5',
    gen: '1024x1536',
    target: { w: 1080, h: 1350 },
    layout:
      'Reframe into a TALLER 4:5 vertical feed ad. Headline near the top, give the person more vertical room in the middle, benefits lower, keep the offer easy to see. Comfortable margins top and bottom.',
  },
  {
    id: '9x16',
    gen: '1024x1536',
    target: { w: 1080, h: 1920 },
    layout:
      'Reframe into a very TALL 9:16 full-screen Stories/Reels ad. Stack it vertically: clear breathing room at the very top, then the headline, then the person in the middle, then the benefits, then the price/offer near the bottom. Keep everything well inside the frame with generous side margins so nothing is cut off, and leave the extreme top and bottom relatively clear for phone UI.',
  },
  {
    id: '1.91x1',
    gen: '1536x1024',
    target: { w: 1200, h: 628 },
    layout:
      'Reframe into a WIDE, SHORT horizontal link-ad (letterbox proportions). Put the headline and benefits on the left, the person on the right, and the price/offer near the person, filling the frame left to right. CRITICAL: the final crop is much shorter than this canvas — keep ALL text, badges, faces and the price within the middle horizontal band, and leave the TOP ~18% and BOTTOM ~18% as plain background margin only (no headline, no badges, no faces, no important content there), because the top and bottom will be trimmed.',
  },
];

function buildPrompt(master, ratio) {
  return [
    `This is an approved MedVirtual healthcare-staffing Meta ad in a 1:1 square.`,
    ratio.layout,
    `Keep the same design language, the same person, the same colors, and specifically preserve: ${master.preserve}.`,
    KEEP_TEXT,
    `Do not add call-center headsets, fake logos, watermarks, or patient data.`,
    NO_PINK,
  ].join(' ');
}

async function cropResize(buf, gen, target) {
  const [gw, gh] = gen.split('x').map(Number);
  const targetRatio = target.w / target.h;
  const genRatio = gw / gh;
  let cropW = gw;
  let cropH = gh;
  if (genRatio > targetRatio) {
    // gen too wide -> trim width
    cropW = Math.round(gh * targetRatio);
  } else if (genRatio < targetRatio) {
    // gen too tall -> trim height
    cropH = Math.round(gw / targetRatio);
  }
  const left = Math.round((gw - cropW) / 2);
  const top = Math.round((gh - cropH) / 2);
  return sharp(buf)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(target.w, target.h)
    .png()
    .toBuffer();
}

async function main() {
  const filter = (process.argv[2] || '').toLowerCase();
  const ratioOnly = (process.env.RATIO_ONLY || '').trim();
  const client = new OpenAI();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  const manifest = [];

  for (const master of MASTERS) {
    if (filter && !master.stem.toLowerCase().includes(filter)) continue;
    const srcPath = path.join(OUT_DIR, master.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`SKIP ${master.stem}: source missing ${srcPath}`);
      continue;
    }
    for (const ratio of RATIOS) {
      if (ratioOnly && ratio.id !== ratioOnly) continue;
      const label = `${master.stem}_${ratio.id}`;
      const t0 = Date.now();
      try {
        const image = await toFile(fs.createReadStream(srcPath), 'master.png', { type: 'image/png' });
        const res = await client.images.edit({
          model,
          image,
          prompt: buildPrompt(master, ratio),
          size: ratio.gen,
          quality: 'medium',
          n: 1,
        });
        const b64 = res.data?.[0]?.b64_json;
        if (!b64) throw new Error('empty response');
        const raw = Buffer.from(b64, 'base64');
        fs.writeFileSync(path.join(RAW_DIR, `${label}_raw.png`), raw);
        const final = await cropResize(raw, ratio.gen, ratio.target);
        const outPath = path.join(OUT_DIR, `${label}.png`);
        fs.writeFileSync(outPath, final);
        const secs = ((Date.now() - t0) / 1000).toFixed(0);
        console.log(`OK  ${label}  (${ratio.target.w}x${ratio.target.h})  ${secs}s`);
        manifest.push({ stem: master.stem, ratio: ratio.id, file: `${label}.png`, ok: true });
      } catch (err) {
        console.log(`ERR ${label}: ${String(err?.message || err).slice(0, 200)}`);
        manifest.push({ stem: master.stem, ratio: ratio.id, ok: false, error: String(err?.message || err).slice(0, 200) });
      }
    }
  }

  fs.writeFileSync('tmp/reframe-manifest.json', JSON.stringify(manifest, null, 2));
  const ok = manifest.filter((m) => m.ok).length;
  console.log(`\nDONE — ${ok}/${manifest.length} images generated.`);
}

main();
