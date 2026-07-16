import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, LOGO_COLORED, LOGO_WHITE, SAFE_ZONE } from './constants.js';

export function EndCard({
  cta = 'Book a Demo',
  logoVariant = 'colored',
  dark = false,
  startFrame = 0,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);
  const enter = spring({ frame: local, fps, config: { damping: 18, stiffness: 120 } });
  const opacity = interpolate(local, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const logo = logoVariant === 'white' || dark ? LOGO_WHITE : LOGO_COLORED;

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        bottom: SAFE_ZONE.bottom + 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 28,
        opacity,
        transform: `translateY(${(1 - enter) * 28}px)`,
        zIndex: 20,
      }}
    >
      <Img src={logo} style={{ width: 280, height: 'auto' }} />
      <div
        style={{
          background: dark ? COLORS.bright : COLORS.accent,
          color: dark ? COLORS.deep : COLORS.white,
          fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: '0.04em',
          padding: '18px 28px',
          borderRadius: 14,
        }}
      >
        {cta}
      </div>
    </div>
  );
}

export function BrandMark({ dark = false, top = SAFE_ZONE.top }) {
  return (
    <Img
      src={dark ? LOGO_WHITE : LOGO_COLORED}
      style={{
        position: 'absolute',
        top,
        left: SAFE_ZONE.left,
        width: 240,
        zIndex: 15,
      }}
    />
  );
}
