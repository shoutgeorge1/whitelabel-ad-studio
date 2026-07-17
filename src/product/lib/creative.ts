import { getPlacement, getTemplate } from '../data/catalog';
import type {
  BrandKit,
  CreativeProject,
  CreativeVariant,
  CreativeWarning,
  ExportManifest,
  ExportManifestItem,
  PlacementDefinition,
} from '../types';

export function safeToken(value: string, fallback = 'UNTITLED'): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' AND ')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .toUpperCase();
  return normalized || fallback;
}

export function buildCreativeFilename(
  project: CreativeProject,
  brand: BrandKit,
  variant: CreativeVariant,
  placement: PlacementDefinition,
  extension: 'png' | 'jpg',
): string {
  return [
    safeToken(brand.name, 'BRAND'),
    safeToken(placement.platform, 'PLATFORM'),
    safeToken(project.concept, 'CONCEPT'),
    safeToken(project.angle, 'ANGLE'),
    safeToken(variant.language, 'EN'),
    safeToken(placement.shortName.replace('×', 'X'), 'FORMAT'),
    `V${String(variant.version).padStart(2, '0')}`,
  ].join('_') + `.${extension}`;
}

export function getCreativeWarnings(
  variant: CreativeVariant,
  placement: PlacementDefinition,
): CreativeWarning[] {
  const warnings: CreativeWarning[] = [];
  const { content, image } = variant;
  if (content.headline.length > placement.maxHeadlineChars) {
    warnings.push({
      field: 'headline',
      level: 'warning',
      message: `Headline is ${content.headline.length - placement.maxHeadlineChars} characters over the ${placement.shortName} guidance.`,
    });
  } else if (content.headline.length > placement.maxHeadlineChars * 0.82) {
    warnings.push({ field: 'headline', level: 'info', message: `Headline is near the ${placement.shortName} limit.` });
  }
  if (placement.maxSupportingChars === 0 && content.supportingText.trim()) {
    warnings.push({ field: 'supportingText', level: 'info', message: 'Supporting copy is intentionally hidden in this compact banner.' });
  } else if (content.supportingText.length > placement.maxSupportingChars) {
    warnings.push({ field: 'supportingText', level: 'warning', message: `Supporting copy is too long for ${placement.shortName}.` });
  }
  if ((placement.family === 'mobile-banner' || placement.family === 'leaderboard') && content.disclaimer.trim()) {
    warnings.push({ field: 'disclaimer', level: 'info', message: 'Disclaimer is omitted from this extreme banner format.' });
  } else {
    const disclaimerLimit = placement.family === 'rectangle' ? 68 : placement.family === 'landscape' ? 90 : 130;
    if (content.disclaimer.length > disclaimerLimit) {
      warnings.push({ field: 'disclaimer', level: 'warning', message: `Disclaimer is too long for ${placement.shortName}; use a shorter approved version.` });
    }
  }
  if (!content.cta.trim()) {
    warnings.push({ field: 'cta', level: 'warning', message: 'Add a CTA before export.' });
  }
  if (content.highlight.trim() && !content.headline.toLowerCase().includes(content.highlight.trim().toLowerCase())) {
    warnings.push({ field: 'headline', level: 'info', message: 'The highlighted phrase is not present in the headline.' });
  }
  if (!image) {
    warnings.push({ field: 'image', level: 'info', message: 'No image selected; the template will use its graphic background system.' });
  } else {
    const requiredScale = Math.max(placement.width / image.width, placement.height / image.height);
    if (requiredScale > 1.2) {
      warnings.push({ field: 'resolution', level: 'warning', message: 'Image may be soft at this output size.' });
    }
  }
  return warnings;
}

export function buildManifest(
  project: CreativeProject,
  brand: BrandKit,
  variant: CreativeVariant,
  placementIds: string[],
  extension: 'png' | 'jpg',
): ExportManifest {
  const template = getTemplate(project.templateId);
  const items: ExportManifestItem[] = placementIds.map((placementId) => {
    const placement = getPlacement(placementId);
    return {
      filename: buildCreativeFilename(project, brand, variant, placement, extension),
      placementId,
      platform: placement.platform,
      width: placement.width,
      height: placement.height,
      variant: variant.name,
      version: variant.version,
      warnings: getCreativeWarnings(variant, placement).map((warning) => warning.message),
    };
  });
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    project: {
      id: project.id,
      name: project.name,
      campaign: project.campaign,
      concept: project.concept,
      angle: project.angle,
      audience: project.audience,
      offer: project.offer,
      language: project.language,
      funnelStage: project.funnelStage,
      status: project.status,
    },
    brand: { id: brand.id, name: brand.name },
    template: { id: template.id, name: template.name },
    items,
  };
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function manifestToCsv(manifest: ExportManifest): string {
  const header = ['filename', 'platform', 'placement', 'width', 'height', 'campaign', 'concept', 'angle', 'audience', 'offer', 'language', 'funnel_stage', 'variant', 'version', 'status', 'warnings'];
  const rows = manifest.items.map((item) => [
    item.filename,
    item.platform,
    item.placementId,
    item.width,
    item.height,
    manifest.project.campaign,
    manifest.project.concept,
    manifest.project.angle,
    manifest.project.audience,
    manifest.project.offer,
    manifest.project.language,
    manifest.project.funnelStage,
    item.variant,
    item.version,
    manifest.project.status,
    item.warnings.join(' | '),
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
}

export function duplicateVariant(source: CreativeVariant): CreativeVariant {
  return {
    ...structuredClone(source),
    id: `variant-${crypto.randomUUID()}`,
    name: `${source.name} copy`,
    version: source.version + 1,
  };
}
