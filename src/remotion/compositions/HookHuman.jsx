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
  headline: 'Too many calls.',
  headlineTwo: 'Not enough day.',
  support: 'Add a dedicated virtual medical admin to your team.',
  bullets: ['Calls and scheduling', 'Patient intake', 'Follow-up support'],
  cta: 'Book a Demo',
  imageSrc: '/exports/vma-masters/MV_VMA_02_CobaltBlue_SOURCE_1x1.png',
  animationIntensity: 'standard',
  showSafeZones: false,
};

export const HookHumanComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = intensityFactor(p.animationIntensity);

  const hook1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 * k } });
  const hook2 = spring({
    frame: frame - Math.round(28 / k),
    fps,
    config: { damping: 16, stiffness: 110 * k },
  });
  const imgOpacity = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const imgScale = interpolate(frame, [70, 200], [1.08, 1.02], { extrapolateRight: 'clamp' });
  const supportOp = interpolate(frame, [120, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const endStart = durationInFrames - 70;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deep, fontFamily: '"Be Vietnam", Inter, Arial, sans-serif' }}>
      <AbsoluteFill
        style={{
          opacity: imgOpacity,
          transform: `scale(${imgScale})`,
        }}
      >
        <Img
          src={publicSrc(p.imageSrc)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '60% 30%' }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(13,84,107,0.75) 0%, rgba(13,84,107,0.35) 45%, rgba(6,30,40,0.78) 100%)',
          }}
        />
      </AbsoluteFill>

      <BrandMark dark top={SAFE_ZONE.top} />

      <AbsoluteFill style={{ padding: `${SAFE_ZONE.top + 90}px ${SAFE_ZONE.left}px 0` }}>
        <div
          style={{
            overflow: 'hidden',
            marginBottom: 12,
            transform: `translateY(${(1 - Math.min(1, hook1)) * 40}px)`,
            opacity: Math.min(1, hook1),
          }}
        >
          <div style={{ color: COLORS.white, fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            {p.headline}
          </div>
        </div>
        <div
          style={{
            overflow: 'hidden',
            clipPath: `inset(0 ${Math.max(0, 100 - Math.min(1, Math.max(0, hook2)) * 100)}% 0 0)`,
            opacity: Math.min(1, Math.max(0, hook2)),
          }}
        >
          <div style={{ color: COLORS.bright, fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            {p.headlineTwo}
          </div>
        </div>

        <div style={{ marginTop: 48, opacity: supportOp, maxWidth: 860 }}>
          <div style={{ color: COLORS.cool, fontSize: 34, fontWeight: 600, lineHeight: 1.3 }}>{p.support}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '28px 0 0', display: 'grid', gap: 14 }}>
            {(p.bullets || []).slice(0, 3).map((b, i) => {
              const op = interpolate(frame, [145 + i * 12, 160 + i * 12], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <li key={b} style={{ opacity: op, color: COLORS.white, fontSize: 30, fontWeight: 650, display: 'flex', gap: 14 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      marginTop: 6,
                      borderRadius: '50%',
                      background: COLORS.cyan,
                      flexShrink: 0,
                    }}
                  />
                  {b}
                </li>
              );
            })}
          </ul>
        </div>
      </AbsoluteFill>

      <Sequence from={endStart}>
        <EndCard cta={p.cta} dark logoVariant="white" startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
