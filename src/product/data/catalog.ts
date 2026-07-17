import type {
  BrandKit,
  CreativeContent,
  CreativeProject,
  PlacementDefinition,
  TemplateDefinition,
} from '../types';

export const PLACEMENTS: PlacementDefinition[] = [
  { id: 'meta-square', platform: 'Meta', name: 'Square feed', shortName: '1:1', width: 1080, height: 1080, family: 'square', safeInset: 0.06, maxHeadlineChars: 62, maxSupportingChars: 95 },
  { id: 'meta-portrait', platform: 'Meta', name: 'Portrait feed', shortName: '4:5', width: 1080, height: 1350, family: 'portrait', safeInset: 0.06, maxHeadlineChars: 72, maxSupportingChars: 115 },
  { id: 'meta-story', platform: 'Meta', name: 'Story / Reel', shortName: '9:16', width: 1080, height: 1920, family: 'story', safeInset: 0.09, maxHeadlineChars: 82, maxSupportingChars: 120 },
  { id: 'meta-landscape', platform: 'Meta', name: 'Landscape', shortName: '1.91:1', width: 1200, height: 628, family: 'landscape', safeInset: 0.06, maxHeadlineChars: 58, maxSupportingChars: 80 },
  { id: 'gdn-medium-rectangle', platform: 'Google Display', name: 'Medium rectangle', shortName: '300×250', width: 300, height: 250, family: 'rectangle', safeInset: 0.06, maxHeadlineChars: 42, maxSupportingChars: 56, actualSizePreview: true },
  { id: 'gdn-large-rectangle', platform: 'Google Display', name: 'Large rectangle', shortName: '336×280', width: 336, height: 280, family: 'rectangle', safeInset: 0.06, maxHeadlineChars: 46, maxSupportingChars: 62, actualSizePreview: true },
  { id: 'gdn-leaderboard', platform: 'Google Display', name: 'Leaderboard', shortName: '728×90', width: 728, height: 90, family: 'leaderboard', safeInset: 0.04, maxHeadlineChars: 36, maxSupportingChars: 0, actualSizePreview: true },
  { id: 'gdn-half-page', platform: 'Google Display', name: 'Half page', shortName: '300×600', width: 300, height: 600, family: 'half-page', safeInset: 0.06, maxHeadlineChars: 54, maxSupportingChars: 82, actualSizePreview: true },
  { id: 'gdn-mobile-banner', platform: 'Google Display', name: 'Mobile banner', shortName: '320×50', width: 320, height: 50, family: 'mobile-banner', safeInset: 0.04, maxHeadlineChars: 26, maxSupportingChars: 0, actualSizePreview: true },
];

const allPlacements = PLACEMENTS.map((placement) => placement.id);
const socialPlacements = PLACEMENTS.filter((placement) => placement.platform === 'Meta').map((placement) => placement.id);

const baseContent: CreativeContent = {
  eyebrow: 'A smarter way to move',
  headline: 'One strong idea. Built for every placement.',
  supportingText: 'Keep the message, brand, and composition consistent while every format adapts.',
  offer: 'Free creative audit',
  cta: 'Get started',
  disclaimer: 'Terms and eligibility may apply.',
  highlight: 'every placement',
};

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'signal-split',
    name: 'Signal Split',
    category: 'Bold headline',
    description: 'Editorial type and a strong image frame for high-contrast campaign concepts.',
    tags: ['Versatile', 'Image-led', 'Social + display'],
    supportedPlacementIds: allPlacements,
    motionPresets: ['none', 'reveal', 'stagger', 'slow-zoom'],
    defaultContent: baseContent,
    thumbnailVariant: 'split',
  },
  {
    id: 'offer-pulse',
    name: 'Offer Pulse',
    category: 'Offer-led',
    description: 'Puts the promotion and CTA first without losing brand recognition.',
    tags: ['Direct response', 'Offer', 'Conversion'],
    supportedPlacementIds: allPlacements,
    motionPresets: ['none', 'offer-pop', 'stagger'],
    defaultContent: {
      ...baseContent,
      eyebrow: 'This week only',
      headline: 'A better offer deserves a clearer ad.',
      offer: 'Save 25% today',
      cta: 'Claim offer',
      highlight: 'clearer ad',
    },
    thumbnailVariant: 'offer',
  },
  {
    id: 'proof-stack',
    name: 'Proof Stack',
    category: 'Proof',
    description: 'A bold statistic or result paired with a concise supporting claim.',
    tags: ['Statistic', 'Trust', 'B2B'],
    supportedPlacementIds: allPlacements,
    motionPresets: ['none', 'reveal', 'offer-pop'],
    defaultContent: {
      ...baseContent,
      eyebrow: 'Built for production teams',
      headline: '9 formats. One controlled creative system.',
      supportingText: 'Less resizing busywork. More time for the idea that drives the campaign.',
      offer: '9',
      cta: 'See the system',
      highlight: 'One controlled',
    },
    thumbnailVariant: 'proof',
  },
  {
    id: 'trusted-frame',
    name: 'Trusted Frame',
    category: 'Trust and compliance',
    description: 'Professional, legible composition with deliberate disclaimer behavior.',
    tags: ['Healthcare', 'Legal', 'Finance'],
    supportedPlacementIds: allPlacements,
    motionPresets: ['none', 'reveal', 'slow-zoom'],
    defaultContent: {
      ...baseContent,
      eyebrow: 'Clear guidance. Real people.',
      headline: 'Professional help, without the usual friction.',
      supportingText: 'A calm, credible system for services where trust matters first.',
      offer: 'Speak with a specialist',
      cta: 'Learn more',
      highlight: 'without the usual friction',
    },
    thumbnailVariant: 'frame',
  },
  {
    id: 'problem-shift',
    name: 'Problem Shift',
    category: 'Problem / solution',
    description: 'Frames the pain quickly, then gives the CTA and image room to resolve it.',
    tags: ['Hook-led', 'Services', 'Acquisition'],
    supportedPlacementIds: socialPlacements.concat(['gdn-medium-rectangle', 'gdn-large-rectangle', 'gdn-half-page']),
    motionPresets: ['none', 'stagger', 'slow-zoom'],
    defaultContent: {
      ...baseContent,
      eyebrow: 'Still rebuilding every ad?',
      headline: 'Stop letting formats break the concept.',
      supportingText: 'Control the system once, then adapt it without starting over.',
      offer: 'Build the family',
      cta: 'Try it now',
      highlight: 'break the concept',
    },
    thumbnailVariant: 'type',
  },
  {
    id: 'minimal-display',
    name: 'Minimal Display',
    category: 'Display',
    description: 'Purpose-built display layout that removes nonessential copy in extreme banners.',
    tags: ['Google Display', 'Minimal', 'Fast scan'],
    supportedPlacementIds: allPlacements,
    motionPresets: ['none', 'reveal', 'offer-pop'],
    defaultContent: {
      ...baseContent,
      eyebrow: 'Ad Studio OS',
      headline: 'One creative. Every placement.',
      supportingText: 'Controlled campaign production for performance teams.',
      offer: 'Build faster',
      cta: 'Start now',
      disclaimer: '',
      highlight: 'Every placement',
    },
    thumbnailVariant: 'minimal',
  },
];

export const DEFAULT_BRAND: BrandKit = {
  id: 'brand-ad-studio',
  name: 'Ad Studio OS',
  primary: '#08111f',
  secondary: '#00b8d9',
  accent: '#c7f464',
  background: '#f3f5f7',
  text: '#08111f',
  headingFont: 'Arial Black, Arial, sans-serif',
  bodyFont: 'Arial, sans-serif',
  defaultCta: 'Start now',
  defaultDisclaimer: 'Terms and eligibility may apply.',
  imageStyleNotes: 'High-contrast, human, uncluttered, with clear subject separation.',
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createProject(templateId = TEMPLATES[0].id, brandKitId = DEFAULT_BRAND.id): CreativeProject {
  const now = new Date().toISOString();
  const template = TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[0];
  const variantId = createId('variant');
  return {
    schemaVersion: 2,
    id: createId('project'),
    name: 'Untitled creative family',
    brandKitId,
    campaign: 'New campaign',
    concept: template.name,
    angle: template.category,
    audience: 'Prospecting',
    offer: template.defaultContent.offer,
    language: 'EN',
    funnelStage: 'Conversion',
    templateId: template.id,
    variants: [{
      id: variantId,
      name: 'Primary',
      content: { ...template.defaultContent },
      language: 'EN',
      version: 1,
      colorMode: 'brand',
      motionPreset: 'none',
      motionDuration: 4,
    }],
    activeVariantId: variantId,
    selectedPlacementIds: [...template.supportedPlacementIds],
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}

export function createDemoProject(): CreativeProject {
  const project = createProject('signal-split', DEFAULT_BRAND.id);
  const now = new Date().toISOString();
  return {
    ...project,
    id: 'demo-performance-family',
    name: 'Performance launch family',
    campaign: 'Q3 Creative System',
    concept: 'One creative, every placement',
    angle: 'Production efficiency',
    audience: 'Performance marketing teams',
    offer: 'Free beta',
    status: 'review',
    createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    updatedAt: now,
  };
}

export function getPlacement(id: string): PlacementDefinition {
  return PLACEMENTS.find((placement) => placement.id === id) ?? PLACEMENTS[0];
}

export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATES.find((template) => template.id === id) ?? TEMPLATES[0];
}
