import JSZip from 'jszip';
import { getPlacement, getTemplate } from '../data/catalog';
import type { BrandKit, CreativeProject, CreativeVariant, ExportFormat } from '../types';
import { buildCreativeFilename, buildManifest, manifestToCsv } from './creative';
import { renderCreativeSvg, svgToBlob } from './render';

function download(blob: Blob, filename: string) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportPlacement(
  project: CreativeProject,
  brand: BrandKit,
  variant: CreativeVariant,
  placementId: string,
  format: ExportFormat,
): Promise<{ filename: string; bytes: number }> {
  const placement = getPlacement(placementId);
  const template = getTemplate(project.templateId);
  const svg = renderCreativeSvg({ project, brand, template, variant, placement });
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const blob = await svgToBlob(svg, mime);
  const filename = buildCreativeFilename(project, brand, variant, placement, extension);
  download(blob, filename);
  return { filename, bytes: blob.size };
}

export async function exportFamily(
  project: CreativeProject,
  brand: BrandKit,
  variant: CreativeVariant,
  placementIds: string[],
  format: ExportFormat,
  onProgress: (message: string) => void,
): Promise<{ filename: string; files: number; bytes: number }> {
  if (placementIds.length === 0) throw new Error('Select at least one placement.');
  const zip = new JSZip();
  const template = getTemplate(project.templateId);
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const manifest = buildManifest(project, brand, variant, placementIds, extension);

  for (const [index, placementId] of placementIds.entries()) {
    const placement = getPlacement(placementId);
    onProgress(`Rendering ${index + 1} of ${placementIds.length}: ${placement.name}`);
    const svg = renderCreativeSvg({ project, brand, template, variant, placement });
    const blob = await svgToBlob(svg, mime);
    const filename = buildCreativeFilename(project, brand, variant, placement, extension);
    zip.file(`creative/${filename}`, blob);
  }

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file('launch-sheet.csv', manifestToCsv(manifest));
  zip.file(
    'README.txt',
    [
      `${project.name} — production package`,
      `Brand: ${brand.name}`,
      `Campaign: ${project.campaign}`,
      `Concept: ${project.concept}`,
      `Variant: ${variant.name} (V${String(variant.version).padStart(2, '0')})`,
      '',
      'creative/ contains exact-size placement assets.',
      'manifest.json contains structured production metadata.',
      'launch-sheet.csv is ready for media-buyer handoff.',
    ].join('\n'),
  );

  onProgress('Compressing production package');
  const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const filename = `${project.name.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'creative_family'}_V${String(variant.version).padStart(2, '0')}.zip`;
  download(archive, filename);
  return { filename, files: placementIds.length, bytes: archive.size };
}
