import React from 'react';
import { Img } from 'remotion';
import { publicSrc } from './constants.js';

export const ICON_PATHS = {
  phone: 'M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.36c1.16.4 2.4.62 3.68.62A1.42 1.42 0 0 1 22 16.88V20a2 2 0 0 1-2 2C10.06 22 2 13.94 2 4a2 2 0 0 1 2-2h3.12A1.42 1.42 0 0 1 8.54 3.42c0 1.28.22 2.52.62 3.68a1.5 1.5 0 0 1-.36 1.5l-2.2 2.2Z',
  calendar: 'M7 2v3M17 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Zm3 9h3v3H8v-3Z',
  intake: 'M9 4h6M9 2h6v4H9V2ZM6 4H4v18h16V4h-2M8 11h8M8 16h8',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-5',
};

export function LineIcon({ name = 'phone', color = '#00B2E2', size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[name] || ICON_PATHS.phone} />
    </svg>
  );
}

export function HumanLayer({ src, style }) {
  return (
    <Img
      src={publicSrc(src)}
      style={{
        position: 'absolute',
        objectFit: 'contain',
        objectPosition: 'bottom center',
        ...style,
      }}
    />
  );
}

export function BenefitLayer({ label, icon, accent, style }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(255,255,255,0.96)',
        border: `2px solid ${accent}33`,
        borderRadius: 18,
        padding: '16px 20px',
        boxShadow: '0 14px 35px rgba(0,0,0,0.14)',
        ...style,
      }}
    >
      <LineIcon name={icon} color={accent} size={34} />
      <span style={{ color: '#0B1F3A', fontSize: 29, fontWeight: 800 }}>{label}</span>
    </div>
  );
}

export function PriceLayer({ text, qualifier, accent, style }) {
  return (
    <div
      style={{
        background: accent,
        color: '#071827',
        borderRadius: 20,
        padding: '16px 22px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
        ...style,
      }}
    >
      <div style={{ fontSize: 46, lineHeight: 1, fontWeight: 900 }}>{text}</div>
      {qualifier ? <div style={{ marginTop: 7, fontSize: 18, fontWeight: 750 }}>{qualifier}</div> : null}
    </div>
  );
}
