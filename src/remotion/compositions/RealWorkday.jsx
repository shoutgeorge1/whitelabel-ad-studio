import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandMark, EndCard } from '../components/EndCard.jsx';
import { SafeZoneOverlay } from '../components/SafeZoneOverlay.jsx';
import { HumanReveal, RealPersonVideo, WorkflowBulletList } from '../components/RealPersonVideo.jsx';
import { COLORS, SAFE_ZONE } from '../components/constants.js';

const DEFAULTS = {
  headline: 'Your front desk does not need another app.',
  headlineTwo: 'It may need another person.',
  support: 'Add dedicated virtual staff to your practice team.',
  bullets: ['Scheduling', 'Patient communication', 'Admin support'],
  cta: 'Meet Available Talent',
  candidateName: 'Chelsea',
  role: 'Dental Virtual Assistant',
  posterSrc: '/assets/real-people/chelsea/vertical-reference-1080x1920.jpg',
  videoSrc: null,
  showSafeZones: false,
  volume: 0,
  crop: { x: 55, y: 35, zoom: 1.08 },
};

export const RealWorkdayComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const hookOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const endStart = durationInFrames - 65;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cool, fontFamily: '"Be Vietnam", Inter, Arial, sans-serif' }}>
      <RealPersonVideo src={p.videoSrc} posterSrc={p.posterSrc} volume={p.volume} crop={p.crop} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(240,245,255,0.88) 0%, rgba(240,245,255,0.35) 42%, rgba(13,84,107,0.78) 100%)',
        }}
      />
      <BrandMark top={SAFE_ZONE.top} />
      <div style={{ position: 'absolute', left: SAFE_ZONE.left, right: '38%', top: SAFE_ZONE.top + 120, opacity: hookOp }}>
        <div style={{ color: COLORS.deep, fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12 }}>
          {p.headline}
        </div>
        <div style={{ marginTop: 12, color: COLORS.primary, fontSize: 36, fontWeight: 750, lineHeight: 1.2 }}>
          {p.headlineTwo}
        </div>
        <div style={{ marginTop: 36 }}>
          <WorkflowBulletList bullets={p.bullets} start={70} />
        </div>
        <div
          style={{
            marginTop: 28,
            color: COLORS.ink,
            fontSize: 28,
            fontWeight: 600,
            opacity: interpolate(frame, [140, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          {p.support}
        </div>
      </div>
      <HumanReveal src={p.posterSrc} name={p.candidateName} role={p.role} start={150} />
      <Sequence from={endStart}>
        <EndCard cta={p.cta} startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
