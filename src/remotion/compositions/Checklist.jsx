import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BrandMark, EndCard } from '../components/EndCard.jsx';
import { SafeZoneOverlay } from '../components/SafeZoneOverlay.jsx';
import { COLORS, SAFE_ZONE, intensityFactor, publicSrc } from '../components/constants.js';

const DEFAULTS = {
  headline: 'Admin work piling up?',
  support: 'Hire a dedicated virtual teammate who works as part of your practice.',
  bullets: ['Calls and scheduling', 'Patient intake', 'Follow-up support'],
  cta: 'Book a Demo',
  imageSrc: '/exports/vma-masters/MV_VMA_03_SignalYellow_SOURCE_1x1.png',
  animationIntensity: 'standard',
  showSafeZones: false,
};

export const ChecklistComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = intensityFactor(p.animationIntensity);
  const ken = interpolate(frame, [0, durationInFrames], [1.06, 1.0], { extrapolateRight: 'clamp' });
  const title = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 120 * k } });
  const endStart = durationInFrames - 65;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cool, fontFamily: '"Be Vietnam", Inter, Arial, sans-serif' }}>
      <AbsoluteFill style={{ transform: `scale(${ken})` }}>
        <Img src={publicSrc(p.imageSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '55% 25%' }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(240,245,255,0.82) 0%, rgba(240,245,255,0.55) 38%, rgba(13,84,107,0.72) 100%)',
        }}
      />

      <BrandMark top={SAFE_ZONE.top} />

      <AbsoluteFill style={{ padding: `${SAFE_ZONE.top + 110}px ${SAFE_ZONE.left}px 0` }}>
        <div
          style={{
            color: COLORS.deep,
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            maxWidth: 900,
            opacity: Math.min(1, Math.max(0, title)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, title))) * 24}px)`,
          }}
        >
          {p.headline}
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '48px 0 0', display: 'grid', gap: 22, maxWidth: 820 }}>
          {(p.bullets || []).slice(0, 3).map((b, i) => {
            const start = 55 + i * 28;
            const appear = spring({
              frame: frame - start,
              fps,
              config: { damping: 14, stiffness: 130 * k },
            });
            const check = interpolate(frame, [start + 8, start + 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <li
                key={b}
                style={{
                  display: 'flex',
                  gap: 18,
                  alignItems: 'center',
                  opacity: Math.min(1, Math.max(0, appear)),
                  transform: `translateX(${(1 - Math.min(1, Math.max(0, appear))) * 36}px)`,
                  background: 'rgba(255,255,255,0.78)',
                  borderRadius: 16,
                  padding: '18px 22px',
                  border: '1px solid rgba(7,121,153,0.18)',
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: COLORS.cyan,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    transform: `scale(${0.7 + check * 0.3})`,
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 22, opacity: check }}>✓</span>
                </span>
                <span style={{ color: COLORS.ink, fontSize: 32, fontWeight: 700 }}>{b}</span>
              </li>
            );
          })}
        </ul>

        <div
          style={{
            marginTop: 40,
            color: COLORS.white,
            fontSize: 30,
            fontWeight: 600,
            maxWidth: 860,
            lineHeight: 1.35,
            opacity: interpolate(frame, [160, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          {p.support}
        </div>
      </AbsoluteFill>

      <Sequence from={endStart}>
        <EndCard cta={p.cta} startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
