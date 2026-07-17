import type { BrandKit, CreativeProject, CreativeVariant, PlacementDefinition, TemplateDefinition } from '../types';

type RenderInput = {
  project: CreativeProject;
  brand: BrandKit;
  template: TemplateDefinition;
  variant: CreativeVariant;
  placement: PlacementDefinition;
  showSafeArea?: boolean;
};

type Box = { x: number; y: number; width: number; height: number };

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character] ?? character);
}

function attr(value: string): string {
  return esc(value);
}

function wrap(value: string, maxChars: number, maxLines: number): string[] {
  if (!value.trim() || maxChars <= 0 || maxLines <= 0) return [];
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || current.length === 0) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && current) lines.push(current);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,;:!?]?$/, '')}…`;
  }
  return lines;
}

function textBlock(
  lines: string[],
  x: number,
  y: number,
  fontSize: number,
  lineHeight: number,
  fill: string,
  family: string,
  weight: number,
  anchor: 'start' | 'middle' | 'end' = 'start',
  className = '',
): string {
  if (lines.length === 0) return '';
  return `<text class="${className}" x="${x}" y="${y}" fill="${fill}" font-family="${attr(family)}" font-size="${fontSize}" font-weight="${weight}" text-anchor="${anchor}">${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`)
    .join('')}</text>`;
}

function highlightedTextBlock(
  lines: string[],
  highlight: string,
  x: number,
  y: number,
  fontSize: number,
  lineHeight: number,
  fill: string,
  highlightFill: string,
  family: string,
): string {
  const phrase = highlight.trim();
  return lines.map((line, index) => {
    const start = phrase ? line.toLowerCase().indexOf(phrase.toLowerCase()) : -1;
    const lineY = y + index * lineHeight;
    if (start < 0) {
      return `<text class="motion-headline" x="${x}" y="${lineY}" fill="${fill}" font-family="${attr(family)}" font-size="${fontSize}" font-weight="900">${esc(line)}</text>`;
    }
    const before = line.slice(0, start);
    const match = line.slice(start, start + phrase.length);
    const after = line.slice(start + phrase.length);
    return `<text class="motion-headline" x="${x}" y="${lineY}" fill="${fill}" font-family="${attr(family)}" font-size="${fontSize}" font-weight="900"><tspan>${esc(before)}</tspan><tspan fill="${highlightFill}">${esc(match)}</tspan><tspan>${esc(after)}</tspan></text>`;
  }).join('');
}

function imageMarkup(variant: CreativeVariant, box: Box, id: string, brandTint: string): string {
  const image = variant.image;
  if (!image) return '';
  const base = Math.max(box.width / image.width, box.height / image.height) * image.zoom;
  const drawWidth = image.width * base;
  const drawHeight = image.height * base;
  const overflowX = Math.max(0, drawWidth - box.width);
  const overflowY = Math.max(0, drawHeight - box.height);
  const x = box.x - overflowX * (image.focalX / 100);
  const y = box.y - overflowY * (image.focalY / 100);
  return `<defs><clipPath id="${id}"><rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}"/></clipPath></defs><g clip-path="url(#${id})"><image class="motion-image" href="${attr(image.dataUrl)}" x="${x}" y="${y}" width="${drawWidth}" height="${drawHeight}" preserveAspectRatio="none"/><rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="${image.tint ? brandTint : '#000'}" opacity="${image.overlay}"/></g>`;
}

function palette(variant: CreativeVariant, brand: BrandKit) {
  if (variant.colorMode === 'inverse') {
    return { background: brand.primary, surface: brand.secondary, text: '#ffffff', accent: brand.accent };
  }
  if (variant.colorMode === 'accent') {
    return { background: brand.accent, surface: brand.primary, text: brand.primary, accent: brand.secondary };
  }
  return { background: brand.background, surface: brand.primary, text: brand.text, accent: brand.accent };
}

function logo(brand: BrandKit, x: number, y: number, maxWidth: number, color: string, compact = false): string {
  if (brand.logoDataUrl) {
    return `<image class="motion-logo" href="${attr(brand.logoDataUrl)}" x="${x}" y="${y}" width="${maxWidth}" height="${compact ? 18 : 34}" preserveAspectRatio="xMinYMid meet"/>`;
  }
  return `<text class="motion-logo" x="${x}" y="${y + (compact ? 13 : 22)}" fill="${color}" font-family="${attr(brand.headingFont)}" font-size="${compact ? 12 : 20}" font-weight="800">${esc(brand.name)}</text>`;
}

function renderCompact(input: RenderInput): string {
  const { brand, variant, placement } = input;
  const { content } = variant;
  const colors = palette(variant, brand);
  const w = placement.width;
  const h = placement.height;
  const pad = Math.max(8, h * 0.13);
  const logoWidth = Math.min(w * 0.2, 120);
  const ctaWidth = Math.min(w * 0.22, 132);
  const headlineX = pad + logoWidth;
  const headlineWidth = w - headlineX - ctaWidth - pad * 2;
  const fontSize = Math.max(13, Math.min(24, h * 0.28, headlineWidth / Math.max(10, content.headline.length * 0.48)));
  const headline = wrap(content.headline, placement.maxHeadlineChars, 1);
  return `
    <rect width="${w}" height="${h}" fill="${colors.background}"/>
    <rect x="${w - ctaWidth - pad}" y="${pad}" width="${ctaWidth}" height="${h - pad * 2}" rx="${Math.min(10, h * 0.14)}" fill="${colors.accent}"/>
    ${logo(brand, pad, (h - 18) / 2, logoWidth - pad, colors.text, true)}
    ${textBlock(headline, headlineX, h / 2 + fontSize * 0.34, fontSize, fontSize, colors.text, brand.headingFont, 800, 'start', 'motion-headline')}
    <text class="motion-cta" x="${w - ctaWidth / 2 - pad}" y="${h / 2 + 4}" fill="${brand.primary}" font-family="${attr(brand.bodyFont)}" font-size="${Math.max(10, Math.min(15, h * 0.22))}" font-weight="800" text-anchor="middle">${esc(content.cta)}</text>
  `;
}

function renderStandard(input: RenderInput): string {
  const { brand, template, variant, placement } = input;
  const { content } = variant;
  const colors = palette(variant, brand);
  const w = placement.width;
  const h = placement.height;
  const isWide = placement.family === 'landscape' || placement.family === 'leaderboard';
  const isTall = placement.family === 'story' || placement.family === 'portrait' || placement.family === 'half-page';
  const isDisplay = placement.platform === 'Google Display';
  const pad = Math.round(Math.min(w, h) * (isDisplay ? 0.065 : 0.075));
  const hasImage = Boolean(variant.image);
  const imageFirst = ['split', 'frame', 'type'].includes(template.thumbnailVariant);
  let imageBox: Box;
  let copyBox: Box;

  if (isWide) {
    const imageWidth = hasImage && imageFirst ? w * 0.44 : 0;
    imageBox = { x: 0, y: 0, width: imageWidth, height: h };
    copyBox = { x: imageWidth, y: 0, width: w - imageWidth, height: h };
  } else if (isTall && hasImage) {
    const imageHeight = template.thumbnailVariant === 'frame' ? h * 0.48 : h * 0.42;
    imageBox = { x: 0, y: 0, width: w, height: imageHeight };
    copyBox = { x: 0, y: imageHeight, width: w, height: h - imageHeight };
  } else if (hasImage) {
    const imageHeight = h * 0.42;
    imageBox = { x: 0, y: 0, width: w, height: imageHeight };
    copyBox = { x: 0, y: imageHeight, width: w, height: h - imageHeight };
  } else {
    imageBox = { x: 0, y: 0, width: 0, height: 0 };
    copyBox = { x: 0, y: 0, width: w, height: h };
  }

  const innerWidth = copyBox.width - pad * 2;
  const compactDisplay = placement.family === 'rectangle';
  const headlineMaxLines = isWide ? 2 : isTall ? 4 : 3;
  const headlineSize = Math.round(Math.max(
    isDisplay ? 21 : 34,
    Math.min(
      isDisplay ? 42 : 82,
      innerWidth / (compactDisplay ? 8 : 10),
      copyBox.height / (headlineMaxLines + (isDisplay ? 4.4 : 3.5)),
    ),
  ));
  const maxCharsPerLine = Math.max(12, Math.floor(innerWidth / (headlineSize * 0.56)));
  const headlineLines = wrap(content.headline, maxCharsPerLine, headlineMaxLines);
  const supportingSize = Math.max(12, Math.round(headlineSize * 0.38));
  const eyebrowSize = Math.max(10, Math.round(headlineSize * 0.28));
  const startX = copyBox.x + pad;
  let cursorY = copyBox.y + pad + eyebrowSize;
  const copyColor = hasImage && copyBox.y === 0 && variant.colorMode === 'brand' ? colors.text : colors.text;
  const showSupporting = placement.maxSupportingChars > 0 && !compactDisplay;
  const showDisclaimer = !['leaderboard', 'mobile-banner'].includes(placement.family) && content.disclaimer.trim();
  const disclaimerSize = Math.max(8, supportingSize * 0.55);
  const disclaimerLines = showDisclaimer
    ? wrap(content.disclaimer, Math.max(24, Math.floor(innerWidth / (disclaimerSize * 0.54))), isTall ? 2 : 1)
    : [];

  const graphic = template.thumbnailVariant === 'proof'
    ? `<circle cx="${w * 0.82}" cy="${h * 0.18}" r="${Math.min(w, h) * 0.16}" fill="${colors.accent}"/><text class="motion-offer" x="${w * 0.82}" y="${h * 0.2}" fill="${brand.primary}" font-family="${attr(brand.headingFont)}" font-size="${Math.min(w, h) * 0.13}" font-weight="900" text-anchor="middle">${esc(content.offer)}</text>`
    : template.thumbnailVariant === 'offer'
      ? `<rect class="motion-offer" x="${w - pad - Math.min(w * 0.34, 220)}" y="${pad}" width="${Math.min(w * 0.34, 220)}" height="${Math.max(44, headlineSize * 1.2)}" rx="${Math.max(10, headlineSize * 0.25)}" fill="${colors.accent}"/><text x="${w - pad - Math.min(w * 0.17, 110)}" y="${pad + Math.max(29, headlineSize * 0.74)}" fill="${brand.primary}" font-family="${attr(brand.headingFont)}" font-size="${Math.max(14, headlineSize * 0.42)}" font-weight="900" text-anchor="middle">${esc(content.offer)}</text>`
      : `<circle cx="${w * 0.92}" cy="${h * 0.08}" r="${Math.min(w, h) * 0.22}" fill="${colors.accent}" opacity=".7"/><path d="M0 ${h * 0.92} C ${w * 0.25} ${h * 0.78}, ${w * 0.55} ${h * 1.08}, ${w} ${h * 0.82} L ${w} ${h} L 0 ${h} Z" fill="${brand.secondary}" opacity=".16"/>`;

  let body = `<rect width="${w}" height="${h}" fill="${colors.background}"/>${graphic}`;
  if (hasImage) body += imageMarkup(variant, imageBox, `clip-${placement.id}`, brand.primary);
  if (hasImage && imageBox.height > 0) body += `<rect x="${copyBox.x}" y="${copyBox.y}" width="${copyBox.width}" height="${copyBox.height}" fill="${colors.background}"/>`;
  body += logo(brand, startX, cursorY - eyebrowSize, innerWidth * 0.45, copyColor, isDisplay);
  cursorY += isDisplay ? eyebrowSize * 1.9 : eyebrowSize * 2.4;
  body += textBlock([content.eyebrow.toUpperCase()], startX, cursorY, eyebrowSize, eyebrowSize, brand.secondary, brand.bodyFont, 800, 'start', 'motion-eyebrow');
  cursorY += headlineSize * 0.85;
  body += highlightedTextBlock(headlineLines, content.highlight, startX, cursorY, headlineSize, headlineSize * 1.02, copyColor, brand.secondary, brand.headingFont);
  cursorY += headlineLines.length * headlineSize * 1.02 + supportingSize * 0.9;
  if (showSupporting) {
    const supportLines = wrap(content.supportingText, Math.max(18, Math.floor(innerWidth / (supportingSize * 0.54))), isTall ? 3 : 2);
    body += textBlock(supportLines, startX, cursorY, supportingSize, supportingSize * 1.25, copyColor, brand.bodyFont, 500, 'start', 'motion-support');
  }
  const buttonHeight = Math.max(isDisplay ? 30 : 50, headlineSize * 0.78);
  const buttonWidth = Math.min(innerWidth * 0.58, Math.max(isDisplay ? 88 : 150, content.cta.length * buttonHeight * 0.28 + buttonHeight));
  const disclaimerReserve = disclaimerLines.length ? disclaimerLines.length * disclaimerSize * 1.2 + 8 : 0;
  const buttonY = copyBox.y + copyBox.height - pad - buttonHeight - disclaimerReserve;
  body += `<rect class="motion-cta" x="${startX}" y="${buttonY}" width="${buttonWidth}" height="${buttonHeight}" rx="${buttonHeight / 2}" fill="${colors.accent}"/><text class="motion-cta" x="${startX + buttonWidth / 2}" y="${buttonY + buttonHeight * 0.63}" fill="${brand.primary}" font-family="${attr(brand.bodyFont)}" font-size="${Math.max(11, buttonHeight * 0.3)}" font-weight="800" text-anchor="middle">${esc(content.cta)}</text>`;
  if (disclaimerLines.length) {
    body += textBlock(disclaimerLines, startX, copyBox.y + copyBox.height - pad * 0.45 - (disclaimerLines.length - 1) * disclaimerSize * 1.15, disclaimerSize, disclaimerSize * 1.15, copyColor, brand.bodyFont, 400);
  }
  return body;
}

export function renderCreativeSvg(input: RenderInput): string {
  const { placement, variant, showSafeArea } = input;
  const compact = placement.family === 'mobile-banner' || placement.family === 'leaderboard';
  const content = compact ? renderCompact(input) : renderStandard(input);
  const safe = showSafeArea
    ? `<rect x="${placement.width * placement.safeInset}" y="${placement.height * placement.safeInset}" width="${placement.width * (1 - placement.safeInset * 2)}" height="${placement.height * (1 - placement.safeInset * 2)}" fill="none" stroke="#ff5d5d" stroke-width="${Math.max(1, placement.width / 500)}" stroke-dasharray="${Math.max(3, placement.width / 200)}" opacity=".9"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${placement.width}" height="${placement.height}" viewBox="0 0 ${placement.width} ${placement.height}">
    ${content}${safe}
    <metadata>${esc(JSON.stringify({ placement: placement.id, variant: variant.id, template: input.template.id }))}</metadata>
  </svg>`;
}

export function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function svgToBlob(svg: string, type: 'image/png' | 'image/jpeg', quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas rendering is unavailable.'));
        return;
      }
      if (type === 'image/jpeg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('The browser could not create the export.'));
      }, type, quality);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('The creative could not be rendered.'));
    };
    image.src = url;
  });
}
