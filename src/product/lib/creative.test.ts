import { describe, expect, it } from 'vitest';
import { createProject, DEFAULT_BRAND, getPlacement, getTemplate } from '../data/catalog';
import { buildCreativeFilename, buildManifest, getCreativeWarnings, manifestToCsv, safeToken } from './creative';
import { renderCreativeSvg } from './render';
import { duplicateProject } from './storage';

describe('creative naming', () => {
  it('creates readable filesystem-safe tokens', () => {
    expect(safeToken('Müller & Sons / Q3')).toBe('MULLER_AND_SONS_Q3');
  });

  it('includes brand, platform, concept, language, format, and version', () => {
    const project = createProject();
    project.concept = 'Problem / Solution';
    const variant = project.variants[0];
    variant.version = 3;
    const name = buildCreativeFilename(project, DEFAULT_BRAND, variant, getPlacement('gdn-medium-rectangle'), 'png');
    expect(name).toBe('AD_STUDIO_OS_GOOGLE_DISPLAY_PROBLEM_SOLUTION_BOLD_HEADLINE_EN_300X250_V03.png');
  });
});

describe('placement constraints', () => {
  it('warns when banner copy is too long and explains simplification', () => {
    const project = createProject();
    const variant = project.variants[0];
    variant.content.headline = 'A deliberately oversized headline that cannot fit into a mobile banner safely';
    const warnings = getCreativeWarnings(variant, getPlacement('gdn-mobile-banner'));
    expect(warnings.some((warning) => warning.field === 'headline' && warning.level === 'warning')).toBe(true);
    expect(warnings.some((warning) => warning.field === 'supportingText' && warning.message.includes('hidden'))).toBe(true);
    expect(warnings.some((warning) => warning.field === 'disclaimer' && warning.message.includes('omitted'))).toBe(true);
  });

  it('renders extreme banners without supporting copy or disclaimers', () => {
    const project = createProject();
    const variant = project.variants[0];
    const placement = getPlacement('gdn-mobile-banner');
    const svg = renderCreativeSvg({
      project,
      brand: DEFAULT_BRAND,
      template: getTemplate(project.templateId),
      variant,
      placement,
    });
    expect(svg).toContain('width="320" height="50"');
    expect(svg).toContain('One strong idea. Built for…');
    expect(svg).not.toContain(variant.content.supportingText);
    expect(svg).not.toContain(variant.content.disclaimer);
  });
});

describe('handoff manifests', () => {
  it('produces structured JSON and CSV rows for selected placements', () => {
    const project = createProject();
    const variant = project.variants[0];
    const ids = ['meta-square', 'gdn-leaderboard'];
    const manifest = buildManifest(project, DEFAULT_BRAND, variant, ids, 'png');
    const csv = manifestToCsv(manifest);
    expect(manifest.items).toHaveLength(2);
    expect(manifest.items[1]).toMatchObject({ placementId: 'gdn-leaderboard', width: 728, height: 90 });
    expect(csv.split('\n')).toHaveLength(3);
    expect(csv).toContain('funnel_stage');
  });
});

describe('project duplication', () => {
  it('creates independent project and variant identities', () => {
    const project = createProject();
    const copy = duplicateProject(project);
    expect(copy.id).not.toBe(project.id);
    expect(copy.variants[0].id).not.toBe(project.variants[0].id);
    expect(copy.status).toBe('draft');
    copy.variants[0].content.headline = 'Changed';
    expect(project.variants[0].content.headline).not.toBe('Changed');
  });
});
