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
  headline: 'Add dedicated support to your practice team.',
  support: 'Add dedicated support to your practice team.',
  bullets: ['Calls', 'Scheduling', 'Follow-ups'],
  cards: ['Calls', 'Scheduling', 'Follow-ups'],
  cta: 'Learn More',
  imageSrc: '/exports/vma-masters/MV_VMA_02_CobaltBlue_SOURCE_1x1.png',
  candidateName: 'Chelsea',
  role: 'Dental Virtual Assistant',
  animationIntensity: 'standard',
  showSafeZones: false,
};

export const ProblemPersonComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = intensityFactor(p.animationIntensity);
  const cards = (p.cards || p.bullets || []).slice(0, 3);
  const organize = interpolate(frame, [90, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const personOp = interpolate(frame, [150, 175], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const copyOp = interpolate(frame, [185, 205], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const endStart = durationInFrames - 70;

  const scatter = [
    { x: -180, y: -120, rot: -8 },
    { x: 40, y: -40, rot: 4 },
    { x: -40, y: 120, rot: 7 },
  ];
  const neat = [
    { x: 0, y: -110, rot: 0 },
    { x: 0, y: 0, rot: 0 },
    { x: 0, y: 110, rot: 0 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cool, fontFamily: '"Be Vietnam", Inter, Arial, sans-serif' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 70% 20%, rgba(0,178,226,0.22), transparent 60%), #F0F5FF',
        }}
      />
      <BrandMark top={SAFE_ZONE.top} />

      <AbsoluteFill style={{ top: SAFE_ZONE.top + 100, left: SAFE_ZONE.left, right: SAFE_ZONE.right }}>
        <div style={{ position: 'relative', height: 420, maxWidth: 520, margin: '0 auto' }}>
          {cards.map((label, i) => {
            const enter = spring({
              frame: frame - i * 12,
              fps,
              config: { damping: 14, stiffness: 100 * k },
            });
            const from = scatter[i];
            const to = neat[i];
            const x = from.x + (to.x - from.x) * organize;
            const y = from.y + (to.y - from.y) * organize;
            const rot = from.rot + (to.rot - from.rot) * organize;
            return (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 360,
                  marginLeft: -180,
                  marginTop: -40,
                  transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${0.85 + Math.min(1, Math.max(0, enter)) * 0.15})`,
                  opacity: Math.min(1, Math.max(0, enter)),
                  background: '#fff',
                  border: '1px solid rgba(7,121,153,0.2)',
                  borderRadius: 18,
                  padding: '22px 26px',
                  boxShadow: '0 12px 30px rgba(13,84,107,0.12)',
                  color: COLORS.deep,
                  fontSize: 34,
                  fontWeight: 800,
                  textAlign: 'center',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 36,
            display: 'flex',
            gap: 28,
            alignItems: 'center',
            opacity: personOp,
            transform: `translateY(${(1 - personOp) * 30}px)`,
          }}
        >
          <div
            style={{
              width: 220,
              height: 280,
              borderRadius: 22,
              overflow: 'hidden',
              border: '3px solid #fff',
              boxShadow: '0 16px 40px rgba(13,84,107,0.2)',
              flexShrink: 0,
            }}
          >
            <Img src={publicSrc(p.imageSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ opacity: copyOp, maxWidth: 560 }}>
            {(p.candidateName || p.role) && (
              <div style={{ color: COLORS.primary, fontWeight: 800, fontSize: 26, marginBottom: 10 }}>
                {[p.candidateName && `Meet ${p.candidateName}`, p.role].filter(Boolean).join(' · ')}
              </div>
            )}
            <div style={{ color: COLORS.ink, fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {p.headline}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Sequence from={endStart}>
        <EndCard cta={p.cta} startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
