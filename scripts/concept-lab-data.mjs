/**
 * Creative + Motion Concept Lab — shared schema, banks, and default batch.
 * Constrained concept engine only — no free-form AI copy generation.
 */
import { BRAND, BRAND_VOICE } from './medvirtual-brand-data.mjs';
import { TALENT } from './real-people-data.mjs';
import { COMPETITOR_ADS } from './competitor-ads-data.mjs';
import { SAAS_PROP_ART, SAAS_COPY_BANKS, SAAS_SUPPORT_BANK, SAAS_CTA_BANK } from './saas-prop-templates-data.mjs';

export const CONCEPT_STATUSES = [
  'Draft',
  'Worth Exploring',
  'Send for Review',
  'Approved to Produce',
  'Needs Revision',
  'Rejected',
];

export const FORMATS = {
  '4:5': { id: '4:5', label: '4:5 Feed', width: 1080, height: 1350, slug: '1080x1350' },
  '1:1': { id: '1:1', label: '1:1 Square', width: 1080, height: 1080, slug: '1080x1080' },
  '9:16': { id: '9:16', label: '9:16 Stories/Reels', width: 1080, height: 1920, slug: '1080x1920' },
};

export const LAYOUTS = [
  'PainPortraitLayout',
  'EditorialTalentLayout',
  'PremiumOpsLayout',
  'VerticalWorkflowLayout',
];

export const THEMES = ['light-grid', 'editorial-light', 'premium-ops-dark', 'vertical-clean'];

export const STORAGE_KEYS = {
  creativeBatch: 'mv-creative-concept-lab-v1',
  motionBatch: 'mv-motion-concept-lab-v1',
  promote: 'mv-concept-promote-v1',
};

/** Slim public talent for concept labs — approved facts only */
export const LAB_TALENT = TALENT.filter((t) => t.approvalStatus?.publicStillApproved).map((t) => ({
  id: t.id,
  firstName: t.firstName,
  fullPublicName: t.fullPublicName,
  title: t.title,
  listedSkills: (t.listedSkills || []).slice(0, 5),
  specializationShown: t.exactPublicFacts?.specializationShown || [],
  imagePath: t.imagePath,
  profileSquare: `/assets/real-people/${t.assetSlug}/profile-1080x1080.jpg`,
  verticalPath: `/assets/real-people/${t.assetSlug}/vertical-reference-1080x1920.jpg`,
  cleanMaster: `/assets/real-people/${t.assetSlug}/clean-master.jpg`,
}));

function friendlySkill(s) {
  return String(s)
    .replace(/^BPO\s*-\s*/i, '')
    .replace(/^VA\s*-\s*/i, '')
    .replace(/^Medical\s*-\s*/i, '')
    .trim();
}

export function talentBullets(talentId, fallback = ['Calls and scheduling', 'Patient intake', 'Follow-up support']) {
  const t = LAB_TALENT.find((x) => x.id === talentId);
  if (!t) return fallback;
  const skills = t.listedSkills.map(friendlySkill).filter(Boolean);
  while (skills.length < 3 && t.specializationShown[skills.length - t.listedSkills.length]) {
    skills.push(`${t.specializationShown[skills.length - t.listedSkills.length]} support`);
  }
  while (skills.length < 3) skills.push(fallback[skills.length]);
  return skills.slice(0, 3);
}

/** Approved image chooser entries (public assets only) */
export const LAB_IMAGES = [
  {
    id: 'jessica-feed',
    name: 'Jessica · feed portrait',
    src: '/assets/real-people/jessica/feed-1080x1350.jpg',
    thumb: '/assets/real-people/jessica/profile-1080x1080.jpg',
    aspectRatio: '4:5',
    subjectPosition: 'center-right',
    copyZone: 'left',
    status: 'approved',
    kind: 'talent',
    talentId: 'jessica',
  },
  {
    id: 'chelsea-feed',
    name: 'Chelsea · feed portrait',
    src: '/assets/real-people/chelsea/feed-1080x1350.jpg',
    thumb: '/assets/real-people/chelsea/profile-1080x1080.jpg',
    aspectRatio: '4:5',
    subjectPosition: 'center-right',
    copyZone: 'left',
    status: 'approved',
    kind: 'talent',
    talentId: 'chelsea',
  },
  {
    id: 'carmen-feed',
    name: 'Carmen · feed portrait',
    src: '/assets/real-people/carmen/feed-1080x1350.jpg',
    thumb: '/assets/real-people/carmen/profile-1080x1080.jpg',
    aspectRatio: '4:5',
    subjectPosition: 'center',
    copyZone: 'left',
    status: 'approved',
    kind: 'talent',
    talentId: 'carmen',
  },
  {
    id: 'angelica-feed',
    name: 'Angelica · feed portrait',
    src: '/assets/real-people/angelica/feed-1080x1350.jpg',
    thumb: '/assets/real-people/angelica/profile-1080x1080.jpg',
    aspectRatio: '4:5',
    subjectPosition: 'center-right',
    copyZone: 'left',
    status: 'approved',
    kind: 'talent',
    talentId: 'angelica',
  },
  {
    id: 'mark-feed',
    name: 'Mark · feed portrait',
    src: '/assets/real-people/mark/feed-1080x1350.jpg',
    thumb: '/assets/real-people/mark/profile-1080x1080.jpg',
    aspectRatio: '4:5',
    subjectPosition: 'center-left',
    copyZone: 'right',
    status: 'approved',
    kind: 'talent',
    talentId: 'mark',
  },
  {
    id: 'jennifer-feed',
    name: 'Jennifer · feed portrait',
    src: '/assets/real-people/jennifer/feed-1080x1350.jpg',
    thumb: '/assets/real-people/jennifer/profile-1080x1080.jpg',
    aspectRatio: '4:5',
    subjectPosition: 'center',
    copyZone: 'left',
    status: 'approved',
    kind: 'talent',
    talentId: 'jennifer',
  },
  {
    id: 'ai-003-left',
    name: 'Image 03 — Follow-Up',
    src: '/exports/image-tests/feed-4x5/IMG_AI_003_4X5_FACE_LEFT.png',
    thumb: '/exports/image-tests/feed-4x5/IMG_AI_003_4X5_FACE_LEFT.png',
    aspectRatio: '4:5',
    subjectPosition: 'left',
    copyZone: 'right',
    status: 'approved',
    kind: 'board',
  },
  {
    id: 'ai-009-left',
    name: 'Image 09 — Scheduling',
    src: '/exports/image-tests/feed-4x5/IMG_AI_009_4X5_FACE_LEFT.png',
    thumb: '/exports/image-tests/feed-4x5/IMG_AI_009_4X5_FACE_LEFT.png',
    aspectRatio: '4:5',
    subjectPosition: 'left',
    copyZone: 'right',
    status: 'approved',
    kind: 'board',
  },
  {
    id: 'ai-010-left',
    name: 'Image 10 — Front Desk',
    src: '/exports/image-tests/feed-4x5/IMG_AI_010_4X5_FACE_LEFT.png',
    thumb: '/exports/image-tests/feed-4x5/IMG_AI_010_4X5_FACE_LEFT.png',
    aspectRatio: '4:5',
    subjectPosition: 'left',
    copyZone: 'right',
    status: 'approved',
    kind: 'board',
  },
  {
    id: 'ai-004-right',
    name: 'Image 04 — Workflow',
    src: '/exports/image-tests/feed-4x5/IMG_AI_004_4X5_FACE_RIGHT.png',
    thumb: '/exports/image-tests/feed-4x5/IMG_AI_004_4X5_FACE_RIGHT.png',
    aspectRatio: '4:5',
    subjectPosition: 'right',
    copyZone: 'left',
    status: 'approved',
    kind: 'board',
  },
  {
    id: 'ai-013-right',
    name: 'Image 13 — Medical Assistant',
    src: '/exports/image-tests/feed-4x5/IMG_AI_013_4X5_FACE_RIGHT.png',
    thumb: '/exports/image-tests/feed-4x5/IMG_AI_013_4X5_FACE_RIGHT.png',
    aspectRatio: '4:5',
    subjectPosition: 'right',
    copyZone: 'left',
    status: 'approved',
    kind: 'board',
  },
  {
    id: 'saas-scheduling',
    name: 'SaaS · Scheduling UI',
    src: SAAS_PROP_ART.schedulingUi,
    thumb: SAAS_PROP_ART.schedulingUi,
    aspectRatio: '1:1',
    subjectPosition: 'center',
    copyZone: 'left',
    status: 'approved',
    kind: 'saas-prop',
  },
  {
    id: 'saas-workflow',
    name: 'SaaS · Workflow steps',
    src: SAAS_PROP_ART.workflowSteps,
    thumb: SAAS_PROP_ART.workflowSteps,
    aspectRatio: '1:1',
    subjectPosition: 'center',
    copyZone: 'left',
    status: 'approved',
    kind: 'saas-prop',
  },
  {
    id: 'saas-dental',
    name: 'SaaS · Dental network',
    src: SAAS_PROP_ART.dentalNetwork,
    thumb: SAAS_PROP_ART.dentalNetwork,
    aspectRatio: '1:1',
    subjectPosition: 'center',
    copyZone: 'left',
    status: 'approved',
    kind: 'saas-prop',
  },
  {
    id: 'saas-analytics',
    name: 'SaaS · Analytics glass',
    src: SAAS_PROP_ART.analyticsGlass,
    thumb: SAAS_PROP_ART.analyticsGlass,
    aspectRatio: '1:1',
    subjectPosition: 'center',
    copyZone: 'left',
    status: 'approved',
    kind: 'saas-prop',
  },
  {
    id: 'saas-inbox',
    name: 'SaaS · Inbox funnel',
    src: SAAS_PROP_ART.inboxFunnel,
    thumb: SAAS_PROP_ART.inboxFunnel,
    aspectRatio: '1:1',
    subjectPosition: 'center',
    copyZone: 'left',
    status: 'approved',
    kind: 'saas-prop',
  },
];

export const COPY_BANKS = {
  practicePains: [
    'Too many calls. Not enough day.',
    'Admin work piling up?',
    'Scheduling taking over the front desk?',
    'Front desk stretched thin?',
    'Billing follow-up eating the week?',
    'Intake backlog before the day even starts?',
  ],
  roles: [
    'Virtual Medical Admin',
    'Dental Admin',
    'Medical Biller',
    'Patient Intake Coordinator',
    'Insurance Verification Specialist',
    'Front Desk Support',
  ],
  workflows: [
    ['Calls and scheduling', 'Patient intake', 'Follow-up support'],
    ['Appointment scheduling', 'Patient follow-up', 'Insurance verification'],
    ['Claims follow-up', 'Payment posting', 'Denial support'],
    ['Scheduling', 'Billing support', 'Patient communication'],
    ['Eligibility checks', 'Prior authorizations', 'Patient coordination'],
  ],
  supportStatements: [
    ...BRAND_VOICE.preferredPhrases.slice(0, 6),
    ...SAAS_SUPPORT_BANK.slice(0, 3),
  ],
  ctas: [
    'Request an Interview',
    'Meet Available Talent',
    'Meet This Candidate',
    'Book a Demo',
    ...SAAS_CTA_BANK.slice(0, 2),
  ],
  eyebrows: [
    'FOR BUSY MEDICAL PRACTICES',
    'MEET AVAILABLE TALENT',
    'PRACTICE OPERATIONS',
    'FOR DENTAL PRACTICES',
    'FOR MEDICAL PRACTICES',
    'HEALTHCARE STAFFING',
  ],
  audiences: [
    'Busy medical practices',
    'Dental practices',
    'Primary care clinics',
    'Specialty practices',
    'Practice owners',
  ],
  verticals: ['medical', 'dental', 'billing', 'front-office'],
  saasHeadlines: SAAS_COPY_BANKS.enterprise,
};

export const COMPETITOR_PRINCIPLES = COMPETITOR_ADS.map((c) => ({
  id: c.id,
  name: c.name,
  category: c.category,
  steal: c.steal,
  reject: c.reject,
  remix: c.remix,
  sourceAdId: null,
}));

function imagePromptFor(concept) {
  const side = concept.copySide === 'right' ? 'left' : 'right';
  return [
    `Premium MedVirtual Meta ad background, ${concept.format || '4:5'} aspect ratio.`,
    `Scene: ${concept.lane === 'premium-ops' ? 'abstract glass medical operations props (calendar, phone, inbox) — no people' : 'professional healthcare workplace or portrait'}.`,
    `Subject position: ${side}. Generous empty copy space on the ${concept.copySide || 'left'}.`,
    'Color direction: teal #077999, cyan #00B2E2, deep teal #0D546B, cool neutrals.',
    'Aesthetic: calm, commercial healthcare SaaS / real workplace — expensive and composed.',
    'Strict: no visible text, no logos, no patient information, no medical claims, no fake interface text, no watermarks.',
  ].join(' ');
}

/** Default four-concept batch — distinct strategic lanes */
export function buildDefaultBatch() {
  const jessica = LAB_TALENT.find((t) => t.id === 'jessica');
  const chelsea = LAB_TALENT.find((t) => t.id === 'chelsea');
  const zocdoc = COMPETITOR_PRINCIPLES.find((c) => c.id === 'zocdoc');
  const helloRache = COMPETITOR_PRINCIPLES.find((c) => c.id === 'hello-rache');
  const nexhealth = COMPETITOR_PRINCIPLES.find((c) => c.id === 'nexhealth');
  const weave = COMPETITOR_PRINCIPLES.find((c) => c.id === 'weave');

  const concepts = [
    {
      id: 'MV-STATIC-PAIN-HUMAN-01',
      name: 'Pain + Human Answer',
      lane: 'pain-human',
      audience: 'Busy medical practices',
      vertical: 'medical',
      format: '4:5',
      status: 'Draft',
      eyebrow: 'FOR BUSY MEDICAL PRACTICES',
      headline: 'Too many calls. Not enough day.',
      support: 'Add a dedicated virtual medical admin to your team.',
      bullets: ['Calls and scheduling', 'Patient intake', 'Follow-up support'],
      cta: 'Request an Interview',
      candidateId: 'jessica',
      candidateName: jessica?.firstName || 'Jessica',
      role: jessica?.title || 'Jr. Medical Admin',
      imageId: 'ai-010-left',
      imageSrc: LAB_IMAGES.find((i) => i.id === 'ai-010-left').src,
      imagePosition: { x: 32, y: 50 },
      imageZoom: 110,
      overlayIntensity: 28,
      theme: 'light-grid',
      layout: 'PainPortraitLayout',
      logoVariant: 'colored',
      copySide: 'right',
      showAudiencePill: true,
      showLogo: true,
      competitorSource: helloRache?.name || 'Hello Rache',
      sourceAdId: null,
      borrowedPrinciple: helloRache?.steal || 'Sharp operational pain earns attention quickly.',
      rejectedPattern: helloRache?.reject || 'Generic headset stock with no practice-owner POV.',
      medvirtualRemix:
        'The answer is a dedicated person the practice can interview — not software or a shared service.',
      sourceInspiration: 'Competitor Wall · virtual staffing + Image Selection Board person-left crops',
      internalNotes: '',
      motionTemplate: 'MV-HOOK-HUMAN-01',
      durationInFrames: 330,
    },
    {
      id: 'MV-STATIC-EDITORIAL-01',
      name: 'Named Talent / Editorial',
      lane: 'editorial-talent',
      audience: 'Practice owners hiring admin support',
      vertical: 'medical',
      format: '4:5',
      status: 'Draft',
      eyebrow: 'MEET AVAILABLE TALENT',
      headline: jessica?.firstName || 'Jessica',
      support: jessica?.title || 'Jr. Medical Admin',
      bullets: talentBullets('jessica', ['Customer service', 'Healthcare support', 'Admin coordination']),
      cta: 'Meet This Candidate',
      candidateId: 'jessica',
      candidateName: jessica?.firstName || 'Jessica',
      role: jessica?.title || 'Jr. Medical Admin',
      imageId: 'jessica-feed',
      imageSrc: jessica?.imagePath,
      imagePosition: { x: 58, y: 42 },
      imageZoom: 105,
      overlayIntensity: 12,
      theme: 'editorial-light',
      layout: 'EditorialTalentLayout',
      logoVariant: 'colored',
      copySide: 'left',
      showAudiencePill: false,
      showLogo: true,
      editorialHook: 'Front-desk admin work overflowing?',
      competitorSource: zocdoc?.name || 'Zocdoc',
      sourceAdId: null,
      borrowedPrinciple: zocdoc?.steal || 'Ruthless simplicity — one idea per frame.',
      rejectedPattern: 'Job-board card energy / crowded skill walls',
      medvirtualRemix: 'Real interviewable talent with stronger practice-owner context.',
      sourceInspiration: 'Real People · Treatment E + editorial profile craft',
      internalNotes: 'Price off by default. Do not invent credentials.',
      motionTemplate: 'MV-CHECKLIST-01',
      durationInFrames: 300,
    },
    {
      id: 'MV-STATIC-PREMIUM-OPS-01',
      name: 'Premium Operations / SaaS Prop',
      lane: 'premium-ops',
      audience: 'Practice owners who value ops craft',
      vertical: 'medical',
      format: '4:5',
      status: 'Draft',
      eyebrow: 'PRACTICE OPERATIONS',
      headline: 'Built like serious operations. Delivered as dedicated people.',
      support: 'Hire full-time virtual staff who work as part of your practice team.',
      bullets: ['Scheduling', 'Billing support', 'Patient communication'],
      cta: 'Meet Available Talent',
      candidateId: null,
      candidateName: '',
      role: '',
      imageId: 'saas-workflow',
      imageSrc: SAAS_PROP_ART.workflowSteps,
      imagePosition: { x: 70, y: 50 },
      imageZoom: 100,
      overlayIntensity: 0,
      theme: 'premium-ops-dark',
      layout: 'PremiumOpsLayout',
      logoVariant: 'white',
      copySide: 'left',
      showAudiencePill: false,
      showLogo: true,
      competitorSource: nexhealth?.name || 'NexHealth',
      sourceAdId: null,
      borrowedPrinciple: nexhealth?.steal || 'Whitespace + hierarchy — don’t crowd the frame.',
      rejectedPattern: 'Fake software screenshots / implying MedVirtual is an app',
      medvirtualRemix: 'Software-grade visual polish with human staffing truth.',
      sourceInspiration: 'SaaS Prop templates + Competitor Wall whitespace craft',
      internalNotes: 'Never claim MedVirtual is EMR/PMS/software.',
      motionTemplate: 'MV-PREMIUM-OPS-01',
      durationInFrames: 360,
    },
    {
      id: 'MV-STATIC-VERTICAL-DENTAL-01',
      name: 'Vertical Workflow · Dental',
      lane: 'vertical-workflow',
      audience: 'Dental practices',
      vertical: 'dental',
      format: '4:5',
      status: 'Draft',
      eyebrow: 'FOR DENTAL PRACTICES',
      headline: 'Scheduling taking over the front desk?',
      support: 'Add a dedicated Dental Admin who works as part of your practice.',
      bullets: ['Appointment scheduling', 'Patient follow-up', 'Insurance verification'],
      cta: 'Request an Interview',
      candidateId: 'chelsea',
      candidateName: chelsea?.firstName || 'Chelsea',
      role: chelsea?.title || 'Dental Virtual Assistant',
      imageId: 'chelsea-feed',
      imageSrc: chelsea?.imagePath,
      imagePosition: { x: 62, y: 45 },
      imageZoom: 108,
      overlayIntensity: 18,
      theme: 'vertical-clean',
      layout: 'VerticalWorkflowLayout',
      logoVariant: 'colored',
      copySide: 'left',
      showAudiencePill: true,
      showLogo: true,
      competitorSource: weave?.name || 'Weave',
      sourceAdId: null,
      borrowedPrinciple: weave?.steal || 'Vertical specificity makes an ad immediately relevant.',
      rejectedPattern: 'Exaggerated smile imagery / clinical claims / “we run your front desk”',
      medvirtualRemix: 'A dedicated team member rather than another tool or outsourced queue.',
      sourceInspiration: 'Competitor Wall · dental/medical practice platform hooks',
      internalNotes: 'Operational, not cosmetic.',
      motionTemplate: 'MV-PROBLEM-PERSON-01',
      durationInFrames: 390,
    },
  ];

  return concepts.map((c) => ({
    ...c,
    imagePrompt: imagePromptFor(c),
  }));
}

/** Deterministic-ish reseed from constrained banks */
export function reseedBatch(seed = Date.now()) {
  const rnd = mulberry32(seed >>> 0);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const talentPool = LAB_TALENT.filter((t) => t.id !== 'jennifer' || t.listedSkills.length);
  const peopleImages = LAB_IMAGES.filter((i) => i.kind === 'talent' || i.kind === 'board');
  const saasImages = LAB_IMAGES.filter((i) => i.kind === 'saas-prop');
  const principles = COMPETITOR_PRINCIPLES;

  const lanes = [
    {
      layout: 'PainPortraitLayout',
      lane: 'pain-human',
      theme: 'light-grid',
      name: 'Pain + Human Answer',
      motionTemplate: 'MV-HOOK-HUMAN-01',
      durationInFrames: 330,
    },
    {
      layout: 'EditorialTalentLayout',
      lane: 'editorial-talent',
      theme: 'editorial-light',
      name: 'Named Talent / Editorial',
      motionTemplate: 'MV-CHECKLIST-01',
      durationInFrames: 300,
    },
    {
      layout: 'PremiumOpsLayout',
      lane: 'premium-ops',
      theme: 'premium-ops-dark',
      name: 'Premium Operations / SaaS Prop',
      motionTemplate: 'MV-PREMIUM-OPS-01',
      durationInFrames: 360,
    },
    {
      layout: 'VerticalWorkflowLayout',
      lane: 'vertical-workflow',
      theme: 'vertical-clean',
      name: 'Vertical Workflow',
      motionTemplate: 'MV-PROBLEM-PERSON-01',
      durationInFrames: 390,
    },
  ];

  return lanes.map((laneDef, idx) => {
    const talent = pick(talentPool);
    const principle = pick(principles);
    const workflows = pick(COPY_BANKS.workflows);
    const isOps = laneDef.lane === 'premium-ops';
    const isEditorial = laneDef.lane === 'editorial-talent';
    const isVertical = laneDef.lane === 'vertical-workflow';
    const img = isOps ? pick(saasImages) : pick(peopleImages);
    const vertical = isVertical ? pick(['dental', 'medical', 'billing']) : pick(COPY_BANKS.verticals);
    const copySide = img.copyZone === 'right' ? 'right' : 'left';

    const headline = isOps
      ? pick(COPY_BANKS.saasHeadlines)
      : isEditorial
        ? talent.firstName
        : pick(COPY_BANKS.practicePains);

    const concept = {
      id: `MV-STATIC-${laneDef.lane.toUpperCase()}-${String(seed).slice(-4)}-${idx + 1}`,
      name: isVertical ? `Vertical Workflow · ${vertical[0].toUpperCase()}${vertical.slice(1)}` : laneDef.name,
      lane: laneDef.lane,
      audience: isVertical && vertical === 'dental' ? 'Dental practices' : pick(COPY_BANKS.audiences),
      vertical,
      format: '4:5',
      status: 'Draft',
      eyebrow: isOps
        ? 'PRACTICE OPERATIONS'
        : isEditorial
          ? 'MEET AVAILABLE TALENT'
          : isVertical && vertical === 'dental'
            ? 'FOR DENTAL PRACTICES'
            : pick(COPY_BANKS.eyebrows),
      headline,
      support: isEditorial
        ? talent.title
        : pick(COPY_BANKS.supportStatements),
      bullets: isEditorial ? talentBullets(talent.id, workflows) : workflows,
      cta: isEditorial ? 'Meet This Candidate' : pick(COPY_BANKS.ctas),
      candidateId: isOps ? null : talent.id,
      candidateName: isOps ? '' : talent.firstName,
      role: isOps ? '' : talent.title,
      imageId: img.id,
      imageSrc: isOps ? img.src : img.kind === 'talent' ? talent.imagePath : img.src,
      imagePosition: {
        x: copySide === 'left' ? 62 : 35,
        y: 48,
      },
      imageZoom: 105 + Math.floor(rnd() * 10),
      overlayIntensity: isOps ? 0 : 15 + Math.floor(rnd() * 20),
      theme: laneDef.theme,
      layout: laneDef.layout,
      logoVariant: isOps ? 'white' : 'colored',
      copySide,
      showAudiencePill: !isEditorial && !isOps,
      showLogo: true,
      editorialHook: isEditorial ? pick(COPY_BANKS.practicePains) : '',
      competitorSource: principle.name,
      sourceAdId: null,
      borrowedPrinciple: principle.steal,
      rejectedPattern: principle.reject,
      medvirtualRemix: principle.remix,
      sourceInspiration: `Competitor Wall · ${principle.name}`,
      internalNotes: '',
      motionTemplate: laneDef.motionTemplate,
      durationInFrames: laneDef.durationInFrames,
    };
    concept.imagePrompt = imagePromptFor(concept);
    return concept;
  });
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALLOWED_KEYS = new Set([
  'id', 'name', 'lane', 'audience', 'vertical', 'format', 'status',
  'eyebrow', 'headline', 'support', 'bullets', 'cta',
  'candidateId', 'candidateName', 'role', 'imageId', 'imageSrc',
  'imagePosition', 'imageZoom', 'overlayIntensity', 'theme', 'layout',
  'logoVariant', 'copySide', 'showAudiencePill', 'showLogo', 'editorialHook',
  'competitorSource', 'sourceAdId', 'borrowedPrinciple', 'rejectedPattern',
  'medvirtualRemix', 'sourceInspiration', 'imagePrompt', 'internalNotes',
  'motionTemplate', 'durationInFrames', 'animationIntensity',
]);

/** Sanitize imported concept — plain text only, ignore dangerous props */
export function sanitizeConcept(raw, fallbackId = 'imported') {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const out = {};
  for (const key of ALLOWED_KEYS) {
    if (!(key in raw)) continue;
    const val = raw[key];
    if (key === 'bullets') {
      out.bullets = Array.isArray(val)
        ? val.slice(0, 3).map((b) => plainText(b)).filter(Boolean)
        : ['', '', ''];
      while (out.bullets.length < 3) out.bullets.push('');
    } else if (key === 'imagePosition' && val && typeof val === 'object') {
      out.imagePosition = {
        x: clampNum(val.x, 0, 100, 50),
        y: clampNum(val.y, 0, 100, 50),
      };
    } else if (typeof val === 'string') {
      out[key] = plainText(val);
    } else if (typeof val === 'number') {
      out[key] = Number.isFinite(val) ? val : 0;
    } else if (typeof val === 'boolean') {
      out[key] = val;
    } else if (val === null) {
      out[key] = null;
    }
  }
  if (!out.id) out.id = fallbackId;
  if (!CONCEPT_STATUSES.includes(out.status)) out.status = 'Draft';
  if (!FORMATS[out.format]) out.format = '4:5';
  if (!LAYOUTS.includes(out.layout)) out.layout = 'PainPortraitLayout';
  return out;
}

function plainText(s) {
  return String(s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .slice(0, 500);
}

function clampNum(n, min, max, fallback) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

export function sanitizeBatch(payload) {
  let list = payload;
  if (payload && typeof payload === 'object' && Array.isArray(payload.concepts)) {
    list = payload.concepts;
  }
  if (!Array.isArray(list)) {
    return { ok: false, error: 'Expected an array of concepts or { concepts: [] }.' };
  }
  const concepts = list.slice(0, 4).map((c, i) => sanitizeConcept(c, `imported-${i + 1}`)).filter(Boolean);
  if (concepts.length !== 4) {
    return { ok: false, error: 'Import must include exactly four valid concepts.' };
  }
  return { ok: true, concepts };
}

export function buildMotionDefaults(staticBatch = buildDefaultBatch()) {
  const byLane = Object.fromEntries(staticBatch.map((c) => [c.motionTemplate, c]));
  return [
    {
      compositionId: 'MV-HOOK-HUMAN-01',
      name: 'Hook Roll + Human Reveal',
      durationInFrames: 330,
      fps: 30,
      width: 1080,
      height: 1920,
      conceptId: byLane['MV-HOOK-HUMAN-01']?.id,
      status: 'Draft',
      animationIntensity: 'standard',
      showSafeZones: false,
      muted: true,
      ...pickMotionCopy(byLane['MV-HOOK-HUMAN-01'], {
        headline: 'Too many calls.',
        headlineTwo: 'Not enough day.',
        support: 'Add a dedicated virtual medical admin to your team.',
        bullets: ['Calls and scheduling', 'Patient intake', 'Follow-up support'],
        cta: 'Request an Interview',
      }),
    },
    {
      compositionId: 'MV-CHECKLIST-01',
      name: 'Checklist Reveal',
      durationInFrames: 300,
      fps: 30,
      width: 1080,
      height: 1920,
      conceptId: byLane['MV-CHECKLIST-01']?.id,
      status: 'Draft',
      animationIntensity: 'standard',
      showSafeZones: false,
      muted: true,
      ...pickMotionCopy(byLane['MV-CHECKLIST-01'], {
        headline: 'Admin work piling up?',
        headlineTwo: '',
        support: 'Hire a dedicated virtual teammate who works as part of your practice.',
        bullets: talentBullets('jessica'),
        cta: 'Meet Available Talent',
      }),
    },
    {
      compositionId: 'MV-PROBLEM-PERSON-01',
      name: 'Problem to Person',
      durationInFrames: 390,
      fps: 30,
      width: 1080,
      height: 1920,
      conceptId: byLane['MV-PROBLEM-PERSON-01']?.id,
      status: 'Draft',
      animationIntensity: 'standard',
      showSafeZones: false,
      muted: true,
      ...pickMotionCopy(byLane['MV-PROBLEM-PERSON-01'], {
        headline: 'Add dedicated support to your practice team.',
        headlineTwo: '',
        support: 'Add dedicated support to your practice team.',
        bullets: ['Calls', 'Scheduling', 'Follow-ups'],
        cta: 'Request an Interview',
        cards: ['Calls', 'Scheduling', 'Follow-ups'],
      }),
    },
    {
      compositionId: 'MV-PREMIUM-OPS-01',
      name: 'Premium Ops / Glass Cards',
      durationInFrames: 360,
      fps: 30,
      width: 1080,
      height: 1920,
      conceptId: byLane['MV-PREMIUM-OPS-01']?.id,
      status: 'Draft',
      animationIntensity: 'subtle',
      showSafeZones: false,
      muted: true,
      ...pickMotionCopy(byLane['MV-PREMIUM-OPS-01'], {
        headline: 'Built like serious operations.',
        headlineTwo: 'Delivered as dedicated people.',
        support: 'Hire full-time virtual staff who join your practice team.',
        bullets: ['Scheduling', 'Billing support', 'Patient communication'],
        cta: 'Meet Available Talent',
      }),
    },
  ];
}

function pickMotionCopy(concept, defaults) {
  if (!concept) return { ...defaults, imageSrc: LAB_IMAGES[0].src, role: '', audience: '', theme: 'light-grid' };
  return {
    headline: defaults.headline,
    headlineTwo: defaults.headlineTwo || '',
    support: defaults.support,
    bullets: defaults.bullets || concept.bullets,
    cta: defaults.cta,
    cards: defaults.cards || concept.bullets,
    imageSrc: concept.imageSrc,
    role: concept.role || '',
    audience: concept.audience || '',
    theme: concept.theme || 'light-grid',
    candidateName: concept.candidateName || '',
    lane: concept.lane,
    internalNotes: '',
  };
}

export function clientPayload() {
  return {
    brand: {
      displayName: BRAND.adFacingName,
      colors: BRAND.colors,
      fonts: BRAND.fonts,
      logoColored: BRAND.assets.logoColoredSvg,
      logoWhite: BRAND.assets.logoWhiteSvg,
    },
    statuses: CONCEPT_STATUSES,
    formats: FORMATS,
    layouts: LAYOUTS,
    themes: THEMES,
    storageKeys: STORAGE_KEYS,
    images: LAB_IMAGES,
    talent: LAB_TALENT,
    banks: COPY_BANKS,
    competitorPrinciples: COMPETITOR_PRINCIPLES,
    defaultBatch: buildDefaultBatch(),
    motionDefaults: buildMotionDefaults(),
  };
}
