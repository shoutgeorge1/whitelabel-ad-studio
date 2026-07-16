/**
 * Real People Video — formats, capture standards, assignments, video assets.
 * Public-safe proxies only in VIDEO_ASSETS. Raw masters stay in .local-masters/video-source/
 */
import { LAB_TALENT, talentBullets } from './concept-lab-data.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

export const VIDEO_ASSIGNMENT_STATUSES = [
  'Not Started',
  'Waiting for Footage',
  'Footage Received',
  'Editing',
  'Internal Review',
  'Send for Review',
  'Revision Requested',
  'Approved',
  'Published',
  'Archived',
];

export const REVIEW_FEEDBACK = [
  'Strong Hook',
  'Better Person',
  'Too Generic',
  'Too Busy',
  'Too Cheap-Looking',
  'More Premium',
  'More Real',
  'Needs Stronger CTA',
  'Approve Direction',
  'Reject Direction',
];

export const CAPTURE_STANDARD = {
  format: [
    'Vertical 9:16',
    '1080 × 1920 minimum',
    '30 fps',
    'Normal phone camera app (no beauty filters, text, or stickers)',
    'No digital zoom',
    'Rear camera if someone can help; front camera if alone',
  ],
  framing: [
    'Camera near eye level',
    'Leave safe space above the head',
    'Direct-to-camera: mid-torso upward',
    'Keep the phone stable (stand, tripod, or propped surface)',
  ],
  lighting: [
    'Face a window or soft light',
    'Do not put a bright window behind you',
    'Face clearly visible',
  ],
  audio: [
    'Quiet room — silence fans and TV',
    'Speak naturally',
    'Record 2–3 takes',
    'One second of silence before and after speaking',
  ],
  background: {
    prefer: ['Clean home office', 'Organized desk', 'Neutral wall', 'Professional workspace'],
    avoid: [
      'Patient records or screen data',
      'Names, phone numbers, emails',
      'Political or offensive material',
      'Messy bedrooms',
      'Unapproved logos',
      'Clinic/hospital footage without authorization',
    ],
  },
  wardrobe: [
    'Smart-casual, solid colors preferred',
    'Avoid narrow stripes and competitor logos',
    'Professional but real — no forced suit unless asked',
  ],
};

export const VIDEO_FORMATS = [
  {
    id: 'MV-MEET-TEAMMATE-01',
    workingName: 'Meet Your Next Teammate',
    shortName: 'Direct-to-Camera',
    durationSec: '10–15',
    durationInFrames: 360,
    needsDtcAudio: true,
    needsBroll: false,
    compositionId: 'MV-MEET-TEAMMATE-01',
    structure: [
      'Direct-to-camera clip',
      'Approved introduction line',
      'Name + role lower third',
      'Two or three workflow bullets',
      'End card + CTA',
    ],
    shotList: [
      '1× direct-to-camera take (mid-torso, eye level)',
      'Optional: 1 clean still / portrait freeze frame',
    ],
    defaultCta: 'Request an Interview',
    defaultSpoken:
      'Hi, I’m {name}. I support {vertical} practices with {skill1}, {skill2}, and {skill3}.',
  },
  {
    id: 'MV-REAL-WORKDAY-01',
    workingName: 'A Real Person Behind the Work',
    shortName: 'Real Workday B-Roll',
    durationSec: '10–15',
    durationInFrames: 360,
    needsDtcAudio: false,
    needsBroll: true,
    compositionId: 'MV-REAL-WORKDAY-01',
    structure: [
      'Pain hook',
      'Two or three work clips',
      'Role / capabilities',
      'Person reveal',
      'CTA',
    ],
    shotList: [
      'Typing at a clean desk (no readable screen data)',
      'Looking at a screen (angle that hides content)',
      'Notes or calendar on paper / blank mock UI',
      'Headset on — do not pretend to speak with a patient',
      'Short natural glance toward camera',
    ],
    defaultCta: 'Meet Available Talent',
    defaultHook: 'Your front desk does not need another app. It may need another person.',
    defaultSupport: 'Add dedicated virtual staff to your practice team.',
  },
  {
    id: 'MV-OVERLOAD-SUPPORT-01',
    workingName: 'From Overload to Support',
    shortName: 'Pain → Human',
    durationSec: '9–13',
    durationInFrames: 330,
    needsDtcAudio: false,
    needsBroll: false,
    compositionId: 'MV-OVERLOAD-SUPPORT-01',
    structure: [
      'Pain statement',
      'Operational cards: Calls · Scheduling · Follow-ups',
      'Real person appears',
      'Dedicated staffing line',
      'CTA',
    ],
    shotList: [
      '1× portrait clip or approved still used as motion',
      'Optional: 1 clean desk clip for transition',
    ],
    defaultCta: 'Request an Interview',
    defaultHook: 'Too many calls. Not enough day.',
    defaultSupport: 'Meet dedicated virtual staff who work as part of your practice.',
  },
  {
    id: 'MV-VERTICAL-PRACTICE-01',
    workingName: 'Built for Your Practice',
    shortName: 'Vertical-Specific',
    durationSec: '10–15',
    durationInFrames: 360,
    needsDtcAudio: false,
    needsBroll: false,
    compositionId: 'MV-VERTICAL-PRACTICE-01',
    structure: [
      'Vertical-specific hook',
      'Real VA clip or portrait',
      'Three approved workflow items',
      'Staffing truth',
      'CTA',
    ],
    shotList: [
      '1× direct-to-camera or portrait hold',
      'Optional: 1–2 vertical-safe work clips (no clinical duties)',
    ],
    defaultCta: 'Request an Interview',
    defaultHook: 'Scheduling taking over the front desk?',
    defaultSupport: 'Add a dedicated Dental Admin who works as part of your practice.',
    defaultBullets: ['Appointment scheduling', 'Patient follow-up', 'Insurance verification'],
    defaultVertical: 'dental',
  },
];

export const VERTICALS = [
  { id: 'medical', label: 'Medical' },
  { id: 'dental', label: 'Dental' },
  { id: 'veterinary', label: 'Veterinary' },
  { id: 'behavioral', label: 'Behavioral health' },
  { id: 'billing', label: 'Billing / revenue-cycle' },
];

export const TONES = ['Calm professional', 'Warm direct', 'Premium editorial', 'Straightforward ops'];

export const CTAS = [
  'Request an Interview',
  'Meet Available Talent',
  'Find Support for Your Practice',
  'Meet This Candidate',
];

/** Placeholder public-safe video registry — proxies only; no raw masters */
export const VIDEO_ASSETS = [
  {
    id: 'placeholder-jessica-dtc',
    personId: 'jessica',
    filename: 'placeholder-awaiting-footage',
    publicSrc: null,
    posterSrc: '/assets/real-people/jessica/vertical-reference-1080x1920.jpg',
    orientation: '9:16',
    duration: null,
    approved: false,
    usageStatus: 'waiting-for-footage',
    hasAudio: false,
    backgroundType: 'home-office',
    shotType: 'direct-to-camera',
    safeForAds: false,
    notes: 'Placeholder poster until approved proxy is registered.',
  },
  {
    id: 'placeholder-chelsea-broll',
    personId: 'chelsea',
    filename: 'placeholder-awaiting-footage',
    publicSrc: null,
    posterSrc: '/assets/real-people/chelsea/vertical-reference-1080x1920.jpg',
    orientation: '9:16',
    duration: null,
    approved: false,
    usageStatus: 'waiting-for-footage',
    hasAudio: false,
    backgroundType: 'home-office',
    shotType: 'b-roll',
    safeForAds: false,
    notes: 'Placeholder poster until approved proxy is registered.',
  },
  {
    id: 'placeholder-carmen-portrait',
    personId: 'carmen',
    filename: 'placeholder-awaiting-footage',
    publicSrc: null,
    posterSrc: '/assets/real-people/carmen/vertical-reference-1080x1920.jpg',
    orientation: '9:16',
    duration: null,
    approved: false,
    usageStatus: 'waiting-for-footage',
    hasAudio: false,
    backgroundType: 'neutral',
    shotType: 'portrait-hold',
    safeForAds: false,
    notes: 'Placeholder poster until approved proxy is registered.',
  },
];

export const CONSENT_CHECKS = [
  { id: 'consent', label: 'Talent consent confirmed' },
  { id: 'adUse', label: 'Advertising usage approved' },
  { id: 'nameUse', label: 'Name usage approved' },
  { id: 'roleVerified', label: 'Role and profile details verified' },
  { id: 'noPhi', label: 'No patient information visible' },
  { id: 'noPii', label: 'No private customer information visible' },
  { id: 'noLogos', label: 'No unapproved logos visible' },
  { id: 'noClaims', label: 'No misleading claims' },
  { id: 'musicOk', label: 'No background music licensing issue' },
  { id: 'copyOk', label: 'Final copy approved' },
];

export const WORKFLOW_GUIDE = [
  'Start with one practice-owner problem.',
  'Choose one real person.',
  'Record only the required footage (about 15–30 minutes on a phone).',
  'Select one approved motion template.',
  'Keep on-screen copy short.',
  'Make the opening frame understandable immediately.',
  'Show the person early.',
  'Keep the role accurate — public profile facts only.',
  'End with one CTA.',
  'Produce one strong vertical master before resizes.',
];

export const CREATIVE_RULES = [
  'Do not hide weak footage beneath excessive graphics.',
  'Reuse the production system, not the exact composition.',
  'Real is the advantage. Polish without making the person feel synthetic.',
];

/** Starter production batch — four assignments */
export function buildVideoAssignments() {
  const jessica = LAB_TALENT.find((t) => t.id === 'jessica');
  const chelsea = LAB_TALENT.find((t) => t.id === 'chelsea');
  const carmen = LAB_TALENT.find((t) => t.id === 'carmen');

  return [
    {
      id: 'vid-meet-jessica',
      assignmentType: 'Capture + Motion',
      status: 'Waiting for Footage',
      concept: 'Direct-to-camera talent introduction',
      formatId: 'MV-MEET-TEAMMATE-01',
      featuredTalentId: 'jessica',
      featuredTalent: jessica?.firstName || 'Jessica',
      role: jessica?.title || 'Jr. Medical Admin',
      vertical: 'medical',
      dueDate: '07/27/2026',
      owner: 'Graphics / Video',
      deliverables: [
        'One 10–15s vertical video',
        'One 4:5 static cover',
        'One 1:1 static cover',
      ],
      requiredFootage: VIDEO_FORMATS[0].shotList,
      script:
        'Hi, I’m Jessica. I support medical practices with customer service, healthcare support, and admin coordination.',
      bullets: talentBullets('jessica'),
      cta: 'Request an Interview',
      example: '/assets/real-people/jessica/ad-treatment-e-9x16.png',
      submission: 'Email finished MP4 + PNGs to george.a@legalsoft.com',
      revisionNotes: '',
      footageStatus: 'placeholder',
      videoAssetId: 'placeholder-jessica-dtc',
    },
    {
      id: 'vid-workday-chelsea',
      assignmentType: 'Capture + Motion',
      status: 'Waiting for Footage',
      concept: 'Real workday b-roll',
      formatId: 'MV-REAL-WORKDAY-01',
      featuredTalentId: 'chelsea',
      featuredTalent: chelsea?.firstName || 'Chelsea',
      role: chelsea?.title || 'Dental Virtual Assistant',
      vertical: 'dental',
      dueDate: '07/27/2026',
      owner: 'Graphics / Video',
      deliverables: [
        'Three to four simple b-roll clips',
        'One 10–15s vertical edit',
        'One first-frame static',
      ],
      requiredFootage: VIDEO_FORMATS[1].shotList,
      script: '',
      hook: VIDEO_FORMATS[1].defaultHook,
      support: VIDEO_FORMATS[1].defaultSupport,
      bullets: ['Appointment setting', 'Patient communication', 'Scheduling support'],
      cta: 'Meet Available Talent',
      example: '/assets/real-people/chelsea/ad-treatment-e-9x16.png',
      submission: 'Email proxy clips + final edit to george.a@legalsoft.com',
      revisionNotes: '',
      footageStatus: 'placeholder',
      videoAssetId: 'placeholder-chelsea-broll',
    },
    {
      id: 'vid-pain-carmen',
      assignmentType: 'Motion',
      status: 'Not Started',
      concept: 'Pain to human solution (existing imagery)',
      formatId: 'MV-OVERLOAD-SUPPORT-01',
      featuredTalentId: 'carmen',
      featuredTalent: carmen?.firstName || 'Carmen',
      role: carmen?.title || 'Medical Biller',
      vertical: 'billing',
      dueDate: '07/24/2026',
      owner: 'Graphics / Video',
      deliverables: ['One 9–13s vertical video', 'One 4:5 static adaptation'],
      requiredFootage: ['Approved portrait or feed still (motion Ken Burns acceptable)'],
      script: '',
      hook: 'Too many calls. Not enough day.',
      support: 'Meet dedicated virtual staff who work as part of your practice.',
      bullets: ['Calls', 'Scheduling', 'Follow-ups'],
      cta: 'Request an Interview',
      example: '/assets/real-people/carmen/feed-1080x1350.jpg',
      submission: 'Render via Remotion CLI; hand stills + MP4 to George',
      revisionNotes: 'Can ship without new capture using approved stills.',
      footageStatus: 'using-existing-imagery',
      videoAssetId: 'placeholder-carmen-portrait',
    },
    {
      id: 'vid-dental-chelsea',
      assignmentType: 'Motion',
      status: 'Not Started',
      concept: 'Vertical-specific dental support',
      formatId: 'MV-VERTICAL-PRACTICE-01',
      featuredTalentId: 'chelsea',
      featuredTalent: chelsea?.firstName || 'Chelsea',
      role: chelsea?.title || 'Dental Virtual Assistant',
      vertical: 'dental',
      dueDate: '07/27/2026',
      owner: 'Graphics / Video',
      deliverables: ['One 10–15s vertical video', 'One square static', 'One 4:5 static'],
      requiredFootage: ['Portrait or approved still; optional dental-safe work clip'],
      script: '',
      hook: 'Scheduling taking over the front desk?',
      support: 'Add a dedicated Dental Admin who works as part of your practice.',
      bullets: ['Appointment scheduling', 'Patient follow-up', 'Insurance verification'],
      cta: 'Request an Interview',
      example: '/assets/real-people/chelsea/feed-1080x1350.jpg',
      submission: 'Email MP4 + static cutdowns to george.a@legalsoft.com',
      revisionNotes: 'Do not imply clinical duties.',
      footageStatus: 'using-existing-imagery',
      videoAssetId: 'placeholder-chelsea-broll',
    },
  ];
}

export function fillSpokenTemplate(template, talent, verticalLabel, bullets) {
  const [s1, s2, s3] = bullets || ['scheduling', 'patient communication', 'admin support'];
  return String(template || '')
    .replace(/\{name\}/g, talent?.firstName || 'Your teammate')
    .replace(/\{vertical\}/g, verticalLabel || 'healthcare')
    .replace(/\{skill1\}/g, String(s1).toLowerCase())
    .replace(/\{skill2\}/g, String(s2).toLowerCase())
    .replace(/\{skill3\}/g, String(s3).toLowerCase());
}

export function buildCaptureBrief(opts) {
  const talent = LAB_TALENT.find((t) => t.id === opts.personId) || LAB_TALENT[0];
  const format = VIDEO_FORMATS.find((f) => f.id === opts.templateId) || VIDEO_FORMATS[0];
  const vertical = VERTICALS.find((v) => v.id === opts.vertical) || VERTICALS[0];
  const bullets = opts.bullets?.length ? opts.bullets : talentBullets(talent.id);
  const spoken =
    opts.spokenLine ||
    fillSpokenTemplate(format.defaultSpoken, talent, vertical.label.toLowerCase(), bullets);

  return {
    title: `${format.workingName} — ${talent.firstName}`,
    brand: BRAND.adFacingName,
    purpose:
      'Create a short Meta ad that shows a real MedVirtual teammate so a practice owner can imagine interviewing dedicated virtual staff.',
    intendedViewer: `${vertical.label} practice owner / ops lead`,
    person: {
      id: talent.id,
      name: talent.firstName,
      role: talent.title,
    },
    template: format.workingName,
    compositionId: format.compositionId,
    tone: opts.tone || TONES[0],
    cta: opts.cta || format.defaultCta,
    targetLength: opts.targetLength || format.durationSec,
    deadline: opts.deadline || '',
    owner: opts.owner || 'Graphics / Video',
    spokenLine: format.needsDtcAudio || opts.requireAudio ? spoken : null,
    requireAudio: Boolean(opts.requireAudio ?? format.needsDtcAudio),
    requireBroll: Boolean(opts.requireBroll ?? format.needsBroll),
    shotList: format.shotList,
    capture: CAPTURE_STANDARD,
    backgroundPreference: opts.backgroundPreference || 'Clean home office / neutral wall',
    wardrobe: opts.wardrobe || CAPTURE_STANDARD.wardrobe.join('; '),
    doNotShow: CAPTURE_STANDARD.background.avoid,
    fileNaming: `MV_${talent.firstName}_${format.shortName.replace(/\s+/g, '')}_take##_YYYYMMDD.mp4`,
    submission:
      'Upload or email proxy clips to the assignment owner. Raw masters stay in .local-masters/video-source/ — do not post raw files to the public site.',
    generatedAt: new Date().toISOString(),
  };
}

export function renderBriefText(brief) {
  const lines = [
    `# ${brief.title}`,
    '',
    `Brand: ${brief.brand}`,
    `Purpose: ${brief.purpose}`,
    `Viewer: ${brief.intendedViewer}`,
    `Person: ${brief.person.name} · ${brief.person.role}`,
    `Template: ${brief.template} (${brief.compositionId})`,
    `Tone: ${brief.tone}`,
    `CTA: ${brief.cta}`,
    `Length: ${brief.targetLength}`,
    brief.deadline ? `Deadline: ${brief.deadline}` : null,
    `Owner: ${brief.owner}`,
    '',
    brief.spokenLine ? `## Spoken line\n${brief.spokenLine}\n` : null,
    '## Shot list',
    ...brief.shotList.map((s, i) => `${i + 1}. ${s}`),
    '',
    '## Capture standard',
    '### Format',
    ...brief.capture.format.map((x) => `- ${x}`),
    '### Framing',
    ...brief.capture.framing.map((x) => `- ${x}`),
    '### Lighting',
    ...brief.capture.lighting.map((x) => `- ${x}`),
    '### Audio',
    ...brief.capture.audio.map((x) => `- ${x}`),
    '',
    `Background preference: ${brief.backgroundPreference}`,
    `Wardrobe: ${brief.wardrobe}`,
    '',
    '## Do not show',
    ...brief.doNotShow.map((x) => `- ${x}`),
    '',
    `## File naming\n${brief.fileNaming}`,
    '',
    `## Submission\n${brief.submission}`,
  ].filter((x) => x !== null);
  return lines.join('\n');
}

export function videoClientPayload() {
  return {
    formats: VIDEO_FORMATS,
    verticals: VERTICALS,
    tones: TONES,
    ctas: CTAS,
    talent: LAB_TALENT,
    assets: VIDEO_ASSETS,
    assignments: buildVideoAssignments(),
    statuses: VIDEO_ASSIGNMENT_STATUSES,
    reviewFeedback: REVIEW_FEEDBACK,
    consentChecks: CONSENT_CHECKS,
    captureStandard: CAPTURE_STANDARD,
    workflowGuide: WORKFLOW_GUIDE,
    creativeRules: CREATIVE_RULES,
    storageKey: 'mv-video-production-v1',
    promoteKey: 'mv-video-brief-promote-v1',
  };
}
