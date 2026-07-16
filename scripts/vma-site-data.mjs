/**
 * VMA (Virtual Medical Admin) Meta production — single source of truth.
 *
 * CURRENT DIRECTION — BOLD VIRTUAL MEDICAL ADMIN ADS + ANIMATED VIDEO.
 * Human-led, offer-first, mobile-readable static ads + short animated video.
 *
 * HARD RULES enforced in this file:
 *   - NO PINK / magenta / rose / fuchsia anywhere in creative palettes.
 *     Approved creative hexes only: #B8F000 lime, #FFE600 yellow, #1D4ED8 cobalt,
 *     #00E5FF cyan, #22C55E green, #E10600 commercial red, #000000 black, #FFFFFF white.
 *   - Ad-facing brand is MedVirtual — never MedVirtual.ai.
 *   - MedVirtual supplies dedicated full-time virtual staff who join the practice team.
 *     Not a call center, not AI, not a SaaS product, not a managed front desk.
 *   - Every price / HIPAA / savings claim requires confirmation before launch.
 *   - $100 no-lead rule (see VMA_META.hundredDollarRule) governs kill / iterate decisions.
 *
 * Regenerate the site with: node scripts/generate-vma-site.mjs
 */

// ─── Meta ────────────────────────────────────────────────────────────────────

export const VMA_META = {
  banner: 'MAKE ADS THAT BOOK DEMOS',
  bannerSub:
    'For the graphics team — match the four approved masters, build scroll-stopping concepts, rebuild every Meta size. Mine competitors for energy, never copy their layouts.',
  coreHeadline: 'HIRE A VIRTUAL MEDICAL ADMIN',
  coreHeadlineEs: 'CONTRATA A UN ASISTENTE MÉDICO VIRTUAL',
  reviewDate: '2026-07-14',
  reviewDateDisplay: 'July 14, 2026',
  campaignName: 'MedVirtual Meta Leads — Virtual Medical Admin',
  recommendedCta: 'Learn More',
  alternateCta: 'Get Started',
  privacyPolicyUrl: 'https://www.medvirtual.ai/privacy-policy',
  completionUrl: 'https://www.medvirtual.ai',
  status: 'Approved Creative Baseline',
  hundredDollarRule:
    '$100 NO-LEAD RULE: If an individual ad spends $100 with zero qualified leads, pause it and iterate the creative (new color, headline, or offer). Do not keep paying to lose. Judge each ad on cost-per-lead, not impressions.',
  rules: [
    'NO PINK — never use pink, magenta, hot pink, rose, or fuchsia in any creative.',
    'Ad-facing brand is MedVirtual — never MedVirtual.ai.',
    'MedVirtual supplies dedicated full-time virtual staff who join the practice team — not a call center, not AI, not a SaaS product, not a managed front desk.',
    'Keep claims already printed on the approved masters ($10, HIPAA on Concept 04, Spanish on Concept 01). Do not invent new claims for resize work.',
    'Rebuild each layout for the canvas — do not stretch or simply crop.',
    'No medical outcome claims, guaranteed savings, guaranteed staffing results, or invented credentials.',
  ],
  conceptBatchRequest:
    'Please create 15–20 original MedVirtual Meta ad concepts. Use bold Virtual Medical Admin messaging, large mobile-readable headlines, a prominent professional person, three or four service benefits, and bright high-contrast colors. Use teal, deep navy, blue, cyan, lime, green, yellow, white, black, or limited red. Do not use pink. Do not copy competitor layouts. Provide initial square concepts first, then build approved concepts in all required aspect ratios.',
  chatgptQaChecks: [
    'Misspelled words',
    'Incorrect price',
    'Incorrect services',
    'Fake logos',
    'Fake compliance claims',
    'Broken hands',
    'Broken laptops',
    'Incorrect headset',
    'Incorrect Spanish',
    'Incorrect flag',
    'Accidental pink',
    'Unreadable text',
  ],
  approvedCreativeHexes: [
    '#B8F000',
    '#FFE600',
    '#1D4ED8',
    '#00E5FF',
    '#22C55E',
    '#E10600',
    '#000000',
    '#FFFFFF',
  ],
  forbiddenHexes: [
    '#EC4899',
    '#F472B6',
    '#DB2777',
    '#BE185D',
    '#FF1493',
    '#FF00AA',
    '#E11D48',
    '#F43F5E',
  ],
  chatgptRisks: [
    'ChatGPT / DALL·E image models frequently render illegible or misspelled text — never ship AI-baked headline text; overlay all copy in design tools.',
    'AI images drift toward pink/rose scrub tones — explicitly negative-prompt pink and verify every export.',
    'AI can invent fake badges, logos, or UI chrome — remove anything implying software, awards, or credentials.',
    'AI faces can look like generic stock or influencers — direct toward a credible medical admin, not a model.',
    'AI may add call-center headsets or physician white coats — both are off-model; negative-prompt them.',
    'Never let AI generate patient data, real names, or readable EHR screens.',
    'Treat AI output as a raw plate only — the designer composes the final ad.',
  ],
};

// ─── Navigation — 8 primary pages ────────────────────────────────────────────

export const VMA_NAV = [
  { href: '/studio.html', label: 'Dashboard', id: 'studio', description: 'Approved ads, checklist, formats, quick links.' },
  { href: '/vma-approved.html', label: 'Approved Creative', id: 'vma-approved', description: 'Four approved masters — image-first.' },
  { href: '/ideas.html', label: 'New Ad Ideas', id: 'ideas', description: '15–20 concept batch builder.' },
  { href: '/vma-static.html', label: 'Aspect Ratios', id: 'vma-static', description: '1:1 · 4:5 · 9:16 · 1.91:1.' },
  { href: '/competitors.html', label: 'Competitor Wall', id: 'competitors', description: 'Image-first references — do not copy.' },
  { href: '/vma-video.html', label: 'Animated Video', id: 'vma-video', description: 'Motion from approved statics.' },
  { href: '/vma-chatgpt.html', label: 'Prompts & Copy', id: 'vma-chatgpt', description: 'ChatGPT, video prompts, EN/ES copy.' },
  { href: '/vma-handoff.html', label: 'Production Handoff', id: 'vma-handoff', description: 'Next wave, pace, and done line.' },
];

// ─── Idea categories + batch structure ───────────────────────────────────────

export const IDEA_CATEGORIES = [
  {
    id: 'core',
    title: 'Category 1 — Core Offer',
    examples: [
      'Hire a Virtual Medical Admin',
      'Add a Virtual Medical Admin',
      'Build Your Medical Admin Team',
      'Add Dedicated Front-Office Support',
    ],
  },
  {
    id: 'pain',
    title: 'Category 2 — Pain Point',
    examples: [
      'Too Many Patient Calls?',
      'Stop Missing Patient Calls',
      'Your Front Desk Needs Backup',
      'Is Administrative Work Piling Up?',
      'Too Much Insurance Work?',
      'Your Staff Is Stretched Too Thin',
    ],
  },
  {
    id: 'role',
    title: 'Category 3 — Role Specific',
    examples: [
      'Virtual Medical Receptionist',
      'Virtual Medical Biller',
      'Insurance Verification Support',
      'Preauthorization Support',
      'Appointment Scheduling Support',
      'Patient Intake Support',
      'Dental Virtual Assistant',
      'Claims Follow-Up Support',
    ],
  },
  {
    id: 'audience',
    title: 'Category 4 — Language and Audience',
    examples: [
      'Spanish-Speaking Medical Admin',
      'Fully Spanish Creative',
      'Dental Practices',
      'Medical Billing Teams',
      'Growing Practices',
      'Practice Managers',
      'Specialty Practices',
    ],
  },
  {
    id: 'offer',
    title: 'Category 5 — Offer and CTA',
    examples: [
      'Starting at $10/Hour',
      'Request an Interview',
      'Find Your Virtual Admin',
      'Book a Demo',
      'Add Full-Time Support',
      'Get More Front-Office Help',
    ],
  },
];

export const CONCEPT_BATCH_STRUCTURE = [
  { count: 4, label: 'Core Offer Concepts' },
  { count: 4, label: 'Pain-Point Concepts' },
  { count: 4, label: 'Role-Specific Concepts' },
  { count: 3, label: 'Spanish or Bilingual Concepts' },
  { count: 3, label: 'Offer or CTA Concepts' },
  { count: 2, label: 'Experimental Concepts' },
];

// ─── Color families — 7 (NO PINK) ────────────────────────────────────────────

const NO_PINK =
  'Forbidden: pink, magenta, hot pink, rose, fuchsia (#EC4899, #F472B6, #DB2777, #BE185D, #FF1493, #E11D48 and similar).';

export const COLOR_FAMILIES = [
  {
    id: 'electric-lime',
    name: 'Electric Lime',
    priority: 1,
    background: '#0A0A0A',
    backgroundAlt: '#111111',
    accent: '#B8F000',
    foreground: '#FFFFFF',
    headlineColor: '#FFFFFF',
    bulletColor: '#F0FFF0',
    ctaBg: '#B8F000',
    ctaText: '#0A0A0A',
    scrubColor: '#B8F000',
    secondary: '#00E5FF',
    contrastStrategy: 'White headline on near-black plate; lime CTA + scrub; cyan badge details.',
    forbiddenNote: NO_PINK,
  },
  {
    id: 'signal-yellow',
    name: 'Signal Yellow',
    priority: 2,
    background: '#FFE600',
    backgroundAlt: '#E6CF00',
    accent: '#FFE600',
    foreground: '#000000',
    headlineColor: '#000000',
    bulletColor: '#111111',
    ctaBg: '#000000',
    ctaText: '#FFE600',
    scrubColor: '#FFE600',
    secondary: '#1D4ED8',
    contrastStrategy: 'Black headline on signal yellow; black CTA with yellow label; cobalt accents.',
    forbiddenNote: NO_PINK,
  },
  {
    id: 'cobalt-blue',
    name: 'Cobalt Blue',
    priority: 3,
    background: '#1D4ED8',
    backgroundAlt: '#1E3A8A',
    accent: '#1D4ED8',
    foreground: '#FFFFFF',
    headlineColor: '#FFFFFF',
    bulletColor: '#E8F0FF',
    ctaBg: '#FFFFFF',
    ctaText: '#1D4ED8',
    scrubColor: '#1D4ED8',
    secondary: '#00E5FF',
    contrastStrategy: 'White type on cobalt plate; white CTA with cobalt text; cyan badge highlights.',
    forbiddenNote: NO_PINK,
  },
  {
    id: 'high-voltage-cyan',
    name: 'High-Voltage Cyan',
    priority: 4,
    background: '#020617',
    backgroundAlt: '#0F172A',
    accent: '#00E5FF',
    foreground: '#FFFFFF',
    headlineColor: '#FFFFFF',
    bulletColor: '#E0F7FF',
    ctaBg: '#00E5FF',
    ctaText: '#020617',
    scrubColor: '#00E5FF',
    secondary: '#B8F000',
    contrastStrategy: 'White headline on navy plate; cyan CTA + scrub; lime secondary pops.',
    forbiddenNote: NO_PINK,
  },
  {
    id: 'vivid-green',
    name: 'Vivid Green',
    priority: 5,
    background: '#22C55E',
    backgroundAlt: '#16A34A',
    accent: '#22C55E',
    foreground: '#000000',
    headlineColor: '#000000',
    bulletColor: '#052E16',
    ctaBg: '#000000',
    ctaText: '#FFFFFF',
    scrubColor: '#22C55E',
    secondary: '#FFE600',
    contrastStrategy: 'Black headline on vivid green; black CTA; yellow or cyan badge accents.',
    forbiddenNote: NO_PINK,
  },
  {
    id: 'commercial-red',
    name: 'Commercial Red',
    priority: 6,
    background: '#0A0A0A',
    backgroundAlt: '#111111',
    accent: '#E10600',
    foreground: '#FFFFFF',
    headlineColor: '#FFFFFF',
    bulletColor: '#FFF5F5',
    ctaBg: '#E10600',
    ctaText: '#FFFFFF',
    scrubColor: '#E10600',
    secondary: '#FFE600',
    contrastStrategy: 'White headline on dark plate; true commercial red (#E10600) CTA + scrub — never pink-rose.',
    forbiddenNote:
      'Use true commercial red only (#E10600). Forbidden: pink, rose, fuchsia, magenta, coral, salmon, #EC4899, #F472B6, #E11D48.',
  },
  {
    id: 'bright-white',
    name: 'Bright White',
    priority: 7,
    background: '#FFFFFF',
    backgroundAlt: '#F4F4F5',
    accent: '#000000',
    foreground: '#000000',
    headlineColor: '#000000',
    bulletColor: '#111111',
    ctaBg: '#000000',
    ctaText: '#FFFFFF',
    scrubColor: '#1D4ED8',
    secondary: '#1D4ED8',
    contrastStrategy: 'Black headline on bright white; black CTA; cobalt or lime accents only. High clean contrast.',
    forbiddenNote: NO_PINK,
  },
];

const COLOR_BY_ID = Object.fromEntries(COLOR_FAMILIES.map((c) => [c.id, c]));

// ─── Talent direction ────────────────────────────────────────────────────────

export const TALENT_DIRECTION = {
  role: 'Virtual Medical Administrator',
  look: 'Professional female virtual medical administrator — credible, warm, approachable, mid-20s to late-30s.',
  wardrobe:
    'Scrubs matching the active color family (lime, yellow, blue, cyan, green, commercial red, or navy/white). Never pink, magenta, rose, or prison-orange.',
  framing: 'Right side of frame or hero center; face and upper torso clear; confident posture.',
  do: [
    'Look like a real healthcare administrative professional.',
    'Warm, trustworthy expression with direct eye contact.',
    'Clean production lighting, high contrast against the color plate.',
    'Diverse casting acceptable — do not imply a specific nationality.',
  ],
  avoid: [
    'Pink, magenta, rose, or fuchsia scrubs or clothing.',
    'Fashion-model / influencer posing.',
    'Clinical nurse bedside care.',
    'Generic headset call-center agent.',
    'Physician white coat or stethoscope implying a doctor.',
    'Prison-orange or neon scrubs.',
  ],
};

// ─── Claims ──────────────────────────────────────────────────────────────────

export const CLAIM_STATUSES = [
  'Confirmed',
  'Pending Leadership',
  'Pending Compliance',
  'Approved for Test',
  'Approved for Launch',
  'Rejected',
  'Do Not Use',
];

export const CLAIMS = [
  {
    id: 'price-10hr',
    label: 'Starting at $10/hr',
    claimText: 'Starting at $10 per hour',
    category: 'pricing',
    status: 'Pending Leadership',
    notes: 'Requires final leadership confirmation before it appears on any creative or form.',
  },
  {
    id: 'hipaa',
    label: 'HIPAA Compliant',
    claimText: 'HIPAA Compliant',
    category: 'compliance',
    status: 'Pending Compliance',
    notes: 'Requires compliance confirmation before launch.',
  },
  {
    id: 'dedicated-ft',
    label: 'Dedicated Full-Time Staff',
    claimText: 'Dedicated full-time virtual staff who join your practice team',
    category: 'model',
    status: 'Confirmed',
    notes: 'Core business-model truth — safe for body copy and supporting lines.',
  },
  {
    id: 'not-call-center',
    label: 'Not a Call Center',
    claimText: 'Dedicated staff — not a call center, not AI, not software',
    category: 'model',
    status: 'Confirmed',
    notes: 'Differentiator truth — safe to use.',
  },
  {
    id: 'trained-admin',
    label: 'Trained Medical Admin Support',
    claimText: 'Healthcare-trained virtual administrative staff',
    category: 'model',
    status: 'Confirmed',
    notes: 'Safe general claim — do not claim specific certifications for a given candidate.',
  },
  {
    id: 'spanish-available',
    label: 'Spanish-Speaking Staff Available',
    claimText: 'Spanish-speaking virtual staff available',
    category: 'availability',
    status: 'Pending Leadership',
    notes: 'Confirm availability messaging with operations before launch.',
  },
  {
    id: 'free-consultation',
    label: 'Free Staffing Consultation',
    claimText: 'Free staffing consultation',
    category: 'offer',
    status: 'Pending Leadership',
    notes: 'Pending leadership approval — do not publish on form or completion screen.',
  },
  {
    id: 'savings-percent',
    label: 'Save up to XX%',
    claimText: 'Save up to XX% on staffing',
    category: 'pricing',
    status: 'Do Not Use',
    notes: 'No invented savings percentages.',
  },
  {
    id: 'instant-placement',
    label: 'Instant Placement / Hire Today',
    claimText: 'Instant placement — hire today',
    category: 'placement',
    status: 'Do Not Use',
    notes: 'Do not claim instant placement unless verified.',
  },
];

// ─── Copy bank ───────────────────────────────────────────────────────────────

export const CTA_OPTIONS = {
  primary: { en: 'Learn More', es: 'Más Información' },
  alternate: { en: 'Get Started', es: 'Comenzar' },
};

export const SERVICE_BULLET_BANK = {
  core: ['Reception & Admin Support', 'Insurance Verification', 'Preauthorization Support', 'Medical Billing Support'],
  calls: ['Answer Patient Calls', 'Schedule Appointments', 'Follow Up With Patients', 'Manage Front-Desk Tasks'],
  scheduling: ['Schedule Appointments', 'Confirm Upcoming Visits', 'Manage Reschedules', 'Reduce No-Shows'],
  insurance: ['Insurance Verification', 'Eligibility Checks', 'Preauthorization Support', 'Prior-Auth Follow-Up'],
  billing: ['Medical Billing Support', 'Claims Follow-Up', 'Patient Balance Outreach', 'Insurance Admin Tasks'],
  intake: ['Patient Intake Forms', 'Collect Patient Details', 'Prep Charts for Visits', 'Registration Support'],
  dental: ['Answer Patient Calls', 'Schedule Appointments', 'Insurance Verification', 'Treatment Follow-Up'],
  dedicated: ['Join Your Practice Team', 'Answer Calls & Schedule', 'Verify Insurance', 'Support Intake & Follow-Up'],
  spanish: ['Recepción y Apoyo Administrativo', 'Verificación de Seguros', 'Apoyo de Preautorización', 'Apoyo de Facturación'],
  spanishCalls: ['Contesta Llamadas', 'Agenda Citas', 'Da Seguimiento a Pacientes', 'Apoya al Mostrador'],
};

// ─── Static concept factory + concepts (24) ──────────────────────────────────

function buildConcept({
  number,
  name,
  role = 'Virtual Medical Admin',
  audience,
  language = 'en',
  headline,
  supportingLine,
  benefits,
  colorFamilyId,
  offer = 'No published offer — direct to staffing conversation.',
  trustBadge = 'Dedicated-staff seal (optional) — no unapproved claims.',
  cta,
  animationTemplate,
  videoDuration = '15s',
  formId = 'form-a',
  claimIds = ['dedicated-ft'],
  productionStatus = 'Ready for design',
  group,
  groupLabel,
}) {
  const family = COLOR_BY_ID[colorFamilyId];
  const resolvedCta = cta || (language === 'es' ? CTA_OPTIONS.primary.es : CTA_OPTIONS.primary.en);
  return {
    number,
    name,
    role,
    audience,
    language,
    headline,
    supportingLine,
    benefits,
    talentDirection: `${TALENT_DIRECTION.look} Wardrobe: ${family.name} scrub top (${family.scrubColor}). ${TALENT_DIRECTION.framing}`,
    colorFamilyId,
    offer,
    trustBadge,
    cta: resolvedCta,
    staticFormats: ['1:1', '4:5', '9:16'],
    videoDuration,
    animationTemplate,
    formId,
    claimIds,
    productionStatus,
    group,
    groupLabel,
    reviewer: '',
    performanceNotes: '',
  };
}

export const CONCEPTS = [
  // ── Core (1–4) ──
  buildConcept({
    number: 'VMA-01',
    name: 'Hire a Virtual Medical Admin',
    audience: 'US medical & multi-specialty practices — broad cold lead gen.',
    headline: 'HIRE A VIRTUAL MEDICAL ADMIN',
    supportingLine: 'Dedicated full-time virtual staff who join your practice team.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'electric-lime',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft'],
    group: 1,
    groupLabel: 'Core',
  }),
  buildConcept({
    number: 'VMA-02',
    name: 'Add a Virtual Medical Admin to Your Team',
    audience: 'Practice owners and office managers open to added capacity.',
    headline: 'ADD A VIRTUAL MEDICAL ADMIN TO YOUR TEAM',
    supportingLine: 'A dedicated teammate for calls, scheduling, and follow-up — not a call center.',
    benefits: SERVICE_BULLET_BANK.dedicated,
    colorFamilyId: 'cobalt-blue',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft', 'not-call-center'],
    group: 1,
    groupLabel: 'Core',
  }),
  buildConcept({
    number: 'VMA-03',
    name: 'Dedicated Full-Time Virtual Staff',
    audience: 'Buyers burned by shared-pool / call-center VA models.',
    headline: 'HIRE DEDICATED FULL-TIME VIRTUAL STAFF',
    supportingLine: 'Full-time teammates who join your practice — not a shared agent pool.',
    benefits: SERVICE_BULLET_BANK.dedicated,
    colorFamilyId: 'high-voltage-cyan',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft', 'not-call-center'],
    group: 1,
    groupLabel: 'Core',
  }),
  buildConcept({
    number: 'VMA-04',
    name: 'Trained Medical Admin Support',
    audience: 'Practices seeking healthcare-trained administrative help.',
    headline: 'TRAINED MEDICAL ADMIN SUPPORT FOR YOUR PRACTICE',
    supportingLine: 'Healthcare-trained virtual staff for reception, insurance, preauth, and billing.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'signal-yellow',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft', 'trained-admin'],
    group: 1,
    groupLabel: 'Core',
  }),

  // ── Pain (5–8) ──
  buildConcept({
    number: 'VMA-05',
    name: 'Too Many Patient Calls?',
    audience: 'Overloaded front desks losing calls.',
    headline: 'TOO MANY PATIENT CALLS?',
    supportingLine: 'Add dedicated virtual staff to help answer calls and keep the schedule moving.',
    benefits: SERVICE_BULLET_BANK.calls,
    colorFamilyId: 'commercial-red',
    animationTemplate: 'VMAMissedCalls15',
    claimIds: ['dedicated-ft'],
    group: 2,
    groupLabel: 'Pain',
  }),
  buildConcept({
    number: 'VMA-06',
    name: 'Your Front Desk Is Overloaded',
    audience: 'Decision-makers feeling front-desk chaos.',
    headline: 'YOUR FRONT DESK IS OVERLOADED',
    supportingLine: 'Add full-time virtual staff who join your team — not a call center.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'signal-yellow',
    animationTemplate: 'VMAPainSolution15',
    claimIds: ['dedicated-ft', 'not-call-center'],
    group: 2,
    groupLabel: 'Pain',
  }),
  buildConcept({
    number: 'VMA-07',
    name: 'Stop Missing Patient Calls',
    audience: 'Practices losing appointments to unanswered phones.',
    headline: 'STOP MISSING PATIENT CALLS',
    supportingLine: 'Missed calls cost appointments. Get dedicated help with calls and scheduling.',
    benefits: SERVICE_BULLET_BANK.calls,
    colorFamilyId: 'electric-lime',
    animationTemplate: 'VMAMissedCalls15',
    claimIds: ['dedicated-ft'],
    group: 2,
    groupLabel: 'Pain',
  }),
  buildConcept({
    number: 'VMA-08',
    name: 'Drowning in Admin Work?',
    audience: 'Owners buried in front-office tasks.',
    headline: 'DROWNING IN ADMIN WORK?',
    supportingLine: 'Build admin capacity without adding another local desk.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'cobalt-blue',
    animationTemplate: 'VMAPainSolution15',
    claimIds: ['dedicated-ft'],
    group: 2,
    groupLabel: 'Pain',
  }),

  // ── Role (9–16) ──
  buildConcept({
    number: 'VMA-09',
    name: 'Hire a Virtual Dental Admin',
    role: 'Virtual Dental Admin',
    audience: 'Dental practices, ortho, and multi-location dental / DSO.',
    headline: 'HIRE A VIRTUAL DENTAL ADMIN',
    supportingLine: 'Calls, scheduling, insurance, and treatment follow-up for dental practices.',
    benefits: SERVICE_BULLET_BANK.dental,
    colorFamilyId: 'vivid-green',
    animationTemplate: 'VMADental15',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),
  buildConcept({
    number: 'VMA-10',
    name: 'Hire a Virtual Medical Biller',
    role: 'Virtual Medical Biller',
    audience: 'Practices needing billing-adjacent admin bandwidth.',
    headline: 'HIRE A VIRTUAL MEDICAL BILLER',
    supportingLine: 'Administrative support for claims follow-up and billing workflows.',
    benefits: SERVICE_BULLET_BANK.billing,
    colorFamilyId: 'cobalt-blue',
    animationTemplate: 'VMABilling15',
    formId: 'form-b',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),
  buildConcept({
    number: 'VMA-11',
    name: 'Add Virtual Scheduling Support',
    role: 'Virtual Scheduling Coordinator',
    audience: 'Clinics struggling to keep the appointment book full.',
    headline: 'ADD VIRTUAL SCHEDULING SUPPORT',
    supportingLine: 'Dedicated help for booking, confirms, and reschedules.',
    benefits: SERVICE_BULLET_BANK.scheduling,
    colorFamilyId: 'signal-yellow',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),
  buildConcept({
    number: 'VMA-12',
    name: 'Support Insurance Verification',
    role: 'Insurance Verification Specialist',
    audience: 'Practices with eligibility and prior-auth backlog.',
    headline: 'SUPPORT INSURANCE VERIFICATION',
    supportingLine: 'Help with eligibility, verification, and preauthorization follow-up.',
    benefits: SERVICE_BULLET_BANK.insurance,
    colorFamilyId: 'high-voltage-cyan',
    animationTemplate: 'VMAInsurance15',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),
  buildConcept({
    number: 'VMA-13',
    name: 'Handle Patient Intake Remotely',
    role: 'Patient Intake Coordinator',
    audience: 'Practices with slow new-patient response.',
    headline: 'HANDLE PATIENT INTAKE REMOTELY',
    supportingLine: 'Intake forms, patient details, and chart-prep support.',
    benefits: SERVICE_BULLET_BANK.intake,
    colorFamilyId: 'electric-lime',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),
  buildConcept({
    number: 'VMA-14',
    name: 'Add Preauthorization Support',
    role: 'Prior-Authorization Specialist',
    audience: 'Specialty practices with prior-auth workload.',
    headline: 'ADD PREAUTHORIZATION SUPPORT',
    supportingLine: 'Virtual admin help for prior-auth and preauthorization workflows.',
    benefits: ['Preauthorization Support', 'Insurance Verification', 'Eligibility Checks', 'Follow-Up With Payers'],
    colorFamilyId: 'cobalt-blue',
    animationTemplate: 'VMAInsurance15',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),
  buildConcept({
    number: 'VMA-15',
    name: 'Virtual Front-Desk Receptionist',
    role: 'Virtual Front-Desk Receptionist',
    audience: 'Front-desk overloaded practices.',
    headline: 'ADD A VIRTUAL FRONT-DESK RECEPTIONIST',
    supportingLine: 'Answer calls, schedule appointments, and follow up with patients.',
    benefits: SERVICE_BULLET_BANK.calls,
    colorFamilyId: 'commercial-red',
    animationTemplate: 'VMAMissedCalls15',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),
  buildConcept({
    number: 'VMA-16',
    name: 'Billing Follow-Up Support',
    role: 'Billing Follow-Up Support',
    audience: 'Practices with AR administrative backlog.',
    headline: 'ADD BILLING FOLLOW-UP SUPPORT',
    supportingLine: 'Claims follow-up and payment-posting administrative support.',
    benefits: ['Claims Follow-Up', 'Payment Posting', 'Medical Billing Support', 'Insurance Verification'],
    colorFamilyId: 'vivid-green',
    animationTemplate: 'VMABilling15',
    formId: 'form-b',
    claimIds: ['dedicated-ft'],
    group: 3,
    groupLabel: 'Role',
  }),

  // ── Spanish (17–20) ──
  buildConcept({
    number: 'VMA-17',
    name: 'Contrata a un Asistente Médico Virtual',
    audience: 'Spanish-speaking practice decision-makers.',
    language: 'es',
    headline: 'CONTRATA A UN ASISTENTE MÉDICO VIRTUAL',
    supportingLine: 'Personal virtual de tiempo completo que se une a tu equipo.',
    benefits: SERVICE_BULLET_BANK.spanish,
    colorFamilyId: 'vivid-green',
    animationTemplate: 'VMASpanish15',
    claimIds: ['dedicated-ft', 'spanish-available'],
    group: 4,
    groupLabel: 'Spanish',
  }),
  buildConcept({
    number: 'VMA-18',
    name: 'No Dejes Llamadas Sin Contestar',
    audience: 'Spanish-speaking practices losing calls.',
    language: 'es',
    headline: 'NO DEJES LLAMADAS DE PACIENTES SIN CONTESTAR',
    supportingLine: 'Apoyo virtual dedicado para llamadas, citas y seguimiento.',
    benefits: SERVICE_BULLET_BANK.spanishCalls,
    colorFamilyId: 'cobalt-blue',
    animationTemplate: 'VMASpanish15',
    claimIds: ['dedicated-ft'],
    group: 4,
    groupLabel: 'Spanish',
  }),
  buildConcept({
    number: 'VMA-19',
    name: 'Spanish-Speaking Medical Admin Available',
    audience: 'Bilingual practices — English-facing cue.',
    language: 'bilingual',
    headline: 'SPANISH-SPEAKING MEDICAL ADMIN AVAILABLE',
    supportingLine: 'Dedicated full-time virtual staff for bilingual practices.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'signal-yellow',
    animationTemplate: 'VMASpanish15',
    claimIds: ['dedicated-ft', 'spanish-available'],
    group: 4,
    groupLabel: 'Spanish',
  }),
  buildConcept({
    number: 'VMA-20',
    name: 'Apoyo Administrativo Médico en Español',
    audience: 'Spanish-speaking multi-specialty practices.',
    language: 'es',
    headline: 'APOYO ADMINISTRATIVO MÉDICO EN ESPAÑOL',
    supportingLine: 'Recepción, seguros, preautorización y facturación — dedicado y de tiempo completo.',
    benefits: SERVICE_BULLET_BANK.spanish,
    colorFamilyId: 'electric-lime',
    animationTemplate: 'VMASpanish15',
    claimIds: ['dedicated-ft'],
    group: 4,
    groupLabel: 'Spanish',
  }),

  // ── Offer (21–24) ──
  buildConcept({
    number: 'VMA-21',
    name: 'Starting at $10/hr',
    audience: 'Price-sensitive practice owners.',
    headline: 'MEDICAL ADMIN SUPPORT STARTING AT $10/HR',
    supportingLine: 'Dedicated full-time virtual staff — starting price pending confirmation.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'high-voltage-cyan',
    offer: 'Price anchor "$10/hr" — DO NOT PUBLISH until price-10hr claim is Approved for Launch.',
    trustBadge: 'Price ticket badge — only if price-10hr approved.',
    animationTemplate: 'VMAOffer10',
    videoDuration: '10s',
    claimIds: ['dedicated-ft', 'price-10hr'],
    productionStatus: 'On hold — claim pending',
    group: 5,
    groupLabel: 'Offer',
  }),
  buildConcept({
    number: 'VMA-22',
    name: 'Dedicated Staff — Not a Call Center',
    audience: 'Buyers burned by shared-pool models.',
    headline: 'DEDICATED STAFF — NOT A CALL CENTER',
    supportingLine: 'Full-time virtual teammates who join your practice workflow.',
    benefits: SERVICE_BULLET_BANK.dedicated,
    colorFamilyId: 'commercial-red',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft', 'not-call-center'],
    group: 5,
    groupLabel: 'Offer',
  }),
  buildConcept({
    number: 'VMA-23',
    name: 'HIPAA-Compliant Virtual Staff',
    audience: 'Compliance-conscious practices.',
    headline: 'HIPAA-COMPLIANT VIRTUAL MEDICAL ADMIN',
    supportingLine: 'Dedicated full-time virtual staff — HIPAA claim pending compliance sign-off.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'cobalt-blue',
    offer: 'HIPAA trust badge — DO NOT PUBLISH until hipaa claim is Approved for Launch.',
    trustBadge: 'HIPAA shield — only if hipaa approved.',
    animationTemplate: 'VMABenefits15',
    claimIds: ['dedicated-ft', 'hipaa'],
    productionStatus: 'On hold — claim pending',
    group: 5,
    groupLabel: 'Offer',
  }),
  buildConcept({
    number: 'VMA-24',
    name: 'Trained Medical Admin — Free Consultation',
    audience: 'Warm leads ready to talk staffing.',
    headline: 'TALK TO US ABOUT VIRTUAL MEDICAL ADMIN STAFF',
    supportingLine: 'Healthcare-trained dedicated staff. Free consultation pending leadership approval.',
    benefits: SERVICE_BULLET_BANK.core,
    colorFamilyId: 'vivid-green',
    offer: 'Free staffing consultation — DO NOT PUBLISH until free-consultation claim is approved.',
    trustBadge: 'Dedicated-staff seal.',
    animationTemplate: 'VMAOffer10',
    videoDuration: '10s',
    claimIds: ['dedicated-ft', 'trained-admin', 'free-consultation'],
    productionStatus: 'On hold — offer pending',
    group: 5,
    groupLabel: 'Offer',
  }),
];

/** @deprecated alias — CONCEPTS is the canonical static concept set. */
export const STATIC_CONCEPTS = CONCEPTS;

// ─── Color test set — 6 identical concepts, color is the only variable ────────

const COLOR_TEST_IDS = [
  'electric-lime',
  'signal-yellow',
  'cobalt-blue',
  'high-voltage-cyan',
  'vivid-green',
  'commercial-red',
];

const SHARED_COLOR_TEST = {
  name: 'Color Test — Hire a Virtual Medical Admin',
  role: 'Virtual Medical Admin',
  audience: 'US medical & multi-specialty practices — broad cold lead gen.',
  language: 'en',
  headline: VMA_META.coreHeadline,
  supportingLine: 'Dedicated full-time virtual staff who join your practice team.',
  benefits: SERVICE_BULLET_BANK.core,
  offer: 'No published offer — direct to staffing conversation.',
  trustBadge: 'Dedicated-staff seal (optional).',
  cta: VMA_META.recommendedCta,
  staticFormats: ['1:1', '4:5', '9:16'],
  videoDuration: '15s',
  animationTemplate: 'VMABenefits15',
  formId: 'form-a',
  claimIds: ['dedicated-ft'],
  productionStatus: 'Ready for design',
  testingVariable: 'color',
  hypothesis: 'Identical message, layout, talent, bullets, CTA, and copy. Only the color plate changes.',
};

export const COLOR_TEST_SET = COLOR_TEST_IDS.map((colorFamilyId, i) => {
  const family = COLOR_BY_ID[colorFamilyId];
  const number = `VMA-C0${i + 1}`;
  return {
    number,
    ...SHARED_COLOR_TEST,
    name: `${family.name} — Hire a Virtual Medical Admin`,
    colorFamilyId,
    talentDirection: `${TALENT_DIRECTION.look} Wardrobe: ${family.name} scrub top (${family.scrubColor}). ${TALENT_DIRECTION.framing}`,
    priority: family.priority,
    reviewer: '',
    performanceNotes: '',
  };
});

// ─── Video ───────────────────────────────────────────────────────────────────

/**
 * VIDEO_SCENES_15S — documented template structure for a standard 15-second
 * animated Virtual Medical Admin ad. Every 15s composition follows these beats.
 */
export const VIDEO_SCENES_15S = {
  duration: '15s',
  fps: 30,
  totalFrames: 450,
  aspectRatios: ['9:16', '1:1', '4:5'],
  structure: [
    { id: 'hook', label: 'Hook', frames: '0–90', seconds: '0–3s', purpose: 'Pain or role headline snaps on. One idea, huge type.', motion: 'Headline scale-in + color plate wipe.' },
    { id: 'problem', label: 'Problem', frames: '90–180', seconds: '3–6s', purpose: 'Name the front-office pain (calls, scheduling, backlog).', motion: 'Icon + short line slide-up.' },
    { id: 'solution', label: 'Solution', frames: '180–300', seconds: '6–10s', purpose: 'Introduce the dedicated virtual medical admin + benefits.', motion: 'Abstract person reveal; benefit bullets stagger in with checks.' },
    { id: 'proof', label: 'Proof / Trust', frames: '300–390', seconds: '10–13s', purpose: 'Dedicated full-time, not a call center. Optional approved badge.', motion: 'Trust seal pop; supporting line.' },
    { id: 'cta', label: 'CTA', frames: '390–450', seconds: '13–15s', purpose: 'Single clear CTA + MedVirtual logo lockup.', motion: 'CTA pill pulse; logo fade-in.' },
  ],
  safeZones: 'Keep all text inside Meta 9:16 safe zones — clear of top/bottom UI chrome.',
  audio: 'Licensed track only; captions burned in for sound-off viewing.',
  rules: ['No pink anywhere in frame.', 'No baked-in unapproved price/HIPAA badge.', 'Captions required.', 'MedVirtual (never MedVirtual.ai).'],
};

function buildVideoConcept({
  number,
  name,
  language = 'en',
  colorFamilyId,
  duration = '15s',
  remotionComposition,
  capcutTemplate,
  headline,
  scenes,
  claimIds = ['dedicated-ft'],
  productionStatus = 'Ready for animation',
  mirrorsConcept,
}) {
  const family = COLOR_BY_ID[colorFamilyId];
  return {
    number,
    name,
    language,
    colorFamilyId,
    colorFamilyName: family.name,
    duration,
    aspectRatios: ['9:16', '1:1', '4:5'],
    remotionComposition,
    capcutTemplate,
    headline,
    scenes,
    claimIds,
    productionStatus,
    mirrorsConcept: mirrorsConcept || null,
    reviewer: '',
    performanceNotes: '',
  };
}

const SCENES_15 = VIDEO_SCENES_15S.structure.map((s) => s.label);
const SCENES_10 = ['Hook (0–3s)', 'Offer + Benefits (3–7s)', 'CTA + Logo (7–10s)'];
const SCENES_6 = ['Static plate reveal (0–2s)', 'Benefit checks stagger (2–4s)', 'CTA + logo (4–6s)'];
const SCENES_20 = ['Hook (0–4s)', 'Problem story (4–8s)', 'Meet the admin (8–12s)', 'Benefits (12–16s)', 'Trust + CTA (16–20s)'];

export const VIDEO_CONCEPTS = [
  // Color-test videos (mirror the 6 color tests) — VMA-V01..V06
  ...COLOR_TEST_IDS.map((colorFamilyId, i) =>
    buildVideoConcept({
      number: `VMA-V0${i + 1}`,
      name: `${COLOR_BY_ID[colorFamilyId].name} — Hire a Virtual Medical Admin (15s)`,
      colorFamilyId,
      remotionComposition: 'VMABenefits15',
      capcutTemplate: 'CAPCUT-BENEFITS-15',
      headline: VMA_META.coreHeadline,
      scenes: SCENES_15,
      mirrorsConcept: `VMA-C0${i + 1}`,
    }),
  ),
  // Role / pain / offer / spanish videos — VMA-V07..V15
  buildVideoConcept({
    number: 'VMA-V07',
    name: 'Missed Calls (15s)',
    colorFamilyId: 'electric-lime',
    remotionComposition: 'VMAMissedCalls15',
    capcutTemplate: 'CAPCUT-PAIN-15',
    headline: 'STOP MISSING PATIENT CALLS',
    scenes: SCENES_15,
    mirrorsConcept: 'VMA-07',
  }),
  buildVideoConcept({
    number: 'VMA-V08',
    name: 'Dental Admin (15s)',
    colorFamilyId: 'vivid-green',
    remotionComposition: 'VMADental15',
    capcutTemplate: 'CAPCUT-BENEFITS-15',
    headline: 'HIRE A VIRTUAL DENTAL ADMIN',
    scenes: SCENES_15,
    mirrorsConcept: 'VMA-09',
  }),
  buildVideoConcept({
    number: 'VMA-V09',
    name: 'Medical Biller (15s)',
    colorFamilyId: 'cobalt-blue',
    remotionComposition: 'VMABilling15',
    capcutTemplate: 'CAPCUT-BENEFITS-15',
    headline: 'HIRE A VIRTUAL MEDICAL BILLER',
    scenes: SCENES_15,
    mirrorsConcept: 'VMA-10',
  }),
  buildVideoConcept({
    number: 'VMA-V10',
    name: 'Insurance Verification (15s)',
    colorFamilyId: 'high-voltage-cyan',
    remotionComposition: 'VMAInsurance15',
    capcutTemplate: 'CAPCUT-BENEFITS-15',
    headline: 'SUPPORT INSURANCE VERIFICATION',
    scenes: SCENES_15,
    mirrorsConcept: 'VMA-12',
  }),
  buildVideoConcept({
    number: 'VMA-V11',
    name: 'Spanish Core (15s)',
    language: 'es',
    colorFamilyId: 'vivid-green',
    remotionComposition: 'VMASpanish15',
    capcutTemplate: 'CAPCUT-PAIN-15',
    headline: 'CONTRATA A UN ASISTENTE MÉDICO VIRTUAL',
    scenes: SCENES_15,
    claimIds: ['dedicated-ft', 'spanish-available'],
    mirrorsConcept: 'VMA-17',
  }),
  buildVideoConcept({
    number: 'VMA-V12',
    name: 'Front Desk Overloaded — Pain/Solution (15s)',
    colorFamilyId: 'signal-yellow',
    remotionComposition: 'VMAPainSolution15',
    capcutTemplate: 'CAPCUT-PAIN-15',
    headline: 'YOUR FRONT DESK IS OVERLOADED',
    scenes: SCENES_15,
    mirrorsConcept: 'VMA-06',
  }),
  buildVideoConcept({
    number: 'VMA-V13',
    name: 'Offer Anchor (10s)',
    colorFamilyId: 'high-voltage-cyan',
    duration: '10s',
    remotionComposition: 'VMAOffer10',
    capcutTemplate: 'CAPCUT-OFFER-10',
    headline: 'MEDICAL ADMIN SUPPORT STARTING AT $10/HR',
    scenes: SCENES_10,
    claimIds: ['dedicated-ft', 'price-10hr'],
    productionStatus: 'On hold — claim pending',
    mirrorsConcept: 'VMA-21',
  }),
  buildVideoConcept({
    number: 'VMA-V14',
    name: 'Static Motion Loop (6s)',
    colorFamilyId: 'electric-lime',
    duration: '6s',
    remotionComposition: 'VMAStaticMotion6',
    capcutTemplate: 'CAPCUT-OFFER-10',
    headline: 'HIRE A VIRTUAL MEDICAL ADMIN',
    scenes: SCENES_6,
    mirrorsConcept: 'VMA-01',
  }),
  buildVideoConcept({
    number: 'VMA-V15',
    name: 'Story — Meet Your Virtual Admin (20s)',
    colorFamilyId: 'cobalt-blue',
    duration: '20s',
    remotionComposition: 'VMAStory20',
    capcutTemplate: 'CAPCUT-BENEFITS-15',
    headline: 'MEET YOUR DEDICATED VIRTUAL MEDICAL ADMIN',
    scenes: SCENES_20,
    claimIds: ['dedicated-ft', 'not-call-center'],
    mirrorsConcept: 'VMA-02',
  }),
];

// ─── Remotion ────────────────────────────────────────────────────────────────

export const REMOTION_COMPONENTS = [
  { id: 'ColorPlate', name: '<ColorPlate />', purpose: 'Full-frame background plate driven by a color-family id. Enforces approved hexes only.', props: 'colorFamilyId' },
  { id: 'KineticHeadline', name: '<KineticHeadline />', purpose: 'Scale/wipe-in billboard headline with mobile-safe type scale.', props: 'text, colorFamilyId, delay' },
  { id: 'BenefitList', name: '<BenefitList />', purpose: 'Staggered benefit bullets with animated check icons (max 4).', props: 'items[], colorFamilyId' },
  { id: 'AbstractPerson', name: '<AbstractPerson />', purpose: 'CSS/SVG abstract admin figure reveal — no photo, no pink.', props: 'colorFamilyId, side' },
  { id: 'TrustSeal', name: '<TrustSeal />', purpose: 'Dedicated-staff / approved-claim seal pop. Hidden unless claim approved.', props: 'claimId, approved' },
  { id: 'PriceTicket', name: '<PriceTicket />', purpose: 'Angled price ticket — renders only when price claim is approved.', props: 'text, approved' },
  { id: 'CTAButton', name: '<CTAButton />', purpose: 'Pulsing CTA pill.', props: 'label, colorFamilyId' },
  { id: 'LogoLockup', name: '<LogoLockup />', purpose: 'MedVirtual white logo fade-in (never MedVirtual.ai).', props: 'delay' },
  { id: 'CaptionTrack', name: '<CaptionTrack />', purpose: 'Burned-in captions for sound-off viewing.', props: 'lines[]' },
  { id: 'SafeZoneGuide', name: '<SafeZoneGuide />', purpose: 'Dev-only 9:16 safe-zone overlay guide.', props: 'visible' },
];

export const REMOTION_COMPOSITIONS = [
  { id: 'VMAStaticMotion6', name: 'VMAStaticMotion6', duration: '6s', frames: 180, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'BenefitList', 'CTAButton', 'LogoLockup'], purpose: 'Animated version of a static ad — quick loopable plate.' },
  { id: 'VMAOffer10', name: 'VMAOffer10', duration: '10s', frames: 300, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'PriceTicket', 'BenefitList', 'CTAButton', 'LogoLockup'], purpose: 'Offer-anchor spot — price ticket only if approved.' },
  { id: 'VMABenefits15', name: 'VMABenefits15', duration: '15s', frames: 450, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'AbstractPerson', 'BenefitList', 'TrustSeal', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Core benefits spot — default 15s workhorse.' },
  { id: 'VMAPainSolution15', name: 'VMAPainSolution15', duration: '15s', frames: 450, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'BenefitList', 'AbstractPerson', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Problem → solution narrative.' },
  { id: 'VMASpanish15', name: 'VMASpanish15', duration: '15s', frames: 450, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'AbstractPerson', 'BenefitList', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Spanish 15s — native-review captions required.' },
  { id: 'VMABilling15', name: 'VMABilling15', duration: '15s', frames: 450, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'BenefitList', 'AbstractPerson', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Billing-support role spot.' },
  { id: 'VMADental15', name: 'VMADental15', duration: '15s', frames: 450, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'BenefitList', 'AbstractPerson', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Dental-admin role spot.' },
  { id: 'VMAMissedCalls15', name: 'VMAMissedCalls15', duration: '15s', frames: 450, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'BenefitList', 'AbstractPerson', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Missed-calls pain spot.' },
  { id: 'VMAInsurance15', name: 'VMAInsurance15', duration: '15s', frames: 450, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'BenefitList', 'AbstractPerson', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Insurance-verification role spot.' },
  { id: 'VMAStory20', name: 'VMAStory20', duration: '20s', frames: 600, fps: 30, uses: ['ColorPlate', 'KineticHeadline', 'AbstractPerson', 'BenefitList', 'TrustSeal', 'CTAButton', 'LogoLockup', 'CaptionTrack'], purpose: 'Longer narrative — meet-your-admin story.' },
];

export const REMOTION_PLAYBOOK = {
  entryFile: 'src/remotion/index.js',
  studioCmd: 'npm run remotion:studio',
  renderPattern: 'remotion render src/remotion/index.js <COMPOSITION-ID> .local-masters/renders/<name>.mp4',
  steps: [
    'Open Remotion Studio and pick a VMA composition.',
    'Set the colorFamilyId prop to an approved family — the ColorPlate rejects non-approved hexes.',
    'Confirm headline + benefits come from approved copy (vma-copy-en / vma-copy-es).',
    'Keep PriceTicket / TrustSeal hidden unless the linked claim is Approved for Launch.',
    'Preview all three aspect ratios; check 9:16 safe zones.',
    'Render to .local-masters/renders — never commit large MP4s to public.',
  ],
  rules: [
    'No pink — ColorPlate enforces the approved palette.',
    'No unapproved price/HIPAA badge baked in.',
    'Captions on every spot.',
    'MedVirtual logo only (never MedVirtual.ai).',
  ],
};

// ─── CapCut ──────────────────────────────────────────────────────────────────

export const CAPCUT_TEMPLATES = [
  {
    id: 'CAPCUT-BENEFITS-15',
    name: 'VMA Benefits — 15s (CapCut)',
    duration: '15s',
    aspectRatios: ['9:16', '1:1', '4:5'],
    beats: SCENES_15,
    textLayers: ['Headline (billboard)', 'Supporting line', '4 benefit bullets', 'CTA pill', 'MedVirtual logo'],
    colorNote: 'Set background + text colors to one approved family only. NO PINK preset.',
    captions: 'Auto-captions on, then hand-correct. Burn in for sound-off.',
    music: 'Use licensed CapCut commercial-safe track; keep upbeat, non-clinical.',
    fonts: 'Be Vietnam (or nearest bold sans available in CapCut).',
    exportSpec: '1080×1920 (9:16), 1080×1080 (1:1), 1080×1350 (4:5), H.264, 30fps.',
    rules: ['No pink filters/stickers.', 'No unapproved price/HIPAA badges.', 'No stock call-center headset b-roll.'],
  },
  {
    id: 'CAPCUT-PAIN-15',
    name: 'VMA Pain → Solution — 15s (CapCut)',
    duration: '15s',
    aspectRatios: ['9:16', '1:1', '4:5'],
    beats: ['Pain hook (0–3s)', 'Problem detail (3–6s)', 'Solution reveal (6–10s)', 'Benefits (10–13s)', 'CTA (13–15s)'],
    textLayers: ['Pain headline', 'Problem line', 'Solution line', '3–4 benefits', 'CTA pill', 'MedVirtual logo'],
    colorNote: 'Single approved color family per export. NO PINK.',
    captions: 'Required — burned in.',
    music: 'Tension-to-resolve licensed track; no clinical drama cliché.',
    fonts: 'Be Vietnam bold.',
    exportSpec: '1080×1920 / 1080×1080 / 1080×1350, H.264, 30fps.',
    rules: ['No pink.', 'No invented claims.', 'MedVirtual only.'],
  },
  {
    id: 'CAPCUT-OFFER-10',
    name: 'VMA Offer Anchor — 10s (CapCut)',
    duration: '10s',
    aspectRatios: ['9:16', '1:1', '4:5'],
    beats: SCENES_10,
    textLayers: ['Offer/price headline (approved only)', '2–3 benefits', 'CTA pill', 'MedVirtual logo'],
    colorNote: 'Single approved family. NO PINK. Price ticket only if claim approved.',
    captions: 'Required — burned in.',
    music: 'Punchy short licensed track.',
    fonts: 'Be Vietnam bold.',
    exportSpec: '1080×1920 / 1080×1080 / 1080×1350, H.264, 30fps.',
    rules: ['Do not show $10/hr until price-10hr is Approved for Launch.', 'No pink.', 'MedVirtual only.'],
  },
];

// ─── ChatGPT image workflow + prompts ────────────────────────────────────────

export const CHATGPT_WORKFLOW = [
  { step: 1, title: 'Upload the approved examples', instruction: 'Upload one or more approved 1:1 masters so ChatGPT can see the MedVirtual baseline.' },
  { step: 2, title: 'Tell ChatGPT to analyze only', instruction: 'Ask for hierarchy, contrast, and role clarity notes — do not invent claims.' },
  { step: 3, title: 'Request original concepts', instruction: 'Ask for 15–20 original concepts in the approved direct-response style. Explicitly say NO PINK and do not copy competitors.' },
  { step: 4, title: 'Select one direction', instruction: 'Pick the strongest concepts for design or AI plate testing.' },
  { step: 5, title: 'Confirm exact copy', instruction: 'Lock headline, benefits, offer, and CTA before final art.' },
  { step: 6, title: 'Generate or brief the designer', instruction: 'AI-generated ads may be used for testing. Designers may also build from the brief directly.' },
  { step: 7, title: 'Check every word', instruction: 'Verify spelling, price, services, Spanish, badges, logos, hands, and accidental pink.' },
  { step: 8, title: 'Build required aspect ratios', instruction: 'Rebuild approved concepts for 1:1, 4:5, 9:16, and 1.91:1 — not a crop.' },
];

const CHATGPT_BASE_NEGATIVE =
  'NO pink, magenta, hot pink, rose, or fuchsia anywhere. No baked-in headline text, no misspelled text, no watermarks, no fake logos, no fake award/HIPAA badges unless requested, no fake software UI, no call-center headset, no physician white coat or stethoscope, no patient data, no prison-orange scrubs, no low-contrast muddy plate.';

function buildChatgptPrompt(concept, i) {
  const family = COLOR_BY_ID[concept.colorFamilyId];
  return {
    id: `CGP-${String(i + 1).padStart(2, '0')}`,
    conceptNumber: concept.number,
    title: concept.name,
    colorFamily: family.name,
    prompt: `Full-image Meta ad plate for a healthcare staffing ad. Style: bold, high-contrast, mobile-first direct response. Color story: ${family.name} — background ${family.background}, accent ${family.accent}. Subject: a credible, warm professional female virtual medical administrator, ${family.name} scrub top (${family.scrubColor}), framed on the right third, clean studio lighting, high contrast against the plate. Leave the left two-thirds as clean negative space for a designer to add a large headline and 4 benefit bullets later. Composition should feel like a scroll-stopping offer ad. ${CHATGPT_BASE_NEGATIVE}`,
    overlayLater: {
      headline: concept.headline,
      benefits: concept.benefits,
      cta: concept.cta,
      logo: 'MedVirtual white logo, small, optional.',
    },
    risks: VMA_META.chatgptRisks,
  };
}

// 15 production prompts — 6 color tests + 9 role/pain/spanish/offer concepts.
const CHATGPT_SOURCE = [
  ...COLOR_TEST_SET,
  ...['VMA-05', 'VMA-07', 'VMA-09', 'VMA-10', 'VMA-12', 'VMA-13', 'VMA-17', 'VMA-19', 'VMA-22'].map((n) =>
    CONCEPTS.find((c) => c.number === n),
  ),
];

export const CHATGPT_PROMPTS = CHATGPT_SOURCE.map((c, i) => buildChatgptPrompt(c, i));

// ─── Video prompts (15) ──────────────────────────────────────────────────────

function buildVideoPrompt(vc, i) {
  const family = COLOR_BY_ID[vc.colorFamilyId];
  return {
    id: `VP-${String(i + 1).padStart(2, '0')}`,
    videoNumber: vc.number,
    title: vc.name,
    duration: vc.duration,
    colorFamily: family.name,
    remotionComposition: vc.remotionComposition,
    capcutTemplate: vc.capcutTemplate,
    prompt: `Animated ${vc.duration} vertical (9:16) Meta ad for MedVirtual virtual medical admin staffing. Color story: ${family.name} (background ${family.background}, accent ${family.accent}). Open on the headline "${vc.headline}" in bold mobile-first type. Beats: ${vc.scenes.join(' → ')}. Introduce an abstract (non-photo) admin figure and stagger in up to 4 benefit checks. End on a single CTA pill and the MedVirtual logo. Burned-in captions throughout. ${CHATGPT_BASE_NEGATIVE} No unapproved price/HIPAA badge on screen.`,
    risks: VMA_META.chatgptRisks,
  };
}

export const VIDEO_PROMPTS = VIDEO_CONCEPTS.map((vc, i) => buildVideoPrompt(vc, i));

// ─── Forms ───────────────────────────────────────────────────────────────────

export const FORMS = {
  formA: {
    id: 'form-a',
    name: 'Form A — Max Volume',
    objective: 'Prioritize lead volume with minimal friction.',
    fields: [
      { name: 'First Name', id: 'fname', required: true, type: 'Short answer' },
      { name: 'Last Name', id: 'lname', required: true, type: 'Short answer' },
      { name: 'Email', id: 'email', required: true, type: 'Email — any email accepted' },
      { name: 'Mobile Phone', id: 'phone', required: true, type: 'Phone — no SMS verification' },
    ],
  },
  formB: {
    id: 'form-b',
    name: 'Form B — Light Qualification',
    objective: 'Slight qualification without killing conversion.',
    fields: [
      { name: 'First Name', id: 'fname', required: true, type: 'Short answer' },
      { name: 'Last Name', id: 'lname', required: true, type: 'Short answer' },
      { name: 'Email', id: 'email', required: true, type: 'Email' },
      { name: 'Mobile Phone', id: 'phone', required: true, type: 'Phone — no SMS verification' },
      { name: 'Medical Specialty', id: 'specialty', required: false, type: 'Multiple choice (optional)' },
      { name: 'Staffing Need', id: 'staffing-need', required: false, type: 'Multiple choice (optional)' },
    ],
  },
  staffingNeedOptions: [
    'Answer patient calls',
    'Scheduling / appointments',
    'Insurance verification',
    'Intake / registration',
    'Billing / claims support',
    'Multiple areas / not sure',
  ],
  trackingFields: [
    { id: 'lead_source', label: 'Lead Source', value: 'Meta Instant Form' },
    { id: 'campaign', label: 'Campaign', value: 'VMA Meta Leads' },
    { id: 'ad_number', label: 'Ad Number', value: 'VMA-## (hidden field / naming convention)' },
    { id: 'color_family', label: 'Color Family', value: 'Which color plate the lead came from' },
    { id: 'language', label: 'Language', value: 'en / es' },
    { id: 'form_variant', label: 'Form Variant', value: 'form-a / form-b' },
  ],
  rules: [
    'Do not require a work email.',
    'Do not require SMS verification.',
    'Clearly distinguish required from optional fields.',
    'Do not invent a free offer on the form until leadership approves.',
    'Default launch form is Form A unless a concept specifies Form B.',
    'Legal / compliance approval required before publishing.',
  ],
  complianceNote:
    'Legal/compliance approval is required before publishing Instant Forms. Keep consent language compliant but visually simple. Do not include AI-notification language in marketing copy.',
};

export const COMPLETION_SCREENS = [
  {
    id: 'safe-default',
    label: 'Safe default',
    headline: 'Your Request Has Been Received',
    body: 'A MedVirtual staffing specialist will review your information and contact you to discuss your practice staffing needs.',
    nextStepBullets: ['We review your practice needs', 'A staffing specialist contacts you', 'You discuss dedicated full-time virtual staff options'],
    cta: 'Visit MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    status: 'Pending',
    notes: 'Use until an approved offer is confirmed. No instant-placement language.',
  },
  {
    id: 'team-followup',
    label: 'Team follow-up',
    headline: 'Thanks — We Are Reviewing Your Request',
    body: 'A MedVirtual specialist will reach out to learn about your calls, scheduling, intake, and insurance verification needs.',
    nextStepBullets: ['Specialist reviews your submission', 'Follow-up call or email scheduled', 'Discuss dedicated hire options'],
    cta: 'Visit MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    status: 'Pending',
    notes: 'Continues selling the staffing conversation.',
  },
  {
    id: 'es-default',
    label: 'Spanish default',
    headline: 'Hemos Recibido Tu Solicitud',
    body: 'Un especialista de MedVirtual revisará tu información y te contactará para hablar sobre las necesidades de personal de tu consulta.',
    nextStepBullets: ['Revisamos las necesidades de tu consulta', 'Un especialista te contacta', 'Hablamos sobre personal virtual dedicado'],
    cta: 'Visitar MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    status: 'Pending',
    notes: 'Pair with Spanish creative and Spanish form intro.',
  },
];

export const OFFER_CONCEPTS = [
  { id: 'offer-consultation', name: 'Free Staffing Consultation', description: 'Short call to discuss practice needs and dedicated virtual staffing options.', status: 'Pending' },
  { id: 'offer-workflow', name: 'Free Front-Office Workflow Review', description: 'Review of calls, scheduling, intake, and insurance verification gaps.', status: 'Pending' },
  { id: 'offer-matching', name: 'Candidate Matching Call', description: 'Conversation focused on matching role needs to potential dedicated candidates.', status: 'Pending' },
  { id: 'offer-cost-compare', name: 'Staffing Cost Comparison', description: 'Compare local desk capacity vs dedicated virtual staff — no invented savings percentages.', status: 'Pending' },
];

// ─── Campaign ────────────────────────────────────────────────────────────────

export const CAMPAIGN = {
  campaign: 'MedVirtual Meta Leads — Virtual Medical Admin',
  objective: 'Leads (Instant Form) — booked staffing conversations.',
  hundredDollarRule: VMA_META.hundredDollarRule,
  warning:
    'Do not spend aggressively until the form, CRM delivery, lead access, attribution, and follow-up process are tested end-to-end.',
  adSets: [
    {
      name: 'Ad Set 1 — Broad / Advantage+ Native Targeting',
      structure: 'Six color-isolated creatives (VMA-C01..C06) sharing identical copy, layout, talent, and Form A. Color is the only variable.',
      creatives: ['VMA-C01 Electric Lime', 'VMA-C02 Signal Yellow', 'VMA-C03 Cobalt Blue', 'VMA-C04 High-Voltage Cyan', 'VMA-C05 Vivid Green', 'VMA-C06 Commercial Red'],
      budgetNote: 'Apply the $100 no-lead rule per creative — pause and iterate any that spend $100 with zero leads.',
    },
    {
      name: 'Ad Set 2 — Lookalike',
      structure: 'Replay the winning color + message on a lookalike audience after the broad set learns.',
      creatives: ['Winner color from Ad Set 1', 'VMA-V## matching winning color'],
      budgetNote: 'Only scale ads that beat the target cost-per-lead.',
    },
    {
      name: 'Ad Set 3 — Spanish Segment',
      structure: 'Spanish concept (VMA-17) + winning color; Spanish form intro + completion screen.',
      creatives: ['VMA-17 Spanish Core — Vivid Green', 'VMA-V11 Spanish 15s'],
      budgetNote: 'Native-speaker review required before spend.',
    },
    {
      name: 'Ad Set 4 — Pain / Role Follow-Up',
      structure: 'Pain and role-specific concepts after the color winner emerges. One message change at a time.',
      creatives: ['VMA-07 Missed Calls', 'VMA-09 Dental', 'VMA-12 Insurance', 'VMA-10 Billing'],
      budgetNote: 'Isolate one variable per test.',
    },
  ],
  controls: [
    'Hold offer constant until leadership approves a free-offer test.',
    'Hold Form A constant across VMA-C01..C06 color isolation.',
    'Vary color first — not five unrelated messages at once.',
    'Prefer 4:5 and 1:1 for feed; adapt 9:16 for Stories/Reels after winners emerge.',
    'Do not publish price or HIPAA badges until claims are Approved for Launch.',
    'Apply the $100 no-lead rule to every ad.',
    'No pink plates in any ad set.',
  ],
};

// ─── QA ──────────────────────────────────────────────────────────────────────

export const QA_CHECKLIST = [
  { group: 'Setup', items: ['Correct Facebook page selected', 'Correct Instant Form attached (Form A unless concept specifies Form B)', 'Form published after legal/compliance approval', 'Ad naming convention matches VMA-## scheme'] },
  { group: 'Lead flow', items: ['Test lead submitted successfully', 'Lead visible in Meta Leads Center', 'Lead visible in CRM (HubSpot)', 'Source, campaign, color, and language fields populated', 'Sales notification triggered', 'End-to-end follow-up confirmed before scaling spend'] },
  { group: 'Creative — brand & color', items: ['No pink, magenta, rose, or fuchsia anywhere in the file', 'Only approved creative hexes used', 'Scrubs match the approved color family — not orange prison scrubs', 'MedVirtual (never MedVirtual.ai) in all copy', 'Logo treatment matches concept spec (optional / omitted)'] },
  { group: 'Creative — message & claims', items: ['Creative uses approved claims only — price and HIPAA checked', 'No unapproved free offer on form or completion screen', 'No instant-placement language', 'No call-center / managed-desk / AI / SaaS claims', 'Headline readable at mobile thumb distance', '3–4 bullets max — not paragraph copy', 'Talent looks like a medical admin — not call-center headset stock'] },
  { group: 'Copy & CTA', items: ['Five primary texts populated', 'Five headlines populated', 'Five descriptions populated where available', 'CTA confirmed (Learn More or approved alternate)', 'Spanish ads use approved Spanish intro variant + native review'] },
  { group: 'Formats & placements', items: ['1:1, 4:5, and 9:16 exported', 'Mobile preview checked on iOS and Android', 'All placements reviewed (Feed, Stories, Reels)', '9:16 safe zones respected (no text under UI chrome)', 'Video captions burned in for sound-off'] },
  { group: 'Budget', items: ['Budget and daily spend confirmed', 'Audience / Advantage+ settings confirmed', '$100 no-lead rule understood — pause + iterate any ad at $100 with zero leads'] },
];

// ─── Production queue — 24 items alternating static / video ───────────────────

const QUEUE_SPEC = [
  ['VMA-C01', 'Static', 'Electric Lime Static', 'electric-lime'],
  ['VMA-V01', 'Video', 'Electric Lime 15s', 'electric-lime'],
  ['VMA-C02', 'Static', 'Signal Yellow Static', 'signal-yellow'],
  ['VMA-V02', 'Video', 'Signal Yellow 15s', 'signal-yellow'],
  ['VMA-C03', 'Static', 'Cobalt Blue Static', 'cobalt-blue'],
  ['VMA-V03', 'Video', 'Cobalt Blue 15s', 'cobalt-blue'],
  ['VMA-C04', 'Static', 'High-Voltage Cyan Static', 'high-voltage-cyan'],
  ['VMA-V04', 'Video', 'High-Voltage Cyan 15s', 'high-voltage-cyan'],
  ['VMA-C05', 'Static', 'Vivid Green Static', 'vivid-green'],
  ['VMA-V05', 'Video', 'Vivid Green 15s', 'vivid-green'],
  ['VMA-C06', 'Static', 'Commercial Red Static', 'commercial-red'],
  ['VMA-V06', 'Video', 'Commercial Red 15s', 'commercial-red'],
  ['VMA-09', 'Static', 'Dental Admin Static', 'vivid-green'],
  ['VMA-V08', 'Video', 'Dental Admin 15s', 'vivid-green'],
  ['VMA-05', 'Static', 'Front-Desk / Missed Calls Static', 'commercial-red'],
  ['VMA-V07', 'Video', 'Missed Calls 15s', 'electric-lime'],
  ['VMA-21', 'Static', 'Starting Price Static (on hold — claim)', 'high-voltage-cyan'],
  ['VMA-V13', 'Video', 'Offer Anchor 10s (on hold — claim)', 'high-voltage-cyan'],
  ['VMA-17', 'Static', 'Spanish Core Static', 'vivid-green'],
  ['VMA-V11', 'Video', 'Spanish Core 15s', 'vivid-green'],
  ['VMA-12', 'Static', 'Insurance Verification Static', 'high-voltage-cyan'],
  ['VMA-V10', 'Video', 'Insurance Verification 15s', 'high-voltage-cyan'],
  ['VMA-10', 'Static', 'Medical Biller Static', 'cobalt-blue'],
  ['VMA-V09', 'Video', 'Medical Biller 15s', 'cobalt-blue'],
];

export const PRODUCTION_QUEUE = QUEUE_SPEC.map(([ref, type, label, colorFamilyId], i) => ({
  order: i + 1,
  ref,
  type,
  label,
  colorFamilyId,
  colorFamilyName: COLOR_BY_ID[colorFamilyId].name,
  status: label.includes('on hold') ? 'On Hold' : 'Queued',
  assignee: '',
  dueDate: '',
  notes: label.includes('on hold') ? 'Blocked on claim approval — do not publish badge/price.' : '',
}));

export const PRODUCTION_STATUSES = [
  'Draft',
  'Ready for copy review',
  'Ready for design',
  'Ready for image generation',
  'Ready for animation',
  'Needs layout review',
  'Ready for export',
  'On hold — claim pending',
  'On hold — offer pending',
  'Approved for Launch',
  'Exported',
  'Rejected',
];

// ─── Copy matrices ───────────────────────────────────────────────────────────

export const COPY_EN = [
  {
    id: 'core-admin',
    name: 'Core Medical Admin',
    matchingForm: 'Form A',
    primaryTexts: [
      'Hire a virtual medical admin for reception, insurance verification, preauthorization, and billing support.',
      'Add dedicated full-time virtual staff who join your practice team — not a call center.',
      'Need reliable administrative help? Hire a virtual medical admin dedicated to your practice.',
      'Get trained medical administrative support without adding another local desk.',
      'MedVirtual helps practices hire dedicated virtual staff for calls, scheduling, and patient follow-up.',
    ],
    headlines: ['HIRE A VIRTUAL MEDICAL ADMIN', 'Add a Virtual Medical Admin', 'Dedicated Medical Admin Support', 'Virtual Medical Admin for Your Practice', 'Get a Dedicated Medical Admin'],
    descriptions: ['Dedicated full-time virtual staff on your team.', 'Reception, insurance, preauth, and billing.', 'Not a call center — hire into your practice.', 'Tell us what your front office needs.', 'Staffing solutions for medical practices.'],
  },
  {
    id: 'missed-calls',
    name: 'Missed Calls / Overload',
    matchingForm: 'Form A',
    primaryTexts: [
      'Stop letting patient calls go unanswered. Hire a virtual medical admin for your practice.',
      'When the front desk is slammed, patient calls slip. Add dedicated virtual call and scheduling support.',
      'Overloaded front desk? Hire full-time virtual staff to help answer calls and manage appointments.',
      'Missed calls cost appointments. Get help with patient calls, scheduling, and follow-up.',
      'Your team should not choose between patients in the lobby and phones that keep ringing.',
    ],
    headlines: ['STOP MISSING PATIENT CALLS', 'YOUR FRONT DESK IS OVERLOADED', 'TOO MANY PATIENT CALLS?', 'Keep Patient Calls Answered', 'Get Help With Patient Calls'],
    descriptions: ['Dedicated virtual support for busy front offices.', 'Help with calls, scheduling, and follow-up.', 'Full-time staff who join your practice team.', 'Support when your desk cannot keep up.', 'Staffing help for missed-call pressure.'],
  },
  {
    id: 'dental',
    name: 'Dental',
    matchingForm: 'Form A',
    primaryTexts: [
      'Hire a virtual dental admin for calls, scheduling, insurance verification, and treatment follow-up.',
      'Dental front desk overloaded? Add dedicated full-time virtual staff to your practice.',
      'Get help answering patient calls and keeping the dental schedule full.',
      'MedVirtual helps dental practices hire dedicated virtual administrative staff.',
      'Support treatment follow-up and insurance checks with a virtual admin on your team.',
    ],
    headlines: ['HIRE A VIRTUAL DENTAL ADMIN', 'Dental Front-Desk Support', 'Virtual Staff for Dental Practices', 'Help With Calls and Scheduling', 'Add Dental Admin Capacity'],
    descriptions: ['Dedicated virtual staff for dental practices.', 'Calls, scheduling, insurance, and follow-up.', 'Full-time hire into your dental team.', 'Not a call center model.', 'Tell us what your office needs.'],
  },
  {
    id: 'billing',
    name: 'Billing / Insurance',
    matchingForm: 'Form B',
    primaryTexts: [
      'Support your billing and insurance team with dedicated full-time virtual staff.',
      'Hire virtual medical admin help for claim follow-up support and patient balance outreach.',
      'Give billing room to breathe — add administrative capacity without another local desk.',
      'Need help supporting billing workflows? Hire trained virtual medical administrative staff.',
      'MedVirtual helps practices hire dedicated staff who support billing-adjacent admin work.',
    ],
    headlines: ['SUPPORT YOUR BILLING TEAM', 'HIRE A VIRTUAL MEDICAL BILLER', 'Virtual Staff for Claims Follow-Up', 'Add Billing Admin Capacity', 'Hire Support for Insurance Work'],
    descriptions: ['Admin support next to your billing team.', 'Dedicated full-time virtual staff.', 'Help with follow-up and patient balances.', 'Staffing — not billing software.', 'Join your practice team remotely.'],
  },
  {
    id: 'dedicated',
    name: 'Dedicated — Not a Call Center',
    matchingForm: 'Form A',
    primaryTexts: [
      'Hire dedicated full-time virtual staff who join your practice team — not a shared call center.',
      'Looking for someone who works as part of your office, not a rotating agent pool?',
      'MedVirtual helps practices hire dedicated full-time virtual medical administrators.',
      'Get a dedicated teammate for calls, scheduling, insurance verification, and intake.',
      'Full-time. Dedicated. Part of your practice — that is the staffing model.',
    ],
    headlines: ['DEDICATED STAFF — NOT A CALL CENTER', 'HIRE DEDICATED FULL-TIME VIRTUAL STAFF', 'Add Front-Office Capacity Virtually', 'Grow Without Another Local Hire', 'Full-Time Virtual Staff on Your Team'],
    descriptions: ['Dedicated full-time — join your team.', 'Not a managed front-desk service.', 'Not AI, not software — real staff.', 'Hire into your practice workflow.', 'Tell us your staffing needs.'],
  },
];

export const COPY_ES = [
  {
    id: 'core-es',
    name: 'Rol Principal',
    matchingForm: 'Form A',
    primaryTexts: [
      'Contrata a un asistente médico virtual para recepción, seguros, preautorización y facturación.',
      'Agrega personal virtual de tiempo completo que se une a tu equipo — no un call center.',
      '¿Necesitas apoyo administrativo confiable? Contrata un asistente médico virtual dedicado.',
      'Personal administrativo entrenado para tu consulta — dedicado y de tiempo completo.',
      'MedVirtual ayuda a consultorios a contratar personal virtual dedicado para el área administrativa.',
    ],
    headlines: ['CONTRATA A UN ASISTENTE MÉDICO VIRTUAL', 'Contrata un Asistente Médico Virtual', 'Apoyo Administrativo Médico Virtual', 'Agrega Apoyo a Tu Consulta', 'Asistente Médico Virtual Dedicado'],
    descriptions: ['Personal de tiempo completo en tu equipo.', 'Recepción, seguros y facturación.', 'No es un call center.', 'Cuéntanos qué necesita tu consulta.', 'Soluciones de personal para consultorios.'],
  },
  {
    id: 'calls-es',
    name: 'Llamadas / Saturación',
    matchingForm: 'Form A',
    primaryTexts: [
      'No dejes llamadas de pacientes sin contestar. Contrata a un asistente médico virtual.',
      'Cuando el mostrador está saturado, se pierden llamadas. Agrega apoyo virtual dedicado.',
      '¿Tu equipo no da abasto? Contrata personal virtual de tiempo completo para llamadas y citas.',
      'Las llamadas perdidas cuestan citas. Obtén ayuda con llamadas, agenda y seguimiento.',
      'Tu equipo no debería elegir entre pacientes en sala y un teléfono que no para.',
    ],
    headlines: ['NO DEJES LLAMADAS SIN CONTESTAR', '¿TU MOSTRADOR ESTÁ SATURADO?', 'Ayuda para Contestar Llamadas', 'Mantén las Llamadas Atendidas', 'Apoyo Virtual para Tu Consulta'],
    descriptions: ['Apoyo dedicado para oficinas ocupadas.', 'Llamadas, citas y seguimiento.', 'Personal de tiempo completo en tu equipo.', 'Ayuda cuando el mostrador no da más.', 'Contratación para presión de llamadas.'],
  },
  {
    id: 'bilingual-es',
    name: 'Bilingual Cue',
    matchingForm: 'Form A',
    primaryTexts: [
      'Personal administrativo médico virtual que habla español, dedicado a tu consulta.',
      'Spanish-speaking virtual medical admin available — dedicated full-time staff.',
      'Apoyo administrativo en español para consultorios bilingües.',
      'Agrega personal virtual bilingüe para llamadas, citas y seguros.',
      'MedVirtual conecta consultorios con personal virtual dedicado que habla español.',
    ],
    headlines: ['SPANISH-SPEAKING MEDICAL ADMIN AVAILABLE', 'Apoyo Administrativo en Español', 'Personal Virtual Bilingüe', 'Asistente Médico Virtual en Español', 'Se Habla Español — Apoyo Administrativo'],
    descriptions: ['Personal bilingüe dedicado.', 'Recepción, seguros y facturación.', 'No es un call center.', 'Tiempo completo en tu equipo.', 'Cuéntanos qué necesitas.'],
  },
];

// ─── Competitor research seed ────────────────────────────────────────────────

function researchRecord(overrides) {
  const base = {
    company: '',
    website: '',
    facebookPage: 'Research needed',
    metaAdLibraryUrl: 'Research needed — search Meta Ad Library by page name',
    sourceUrl: 'Research needed',
    dateCaptured: '',
    screenshot: '',
    creativeFormat: 'Research needed',
    language: 'Research needed',
    headline: 'Research needed',
    offer: 'Research needed',
    priceShown: 'Research needed',
    trustClaim: 'Research needed',
    cta: 'Research needed',
    talentShown: 'Research needed',
    wardrobe: 'Research needed',
    backgroundColor: 'Research needed',
    accentColor: 'Research needed',
    benefitsShown: 'Research needed',
    spanishTreatment: 'Research needed',
    flagTreatment: 'Research needed',
    formType: 'Research needed',
    formFriction: 'Research needed',
    requiredFields: 'Research needed',
    smsVerification: 'Research needed',
    workEmailRequirement: 'Research needed',
    strengths: 'Research needed',
    weaknesses: 'Research needed',
    whatAdapt: 'Research needed',
    whatNotCopy: 'Never copy competitor names, logos, URLs, exact layouts, palettes (esp. pink), or unverified claims.',
    originalityRisk: 'Research needed',
    reviewer: '',
    reviewStatus: 'Research Needed',
    notes: 'EXTERNAL REFERENCE ONLY — not affiliated with or endorsed by MedVirtual. Do not reuse their assets or claims.',
  };
  return { ...base, ...overrides };
}

export const COMPETITOR_RESEARCH_SEED = [
  researchRecord({ company: 'Hello Rache', website: 'https://www.hellorache.com', notes: 'EXTERNAL REFERENCE ONLY — healthcare virtual assistant competitor. Benchmark structure only; do not copy palette, claims, or copy.' }),
  researchRecord({ company: 'Virtual Medical Admins', website: 'Research needed — confirm official domain', notes: 'EXTERNAL REFERENCE ONLY — verify this is a distinct company vs a generic category name before logging ads.' }),
  researchRecord({ company: 'My Mountain Mover', website: 'https://www.mymountainmover.com', notes: 'EXTERNAL REFERENCE ONLY — healthcare VA staffing competitor. Benchmark only.' }),
  researchRecord({ company: 'MedVA', website: 'https://www.medva.com', notes: 'EXTERNAL REFERENCE ONLY — medical virtual assistant competitor. Benchmark only.' }),
  researchRecord({ company: 'Virtual Latinos', website: 'https://www.virtuallatinos.com', language: 'Likely EN + ES', spanishTreatment: 'Research needed — Spanish-speaking VA positioning', notes: 'EXTERNAL REFERENCE ONLY — relevant for Spanish/bilingual staffing benchmark. Benchmark only.' }),
  researchRecord({ company: 'Dental VA competitor (e.g., Dental Support Specialties)', website: 'Research needed — confirm specific dental VA vendor', notes: 'EXTERNAL REFERENCE ONLY — dental-specific virtual admin benchmark. Identify a concrete vendor before logging.' }),
  researchRecord({ company: 'Medical billing VA competitor', website: 'Research needed — confirm specific billing VA vendor', notes: 'EXTERNAL REFERENCE ONLY — medical-billing virtual staff benchmark. Identify a concrete vendor before logging.' }),
  researchRecord({ company: 'Spanish-speaking staffing competitor', website: 'Research needed', language: 'ES', notes: 'EXTERNAL REFERENCE ONLY — bilingual staffing benchmark for the Spanish segment.' }),
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getColorTestSet() {
  return COLOR_TEST_SET;
}

export function getProductionQueue() {
  return PRODUCTION_QUEUE;
}

export function getClaim(id) {
  return CLAIMS.find((c) => c.id === id) ?? null;
}

export function getClaimsForConcept(concept) {
  if (!concept?.claimIds?.length) return [];
  return CLAIMS.filter((c) => concept.claimIds.includes(c.id));
}

export function conceptsByGroup(g) {
  return CONCEPTS.filter((c) => c.group === g);
}

export function getColorFamily(id) {
  return COLOR_BY_ID[id] ?? null;
}

export function getConceptByNumber(n) {
  return CONCEPTS.find((c) => c.number === n) || COLOR_TEST_SET.find((c) => c.number === n) || null;
}
