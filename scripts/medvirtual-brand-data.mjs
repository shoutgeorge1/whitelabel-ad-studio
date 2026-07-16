/**
 * Official MedVirtual brand + messaging source of truth.
 * Do not invent colors, logos, or claims beyond this module + claims-review.
 */
export const BRAND = {
  displayName: 'MedVirtual',
  adFacingName: 'MedVirtual',
  websiteUrl: 'https://www.medvirtual.ai',
  /** Never use in ad-facing body unless explicitly requested */
  forbiddenAdNames: ['MedVirtual.ai'],
  taglineReference: 'Staffing Solutions for Every Practice',
  fonts: {
    family: '"Be Vietnam", Inter, Arial, sans-serif',
    files: {
      regular: '/assets/brand/medvirtual/fonts/BeVietnam-Regular.ttf',
      medium: '/assets/brand/medvirtual/fonts/BeVietnam-Medium.ttf',
      bold: '/assets/brand/medvirtual/fonts/BeVietnam-Bold.ttf',
    },
  },
  colors: {
    main01: '#077999',
    main02: '#00B2E2',
    main03: '#0D546B',
    accent01: '#00C0D4',
    accent02: '#27E6FA',
    neutral01: '#F0F5FF',
    neutral02: '#EFEDE1',
    ink: '#161511',
    white: '#FFFFFF',
  },
  gradients: {
    primary: 'linear-gradient(90deg, #077999 0%, #00B2E2 100%)',
    light: 'linear-gradient(90deg, #F0F5FF 0%, #00B2E2 100%)',
    bright: 'linear-gradient(90deg, #27E6FA 0%, #F0F5FF 100%)',
    deep: 'linear-gradient(90deg, #0D546B 0%, #00C0D4 100%)',
  },
  assets: {
    logoColoredSvg: '/assets/brand/medvirtual/logo-colored.svg',
    logoWhiteSvg: '/assets/brand/medvirtual/logo-white.svg',
    logoColoredPng: '/assets/brand/medvirtual/logo-colored.png',
    logomarkColoredSvg: '/assets/brand/medvirtual/logomark-colored.svg',
    logomarkWhiteSvg: '/assets/brand/medvirtual/logomark-white.svg',
    logomarkOnBlackPng: '/assets/brand/medvirtual/logomark-on-black.png',
    linkedinBannerRef: '/assets/brand/medvirtual/linkedin-banner-reference.png',
    storyGradientRef: '/assets/brand/medvirtual/story-gradient-reference.png',
    brandKitRef: '/assets/brand/medvirtual/brand-kit-reference.png',
  },
};

export const BRAND_VOICE = {
  traits: [
    'Professional',
    'Healthcare-specific',
    'Confident',
    'Direct',
    'Supportive',
    'Solution-oriented',
    'Operationally credible',
    'Clear and concise',
  ],
  preferredTerms: [
    'Patient calls',
    'Appointment scheduling',
    'Patient intake',
    'Insurance verification',
    'Eligibility checks',
    'Prior authorizations',
    'Billing support',
    'Claim follow-up',
    'AR follow-up',
    'EHR or EMR updates',
    'Front-desk workflow',
    'Patient coordination',
    'Treatment-plan follow-up',
    'Recall management',
  ],
  preferredPhrases: [
    'Add dedicated virtual staff to your practice',
    'Meet a candidate your team can interview',
    'Full-time virtual staff who work as part of your practice',
    'Healthcare-trained talent matched to your workflow',
    'A dedicated team member working remotely',
    'Your dedicated virtual staff can support calls and scheduling',
    'Add a virtual medical admin to your team',
    'Interview healthcare-trained talent for your practice',
  ],
  avoidPhrases: [
    'Unlock growth',
    'Transform your practice',
    'Revolutionize',
    'Generic virtual help',
    'MedVirtual handles your calls',
    'We run your front desk',
    'Outsource your front desk to MedVirtual',
    'MedVirtual answers every call',
    'MedVirtual.ai (in ad-facing copy)',
  ],
  serviceModel: {
    correct:
      'MedVirtual helps practices hire dedicated full-time virtual staff who become part of the practice’s team.',
    not: [
      'A call center',
      'A managed front-desk service',
      'A software product',
      'A generic outsourcing agency',
      'A service that performs all work independently on behalf of the practice',
    ],
  },
  weakVsBetter: [
    {
      weak: 'Unlock growth with virtual solutions.',
      better:
        'Too many patient calls for your front desk? Add a dedicated virtual medical admin to your team.',
    },
    {
      weak: 'MedVirtual handles your entire front desk.',
      better: 'Hire dedicated virtual staff who work remotely as part of your practice.',
    },
    {
      weak: 'Reduce overhead and scale effortlessly.',
      better:
        'Add scheduling, billing, or front-desk support without adding another in-office workstation.',
    },
  ],
  messagingStructure: [
    'Specific practice pain',
    'Specific staff role',
    'Specific workflow supported',
    'Human or candidate proof',
    'Clear next action',
  ],
  messagingExample:
    'Insurance verification slowing the team down? Meet Mark, an Insurance Verification Specialist available through MedVirtual’s talent pool. Request an interview to see whether he fits your workflow.',
};

export const ICP = {
  coreVerticals: ['Primary care', 'Dental', 'Aesthetic and cosmetic', 'Chiropractic'],
  specialtyCountLabel: '18+ practice types',
  decisionMakers: [
    'Practice Owner',
    'Clinic Owner',
    'Medical Director',
    'Lead Dentist',
    'Lead Chiropractor',
    'Office Manager',
    'Practice Manager',
    'Practice Administrator',
    'Treatment Coordinator',
    'Billing Manager',
    'Revenue Cycle Manager',
    'Sales Director (aesthetic)',
  ],
};

export const ROLE_USE_CASES = [
  {
    role: 'Medical Admin',
    practiceTypes: ['Primary care', 'Specialty clinics', 'Multi-provider groups'],
    pains: [
      'Too many calls',
      'Scheduling backlog',
      'Patient intake overload',
      'Follow-up tasks piling up',
      'Front-desk turnover',
    ],
    workflows: [
      'Calls',
      'Scheduling',
      'Intake',
      'Patient communication',
      'EHR or EMR updates',
      'Referral coordination',
    ],
    safeHooks: [
      'THE ADMIN WORK DOESN’T STOP.',
      'TOO MANY CALLS. NOT ENOUGH DAY.',
      'Add a Jr. Medical Admin your team can interview.',
    ],
    disallowed: [
      'Guaranteed call answer rates',
      'MedVirtual runs your front desk',
      'Specific revenue outcomes',
    ],
  },
  {
    role: 'Medical Biller',
    practiceTypes: ['Primary care', 'Specialty', 'Dental (billing support)'],
    pains: [
      'Billing backlog',
      'Claims waiting for follow-up',
      'AR workload',
      'Payment-posting workload',
      'Denial follow-up',
    ],
    workflows: ['Claims support', 'Payment posting', 'AR follow-up', 'Billing inquiries'],
    safeHooks: ['BILLING WORK PILING UP?', 'Meet a Medical Billing support candidate.'],
    disallowed: [
      'Specific reimbursement increases',
      'Specific denial-rate reductions',
      'Guaranteed revenue recovery',
    ],
  },
  {
    role: 'Insurance Verification Specialist',
    practiceTypes: ['Primary care', 'Specialty', 'Dental'],
    pains: [
      'Eligibility checks consuming staff time',
      'Verification delays',
      'Coverage surprises',
      'Prior-authorization workload',
    ],
    workflows: ['Eligibility checks', 'Insurance verification', 'Prior-auth support'],
    safeHooks: [
      'HOW MUCH OF YOUR DAY GOES TO INSURANCE VERIFICATION?',
      'VERIFICATION WORK PILING UP?',
    ],
    disallowed: ['Faster reimbursement guarantees', 'Denial reduction guarantees'],
  },
  {
    role: 'Dental Admin',
    practiceTypes: ['Dental', 'Ortho', 'Multi-location dental / DSO'],
    pains: [
      'Treatment-plan follow-up',
      'Recall management',
      'Scheduling',
      'Insurance verification',
      'Case acceptance follow-up',
    ],
    workflows: ['Scheduling', 'Recalls', 'Insurance verification', 'Patient follow-up'],
    safeHooks: [
      'YOUR FRONT DESK SHOULDN’T SPEND ALL DAY SCHEDULING.',
      'SCHEDULING TAKING OVER THE FRONT DESK?',
    ],
    disallowed: ['Clinical claims', 'Case acceptance rate guarantees'],
  },
  {
    role: 'Patient Intake Coordinator',
    practiceTypes: ['Primary care', 'Specialty', 'Aesthetic'],
    pains: [
      'Slow response to new-patient inquiries',
      'Intake paperwork',
      'Phone and appointment coordination',
      'Follow-up gaps',
    ],
    workflows: ['New-patient intake', 'Phone coordination', 'Appointment follow-up'],
    safeHooks: ['NEW PATIENT INTAKE FALLING BEHIND?', 'INTAKE AND FOLLOW-UP PILING UP?'],
    disallowed: ['Conversion-rate guarantees'],
  },
];

/** Shared CSS: fonts + brand tokens for generated HTML pages */
export function brandCssVariables() {
  const c = BRAND.colors;
  const g = BRAND.gradients;
  const f = BRAND.fonts.files;
  return `
@font-face {
  font-family: 'Be Vietnam';
  src: url('${f.regular}') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Be Vietnam';
  src: url('${f.medium}') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Be Vietnam';
  src: url('${f.bold}') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
:root {
  --mv-primary: ${c.main01};
  --mv-cyan: ${c.main02};
  --mv-deep-teal: ${c.main03};
  --mv-accent: ${c.accent01};
  --mv-bright-accent: ${c.accent02};
  --mv-neutral-blue: ${c.neutral01};
  --mv-neutral-warm: ${c.neutral02};
  --mv-ink: ${c.ink};
  --mv-white: ${c.white};
  --mv-gradient-primary: ${g.primary};
  --mv-gradient-light: ${g.light};
  --mv-gradient-bright: ${g.bright};
  --mv-gradient-deep: ${g.deep};
  --mv-font: ${BRAND.fonts.family};
}
`;
}
