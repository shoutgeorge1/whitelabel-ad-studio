/**
 * MedVirtual claims review — conflicting or unverified claims from internal docs.
 * Do not publish unapproved values on new creative pages.
 */

export const CLAIMS_UPDATED = '2026-07-13';

/** @typedef {'Needs CMO / sales confirmation' | 'Needs confirmation and substantiation' | 'Needs operational confirmation' | 'Confirm current approved number' | 'Do not publish without supporting evidence' | 'Conflicting — do not use in external advertising' | 'Default safe wording until approved'} ClaimStatus */

/**
 * @type {Array<{
 *   id: string,
 *   claim: string,
 *   category: string,
 *   valuesFound: string[],
 *   sourceFiles: string[],
 *   status: ClaimStatus,
 *   approvedPublicWording: string | null,
 *   needsConfirmation: boolean,
 *   notes: string,
 * }>}
 */
export const CLAIMS_REVIEW = [
  {
    id: 'pricing',
    claim: 'Hourly / monthly starting price',
    category: 'Pricing',
    valuesFound: [
      'Starting at $10/hour',
      '$11/hour',
      '$11–$17/hour',
      'Approximately $2,200/month',
      'Less than $2,000/month',
    ],
    sourceFiles: [
      'GTM Strategy- MedVirtual.xlsx',
      'MedVirtual Intake for SDR.docx',
      'Prior Meta creative / landing copy (legacy)',
    ],
    status: 'Needs CMO / sales confirmation',
    approvedPublicWording: null,
    needsConfirmation: true,
    notes:
      'Do not publish a specific price on a new page unless it already appears in approved live creative or is separately confirmed.',
  },
  {
    id: 'cost-savings',
    claim: 'Cost savings vs in-office hire',
    category: 'Cost savings',
    valuesFound: ['Up to 68%', 'Up to 70%'],
    sourceFiles: ['GTM Strategy- MedVirtual.xlsx', 'MedVirtual Intake for SDR.docx'],
    status: 'Needs confirmation and substantiation',
    approvedPublicWording: null,
    needsConfirmation: true,
    notes: 'Do not automatically publish either number. Requires methodology + approval.',
  },
  {
    id: 'hipaa',
    claim: 'HIPAA / compliance language',
    category: 'Compliance',
    valuesFound: [
      'HIPAA-trained',
      'HIPAA-certified',
      '100% HIPAA compliance',
      'Compliance-ready',
    ],
    sourceFiles: ['GTM Strategy- MedVirtual.xlsx', 'SDR intake', 'Legacy ad copy'],
    status: 'Default safe wording until approved',
    approvedPublicWording: 'Healthcare-trained virtual staff with HIPAA training',
    needsConfirmation: true,
    notes:
      'Do not claim certification or 100% compliance without confirmation. Prefer trained wording until legal/CMO signs off.',
  },
  {
    id: 'deployment-speed',
    claim: 'Time to place / start virtual staff',
    category: 'Operations',
    valuesFound: ['Under two weeks', 'Days, not months'],
    sourceFiles: ['GTM Strategy- MedVirtual.xlsx', 'SDR intake'],
    status: 'Needs operational confirmation',
    approvedPublicWording: null,
    needsConfirmation: true,
    notes: 'Confirm against current recruiting / onboarding SLAs before advertising.',
  },
  {
    id: 'practice-count',
    claim: 'Practices served',
    category: 'Social proof',
    valuesFound: ['250+ practices served'],
    sourceFiles: ['GTM Strategy- MedVirtual.xlsx', 'Prior marketing materials'],
    status: 'Confirm current approved number',
    approvedPublicWording: null,
    needsConfirmation: true,
    notes: 'Use only the current sales-approved count once confirmed.',
  },
  {
    id: 'retention-performance',
    claim: 'Retention and performance outcomes',
    category: 'Performance',
    valuesFound: [
      '90%+ retention',
      'Reduced denials',
      'Faster reimbursements',
      'Higher conversion',
      'Revenue recovery',
      'Exact savings calculations',
      'Exact missed-call revenue calculations',
    ],
    sourceFiles: ['GTM Strategy- MedVirtual.xlsx', 'Legacy creative / decks'],
    status: 'Do not publish without supporting evidence',
    approvedPublicWording: null,
    needsConfirmation: true,
    notes: 'No outcome claims in new ads unless substantiated and approved.',
  },
  {
    id: 'managed-service',
    claim: 'Managed service / MedVirtual operates workflows',
    category: 'Service model',
    valuesFound: [
      'Fully managed by MedVirtual',
      'MedVirtual handles workflows',
      'We run your front desk (implied in some internal lines)',
    ],
    sourceFiles: ['GTM Strategy- MedVirtual.xlsx (internal framing)', 'Prior strategy notes'],
    status: 'Conflicting — do not use in external advertising',
    approvedPublicWording:
      'Hire dedicated full-time virtual staff who become part of your practice’s team',
    needsConfirmation: false,
    notes:
      'Current CMO advertising standard: staff join the client’s team. Internal managed-service wording must not appear in external ads.',
  },
];

export function claimsNeedingConfirmation() {
  return CLAIMS_REVIEW.filter((c) => c.needsConfirmation);
}

export function claimsBlockedForAds() {
  return CLAIMS_REVIEW.filter(
    (c) =>
      c.status === 'Conflicting — do not use in external advertising' ||
      c.status === 'Do not publish without supporting evidence' ||
      !c.approvedPublicWording,
  );
}
