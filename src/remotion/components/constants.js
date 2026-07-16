import { staticFile } from 'remotion';

/** Meta Stories / Reels safe zones for 1080×1920 */
export const SAFE_ZONE = {
  top: 120,
  bottom: 220,
  left: 72,
  right: 72,
};

export const COLORS = {
  primary: '#077999',
  cyan: '#00B2E2',
  deep: '#0D546B',
  accent: '#00C0D4',
  bright: '#27E6FA',
  cool: '#F0F5FF',
  ink: '#161511',
  white: '#FFFFFF',
};

export const LOGO_COLORED = staticFile('assets/brand/medvirtual/logo-colored.svg');
export const LOGO_WHITE = staticFile('assets/brand/medvirtual/logo-white.svg');

/** Resolve project-public paths for Remotion Img */
export function publicSrc(src) {
  if (!src) return LOGO_COLORED;
  if (/^https?:\/\//i.test(src) || src.startsWith('blob:') || src.startsWith('data:')) return src;
  const cleaned = String(src).replace(/^\//, '');
  return staticFile(cleaned);
}

export function intensityFactor(level = 'standard') {
  if (level === 'subtle') return 0.6;
  if (level === 'energetic') return 1.35;
  return 1;
}
