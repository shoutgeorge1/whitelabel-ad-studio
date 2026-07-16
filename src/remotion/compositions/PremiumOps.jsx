import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BrandMark, EndCard } from '../components/EndCard.jsx';
import { SafeZoneOverlay } from '../components/SafeZoneOverlay.jsx';
import { COLORS, SAFE_ZONE, intensityFactor } from '../components/constants.js';

const DEFAULTS = {
  headline: 'Built like serious operations.',
  headlineTwo: 'Delivered as dedicated people.',
  support: 'Hire full-time virtual staff who join your practice team.',
  bullets: ['Scheduling', 'Billing support', 'Patient communication'],
  cta: 'Meet Available Talent',
  animationIntensity: 'subtle',
  showSafeZones: false,
};

export const PremiumOpsComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = intensityFactor(p.animationIntensity);
  const cards = (p.bullets || []).slice(0, 3);
  const line1 = spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 100 * k } });
  const line2 = spring({ frame: frame - 100, fps, config: { damping: 18, stiffness: 100 * k } });
  const supportOp = interpolate(frame, [140, 165], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const endStart = durationInFrames - 75;
  const drift = interpolate(frame, [0, durationInFrames], [0, 18], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(155deg, #0D546B 0%, #0a3d4d 45%, #061e28 100%)',
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 80% 10%, rgba(39,230,250,0.18), transparent 55%)',
        }}
      />
      <BrandMark dark top={SAFE_ZONE.top} />

      <AbsoluteFill style={{ padding: `${SAFE_ZONE.top + 100}px ${SAFE_ZONE.left}px 0` }}>
        <div style={{ display: 'grid', gap: 16, maxWidth: 880, marginBottom: 48 }}>
          {cards.map((label, i) => {
            const enter = spring({
              frame: frame - i * 14,
              fps,
              config: { damping: 16, stiffness: 90 * k },
            });
            return (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 18,
                  padding: '22px 26px',
                  backdropFilter: 'blur(10px)',
                  color: COLORS.bright,
                  fontSize: 30,
                  fontWeight: 750,
                  opacity: Math.min(1, Math.max(0, enter)),
                  transform: `translateY(${(1 - Math.min(1, Math.max(0, enter))) * 24 + drift * (i - 1) * 0.35}px)`,
                  boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        <div
          style={{
            color: COLORS.white,
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.12,
            maxWidth: 920,
            opacity: Math.min(1, Math.max(0, line1)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, line1))) * 20}px)`,
          }}
        >
          {p.headline}
        </div>
        <div
          style={{
            marginTop: 14,
            color: COLORS.bright,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: 920,
            opacity: Math.min(1, Math.max(0, line2)),
          }}
        >
          {p.headlineTwo}
        </div>
        <div
          style={{
            marginTop: 36,
            color: '#cbd5e1',
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.35,
            maxWidth: 880,
            opacity: supportOp,
          }}
        >
          {p.support}
        </div>
      </AbsoluteFill>

      <Sequence from={endStart}>
        <EndCard cta={p.cta} dark logoVariant="white" startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
