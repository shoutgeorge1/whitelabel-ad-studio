/**
 * Competitor Wall seed + rules.
 *
 * The rendered wall prefers live Ad Library stills from
 * public/assets/competitors/live-snapshots.json — only creatives with
 * real image files on disk are shown. Empty / research-only cards stay off the wall.
 *
 * Regenerate primary wall: npm run generate:vma
 * Refresh live stills periodically: npm run generate:competitor-snaps (or the refresh agent)
 */

export const COMPETITOR_META = {
  title: 'Competitor Wall',
  intro: 'Real competitor ads. Steal the energy — never the layout, colors, or badges.',
  howToRefresh: [
    'One card per company — no duplicate brands.',
    'Only add companies we do not already have.',
    'No image = not on the wall. Capture a real still, then regenerate.',
    'Spotted a useful medical VA ad from a new brand? Email george.a@legalsoft.com.',
  ],
  libraryBase:
    'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&media_type=all&search_type=keyword_unordered&q=',
};

/**
 * Live snapshot source keys allowed onto the wall.
 * Skip off-category / wrong scrapes (pet meds, consumer derm, shoe ads).
 */
export const WALL_LIVE_SOURCE_IDS = [
  'generic-va-commodity',
  'hello-rache',
  'weave',
  'commure-scribe',
];

/**
 * Extra static creatives with verified on-disk images (not wrong scrapes).
 * One card per company. `featured: true` floats strongest/newest to the top.
 */
export const WALL_STATIC_CREATIVES = [
  {
    id: 'portiva-hero',
    name: 'Portiva',
    category: 'virtual-staffing',
    featured: true,
    whyWatch: 'Office-supervised medical VA brand — long-running neighbor.',
    adLibraryQuery: 'Portiva',
    image: '/assets/competitors/portiva.jpg',
    fingerprint: {
      hookStyle: 'Trained medical VAs · supervised teams',
      visual: 'People-forward medical VA marketing',
      weakness: 'Can read like generic staffing stock',
    },
    steal: 'Role clarity + human face stops the scroll.',
    reject: 'Copying their supervision / office framing as our trade dress.',
    remix: 'Dedicated Virtual Medical Admin hire — MedVirtual colors, no pink.',
  },
  {
    id: 'wishup-hero',
    name: 'Wishup',
    category: 'virtual-staffing',
    featured: true,
    whyWatch: 'Managed VA platform pushing hard into healthcare.',
    adLibraryQuery: 'Wishup',
    image: '/assets/competitors/wishup.jpg',
    fingerprint: {
      hookStyle: 'Testimonial + medical VA proof',
      visual: 'Portrait + review social proof',
      weakness: 'Platform / managed service, not a single dedicated hire story',
    },
    steal: 'Social proof next to a real face reads fast on mobile.',
    reject: 'Managed-VA marketplace positioning for MedVirtual.',
    remix: 'One dedicated Virtual Medical Admin — not a talent marketplace.',
  },
  {
    id: 'medva-hero',
    name: 'MedVA',
    category: 'virtual-staffing',
    featured: true,
    whyWatch: 'Direct category competitor — medical VA staffing.',
    adLibraryQuery: 'MedVA',
    image: '/assets/competitors/medva.jpg',
    fingerprint: {
      hookStyle: 'Healthcare virtual assistant company',
      visual: 'Clean brand plate + healthcare cues',
      weakness: 'Easy to look like every other VA brand',
    },
    steal: 'Category-owning name + simple healthcare signal.',
    reject: 'Blending into soft teal VA commodity look.',
    remix: 'Bolder MedVirtual hierarchy — huge Hire a Virtual Medical Admin.',
  },
  {
    id: 'almostfriday-hero',
    name: 'Almost Friday',
    category: 'virtual-staffing',
    featured: true,
    whyWatch: 'Newer VA staffing brand with strong lifestyle energy.',
    adLibraryQuery: 'Almost Friday',
    image: '/assets/competitors/almostfriday.jpg',
    fingerprint: {
      hookStyle: 'Lifestyle / culture-led VA hire',
      visual: 'Bold brand mark · open-graph creative',
      weakness: 'Not always medical-specific',
    },
    steal: 'Brand energy that feels different from cheap VA ads.',
    reject: 'Copying their mark, colors, or lifestyle system.',
    remix: 'Same energy, MedVirtual VMA hire message, no pink.',
  },
  {
    id: 'hello-rache-hero',
    name: 'Hello Rache',
    category: 'virtual-staffing',
    featured: true,
    whyWatch: 'Closest neighbor — “not all medical VAs are equal.”',
    adLibraryQuery: 'Hello Rache',
    image: '/assets/competitors/hello-rache.jpg',
    fingerprint: {
      hookStyle: 'Not all medical VAs are equal',
      visual: 'Purple comparison layout · clinical talent',
      weakness: 'Purple / pink-leaning system — reference only',
    },
    steal: 'Clear medical VA vs generic VA framing.',
    reject: 'Purple / pink palette or copy-cat comparison layout.',
    remix: 'MedVirtual bold VMA hire message — no pink.',
  },
  {
    id: 'commure-scribe-hero',
    name: 'Commure',
    category: 'practice-saas',
    featured: true,
    whyWatch: 'AI-automation angle — the opposite of a real human hire.',
    adLibraryQuery: 'Commure',
    image: '/assets/competitors/commure-scribe.jpg',
    fingerprint: {
      hookStyle: 'AI does the busywork · hours saved',
      visual: 'White + blue claim cards',
      weakness: 'AI automation — not dedicated human staff',
    },
    steal: 'Front-desk failure modes read fast.',
    reject: 'AI-agent replacement positioning.',
    remix: 'Same pain → a dedicated human Virtual Medical Admin.',
  },
  {
    id: 'weave-schedule-hero',
    name: 'Weave',
    category: 'practice-saas',
    whyWatch: 'Front-desk / scheduling pain — software, not a dedicated hire.',
    adLibraryQuery: 'Weave',
    image: '/assets/competitors/weave.jpg',
    fingerprint: {
      hookStyle: 'Schedule appointments 24/7',
      visual: 'Phone UI + one clear benefit',
      weakness: 'Software product',
    },
    steal: 'One pain, one benefit, high mobile clarity.',
    reject: '“We run your front desk” language for MedVirtual.',
    remix: 'Pain in copy; on-image stays Hire a Virtual Medical Admin.',
  },
];

/**
 * Known bad / off-category image paths — never show these.
 * (Wrong Ad Library matches: shoes, pet meds, etc.)
 */
export const BLOCKED_COMPETITOR_IMAGES = new Set([
  '/assets/competitors/quadrant-health.jpg',
  '/assets/competitors/live/quadrant-health-1.jpg',
  '/assets/competitors/nexhealth.jpg',
  '/assets/competitors/live/nexhealth-1.jpg',
  '/assets/competitors/zocdoc.jpg',
  '/assets/competitors/live/zocdoc-1.jpg',
  '/assets/competitors/live/zocdoc-2.jpg',
  '/assets/competitors/live/zocdoc-3.jpg',
  '/assets/competitors/live/zocdoc-4.jpg',
]);

/**
 * Seed records kept for Ad Library links / other tools.
 * The wall itself is built from live snapshots + WALL_STATIC_CREATIVES.
 */
/** @type {Array<Record<string, unknown>>} */
export const COMPETITOR_ADS = [
  {
    id: 'hello-rache',
    name: 'Hello Rache',
    category: 'virtual-staffing',
    whyWatch: 'Closest category neighbor — medical virtual assistants.',
    adLibraryQuery: 'Hello Rache',
    image: '/assets/competitors/hello-rache.jpg',
    fingerprint: {
      hookStyle: 'Medical VA comparison · price transparency',
      visual: 'Purple brand · clinical talent',
      weakness: 'Purple / pink-leaning — reference only',
    },
    steal: 'Clear role framing in one glance.',
    reject: 'Purple / pink palette or exact badge shapes.',
    remix: 'Original MedVirtual VMA layout — no pink.',
  },
  {
    id: 'generic-va-commodity',
    name: 'Medical VA commodity ads',
    category: 'virtual-staffing',
    whyWatch: 'Crowded medical VA / receptionist hiring ads.',
    adLibraryQuery: 'hire a medical virtual assistant',
    adLibraryQueries: [
      'hire a medical virtual assistant',
      'medical virtual assistant',
      'hire medical VA',
      'healthcare virtual assistant',
      'virtual medical receptionist',
    ],
    image: '/assets/competitors/live/generic-va-1.jpg',
    fingerprint: {
      hookStyle: 'Price / trained VA / front-desk staffing',
      visual: 'Mixed commodity VA plates',
      weakness: 'Easy to blend into the pack',
    },
    steal: 'Simple role + price + human face can stop the scroll.',
    reject: 'Blending into cheap-VA commodity look.',
    remix: 'Bold MedVirtual masters with clearer hierarchy.',
  },
  {
    id: 'weave',
    name: 'Weave',
    category: 'practice-saas',
    whyWatch: 'Front-desk missed-call / scheduling pain.',
    adLibraryQuery: 'Weave',
    image: '/assets/competitors/weave.jpg',
    fingerprint: {
      hookStyle: 'Missed calls · scheduling',
      visual: 'Bright product moments',
      weakness: 'Software, not staffing',
    },
    steal: 'Tight front-office hooks.',
    reject: 'Managed front-desk positioning.',
    remix: 'Human VMA hire answer.',
  },
  {
    id: 'commure-scribe',
    name: 'Commure — AI scribe',
    category: 'practice-saas',
    whyWatch: 'AI-automation angle — opposite of a real human hire.',
    adLibraryQuery: 'Commure',
    image: '/assets/competitors/commure-scribe.jpg',
    fingerprint: {
      hookStyle: 'AI does the busywork · hours saved',
      visual: 'White + blue claim cards',
      weakness: 'AI automation, not dedicated staff',
    },
    steal: 'Front-desk failure modes read fast.',
    reject: 'AI-agent replacement positioning.',
    remix: 'Same pain → dedicated human Virtual Medical Admin.',
  },
];

export const FEATURED_COMPETITOR_IDS = COMPETITOR_ADS.map((a) => a.id);

/** @deprecated empty research wall — no image = not shown */
export const RESEARCH_COMPETITOR_IDS = [];

export const PINK_REFERENCE_COMPETITOR_IDS = new Set(['hello-rache']);

export const WEEKLY_FORK_PROMPTS = [
  {
    id: 'fork-vma-lime',
    talent: 'Generic VMA talent',
    size: '1080×1350',
    lookbook: 'Hire a Virtual Medical Admin · Electric Lime color test',
    experiment: 'Giant headline · 4 benefit blocks · price badge pending',
    saas: 'N/A — SaaS direction removed July 2026',
  },
  {
    id: 'fork-missed-calls',
    talent: 'Generic VMA talent',
    size: '1080×1350',
    lookbook: 'Too Many Patient Calls? · Signal Yellow',
    experiment: 'Pain-first hook · same benefit stack · no pink',
    saas: 'N/A — SaaS direction removed July 2026',
  },
  {
    id: 'fork-spanish',
    talent: 'Generic VMA talent',
    size: '1080×1350',
    lookbook: 'Contrata a un Asistente Médico Virtual',
    experiment: 'Full Spanish · Se Habla badge option · no nationality assumption',
    saas: 'N/A — SaaS direction removed July 2026',
  },
];

export function adLibraryUrl(query) {
  return COMPETITOR_META.libraryBase + encodeURIComponent(query);
}
