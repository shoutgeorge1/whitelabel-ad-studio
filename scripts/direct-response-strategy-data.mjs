/**
 * Direct-Response Meta strategy — July 14, 2026 campaign review.
 * Single source of truth for DR boards, copy matrices, form specs, queue, and test plans.
 * Reference ads informed STRATEGY ONLY — pink/magenta is forbidden in all creative palettes.
 */

// ─── Meta & navigation ───────────────────────────────────────────────────────

export const DR_META = {
  reviewDate: '2026-07-14',
  reviewDateDisplay: 'July 14, 2026',
  campaignName: 'MedVirtual Meta Leads — Direct Response',
  coreHeadlineEn: 'HIRE A VIRTUAL MEDICAL ADMIN',
  coreHeadlineEs: 'CONTRATA A UN ASISTENTE MÉDICO VIRTUAL',
  bannerTitle: 'CURRENT DIRECTION — HIGH-CONTRAST DIRECT-RESPONSE META CREATIVE',
  bannerSub: 'Human-led, offer-first, mobile-readable, and designed to generate leads.',
  noPinkRule:
    'Do not use pink, magenta, hot pink, rose, or fuchsia anywhere in DR creative palettes, mockups, scrubs, badges, or accent colors. Reference ads used pink — that informed structure only, not MedVirtual color.',
  recommendedCta: 'Learn More',
  alternateCta: 'Get Started',
  privacyPolicyUrl: 'https://www.medvirtual.ai/privacy-policy',
  completionUrl: 'https://www.medvirtual.ai',
  status: 'Current Direction',
  guardrails: [
    'Ad-facing brand is MedVirtual — never MedVirtual.ai.',
    'Dedicated full-time virtual medical staff who join the practice team.',
    'Not a call center, managed front desk, outsourcing agency, chatbot, AI service, or fully managed service.',
    'No medical outcome claims, guaranteed savings, guaranteed staffing results, or unsupported performance claims.',
    'Do not invent a free offer. Label every offer concept pending leadership approval until confirmed.',
    'Legal/compliance approval required before publishing Instant Forms.',
    'Do not claim instant placement unless verified.',
    'No pink, magenta, hot pink, rose, or fuchsia in any creative palette or accent.',
    'Logo on creative is optional — not required.',
    'Price and HIPAA claims require explicit approval before publish.',
  ],
  referencePrinciples: [
    'One dominant headline readable in ~1 second on mobile.',
    'Human talent framed large on the right — credible medical admin, not generic stock.',
    '3–4 large task bullets with check-style icons under the headline.',
    'Visible price-anchor badge treatment to stop scroll (only with approved claims).',
    'High-contrast vivid color plate — foreground punches against background.',
    'Mobile-first type scale — billboard headline, not brochure body copy.',
    'Single clear CTA pill or button — easy to spot without hunting.',
    'Optional trust badge zone (HIPAA, dedicated staff) — only approved claims.',
    'Offer-first message hierarchy — role and tasks before brand decoration.',
    'One focused message per ad — isolate test variables deliberately.',
  ],
  doNotCopy: [
    'Pink, magenta, hot pink, rose, or fuchsia color palettes from reference ads.',
    'Competitor brand names, logos, URLs, or proprietary layout trademarks.',
    'Unapproved price points, savings percentages, or HIPAA claims copied verbatim.',
    'Pixel-for-pixel duplication of reference layouts — adapt structure with original shapes.',
    'Nationality assumptions about the talent or the viewer.',
    'Fake testimonials, fake UI screenshots, or invented credentials.',
    'Call-center headset stock or physician-implying clinical scenes.',
    'Prison-orange or neon-pink scrub colors.',
    'Instant-placement or guaranteed-hire promises.',
  ],
  externalRefs: [
    {
      id: 'ref-spanish-speaking',
      src: '/assets/external-references/ref-ad-spanish-speaking.png',
      label: 'External creative reference — visual benchmark only.',
      notes: 'Benchmark for Spanish/bilingual cue placement and headline scale — not for pink palette or competitor copy.',
    },
    {
      id: 'ref-hipaa-price',
      src: '/assets/external-references/ref-ad-hipaa-price.png',
      label: 'External creative reference — visual benchmark only.',
      notes: 'Benchmark for price-badge and trust-badge hierarchy — confirm claims before publishing.',
    },
  ],
};

export const DR_NAV = [
  { href: '/direct-response.html', label: 'Current Meta Direction', id: 'dr-overview' },
  { href: '/dr-reference-analysis.html', label: 'Reference Ad Analysis', id: 'dr-reference' },
  { href: '/dr-design-system.html', label: 'DR Design System', id: 'dr-design' },
  { href: '/dr-color-board.html', label: 'Color Testing Board', id: 'dr-color' },
  { href: '/dr-concepts-en.html', label: 'English Concepts', id: 'dr-concepts-en' },
  { href: '/dr-concepts-es.html', label: 'Spanish & Bilingual', id: 'dr-concepts-es' },
  { href: '/dr-concepts-roles.html', label: 'Role-Specific Board', id: 'dr-concepts-roles' },
  { href: '/dr-image-prompts.html', label: 'Image Prompt Library', id: 'dr-prompts' },
  { href: '/dr-copy-matrix.html', label: 'Meta Copy Matrix', id: 'dr-copy' },
  { href: '/dr-form.html', label: 'Low-Friction Form', id: 'dr-form' },
  { href: '/dr-offers.html', label: 'Completion & Offers', id: 'dr-offers' },
  { href: '/dr-campaign-plan.html', label: 'Campaign Test Structure', id: 'dr-campaign' },
  { href: '/dr-qa-checklist.html', label: 'Launch QA', id: 'dr-qa' },
  { href: '/dr-claims.html', label: 'Claims Tracker', id: 'dr-claims' },
  { href: '/dr-production-queue.html', label: 'Production Queue', id: 'dr-queue' },
  { href: '/dr-superseded.html', label: 'Superseded Direction', id: 'dr-superseded' },
  { href: '/dr-approval.html', label: 'Final Approval', id: 'dr-approval' },
];

// ─── Claims ──────────────────────────────────────────────────────────────────

export const CLAIM_STATUSES = [
  'Confirmed',
  'Pending confirmation',
  'Not approved',
  'Rejected',
  'Approved for launch',
];

export const CLAIMS = [
  {
    id: 'price-10hr',
    label: 'Starting at $10/hr',
    claimText: 'Starting at $10 per hour',
    category: 'pricing',
    status: 'Pending confirmation',
    notes: 'Requires final leadership confirmation before launch.',
  },
  {
    id: 'hipaa',
    label: 'HIPAA Compliant',
    claimText: 'HIPAA Compliant',
    category: 'compliance',
    status: 'Pending confirmation',
    notes: 'Requires compliance confirmation before launch.',
  },
  {
    id: 'dedicated-ft',
    label: 'Dedicated Full-Time Staff',
    claimText: 'Dedicated full-time virtual staff who join your practice team',
    category: 'other',
    status: 'Confirmed',
    notes: 'Core business model truth — safe for body copy and supporting lines.',
  },
  {
    id: 'spanish-available',
    label: 'Spanish-Speaking Staff',
    claimText: 'Spanish-speaking virtual staff available',
    category: 'other',
    status: 'Pending confirmation',
    notes: 'Confirm availability messaging with operations before launch.',
  },
  {
    id: 'free-consultation',
    label: 'Free Staffing Consultation',
    claimText: 'Free staffing consultation',
    category: 'offer',
    status: 'Pending confirmation',
    notes: 'Pending leadership approval — do not publish on form or completion screen.',
  },
  {
    id: 'free-workflow-review',
    label: 'Free Workflow Review',
    claimText: 'Free front-office workflow review',
    category: 'offer',
    status: 'Not approved',
    notes: 'Not approved for launch.',
  },
  {
    id: 'free-candidate-profiles',
    label: 'Free Sample Profiles',
    claimText: 'Free sample candidate profiles',
    category: 'offer',
    status: 'Not approved',
    notes: 'Do not invent credentials on sample profiles.',
  },
  {
    id: 'instant-placement',
    label: 'Instant Placement',
    claimText: 'Instant placement / hire today',
    category: 'placement',
    status: 'Not approved',
    notes: 'Do not claim instant placement unless verified.',
  },
];

// ─── Color families ──────────────────────────────────────────────────────────

const NO_PINK_FORBIDDEN =
  'Forbidden: pink, magenta, hot pink, rose, fuchsia (#FF00AA, #FF1493, #EC4899, #F472B6, #DB2777, #BE185D and similar).';

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
    scrubNote: 'Electric lime scrubs on near-black plate — high scroll-stop, no pink',
    secondary: '#00E5FF',
    contrastStrategy: 'White headline on near-black plate. Lime accent for CTA and scrub. Cyan secondary for badge details.',
    avoid: 'Muted olive greens, neon that clips on mobile, pink-adjacent magentas.',
    forbiddenNote: NO_PINK_FORBIDDEN,
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
    scrubNote: 'Signal yellow scrubs — avoid prison-orange',
    secondary: '#1D4ED8',
    contrastStrategy: 'Black headline on signal yellow. Black CTA with yellow label. Cobalt secondary for price tab accent.',
    avoid: 'Beige, mustard mud, cream plates, prison-orange scrubs.',
    forbiddenNote: NO_PINK_FORBIDDEN,
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
    scrubNote: 'Cobalt blue scrubs — professional healthcare admin',
    secondary: '#00E5FF',
    contrastStrategy: 'White type on cobalt plate. White CTA with cobalt text. Cyan accents for badges.',
    avoid: 'Navy-on-navy, pastel baby blue, muddy brand-teal as dominant plate.',
    forbiddenNote: NO_PINK_FORBIDDEN,
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
    scrubNote: 'High-voltage cyan scrubs on navy plate',
    secondary: '#B8F000',
    contrastStrategy: 'White headline on navy plate. Cyan accent for CTA, scrub, and badge highlights. Lime secondary pops.',
    avoid: 'Muted teal (#077999) as dominant if it reads restrained on feed.',
    forbiddenNote: NO_PINK_FORBIDDEN,
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
    scrubNote: 'Vivid green scrubs — credible admin look',
    secondary: '#FFE600',
    contrastStrategy: 'Black headline on vivid green. Black CTA. Yellow or cyan badge accents only.',
    avoid: 'Forest mud, olive drab, low-saturation sage that kills scroll-stop.',
    forbiddenNote: NO_PINK_FORBIDDEN,
  },
  {
    id: 'signal-red',
    name: 'Signal Red',
    priority: 6,
    background: '#0A0A0A',
    backgroundAlt: '#111111',
    accent: '#E10600',
    foreground: '#FFFFFF',
    headlineColor: '#FFFFFF',
    bulletColor: '#FFF5F5',
    ctaBg: '#E10600',
    ctaText: '#FFFFFF',
    scrubColor: '#D61F1F',
    scrubNote: 'True commercial red scrubs — never pink, rose, or fuchsia',
    secondary: '#FFE600',
    contrastStrategy: 'White headline on dark plate. True commercial red (#E10600 / #D61F1F) for accent, CTA, and scrub — never pink-rose.',
    avoid: 'Rose, coral-pink, salmon, fuchsia, or #E11D48 pink-red. No magenta scrubs.',
    forbiddenNote:
      'Use true commercial red only (#E10600, #D61F1F). Forbidden: pink, rose, fuchsia, magenta, #EC4899, #F472B6, #DB2777.',
  },
  {
    id: 'tangerine-accent',
    name: 'Tangerine Accent (optional)',
    priority: 7,
    background: '#020617',
    backgroundAlt: '#0F172A',
    accent: '#F97316',
    foreground: '#FFFFFF',
    headlineColor: '#FFFFFF',
    bulletColor: '#FFF7ED',
    ctaBg: '#FFFFFF',
    ctaText: '#020617',
    scrubColor: '#FFFFFF',
    scrubNote: 'Navy or white scrub top only — tangerine for badges, never orange scrubs',
    secondary: '#00E5FF',
    contrastStrategy: 'Tangerine (#F97316) for badges and price tabs only. Navy/black/white dominate. Scrubs navy or white top — never orange scrubs.',
    avoid: 'Orange scrubs, prison jumpsuit orange, pink-orange coral.',
    forbiddenNote: NO_PINK_FORBIDDEN,
    optional: true,
    badgeOnly: true,
  },
];

// ─── Layout & badges ─────────────────────────────────────────────────────────

export const LAYOUT_SYSTEMS = [
  {
    id: 'layout-a',
    name: 'A — Split-Screen Offer',
    description: 'Large headline and bullets left; credible talent right. Primary DR layout for color tests.',
    formats: ['1:1', '4:5', '9:16'],
    notes: 'Mirrors reference scroll-stop structure but uses original MedVirtual shapes — not a pixel clone.',
  },
  {
    id: 'layout-b',
    name: 'B — Central Talent Hero',
    description: 'Talent centered or dominant; copy band above or below. Strong face-first stop.',
    formats: ['1:1', '4:5', '9:16'],
    notes: 'Original framing — reference used side-split; this variant tests hero-first for Stories.',
  },
  {
    id: 'layout-c',
    name: 'C — Giant Price Anchor',
    description: 'Oversized price badge as visual anchor; headline and bullets secondary but still large.',
    formats: ['1:1', '4:5', '9:16'],
    notes: 'Price hierarchy inspired by references — use only with approved pricing claims.',
  },
  {
    id: 'layout-d',
    name: 'D — Role Card',
    description: 'Role pill + checklist card with talent inset. Good for role-specific boards.',
    formats: ['1:1', '4:5', '9:16'],
    notes: 'Shares Role-Offer DNA but on vivid DR plates — not teal grid default.',
  },
  {
    id: 'layout-e',
    name: 'E — Vertical Benefit Rail',
    description: 'Stacked benefit rail with icons left; talent lower-right or bottom band.',
    formats: ['1:1', '4:5', '9:16'],
    notes: 'Original vertical rhythm — avoids reference side-by-side clone.',
  },
  {
    id: 'layout-f',
    name: 'F — Poster Style',
    description: 'Bold poster headline top-to-mid; talent and CTA anchored bottom. High impact on 9:16.',
    formats: ['1:1', '4:5', '9:16'],
    notes: 'Alternative to Layout A for color tests. Strong mobile readability.',
  },
];

export const BADGE_STYLES = [
  { id: 'angled-ticket', name: 'Angled Ticket', description: 'Tilted ticket stub with price — original corner angle, not reference clone.' },
  { id: 'rectangular-price-tab', name: 'Rectangular Price Tab', description: 'Flush price tab attached to headline block.' },
  { id: 'bottom-banner', name: 'Bottom Banner', description: 'Full-width bottom band for price or trust claim.' },
  { id: 'vertical-side-strip', name: 'Vertical Side Strip', description: 'Narrow side strip for price/HIPAA — sits outside copy safe zone.' },
  { id: 'shield', name: 'Shield', description: 'Shield shape for HIPAA or compliance — only with approved claim.' },
  { id: 'circular-seal', name: 'Circular Seal', description: 'Circular seal for dedicated-staff or trust cues.' },
  { id: 'corner-ribbon', name: 'Corner Ribbon', description: 'Corner ribbon for promotional callout — pending offer approval only.' },
  { id: 'digital-display', name: 'Digital Display', description: 'LED-style price display — original typography, no fake UI chrome.' },
  { id: 'highlighter-panel', name: 'Highlighter Panel', description: 'Highlighter swipe behind price text — vivid accent only.' },
];

// ─── Copy banks ──────────────────────────────────────────────────────────────

export const HEADLINE_FAMILIES_EN = [
  {
    id: 'core-role',
    name: 'Core Role',
    headlines: [
      'HIRE A VIRTUAL MEDICAL ADMIN',
      'Hire a Virtual Medical Admin',
      'Add a Virtual Medical Administrator',
      'Virtual Medical Admin for Your Practice',
      'Get a Dedicated Medical Admin',
    ],
  },
  {
    id: 'pain-calls',
    name: 'Missed Calls / Overload',
    headlines: [
      'STOP LETTING PATIENT CALLS GO UNANSWERED',
      'YOUR FRONT DESK IS OVERLOADED',
      'Keep Patient Calls Answered',
      'Get Help With Patient Calls',
      'Stop Missing Patient Calls',
    ],
  },
  {
    id: 'capacity',
    name: 'Admin Capacity',
    headlines: [
      'BUILD ADMIN CAPACITY WITHOUT ANOTHER LOCAL DESK',
      'HIRE DEDICATED FULL-TIME VIRTUAL STAFF',
      'Add Front-Office Capacity Virtually',
      'Scale Calls and Scheduling Support',
      'Grow Without Another Local Hire',
    ],
  },
  {
    id: 'role-specific',
    name: 'Role Specific',
    headlines: [
      'HIRE A VIRTUAL DENTAL ADMIN',
      'SUPPORT INSURANCE VERIFICATION',
      'ADD VIRTUAL SCHEDULING SUPPORT',
      'SUPPORT YOUR BILLING TEAM',
      'HANDLE PATIENT INTAKE REMOTELY',
    ],
  },
  {
    id: 'value-offer',
    name: 'Value / Offer',
    headlines: [
      'TRAINED MEDICAL ADMIN SUPPORT FOR YOUR PRACTICE',
      'DEDICATED STAFF — NOT A CALL CENTER',
      'Find Trained Medical Administrative Staff',
      'Full-Time Virtual Staff on Your Team',
      'Staffing Help for Busy Medical Practices',
    ],
  },
];

export const HEADLINE_FAMILIES_ES = [
  {
    id: 'core-role-es',
    name: 'Rol Principal',
    headlines: [
      'CONTRATA A UN ASISTENTE MÉDICO VIRTUAL',
      'Contrata un Asistente Médico Virtual',
      'Personal Administrativo Médico Virtual',
      'Agrega Apoyo Administrativo a Tu Consulta',
      'Asistente Médico Virtual Dedicado',
    ],
  },
  {
    id: 'pain-calls-es',
    name: 'Llamadas / Saturación',
    headlines: [
      'NO DEJES LLAMADAS DE PACIENTES SIN CONTESTAR',
      '¿TU MOSTRADOR ESTÁ SATURADO?',
      'Ayuda para Contestar Llamadas',
      'Mantén las Llamadas Atendidas',
      'Apoyo Virtual para Tu Consulta',
    ],
  },
  {
    id: 'bilingual-cue',
    name: 'Bilingual Cue',
    headlines: [
      'SE HABLA ESPAÑOL — CONTRATA APOYO ADMINISTRATIVO',
      'Spanish-Speaking Virtual Staff Available',
      'Apoyo Administrativo en Español',
      'Personal Virtual para Consultorios Bilingües',
      'Atención Administrativa en Español',
    ],
  },
];

export const defaultCoreBullets = [
  'Reception & Admin Support',
  'Insurance Verification',
  'Preauthorization Support',
  'Medical Billing Support',
];

export const SERVICE_BULLET_BANK = {
  core: defaultCoreBullets,
  calls: ['Answer Patient Calls', 'Schedule Appointments', 'Follow Up With Patients', 'Manage Front-Desk Tasks'],
  scheduling: ['Schedule Appointments', 'Confirm Upcoming Visits', 'Manage Reschedules', 'Reduce No-Shows'],
  insurance: ['Insurance Verification', 'Eligibility Checks', 'Preauthorization Support', 'Prior Auth Follow-Up'],
  billing: ['Medical Billing Support', 'Claims Follow-Up', 'Patient Balance Outreach', 'Insurance Admin Tasks'],
  intake: ['Patient Intake Forms', 'Collect Patient Details', 'Prep Charts for Visits', 'Registration Support'],
  dental: ['Answer Patient Calls', 'Schedule Appointments', 'Insurance Verification', 'Treatment Follow-Up'],
  dedicated: ['Join Your Practice Team', 'Answer Calls & Schedule', 'Verify Insurance', 'Support Intake & Follow-Up'],
  spanish: [
    'Recepción y Apoyo Administrativo',
    'Verificación de Seguros',
    'Apoyo de Preautorización',
    'Apoyo de Facturación Médica',
  ],
  spanishCalls: ['Contesta Llamadas', 'Agenda Citas', 'Da Seguimiento a Pacientes', 'Apoya al Mostrador'],
};

export const CTA_OPTIONS = {
  primary: { en: 'Learn More', es: 'Más Información' },
  alternate: { en: 'Get Started', es: 'Comenzar' },
};

export const TALENT_DIRECTION = {
  role: 'Virtual Medical Administrator',
  look: 'Professional female virtual medical administrator — credible, warm, approachable, mid-20s to late-30s',
  wardrobe: 'Scrubs matching the active color family — green, yellow, blue, cyan, lime, or commercial red top. Never pink, magenta, rose, or prison-orange.',
  framing: 'Right side of frame (Layouts A/F) or hero center (Layout B); face and upper torso clear; confident posture',
  wardrobeTests: [
    { id: 'scrub-match', label: 'Scrubs match color family', notes: 'Scrub top matches plate accent — green, yellow, blue, cyan, lime, or commercial red. Never pink or orange prison scrubs.' },
    { id: 'navy-white-top', label: 'Navy or white scrub top', notes: 'For tangerine-accent badges or dark plates — scrub top navy or white, not orange.' },
    { id: 'white-coat-off', label: 'No white coat', notes: 'Admin look — scrubs or professional medical admin attire, not physician white coat.' },
  ],
  poseVariations: [
    'Slight smile, arms relaxed at sides',
    'One hand on hip, open posture',
    'Holding tablet or clipboard at waist — no patient data visible',
    'Seated at clean desk edge — no call-center headset',
  ],
  do: [
    'Look like a real healthcare administrative professional',
    'Warm, trustworthy expression with direct eye contact',
    'Clean production lighting, high contrast against color plate',
    'Diverse casting acceptable — do not imply specific nationality',
  ],
  avoid: [
    'Pink, magenta, rose, or fuchsia scrubs or clothing',
    'Fashion model / influencer posing',
    'Clinical nurse providing bedside care',
    'Generic headset call-center agent',
    'Physician white coat or stethoscope implying doctor',
    'Stock "smiling at laptop" generic corporate',
    'Prison-orange or neon scrubs',
  ],
  /** @deprecated Use avoid — generator compatibility */
  dont: [
    'Pink, magenta, rose, or fuchsia scrubs or clothing',
    'Fashion model / influencer posing',
    'Clinical nurse providing bedside care',
    'Generic headset call-center agent',
    'Physician white coat or stethoscope implying doctor',
    'Stock "smiling at laptop" generic corporate',
    'Prison-orange or neon scrubs',
  ],
};

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
  introVariations: [
    {
      id: 'intro-1',
      headline: 'Need reliable help with calls, scheduling, intake, or insurance verification?',
      body: 'Tell us a few details and a MedVirtual staffing specialist will follow up about dedicated full-time virtual staff for your practice.',
    },
    {
      id: 'intro-2',
      headline: 'Add a dedicated virtual medical administrator to your practice.',
      body: 'Share your contact information so we can discuss hiring full-time virtual staff who join your team.',
    },
    {
      id: 'intro-3',
      headline: 'Tell us how we can support your front office.',
      body: 'MedVirtual helps practices hire dedicated virtual medical administrative staff — not a call center.',
    },
    {
      id: 'intro-4',
      headline: 'Find trained virtual staff for your medical practice.',
      body: 'Submit this short form and a staffing specialist will contact you to discuss your needs.',
    },
    {
      id: 'intro-5',
      headline: 'Build more administrative capacity without adding another local desk.',
      body: 'Request a conversation about dedicated full-time virtual medical admin support for your practice.',
    },
    {
      id: 'intro-6',
      headline: 'Hire dedicated full-time virtual staff who join your practice team.',
      body: 'A MedVirtual specialist will reach out to learn about your calls, scheduling, and insurance verification needs.',
    },
  ],
  introEs: [
    {
      id: 'intro-es-1',
      headline: '¿Necesitas ayuda confiable con llamadas, citas, admisiones o verificación de seguros?',
      body: 'Comparte tus datos y un especialista de MedVirtual te contactará sobre personal virtual de tiempo completo para tu consulta.',
    },
    {
      id: 'intro-es-2',
      headline: 'Agrega un administrador médico virtual dedicado a tu consulta.',
      body: 'Déjanos tus datos para hablar sobre personal que se une a tu equipo — no un call center.',
    },
    {
      id: 'intro-es-3',
      headline: 'Cuéntanos qué necesita tu consulta.',
      body: 'MedVirtual ayuda a consultorios a contratar personal administrativo médico virtual dedicado.',
    },
  ],
  rules: [
    'Do not require a work email.',
    'Do not require SMS verification.',
    'Do not require both SMS verification and extra qualification friction.',
    'Clearly distinguish required fields from optional fields.',
    'Do not invent a free offer on the form until leadership approves.',
    'Default launch form is Form A unless a concept explicitly specifies Form B.',
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
    nextStepBullets: [
      'We review your practice needs',
      'A staffing specialist contacts you',
      'You discuss dedicated full-time virtual staff options',
    ],
    cta: 'Visit MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    notes: 'Use until an approved offer is confirmed. Do not promise instant placement.',
  },
  {
    id: 'team-followup',
    label: 'Team follow-up',
    headline: 'Thanks — We Are Reviewing Your Request',
    body: 'A MedVirtual specialist will reach out to learn about your calls, scheduling, intake, and insurance verification needs.',
    nextStepBullets: ['Specialist reviews your submission', 'Follow-up call or email scheduled', 'Discuss dedicated hire options'],
    cta: 'Visit MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    notes: 'Continues selling the staffing conversation.',
  },
  {
    id: 'what-happens-next',
    label: 'What happens next',
    headline: 'Here Is What Happens Next',
    body: 'We will walk you through how dedicated full-time virtual staff can join your practice team.',
    nextStepBullets: [
      'Review your front-office priorities',
      'Match role needs to staffing options',
      'Plan next steps for your practice',
    ],
    cta: 'Visit MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    notes: 'No instant-placement language.',
  },
  {
    id: 'capacity-continue',
    label: 'Capacity continue',
    headline: 'Let Us Talk About Front-Office Capacity',
    body: 'You asked about dedicated virtual medical admin support. A MedVirtual specialist will contact you shortly.',
    nextStepBullets: ['Confirm your staffing priorities', 'Discuss full-time dedicated model', 'Answer your questions'],
    cta: 'Visit MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    notes: '',
  },
  {
    id: 'es-default',
    label: 'Spanish default',
    headline: 'Hemos Recibido Tu Solicitud',
    body: 'Un especialista de MedVirtual revisará tu información y te contactará para hablar sobre las necesidades de personal de tu consulta.',
    nextStepBullets: [
      'Revisamos las necesidades de tu consulta',
      'Un especialista te contacta',
      'Hablamos sobre personal virtual dedicado',
    ],
    cta: 'Visitar MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    notes: 'Pair with Spanish creative and Spanish form intro.',
  },
  {
    id: 'dedicated-model',
    label: 'Dedicated model reinforcement',
    headline: 'Dedicated Staff — Not a Call Center',
    body: 'MedVirtual helps practices hire full-time virtual staff who join the team — not a shared agent pool.',
    nextStepBullets: ['Learn your workflow needs', 'Discuss dedicated hire model', 'Plan onboarding conversation'],
    cta: 'Visit MedVirtual',
    ctaUrl: 'https://www.medvirtual.ai',
    notes: 'Reinforces business model truth.',
  },
];

export const OFFER_CONCEPTS = [
  {
    id: 'offer-consultation',
    name: 'Free Staffing Consultation',
    description: 'Short call to discuss practice needs and dedicated virtual staffing options.',
    status: 'Pending leadership approval — do not publish.',
  },
  {
    id: 'offer-workflow',
    name: 'Free Front-Office Workflow Review',
    description: 'Review of calls, scheduling, intake, and insurance verification workflow gaps.',
    status: 'Pending leadership approval — do not publish.',
  },
  {
    id: 'offer-matching',
    name: 'Candidate Matching Call',
    description: 'Conversation focused on matching role needs to potential dedicated candidates.',
    status: 'Pending leadership approval — do not publish.',
  },
  {
    id: 'offer-profiles',
    name: 'Sample Candidate Profiles',
    description: 'Share illustrative approved sample profiles after conversation — never invent credentials.',
    status: 'Pending leadership approval — do not publish.',
  },
  {
    id: 'offer-cost-compare',
    name: 'Staffing Cost Comparison',
    description: 'Compare local desk capacity vs dedicated virtual staff — no invented savings percentages.',
    status: 'Pending leadership approval — do not publish.',
  },
  {
    id: 'offer-onboarding',
    name: 'Onboarding Planning Session',
    description: 'Session to plan how dedicated virtual staff integrate into practice workflows.',
    status: 'Pending leadership approval — do not publish.',
  },
];

export const CAMPAIGN_PLAN = {
  campaign: 'MedVirtual Meta Leads — Direct Response',
  objective: 'Leads (Instant Form) — booked demos / staffing conversations',
  warning:
    'Do not spend aggressively until the form, CRM delivery, lead access, attribution, and follow-up process have been tested end-to-end.',
  adSets: [
    {
      name: 'Ad Set 1 — Broad / Advantage+ Native Targeting',
      structure:
        'Six color-isolated creatives (DR-01..DR-06) sharing identical copy, layout, talent, and Form A. Color is the only variable.',
      creatives: ['DR-01 Electric Lime', 'DR-02 Signal Yellow', 'DR-03 Cobalt Blue', 'DR-04 High-Voltage Cyan', 'DR-05 Vivid Green', 'DR-06 Signal Red'],
    },
    {
      name: 'Ad Set 2 — Spanish Segment',
      structure: 'Spanish concept (DR-19) plus winning color from Ad Set 1. Hold form intro in Spanish.',
      creatives: ['DR-19 Spanish Core — Vivid Green', 'Winner color from Set 1'],
    },
    {
      name: 'Ad Set 3 — Pain / Role Follow-Up',
      structure: 'Pain and role-specific concepts after color winner emerges. One message change at a time.',
      creatives: ['DR-07 Missed Calls', 'DR-11 Dental Admin', 'DR-12 Billing Support'],
    },
    {
      name: 'Ad Set 4 — Lookalike',
      structure: 'Replay winning color + message on lookalike after broad learns.',
      creatives: ['Winner from Set 1 or 2'],
    },
  ],
  controls: [
    'Hold offer constant until leadership approves a free-offer test.',
    'Hold Form A constant across DR-01..DR-06 color isolation.',
    'Vary color first — not five unrelated messages at once.',
    'Prefer 4:5 and 1:1 for feed; adapt 9:16 for Stories/Reels after winners emerge.',
    'Do not publish price or HIPAA badges until claims are Approved for launch.',
    'No pink/magenta plates in any ad set.',
  ],
};

export const QA_CHECKLIST = [
  'Correct Facebook page selected',
  'Correct Instant Form attached (Form A unless concept specifies Form B)',
  'Form published after legal/compliance approval',
  'Test lead submitted successfully',
  'Lead visible in Meta Leads Center',
  'Lead visible in HubSpot',
  'Source and campaign fields populated correctly',
  'Sales notification triggered',
  'Correct privacy-policy URL',
  'Correct completion-screen URL',
  'Mobile preview checked on iOS and Android',
  'All placements reviewed (Feed, Stories, Reels)',
  'No accidental SMS verification enabled',
  'No work-email restriction enabled',
  'No unapproved AI language in copy or form',
  'No unapproved free offer on form or completion screen',
  'Five primary texts populated',
  'Five headlines populated',
  'Five descriptions populated where available',
  'CTA confirmed (Learn More or approved alternate)',
  'Budget and daily spend confirmed',
  'Audience / Advantage+ settings confirmed',
  'Existing reactions / engagement settings reviewed',
  'Ad naming convention matches DR-## scheme',
  'Creative uses approved claims only — price and HIPAA checked',
  'No pink, magenta, rose, or fuchsia in creative file',
  'Scrubs color matches approved color family — not orange prison scrubs',
  'Headline readable at mobile thumb distance',
  '3–4 bullets max on creative — not paragraph copy',
  'Talent looks like medical admin — not call-center headset stock',
  '9:16 safe zones respected (no text under UI chrome)',
  'Logo treatment matches concept spec (optional / omitted)',
  'Spanish ads use approved Spanish intro variant',
  'Instant placement language absent',
  'MedVirtual.ai not used in ad-facing copy',
  'Call-center / managed-desk / AI service claims absent',
  'End-to-end follow-up process confirmed before scaling spend',
];

export const SUPERSEDED = {
  summary:
    'Earlier teal SaaS-only / no-people guidance is archived for primary Meta DR testing — not deleted. Human-led, high-contrast direct response is now the paid-social priority.',
  points: [
    'Earlier teal SaaS-only concepts remain at `/saas-prop-templates.html` under Producer Lab — archived, not deleted.',
    'Earlier "no people" guidance for primary Meta ads replaced by human-led direct-response creatives.',
    'Pink/magenta excluded from DR palettes — reference ads informed structure only.',
    'Logo use is optional on DR creatives.',
    'Objective is leads and booked staffing conversations — not brand-consistency for its own sake.',
    'Purple remains lower priority based on weaker prior tests.',
    'Role-Offer and Real People boards remain useful; DR is the new cold-lead visual language.',
    'Old dr-creative-board / dr-copy-en / dr-copy-es pages superseded by expanded DR board set.',
  ],
};

export const PRODUCTION_STATUSES = [
  'Draft',
  'Ready for copy review',
  'Ready for design',
  'Ready for image generation',
  'Needs layout review',
  'Ready for Chris',
  'Ready for export',
  'Approved for launch',
  'Exported',
  'Rejected',
  'On hold',
];

// ─── Factories ───────────────────────────────────────────────────────────────

const COLOR_BY_ID = Object.fromEntries(COLOR_FAMILIES.map((c) => [c.id, c]));

export function makeCopyPack({ role = 'general', angle = 'core-offer', language = 'en' } = {}) {
  const isEs = language === 'es';
  const cta = isEs ? CTA_OPTIONS.primary.es : CTA_OPTIONS.primary.en;
  const alt = isEs ? CTA_OPTIONS.alternate.es : CTA_OPTIONS.alternate.en;

  const packs = {
    'core-offer': {
      funnelStage: 'TOFU / cold lead gen',
      audienceHypothesis: 'Practice owners and managers open to adding dedicated virtual admin capacity.',
      primaryTexts: isEs
        ? [
            'Contrata a un asistente médico virtual para recepción, seguros, preautorización y facturación.',
            'Agrega personal virtual de tiempo completo que se une a tu equipo — no un call center.',
            '¿Necesitas apoyo administrativo confiable? Contrata un asistente médico virtual dedicado.',
            'Personal administrativo entrenado para tu consulta — dedicado y de tiempo completo.',
            'MedVirtual ayuda a consultorios a contratar personal virtual dedicado para el área administrativa.',
          ]
        : [
            'Hire a virtual medical admin for reception, insurance verification, preauthorization, and billing support.',
            'Add dedicated full-time virtual staff who join your practice team — not a call center.',
            'Need reliable administrative help? Hire a virtual medical admin dedicated to your practice.',
            'Get trained medical administrative support without adding another local desk.',
            'MedVirtual helps practices hire dedicated virtual staff for calls, scheduling, and patient follow-up.',
          ],
      headlines: isEs
        ? HEADLINE_FAMILIES_ES.find((f) => f.id === 'core-role-es').headlines
        : HEADLINE_FAMILIES_EN.find((f) => f.id === 'core-role').headlines,
      descriptions: isEs
        ? [
            'Personal de tiempo completo en tu equipo.',
            'Recepción, seguros y facturación.',
            'No es un call center.',
            'Cuéntanos qué necesita tu consulta.',
            'Apoyo administrativo médico virtual.',
          ]
        : [
            'Dedicated full-time virtual staff who join your team.',
            'Reception, insurance, preauth, and billing support.',
            'Not a call center — hire into your practice.',
            'Tell us what your front office needs.',
            'Staffing solutions for medical practices.',
          ],
    },
    'missed-calls': {
      funnelStage: 'TOFU pain-aware',
      audienceHypothesis: 'Decision-makers feeling unanswered phones and front-desk chaos.',
      primaryTexts: isEs
        ? [
            'No dejes llamadas de pacientes sin contestar. Contrata a un asistente médico virtual.',
            'Cuando el mostrador está saturado, se pierden llamadas. Agrega apoyo virtual dedicado.',
            '¿Tu equipo no da abasto? Contrata personal virtual de tiempo completo para llamadas y citas.',
            'Las llamadas perdidas cuestan citas. Obtén ayuda con llamadas, agenda y seguimiento.',
            'Tu equipo no debería elegir entre pacientes en sala y un teléfono que no para.',
          ]
        : [
            'Stop letting patient calls go unanswered. Hire a virtual medical admin for your practice.',
            'When the front desk is slammed, patient calls slip. Add dedicated virtual call and scheduling support.',
            'Overloaded front desk? Hire full-time virtual staff to help answer calls and manage appointments.',
            'Missed calls cost appointments. Get help with patient calls, scheduling, and follow-up.',
            'Your team should not choose between patients in the lobby and phones that keep ringing.',
          ],
      headlines: isEs
        ? HEADLINE_FAMILIES_ES.find((f) => f.id === 'pain-calls-es').headlines
        : HEADLINE_FAMILIES_EN.find((f) => f.id === 'pain-calls').headlines,
      descriptions: isEs
        ? ['Apoyo dedicado para oficinas ocupadas.', 'Llamadas, citas y seguimiento.', 'Personal de tiempo completo en tu equipo.', 'Ayuda cuando el mostrador no da más.', 'Contratación para presión de llamadas.']
        : ['Dedicated virtual support for busy front offices.', 'Help with calls, scheduling, and follow-up.', 'Full-time staff who join your practice team.', 'Support when your desk cannot keep up.', 'Staffing help for missed-call pressure.'],
    },
    scheduling: {
      funnelStage: 'TOFU / MOFU',
      audienceHypothesis: 'Clinics struggling to keep the appointment book full.',
      primaryTexts: [
        'Add virtual scheduling support so appointments get booked, confirmed, and updated.',
        'Hire a virtual medical admin to schedule appointments and manage reschedules.',
        'Need a dedicated person for the appointment book? Hire full-time virtual scheduling support.',
        'Keep your schedule moving — virtual staff for booking, confirms, and patient follow-up.',
        'Scheduling backlog? Hire trained virtual medical administrative staff for your practice.',
      ],
      headlines: HEADLINE_FAMILIES_EN.find((f) => f.id === 'role-specific').headlines.slice(2, 7).concat(['Hire Scheduling Admin Support']),
      descriptions: ['Dedicated help for booking and confirms.', 'Full-time virtual staff on your team.', 'Scheduling support for medical practices.', 'Keep appointments moving.', 'Hire into your practice — not a call pool.'],
    },
    dental: {
      funnelStage: 'TOFU',
      audienceHypothesis: 'Dental owners and managers seeking virtual admin help.',
      primaryTexts: [
        'Hire a virtual dental admin for calls, scheduling, insurance verification, and follow-up.',
        'Dental front desk overloaded? Add dedicated full-time virtual staff to your practice.',
        'Get help answering patient calls and keeping the dental schedule full.',
        'MedVirtual helps dental practices hire dedicated virtual administrative staff.',
        'Support treatment follow-up and insurance checks with a virtual admin on your team.',
      ],
      headlines: ['Hire a Virtual Dental Admin', 'Dental Front Desk Support', 'Virtual Staff for Dental Practices', 'Help With Calls and Scheduling', 'Add Dental Admin Capacity'],
      descriptions: ['Dedicated virtual staff for dental practices.', 'Calls, scheduling, insurance, and follow-up.', 'Full-time hire into your dental team.', 'Not a call center model.', 'Tell us what your office needs.'],
    },
    billing: {
      funnelStage: 'MOFU',
      audienceHypothesis: 'Practices needing admin bandwidth adjacent to billing teams.',
      primaryTexts: [
        'Support your billing and insurance team with dedicated full-time virtual staff.',
        'Hire virtual medical admin help for claim follow-up support and patient balance outreach.',
        'Give billing room to breathe — add administrative capacity without another local desk.',
        'Need help supporting billing workflows? Hire trained virtual medical administrative staff.',
        'MedVirtual helps practices hire dedicated staff who support billing-adjacent admin work.',
      ],
      headlines: ['Support Your Billing Team', 'Admin Help for Billing Work', 'Virtual Staff for Claims Follow-Up', 'Add Billing Admin Capacity', 'Hire Support for Insurance Work'],
      descriptions: ['Admin support next to your billing team.', 'Dedicated full-time virtual staff.', 'Help with follow-up and patient balances.', 'Staffing — not a billing software pitch.', 'Join your practice team remotely.'],
    },
    dedicated: {
      funnelStage: 'MOFU differentiation',
      audienceHypothesis: 'Buyers burned by shared-pool / call-center VA models.',
      primaryTexts: [
        'Hire dedicated full-time virtual staff who join your practice team — not a shared call center.',
        'Looking for someone who works as part of your office, not a rotating agent pool?',
        'MedVirtual helps practices hire dedicated full-time virtual medical administrators.',
        'Get a dedicated teammate for calls, scheduling, insurance verification, and intake.',
        'Full-time. Dedicated. Part of your practice — that is the staffing model.',
      ],
      headlines: HEADLINE_FAMILIES_EN.find((f) => f.id === 'capacity').headlines,
      descriptions: ['Dedicated full-time — join your team.', 'Not a managed front desk service.', 'Hire into your practice workflow.', 'Staffing solutions for medical practices.', 'Tell us your staffing needs.'],
    },
  };

  const key = angle === 'role-specific' ? role : angle;
  const pack = packs[key] || packs['core-offer'];

  return {
    primaryTexts: pack.primaryTexts.slice(0, 5),
    headlines: pack.headlines.slice(0, 5),
    descriptions: pack.descriptions.slice(0, 5),
    recommendedCta: cta,
    alternateCta: alt,
    audienceHypothesis: pack.audienceHypothesis,
    funnelStage: pack.funnelStage,
  };
}

const CORE_COLOR_TEST_IDS = [
  'electric-lime',
  'signal-yellow',
  'cobalt-blue',
  'high-voltage-cyan',
  'vivid-green',
  'signal-red',
];

const SHARED_COLOR_TEST = {
  group: 1,
  groupLabel: 'Core Offer',
  language: 'en',
  headline: DR_META.coreHeadlineEn,
  supportingLine: 'Dedicated full-time virtual staff who join your practice team.',
  bullets: [...defaultCoreBullets],
  talent: TALENT_DIRECTION.look,
  layoutId: 'layout-a',
  badgeType: 'angled-ticket',
  priceTreatment: 'angled-ticket — "Starting at $10/hr" (pending leadership confirmation)',
  trustTreatment: 'shield — "HIPAA Compliant" (pending compliance confirmation)',
  cta: DR_META.recommendedCta,
  alternateCta: DR_META.alternateCta,
  formats: ['1:1', '4:5', '9:16'],
  audience: 'US medical & multi-specialty practices — broad cold lead gen',
  formId: 'form-a',
  hypothesis: 'Isolated color test — identical message, talent, bullets, badge, CTA, layout, and copy pack. Only palette changes.',
  claimIds: ['price-10hr', 'hipaa', 'dedicated-ft'],
  claimStatusNote: 'Price and HIPAA may appear as visual badges but require approval before publish.',
  productionStatus: 'Ready for design',
  approvalNotes: 'Do not alter layout, copy, or talent between DR-01..DR-06.',
  testingVariable: 'color',
};

function buildColorTestConcept(num, colorFamilyId, priority) {
  const family = COLOR_BY_ID[colorFamilyId];
  const copy = makeCopyPack({ angle: 'core-offer' });
  const n = `DR-${String(num).padStart(2, '0')}`;
  return {
    number: n,
    workingName: `${family.name} — Core Medical Admin`,
    ...SHARED_COLOR_TEST,
    wardrobeColor: family.scrubColor,
    backgroundColor: family.background,
    accentColor: family.accent,
    colorFamilyId,
    primaryTexts: copy.primaryTexts,
    headlines: copy.headlines,
    descriptions: copy.descriptions,
    priority,
    scrubColor: family.scrubColor,
    status: SHARED_COLOR_TEST.productionStatus,
    notes: SHARED_COLOR_TEST.approvalNotes,
  };
}

function buildConcept({
  number,
  workingName,
  group,
  groupLabel,
  language = 'en',
  headline,
  supportingLine,
  bullets,
  colorFamilyId,
  layoutId = 'layout-a',
  badgeType = 'angled-ticket',
  angle = 'core-offer',
  role = 'general',
  formId = 'form-a',
  hypothesis,
  claimIds = ['dedicated-ft'],
  claimStatusNote = 'Use only confirmed claims in published ads.',
  productionStatus = 'Ready for copy review',
  approvalNotes = '',
  priority,
  testingVariable = 'message',
  culturalTreatment,
}) {
  const family = COLOR_BY_ID[colorFamilyId];
  const copy = makeCopyPack({ role, angle, language: language === 'bilingual' ? 'en' : language });
  const n = typeof number === 'number' ? `DR-${String(number).padStart(2, '0')}` : number;
  const concept = {
    number: n,
    workingName,
    group,
    groupLabel,
    language,
    headline,
    supportingLine,
    bullets,
    talent: TALENT_DIRECTION.look,
    wardrobeColor: family.scrubColor,
    backgroundColor: family.background,
    accentColor: family.accent,
    colorFamilyId,
    layoutId,
    badgeType,
    priceTreatment: claimIds.includes('price-10hr')
      ? 'angled-ticket — "Starting at $10/hr" (pending leadership confirmation)'
      : 'omit or generic value cue — no unapproved price',
    trustTreatment: claimIds.includes('hipaa')
      ? 'shield — "HIPAA Compliant" (pending compliance confirmation)'
      : 'dedicated-staff seal or omit',
    cta: language === 'es' || language === 'bilingual' ? CTA_OPTIONS.primary.es : CTA_OPTIONS.primary.en,
    alternateCta: language === 'es' || language === 'bilingual' ? CTA_OPTIONS.alternate.es : CTA_OPTIONS.alternate.en,
    primaryTexts: copy.primaryTexts,
    headlines: copy.headlines,
    descriptions: copy.descriptions,
    formats: ['1:1', '4:5', '9:16'],
    audience: copy.audienceHypothesis,
    formId,
    hypothesis,
    claimIds,
    claimStatusNote,
    productionStatus,
    approvalNotes,
    priority,
    testingVariable,
    scrubColor: family.scrubColor,
    status: productionStatus,
    notes: approvalNotes,
  };
  if (culturalTreatment) concept.culturalTreatment = culturalTreatment;
  return concept;
}

export const CREATIVE_CONCEPTS = [
  // Group 1 — Core Offer color tests (DR-01..06). First production queue prioritizes 01–04; 05–06 follow after role pack.
  ...CORE_COLOR_TEST_IDS.map((id, i) =>
    buildColorTestConcept(i + 1, id, i < 4 ? i + 1 : i + 9),
  ),

  // Group 2 — Pain (DR-07..10)
  buildConcept({
    number: 7,
    workingName: 'Too Many Patient Calls? — Electric Lime',
    group: 2,
    groupLabel: 'Pain',
    headline: 'TOO MANY PATIENT CALLS?',
    supportingLine: 'Dedicated virtual staff to help answer calls and keep the schedule moving.',
    bullets: SERVICE_BULLET_BANK.calls,
    colorFamilyId: 'electric-lime',
    angle: 'missed-calls',
    hypothesis: 'Pain-first headline increases stop-rate vs benefit-only role ads.',
    priority: 7,
    claimIds: ['dedicated-ft'],
  }),
  buildConcept({
    number: 8,
    workingName: 'Front Desk Overload — Signal Yellow',
    group: 2,
    groupLabel: 'Pain',
    headline: 'YOUR FRONT DESK IS OVERLOADED',
    supportingLine: 'Add full-time virtual staff who join your team — not a call center.',
    bullets: defaultCoreBullets,
    colorFamilyId: 'signal-yellow',
    angle: 'missed-calls',
    hypothesis: 'Overload framing converts decision-makers who already feel the pain.',
    priority: 15,
    claimIds: ['dedicated-ft'],
    approvalNotes: 'Do not claim "we run your front desk."',
  }),
  buildConcept({
    number: 9,
    workingName: 'Admin Capacity — Cobalt Blue',
    group: 2,
    groupLabel: 'Pain',
    headline: 'BUILD ADMIN CAPACITY WITHOUT ANOTHER LOCAL DESK',
    supportingLine: 'Hire dedicated full-time virtual medical administrative staff.',
    bullets: defaultCoreBullets,
    colorFamilyId: 'cobalt-blue',
    angle: 'dedicated',
    layoutId: 'layout-e',
    hypothesis: 'Capacity framing attracts growth-minded owners without savings claims.',
    priority: 16,
    claimIds: ['dedicated-ft'],
  }),
  buildConcept({
    number: 10,
    workingName: 'Dedicated Staff Message — High-Voltage Cyan',
    group: 2,
    groupLabel: 'Pain',
    headline: 'HIRE DEDICATED FULL-TIME VIRTUAL STAFF',
    supportingLine: 'Full-time teammates who join your practice — not a shared agent pool.',
    bullets: SERVICE_BULLET_BANK.dedicated,
    colorFamilyId: 'high-voltage-cyan',
    angle: 'dedicated',
    hypothesis: 'Dedicated full-time message differentiates vs commodity VA ads.',
    priority: 17,
    claimIds: ['dedicated-ft'],
    productionStatus: 'Ready for copy review',
  }),

  // Group 3 — Role Specific (DR-11..18)
  buildConcept({
    number: 11,
    workingName: 'Dental Virtual Assistant — Vivid Green',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'HIRE A VIRTUAL DENTAL ADMIN',
    supportingLine: 'Calls, scheduling, insurance, and follow-up for dental practices.',
    bullets: SERVICE_BULLET_BANK.dental,
    colorFamilyId: 'vivid-green',
    layoutId: 'layout-d',
    angle: 'dental',
    role: 'dental',
    hypothesis: 'Dental-specific headline improves relevance vs general medical admin.',
    priority: 11,
    claimIds: ['dedicated-ft'],
  }),
  buildConcept({
    number: 12,
    workingName: 'Virtual Medical Biller — Cobalt Blue',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'HIRE A VIRTUAL MEDICAL BILLER',
    supportingLine: 'Administrative bandwidth for billing-adjacent workflows.',
    bullets: SERVICE_BULLET_BANK.billing,
    colorFamilyId: 'cobalt-blue',
    layoutId: 'layout-d',
    angle: 'billing',
    role: 'billing',
    formId: 'form-b',
    hypothesis: 'Billing-support framing qualifies revenue-ops buyers.',
    priority: 10,
    claimIds: ['dedicated-ft'],
    approvalNotes: 'Do not claim MedVirtual is a billing company.',
  }),
  buildConcept({
    number: 13,
    workingName: 'Appointment Scheduling Support — Signal Yellow',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'ADD VIRTUAL SCHEDULING SUPPORT',
    supportingLine: 'Dedicated help for booking, confirms, and reschedules.',
    bullets: SERVICE_BULLET_BANK.scheduling,
    colorFamilyId: 'signal-yellow',
    angle: 'scheduling',
    role: 'scheduling',
    hypothesis: 'Scheduling-specific offer improves CTR from ops managers.',
    priority: 12,
    claimIds: ['dedicated-ft'],
  }),
  buildConcept({
    number: 14,
    workingName: 'Insurance Verification Support — High-Voltage Cyan',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'SUPPORT INSURANCE VERIFICATION',
    supportingLine: 'Help with eligibility, verification, and preauthorization follow-up.',
    bullets: SERVICE_BULLET_BANK.insurance,
    colorFamilyId: 'high-voltage-cyan',
    layoutId: 'layout-c',
    badgeType: 'rectangular-price-tab',
    hypothesis: 'Insurance verification is a concrete pain worth isolating.',
    priority: 8,
    claimIds: ['dedicated-ft'],
    approvalNotes: 'Do not invent savings % or denied-claim guarantees.',
  }),
  buildConcept({
    number: 15,
    workingName: 'Patient Intake Support — Electric Lime',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'HANDLE PATIENT INTAKE REMOTELY',
    supportingLine: 'Intake forms, patient details, and chart prep support.',
    bullets: SERVICE_BULLET_BANK.intake,
    colorFamilyId: 'electric-lime',
    hypothesis: 'Intake-specific messaging qualifies warmer ops leads.',
    priority: 18,
    claimIds: ['dedicated-ft'],
  }),
  buildConcept({
    number: 16,
    workingName: 'Medical Reception Support — Signal Red',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'GET HELP WITH PATIENT CALLS',
    supportingLine: 'Answer calls, schedule appointments, and follow up with patients.',
    bullets: SERVICE_BULLET_BANK.calls,
    colorFamilyId: 'signal-red',
    layoutId: 'layout-f',
    angle: 'missed-calls',
    hypothesis: 'Call-pain headline beats generic role headline for overloaded front desks.',
    priority: 19,
    claimIds: ['dedicated-ft'],
  }),
  buildConcept({
    number: 17,
    workingName: 'Preauthorization Support — Cobalt Blue',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'ADD PREAUTHORIZATION SUPPORT',
    supportingLine: 'Virtual admin help for prior auth and preauthorization workflows.',
    bullets: ['Preauthorization Support', 'Insurance Verification', 'Eligibility Checks', 'Follow-Up With Payers'],
    colorFamilyId: 'cobalt-blue',
    layoutId: 'layout-d',
    hypothesis: 'Preauth-specific role angle qualifies specialty practices.',
    priority: 9,
    claimIds: ['dedicated-ft'],
  }),
  buildConcept({
    number: 18,
    workingName: 'Billing Follow-Up Support — Vivid Green',
    group: 3,
    groupLabel: 'Role Specific',
    headline: 'ADD BILLING FOLLOW-UP SUPPORT',
    supportingLine: 'Claims follow-up and payment-posting administrative support.',
    bullets: ['Claims Follow-Up', 'Payment Posting', 'Medical Billing Support', 'Insurance Verification'],
    colorFamilyId: 'vivid-green',
    hypothesis: 'Follow-up framing for practices with AR administrative backlog.',
    priority: 20,
    claimIds: ['dedicated-ft'],
  }),

  // Group 4 — Spanish / Bilingual (DR-19..22)
  buildConcept({
    number: 19,
    workingName: 'Spanish Core — Contrata Asistente Médico Virtual',
    group: 4,
    groupLabel: 'Spanish & Bilingual',
    language: 'es',
    headline: DR_META.coreHeadlineEs,
    supportingLine: 'Personal virtual de tiempo completo que se une a tu equipo.',
    bullets: SERVICE_BULLET_BANK.spanish,
    colorFamilyId: 'vivid-green',
    culturalTreatment: 'full-es-no-flag',
    hypothesis: 'Natural Spanish + role clarity unlocks a distinct audience segment.',
    priority: 5,
    claimIds: ['dedicated-ft', 'spanish-available'],
    claimStatusNote: 'Spanish availability claim pending confirmation.',
    productionStatus: 'Ready for design',
    approvalNotes: 'Priority Spanish launch. Native-speaker review required. No nationality assumptions.',
  }),
  buildConcept({
    number: 20,
    workingName: 'Spanish Calls Pain — Cobalt Blue',
    group: 4,
    groupLabel: 'Spanish & Bilingual',
    language: 'es',
    headline: 'NO DEJES LLAMADAS DE PACIENTES SIN CONTESTAR',
    supportingLine: 'Apoyo virtual dedicado para llamadas, citas y seguimiento.',
    bullets: SERVICE_BULLET_BANK.spanishCalls,
    colorFamilyId: 'cobalt-blue',
    culturalTreatment: 'full-es-no-flag',
    angle: 'missed-calls',
    hypothesis: 'Pain-first Spanish outperforms generic role headline for cold traffic.',
    priority: 21,
    claimIds: ['dedicated-ft'],
    approvalNotes: 'Native-speaker review required.',
  }),
  buildConcept({
    number: 21,
    workingName: 'Spanish-Speaking Staff Available — Signal Yellow',
    group: 4,
    groupLabel: 'Spanish & Bilingual',
    language: 'bilingual',
    headline: 'SPANISH-SPEAKING MEDICAL ADMIN AVAILABLE',
    supportingLine: 'Dedicated full-time virtual staff for bilingual practices.',
    bullets: defaultCoreBullets,
    colorFamilyId: 'signal-yellow',
    culturalTreatment: 'se-habla',
    hypothesis: 'Spanish-speaking availability cue tests relevance without flag dependency.',
    priority: 6,
    claimIds: ['dedicated-ft', 'spanish-available'],
    approvalNotes: 'Native-speaker review for any Spanish overlay; Se Habla badge is English-facing cue.',
  }),
  buildConcept({
    number: 22,
    workingName: 'Flag Badge Test — Electric Lime',
    group: 4,
    groupLabel: 'Spanish & Bilingual',
    language: 'es',
    headline: DR_META.coreHeadlineEs,
    supportingLine: 'Apoyo administrativo médico virtual dedicado.',
    bullets: SERVICE_BULLET_BANK.spanish,
    colorFamilyId: 'electric-lime',
    culturalTreatment: 'flag-badge',
    hypothesis: 'Tasteful flag badge may lift relevance for a subset — test only, not brand system.',
    priority: 23,
    claimIds: ['dedicated-ft'],
    approvalNotes: 'Optional tasteful Mexican flag cue — campaign test only. Do not assume nationality of worker or viewer. Native-speaker review required.',
  }),

  // Group 5 — Offer / Value (DR-23..24)
  buildConcept({
    number: 23,
    workingName: 'Trained Staff Value — High-Voltage Cyan',
    group: 5,
    groupLabel: 'Offer / Value',
    headline: 'TRAINED MEDICAL ADMIN SUPPORT FOR YOUR PRACTICE',
    supportingLine: 'Dedicated hires for reception, insurance, preauth, and billing.',
    bullets: defaultCoreBullets,
    colorFamilyId: 'high-voltage-cyan',
    layoutId: 'layout-c',
    badgeType: 'highlighter-panel',
    angle: 'core-offer',
    hypothesis: 'Trained-staff value cue supports credibility without credential invention.',
    priority: 24,
    claimIds: ['dedicated-ft', 'price-10hr'],
    approvalNotes: 'Do not claim every candidate is certified unless verified.',
  }),
  buildConcept({
    number: 24,
    workingName: 'Not a Call Center — Signal Red',
    group: 5,
    groupLabel: 'Offer / Value',
    headline: 'DEDICATED STAFF — NOT A CALL CENTER',
    supportingLine: 'Full-time virtual teammates who join your practice workflow.',
    bullets: SERVICE_BULLET_BANK.dedicated,
    colorFamilyId: 'signal-red',
    layoutId: 'layout-f',
    badgeType: 'circular-seal',
    angle: 'dedicated',
    hypothesis: 'Differentiation message for buyers burned by shared-pool models.',
    priority: 25,
    claimIds: ['dedicated-ft'],
    productionStatus: 'Ready for copy review',
  }),
];

// ─── Image prompts ───────────────────────────────────────────────────────────

const STANDARD_NEGATIVE_PROMPT =
  'no pink, no magenta, no fuchsia, no rose, no hot pink, no watermarks, no logos, no illegible text, no fake procedures, no patient info, no generic stock call-center farm background, no physician implication, no white coat implying MD, no prison-orange scrubs, no cluttered background, no low contrast, no sexualized posing';

function buildImagePrompt(concept, titleSuffix = '') {
  const family = COLOR_BY_ID[concept.colorFamilyId];
  return {
    conceptNumber: concept.number,
    title: `${concept.workingName}${titleSuffix ? ` — ${titleSuffix}` : ''}`,
    backgroundTalentPrompt: `Professional female virtual medical administrator, warm approachable expression, ${family.name} color story. Background plate ${family.background} with accent ${family.accent}. Scrubs ${concept.wardrobeColor} — credible medical admin, not nurse bedside, not physician. Clean studio lighting, high contrast, right-side framing for split layout. No pink, magenta, rose, or fuchsia anywhere.`,
    designerOverlaySpec: `Layout ${concept.layoutId}: headline "${concept.headline}" upper-left in ${family.headlineColor || family.foreground}; 3–4 bullets with check icons; ${concept.badgeType} price badge per priceTreatment; ${concept.trustTreatment}; CTA pill "${concept.cta}" lower-left. Optional MedVirtual logo small — omit if concept specifies. All overlay text designer-added — no AI text in photo.`,
    approvedCopy: {
      headline: concept.headline,
      bullets: concept.bullets,
      price: concept.priceTreatment,
      trust: concept.trustTreatment,
      cta: concept.cta,
    },
    cropInstructions: {
      '1:1': 'Keep headline top-left; talent right; max 4 bullets; verify CTA visible above fold.',
      '4:5': 'Primary feed crop — generous left copy column; talent fills right 45%; best balance.',
      '9:16': 'Stack headline high; talent lower-right; respect Meta UI safe zones top and bottom.',
    },
    negativePrompt: STANDARD_NEGATIVE_PROMPT,
    qaChecklist: [
      'Scrubs match color family — not pink or orange prison',
      'Headline readable at mobile thumbnail size',
      'Price/HIPAA badges only if claims approved',
      'No call-center headset or physician cues',
      'Safe zones clear on 9:16',
      'CTA high contrast against plate',
    ],
  };
}

export const IMAGE_PROMPTS = [
  ...getPriorityColorTest().map((c) => buildImagePrompt(c)),
  ...['DR-19', 'DR-21', 'DR-07', 'DR-14', 'DR-17', 'DR-12', 'DR-11', 'DR-13']
    .map((id) => {
      const c = getConceptByNumber(id);
      if (!c) throw new Error(`IMAGE_PROMPTS missing concept ${id}`);
      return buildImagePrompt(c);
    }),
];

// ─── Visual spec ─────────────────────────────────────────────────────────────

export const VISUAL_SPEC = {
  hierarchy: [
    'One dominant headline (role or pain) — readable in ~1 second',
    '3–4 large task bullets with check icons under headline',
    'Credible professional talent on the right or hero zone',
    'Price/trust badge zone when claims approved',
    'CTA easy to notice; logo optional',
  ],
  mobileType: [
    'Headline: billboard scale on mobile — not brochure body size',
    'Bullets: large enough to read thumb-distance without zooming',
    'Avoid paragraphs on the creative',
    'Small captions and fine print are not primary communication',
  ],
  safeZones: [
    'Keep headline and bullets inside Meta UI safe zones on 9:16',
    'Leave breathing room at edges — do not crowd type into crop risk',
  ],
  personPlacement: 'Right half (Layouts A/F); face clear; not cropped awkwardly at chin or forehead across 1:1, 4:5, 9:16',
  bulletSpacing: 'Generous; max 4 bullets on creative; prefer 3–4 when space is tight on 1:1',
  ctaPlacement: 'Lower left under bullets or bottom band — high contrast pill',
  contrast: 'Foreground must punch against background. No muddy, dark, dirty, beige-heavy, or low-contrast plates.',
  rejectCriteria: [
    'Any pink, magenta, rose, or fuchsia in plate, scrubs, or accents',
    'Tiny headline or bullet text unreadable on mobile',
    'More than 5 bullets or paragraph body copy on creative',
    'Call-center headset stock or physician-implying wardrobe',
    'Unapproved price, HIPAA, free offer, or instant-placement claim visible',
    'MedVirtual.ai in ad-facing copy',
    'Fake testimonials, fake UI, or invented credentials',
    'Prison-orange scrubs or muddy low-contrast plates',
    'Pixel-clone of competitor reference layout',
    'Watermarks, illegible AI-generated text, or patient info in image',
  ],
  goods: [
    'Large headline left + 3–4 bullets + professional talent right',
    'Saturated vivid color plate with white or near-black type',
    'Scrubs matching approved color family',
    'One message, one role, obvious CTA',
    'Original badge shapes from BADGE_STYLES — not reference clone',
    'Mobile-first type scale',
  ],
  bads: [
    'Tiny text / seven or more bullets',
    'Generic dashboards as dominant image',
    'Abstract glassmorphism without clear staffing message',
    'Headset call-center stock',
    'Logo overload',
    'Fake testimonials / fake interface screenshots',
    'Unapproved pricing or savings claims',
    'Pink, magenta, rose, or fuchsia primary plates',
    'Prison-jumpsuit orange scrub color',
    'Muddy dark teal overlays that kill contrast',
  ],
  crops: {
    '1:1': 'Square feed — compress vertical space; keep 3–4 bullets; talent still large',
    '4:5': 'Primary feed test — best balance of left copy + right talent',
    '9:16': 'Stories/Reels — stack copy high; protect UI safe zones',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPriorityColorTest() {
  return CREATIVE_CONCEPTS.filter((c) =>
    ['DR-01', 'DR-02', 'DR-03', 'DR-04', 'DR-05', 'DR-06'].includes(c.number),
  );
}

export function getPriorityQueue() {
  return [...CREATIVE_CONCEPTS].sort((a, b) => a.priority - b.priority).slice(0, 12);
}

export function getConceptByNumber(n) {
  const id = String(n).startsWith('DR-') ? n : `DR-${String(n).padStart(2, '0')}`;
  return CREATIVE_CONCEPTS.find((c) => c.number === id) ?? null;
}

export function getClaimsForConcept(concept) {
  if (!concept?.claimIds?.length) return [];
  return CLAIMS.filter((cl) => concept.claimIds.includes(cl.id));
}

export function conceptsByGroup(g) {
  return CREATIVE_CONCEPTS.filter((c) => c.group === g);
}

// ─── Legacy aliases (generator compatibility) ────────────────────────────────

/** @deprecated Use FORMS — kept for generate-direct-response.mjs */
export const FORM_SPEC = {
  title: FORMS.formA.name,
  objective: FORMS.formA.objective,
  complianceNote: FORMS.complianceNote,
  rules: FORMS.rules,
  fields: [
    ...FORMS.formA.fields,
    { name: 'Medical Specialty', required: false, type: 'Multiple choice (optional)', options: FORMS.staffingNeedOptions },
  ],
  introVariations: FORMS.introVariations,
  introVariationsEs: FORMS.introEs,
};

/** @deprecated Use makeCopyPack angles — kept for generator compatibility */
export const COPY_GROUPS_EN = [
  { id: 'general-admin', name: 'General Medical Admin', matchingForm: FORMS.formA.name, ...makeCopyPack({ angle: 'core-offer' }) },
  { id: 'missed-calls', name: 'Missed Calls', matchingForm: FORMS.formA.name, ...makeCopyPack({ angle: 'missed-calls' }) },
  { id: 'scheduling', name: 'Scheduling', matchingForm: FORMS.formA.name, ...makeCopyPack({ angle: 'scheduling' }) },
  { id: 'dental', name: 'Dental', matchingForm: FORMS.formA.name, ...makeCopyPack({ angle: 'dental' }) },
  { id: 'billing', name: 'Billing', matchingForm: FORMS.formB.name, ...makeCopyPack({ angle: 'billing' }) },
  { id: 'dedicated-ft', name: 'Dedicated Full-Time', matchingForm: FORMS.formA.name, ...makeCopyPack({ angle: 'dedicated' }) },
  { id: 'spanish', name: 'Spanish', matchingForm: FORMS.formA.name, ...makeCopyPack({ angle: 'core-offer', language: 'es' }) },
];

export const COPY_GROUPS_ES = [
  COPY_GROUPS_EN.find((g) => g.id === 'spanish'),
  { id: 'es-calls', name: 'Llamadas', matchingForm: FORMS.formA.name, ...makeCopyPack({ angle: 'missed-calls', language: 'es' }) },
];

/** @deprecated Use PRODUCTION_STATUSES */
export const STATUS_OPTIONS = PRODUCTION_STATUSES;

/** @deprecated Use getPriorityColorTest + Spanish concept */
export function getPriorityLaunchConcepts() {
  return [...getPriorityColorTest(), getConceptByNumber('DR-19')].filter(Boolean);
}

/** @deprecated */
export function getCopyForConcept(concept) {
  if (!concept) return COPY_GROUPS_EN[0];
  if (concept.language === 'es') return COPY_GROUPS_EN.find((g) => g.id === 'spanish');
  const map = {
    'DR-01': 'general-admin',
    'DR-02': 'general-admin',
    'DR-03': 'general-admin',
    'DR-04': 'general-admin',
    'DR-05': 'general-admin',
    'DR-06': 'general-admin',
    'DR-07': 'missed-calls',
    'DR-08': 'missed-calls',
    'DR-09': 'dedicated-ft',
    'DR-10': 'dedicated-ft',
    'DR-11': 'dental',
    'DR-12': 'billing',
    'DR-13': 'scheduling',
    'DR-14': 'billing',
    'DR-16': 'missed-calls',
    'DR-19': 'spanish',
    'DR-20': 'spanish',
    'DR-24': 'dedicated-ft',
  };
  const id = map[concept.number] || 'general-admin';
  return COPY_GROUPS_EN.find((g) => g.id === id) || COPY_GROUPS_EN[0];
}
