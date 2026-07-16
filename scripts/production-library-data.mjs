/**
 * Production library — winning green-person direction + human handoff metadata.
 * Library first. Production brief second. Lightweight preview third. Editing software never.
 */
import { FORMAT_SPECS } from './vma-approved-masters.mjs';

export const WINNING_MASTER = '04';
export const VARIATION_MASTERS = ['01'];
export const PAUSED_MASTERS = ['02', '03'];

export const WINNING_NOTE =
  'VMA-04 HIPAA Green (green-scrub admin, HIPAA Compliant badge) is the current winning direction. Static images are producing leads more efficiently than longer custom video concepts. New static and motion work should stay visually close to this — do not invent unrelated directions.';

/** Shown on Handoff + Component Library — prevents confusion with older VMA-01 tickets. */
export const ACTIVE_REQUEST_NOTE =
  'Current winner: VMA-04 HIPAA Green — the green-scrub admin with the HIPAA Compliant badge and circular $10/hr offer. If your Monday ticket says VMA-01 Spanish Green, pause that work and use VMA-04 instead. VMA-01 is only an approved variation when explicitly briefed (Spanish badge).';

export const PRODUCTION_STATUS = {
  '04': { label: 'Winning Direction', tone: 'win' },
  '01': { label: 'Approved Variation', tone: 'ok' },
  '02': { label: 'Paused', tone: 'pause' },
  '03': { label: 'Paused', tone: 'pause' },
};

export const TYPOGRAPHY = {
  family: 'Be Vietnam Pro',
  headline: {
    weight: 900,
    case: 'ALL CAPS',
    letterSpacing: '-0.03em',
    lineHeight: '0.94–0.98',
    accentLine: 'Line 2 — VIRTUAL — uses concept accent color',
    mobile: 'Headline must read in under 2 seconds on a phone — scale up, never shrink below legibility',
  },
  subhead: { weight: 600, size: '≈30–34px at 4:5 reference' },
  benefits: { weight: 700, size: '≈26–28px at 4:5 reference' },
  badge: { weight: 800, size: 'Offer / trust badges — high contrast, never pink' },
};

export const LOGO_ASSETS = [
  { label: 'Logo · white SVG', href: '/assets/brand/medvirtual/logo-white.svg', format: 'SVG' },
  { label: 'Logo · color SVG', href: '/assets/brand/medvirtual/logo-colored.svg', format: 'SVG' },
  { label: 'Logomark · white SVG', href: '/assets/brand/medvirtual/logomark-white.svg', format: 'SVG' },
  { label: 'Logomark · color SVG', href: '/assets/brand/medvirtual/logomark-colored.svg', format: 'SVG' },
];

export const PERSON_ASSETS = {
  transparent: '/assets/graphics-kit/options/green-person-a-brunette-bun.png',
  referenceCrop: '/assets/graphics-kit/options/green-person-a-brunette-bun.png',
  scrubColor: '#1F7A4D',
  dimensions: 'High-res transparent PNG · 1024×1536',
  options: [
    { id: 'a', label: 'Brunette · bun (matches winner)', href: '/assets/graphics-kit/options/green-person-a-brunette-bun.png' },
    { id: 'b', label: 'Brunette · hair down', href: '/assets/graphics-kit/options/green-person-b-brunette-down.png' },
    { id: 'c', label: 'Blonde · hair down', href: '/assets/graphics-kit/options/green-person-c-blonde.png' },
  ],
  rules: [
    'No text, badges, backgrounds, or logos baked into the person file',
    'Recolor scrubs only — preserve natural skin tones',
    'Reposition and scale per ratio — never stretch',
  ],
};

export const BACKGROUND_SPEC = {
  type: 'gradient',
  css: 'linear-gradient(135deg, #0a1628 0%, #0d2840 100%)',
  hex: ['#0a1628', '#0d2840'],
  note: 'Rebuild as a separate layer behind the person. Match approved static energy — deep navy/teal, not flat black.',
};

export const ICON_ELEMENTS = [
  { id: 'check', label: 'Checkmark (benefit chips)', type: 'svg-inline', note: 'Simple line check — current color from concept palette' },
  { id: 'phone', label: 'Phone', type: 'request', note: 'Use simple line icon if needed in variations — not on approved master' },
  { id: 'calendar', label: 'Calendar', type: 'request', note: 'Optional for scheduling-angle variations' },
  { id: 'insurance', label: 'Insurance', type: 'request', note: 'Optional for benefit-card variations' },
  { id: 'billing', label: 'Billing', type: 'request', note: 'Optional for benefit-card variations' },
];

export const COPY_LOCKED = {
  headline: { lines: ['HIRE A', 'VIRTUAL', 'MEDICAL', 'ADMIN'], locked: true, accentLine: 1 },
  subhead: { text: 'Reception · insurance · scheduling · billing', locked: true },
  benefits: {
    items: [
      'Reception & Admin Support',
      'Insurance Verification',
      'Appointment Scheduling',
      'Billing Support',
    ],
    locked: true,
  },
  offer: { text: 'Starting at $10/hour', locked: 'pending-claim', note: 'Pending leadership approval — use only as shown on approved master' },
  trust: { text: 'HIPAA Compliant', locked: 'pending-claim', note: 'Concept 04 — shield badge. HIPAA claim pending compliance confirmation before launch.' },
  brand: { text: 'MedVirtual', locked: true, forbid: 'MedVirtual.ai' },
};

export const DELIVERABLES_STATIC = FORMAT_SPECS.map((f) => ({
  ratio: f.label,
  dims: f.dims,
  filename: `MV_VMA_04_HIPAAGreen_${f.id}.png`,
  required: f.id !== '1x1' || true,
}));

export const DELIVERABLES_MOTION = [
  {
    id: '6s-4x5',
    label: '6-second motion · 4:5',
    dims: '1080×1350',
    duration: '6s',
    fps: 30,
    format: 'MP4 H.264',
    filename: 'MV_VMA_04_HIPAAGreen_6s_4x5.mp4',
    sound: 'Works with sound off — captions optional',
    firstFrame: 'Must read as a strong static ad',
  },
  {
    id: '8s-9x16',
    label: '8-second motion · 9:16',
    dims: '1080×1920',
    duration: '8s',
    fps: 30,
    format: 'MP4 H.264',
    filename: 'MV_VMA_04_HIPAAGreen_8s_9x16.mp4',
    sound: 'Sound-off first — subtle bed only if licensed',
    firstFrame: 'Headline + person visible in frame 1',
  },
];

export const GREEN_MOTION_BRIEF = {
  principle: 'Make the winning static move — not a new TV commercial.',
  duration: '6–10 seconds · test 6s first',
  opening: 'Approved static composition visible from frame 0 — no logo-only or slow cinematic intro',
  sequence: [
    { time: '0.0–0.5s', action: 'Full static composition already on screen' },
    { time: '0.2–1.0s', action: 'Subtle person movement, crop push, or light parallax' },
    { time: '0.3–1.2s', action: 'Headline resolves immediately (no long type animation)' },
    { time: '1.0–3.0s', action: 'Benefit cards enter one at a time' },
    { time: '3.0–5.5s', action: 'Complete offer remains readable' },
    { time: 'Final 1–2s', action: 'Price / CTA subtle emphasis · loop cleanly' },
  ],
  motionAllowed: [
    'Slight push-in',
    'Controlled parallax',
    'Headline reveal',
    'Benefit-card stagger',
    'Badge emphasis',
    'Soft background movement',
    'Small glow changes',
  ],
  motionAvoid: [
    'Logo-only openings',
    'Slow cinematic setup',
    'Waiting several seconds for the main idea',
    'Animating everything just because it can move',
  ],
  independentLayers: ['person', 'headline', 'benefit cards', 'offer badge', 'CTA', 'background', 'logo'],
  export: ['MP4 H.264', '30fps', 'Editable AE / CapCut / Premiere source', 'First frame = strong static'],
};

export const SITE_BASE = 'https://medvirtual-ad-content-doc.vercel.app';

/** Direct links for Philippines team — everything on the site. */
export const TEAM_HANDOFF_LINKS = [
  {
    step: 1,
    label: 'Component Library — start here',
    path: '/graphics-kit.html#04-4x5',
    note: 'Transparent person PNG, logos, headline copy, colors, and layout reference for each size.',
  },
  {
    step: 2,
    label: 'Approved winner',
    path: '/vma-approved.html',
    note: 'VMA-04 HIPAA Green — match this look.',
  },
  {
    step: 3,
    label: 'Static Production — Meta sizes',
    path: '/vma-static.html',
    note: '1:1 · 4:5 · 9:16 · 1.91:1 with exact pixel sizes and filenames.',
  },
  {
    step: 4,
    label: 'Animated Video — motion brief',
    path: '/vma-video.html#green-motion',
    note: '6-second sequence: make the winning static move.',
  },
];

function teamLink(path) {
  return `${SITE_BASE}${path}`;
}

export const MONDAY_REQUEST = {
  formUrl: 'https://forms.monday.com/forms/d03f1925ccfafd8f54a39d90a0e277d4?r=use1',
  fields: {
    brand: 'MedVirtual',
    type: 'Ad Graphics',
    title: 'VMA-04 HIPAA Green — 3–4 static variations + 1 animation',
    description: `Please pause all other open MedVirtual graphics requests (including any earlier VMA-01 / green-person tickets). This request replaces them.

Creative direction: VMA-04 HIPAA Green — green-scrub Virtual Medical Admin with HIPAA Compliant badge and circular $10/hr offer. Match the approved 1:1 master exactly. Do not use the older VMA-01 Spanish Green layout unless explicitly briefed as a variation.

Please deliver:
• 3–4 static variations of the green-person concept, each in Meta aspect ratios: 1:1 (1080×1080), 4:5 (1080×1350), 9:16 (1080×1920), and 1.91:1 (1200×628)
• 1 short animated sequence (about 6 seconds) based on the winning static — make the static move; do not invent a new video concept

Production links:
• Component Library (assets + copy): ${teamLink('/graphics-kit.html#04-4x5')}
• Approved winner: ${teamLink('/vma-approved.html')}
• Aspect ratios + filenames: ${teamLink('/vma-static.html')}
• Motion brief: ${teamLink('/vma-video.html#green-motion')}

Brand rules: MedVirtual logo only (never MedVirtual.ai) · no pink · rebuild each ratio (do not stretch the square) · deliver PNG + editable source (PSD / AI / Figma).`,
    resolution: 'Custom — see Static Production for exact pixels per ratio',
    dueDate: 'Per sprint assignment',
    references: teamLink('/graphics-kit.html#04-4x5'),
  },
};

export const CONCEPT_VARIATIONS = [
  {
    id: 'var-core',
    name: 'Core winner',
    master: '04',
    status: 'Winning Direction',
    note: 'Approved 1:1 live reference — all new work matches this',
  },
  {
    id: 'var-spanish',
    name: 'Spanish variation',
    master: '01',
    status: 'Approved Variation',
    note: 'Same green person — Spanish badge instead of HIPAA. Only when briefed.',
  },
  {
    id: 'var-scroll-01',
    name: 'Giant type (no people)',
    status: 'Concept Review',
    thumb: '/assets/mockups/mock-01-giant-type.png',
    note: 'Experimental — thumbs up/down on Concept Review page',
  },
  {
    id: 'var-scroll-02',
    name: 'Split missed/handled',
    status: 'Concept Review',
    thumb: '/assets/mockups/mock-02-split-missed-handled.png',
    note: 'Experimental split-screen',
  },
  {
    id: 'var-scroll-03',
    name: 'Split person',
    status: 'Concept Review',
    thumb: '/assets/mockups/mock-03-split-person.png',
    note: 'Person + bold type split',
  },
];
