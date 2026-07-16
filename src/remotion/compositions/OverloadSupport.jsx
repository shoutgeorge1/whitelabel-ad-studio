import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandMark, EndCard } from '../components/EndCard.jsx';
import { SafeZoneOverlay } from '../components/SafeZoneOverlay.jsx';
import { HumanReveal, PainHookScene } from '../components/RealPersonVideo.jsx';
import { COLORS, SAFE_ZONE } from '../components/constants.js';

const DEFAULTS = {
  headline: 'Too many calls.',
  headlineTwo: 'Not enough day.',
  support: 'Meet dedicated virtual staff who work as part of your practice.',
  cards: ['Calls', 'Scheduling', 'Follow-ups'],
  cta: 'Request an Interview',
  candidateName: 'Carmen',
  role: 'Medical Biller',
  posterSrc: '/assets/real-people/carmen/vertical-reference-1080x1920.jpg',
  showSafeZones: false,
};

export const OverloadSupportComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const cards = (p.cards || p.bullets || []).slice(0, 3);
  const organize = interpolate(frame, [70, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const supportOp = interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const endStart = durationInFrames - 70;
  const scatter = [
    { x: -160, y: -90, rot: -7 },
    { x: 30, y: -20, rot: 4 },
    { x: -20, y: 100, rot: 6 },
  ];
  const neat = [
    { x: 0, y: -90, rot: 0 },
    { x: 0, y: 0, rot: 0 },
    { x: 0, y: 90, rot: 0 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #0D546B 0%, #083948 55%, #061e28 100%)',
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
      }}
    >
      <BrandMark dark top={SAFE_ZONE.top} />
      <PainHookScene line={p.headline} lineTwo={p.headlineTwo} start={0} />
      <div style={{ position: 'absolute', left: SAFE_ZONE.left, top: 520, width: 420, height: 360 }}>
        {cards.map((label, i) => {
          const enter = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 14, stiffness: 110 } });
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
                left: 40,
                top: 120,
                width: 320,
                padding: '18px 22px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: COLORS.bright,
                fontSize: 30,
                fontWeight: 800,
                textAlign: 'center',
                opacity: Math.min(1, Math.max(0, enter)),
                transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      <HumanReveal src={p.posterSrc} name={p.candidateName} role={p.role} start={130} />
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.left,
          right: '46%',
          bottom: SAFE_ZONE.bottom + 160,
          color: '#e2e8f0',
          fontSize: 30,
          fontWeight: 650,
          lineHeight: 1.3,
          opacity: supportOp,
        }}
      >
        {p.support}
      </div>
      <Sequence from={endStart}>
        <EndCard cta={p.cta} dark logoVariant="white" startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
