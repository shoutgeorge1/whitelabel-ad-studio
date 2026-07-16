import { toPng } from 'html-to-image';
import type { ExportSize } from '../types/concept';
import { EXPORT_SIZES } from './constants';

export async function exportAdToPng(
  element: HTMLElement,
  fileName: string,
  size: ExportSize
): Promise<void> {
  const { width, height } = EXPORT_SIZES[size];

  const dataUrl = await toPng(element, {
    width,
    height,
    pixelRatio: 1,
    cacheBust: true,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  });

  const link = document.createElement('a');
  link.download = `${fileName}_${size}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportAllAds(
  elements: { element: HTMLElement; fileName: string }[],
  size: ExportSize,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    const { element, fileName } = elements[i];
    await exportAdToPng(element, fileName, size);
    onProgress?.(i + 1, elements.length);
    await new Promise((r) => setTimeout(r, 300));
  }
}
