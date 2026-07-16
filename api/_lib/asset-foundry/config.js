/**
 * MedVirtual AI Asset Foundry — shared server config.
 * Secrets only via environment variables — never client-exposed.
 */

export const COST_TABLE_USD = {
  low: 0.005,
  medium: 0.041,
  high: 0.165,
};

/**
 * Friendly labels → sizes typed by the installed OpenAI Images SDK
 * (1024x1024 | 1024x1536 | 1536x1024). Do not accept arbitrary client sizes.
 */
export const SIZE_PRESETS = {
  square: { id: 'square', label: 'Square', width: 1024, height: 1024, size: '1024x1024', aspect: '1:1' },
  portrait: { id: 'portrait', label: 'Portrait', width: 1024, height: 1536, size: '1024x1536', aspect: '2:3' },
  vertical: { id: 'vertical', label: 'Vertical', width: 1024, height: 1536, size: '1024x1536', aspect: '2:3' },
  landscape: { id: 'landscape', label: 'Landscape', width: 1536, height: 1024, size: '1536x1024', aspect: '3:2' },
  // aliases used by older UI / presets
  '1:1': { id: '1:1', label: 'Square', width: 1024, height: 1024, size: '1024x1024', aspect: '1:1' },
  '4:5': { id: '4:5', label: 'Portrait', width: 1024, height: 1536, size: '1024x1536', aspect: '2:3' },
  '9:16': { id: '9:16', label: 'Vertical', width: 1024, height: 1536, size: '1024x1536', aspect: '2:3' },
};

export const QUALITY_MODES = {
  draft: { id: 'draft', openai: 'low', label: 'Draft', note: 'Low-cost composition exploration' },
  review: { id: 'review', openai: 'medium', label: 'Review', note: 'Default for four-image batches' },
};

export const LANES = [
  'raw-parts',
  'real-va-workplace',
  'healthcare-operations',
  'saas-props',
  'vertical-specific',
  'real-talent-reference',
];

/** Rotating kit used when lane = raw-parts (four sequential images). */
export const RAW_PART_ROTATION = [
  {
    concept: 'Face / headshot cutout',
    sceneType: 'Isolated portrait cutout',
    subjectPosition: 'center',
    copySpace: 'wide-negative-space',
    cameraTreatment: 'Eye-level editorial',
    lighting: 'Soft studio daylight',
    realism: 'Premium commercial',
    additionalDirection:
      'Tight head-and-shoulders of a credible female virtual medical administrator, clean solid or soft gradient background, sharp face detail, natural skin texture, usable as a cutout plate. No text.',
  },
  {
    concept: 'Person / talent plate',
    sceneType: 'Desk-based work scene',
    subjectPosition: 'right',
    copySpace: 'left',
    cameraTreatment: 'Natural documentary',
    lighting: 'Natural window light',
    realism: 'Natural',
    additionalDirection:
      'Upper-body or mid shot of a professional virtual medical admin at a clean desk with laptop, open left side for copy compositing later. Scrubs in lime, cobalt, cyan, yellow, or navy — never pink.',
  },
  {
    concept: 'Icon / symbol pack',
    sceneType: 'Dimensional prop',
    subjectPosition: 'no-person',
    copySpace: 'wide-negative-space',
    cameraTreatment: 'Isolated object photography',
    lighting: 'Clean high-key',
    realism: 'Dimensional 3D',
    additionalDirection:
      'Isolated premium icon set on a clean uniform background: phone, calendar, insurance shield, checkmark. No readable words. High contrast, easy to extract for designers.',
  },
  {
    concept: 'Callout / badge / text chip',
    sceneType: 'Graphic element plate',
    subjectPosition: 'no-person',
    copySpace: 'wide-negative-space',
    cameraTreatment: 'Isolated object photography',
    lighting: 'Clean high-key',
    realism: 'Dimensional 3D',
    additionalDirection:
      'Raw graphic design element plate: price/offer badge shapes, benefit chips, or bold callout ribbons with simple placeholder graphic lettering designers can rebuild. Colors: lime, yellow, cobalt, cyan, navy, black, white. Never pink. Not a finished Meta ad.',
  },
];

export const VERTICALS = ['general-medical', 'dental', 'veterinary', 'behavioral-health', 'billing-rcm', 'none'];

export const STATUSES = [
  'Generated',
  'Pending Review',
  'George Liked',
  'Revision Requested',
  'Approved',
  'Saved to Project',
  'Rejected',
  'Archived',
  'Deleted',
];

export const REVIEWERS = ['George', 'Graphics Team'];

export const LIKE_TAGS = [
  'Believable',
  'Natural person',
  'Strong copy space',
  'Premium',
  'Good lighting',
  'Good composition',
  'Correct workplace',
  'Strong prop',
  'Strong vertical relevance',
  'Feels like MedVirtual',
  'Fresh direction',
  'Easy to build an ad around',
];

export const MISS_TAGS = [
  'Looks fake',
  'Too generic',
  'Too stock-like',
  'Too posed',
  'Too glossy',
  'Too cheap-looking',
  'Wrong person',
  'Wrong workplace',
  'Bad hands',
  'Bad face',
  'No copy space',
  'Too busy',
  'Too blue',
  'Too much cyan',
  'Fake dashboard',
  'Recruitment feel',
  'Call-center feel',
  'Wrong vertical',
  'Weak concept',
  'Unusable crop',
  'Text artifacts',
  'Privacy concern',
  'Below our standard',
];

export const PREFERENCE_ATTRIBUTES = [
  'natural-lighting',
  'studio-lighting',
  'subject-left',
  'subject-right',
  'centered-subject',
  'wide-copy-space',
  'tight-crop',
  'workplace-scene',
  'editorial-portrait',
  'dimensional-prop',
  'glass-effect',
  'warm-neutral',
  'light-cyan',
  'deep-teal',
  'documentary-realism',
  'premium-commercial',
  'human-led',
  'prop-led',
  'minimal-composition',
  'vertical-specificity',
  'abstract-metaphor',
  'home-office',
  'professional-office',
  'natural-smile',
  'focused-expression',
];

export function isLocalDevEnvironment() {
  if (String(process.env.ASSET_FOUNDRY_FORCE_PROD_AUTH || '') === 'true') return false;
  if (process.env.VERCEL_ENV === 'production') return false;
  return process.env.NODE_ENV !== 'production';
}

export function getConfig() {
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  const dailyLimit = Number(process.env.ASSET_FOUNDRY_DAILY_IMAGE_LIMIT || 20);
  const defaultQuality = process.env.ASSET_FOUNDRY_DEFAULT_QUALITY || 'medium';
  const localDev = isLocalDevEnvironment();

  return {
    model,
    maxBatch: 4,
    dailyLimit: Math.max(0, dailyLimit),
    defaultQuality: ['low', 'medium'].includes(defaultQuality) ? defaultQuality : 'medium',
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasPassword: Boolean(process.env.ASSET_FOUNDRY_PASSWORD),
    hasSessionSecret: Boolean(process.env.ASSET_FOUNDRY_SESSION_SECRET) || localDev,
    localDev,
  };
}

export function estimateCostUsd(qualityKey, count = 1) {
  const q = QUALITY_MODES[qualityKey]?.openai || qualityKey;
  const unit = COST_TABLE_USD[q] ?? COST_TABLE_USD.medium;
  return Math.round(unit * count * 1000) / 1000;
}

export function estimateBatchCostUsd(qualityKey, count = 4) {
  return estimateCostUsd(qualityKey, count);
}
