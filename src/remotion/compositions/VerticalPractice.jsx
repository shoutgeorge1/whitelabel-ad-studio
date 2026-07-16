import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandMark, EndCard } from '../components/EndCard.jsx';
import { SafeZoneOverlay } from '../components/SafeZoneOverlay.jsx';
import { RealPersonVideo, WorkflowBulletList } from '../components/RealPersonVideo.jsx';
import { COLORS, SAFE_ZONE } from '../components/constants.js';

const DEFAULTS = {
  eyebrow: 'FOR DENTAL PRACTICES',
  headline: 'Scheduling taking over the front desk?',
  support: 'Add a dedicated Dental Admin who works as part of your practice.',
  bullets: ['Appointment scheduling', 'Patient follow-up', 'Insurance verification'],
  cta: 'Request an Interview',
  candidateName: 'Chelsea',
  role: 'Dental Virtual Assistant',
  posterSrc: '/assets/real-people/chelsea/vertical-reference-1080x1920.jpg',
  videoSrc: null,
  showSafeZones: false,
  volume: 0,
  crop: { x: 58, y: 32, zoom: 1.06 },
};

export const VerticalPracticeComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const endStart = durationInFrames - 70;
  const copyOp = interpolate(frame, [8, 24], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cool, fontFamily: '"Be Vietnam", Inter, Arial, sans-serif' }}>
      <RealPersonVideo src={p.videoSrc} posterSrc={p.posterSrc} volume={p.volume} crop={p.crop} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(240,245,255,0.94) 0%, rgba(240,245,255,0.72) 48%, rgba(240,245,255,0.2) 78%, transparent 100%)',
        }}
      />
      <BrandMark top={SAFE_ZONE.top} />
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.left,
          top: SAFE_ZONE.top + 130,
          maxWidth: 620,
          opacity: copyOp,
        }}
      >
        <div
          style={{
            color: COLORS.primary,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: 14,
          }}
        >
          {p.eyebrow}
        </div>
        <div style={{ color: COLORS.deep, fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {p.headline}
        </div>
        {(p.candidateName || p.role) && (
          <div style={{ marginTop: 18, color: COLORS.primary, fontSize: 26, fontWeight: 750 }}>
            {[p.candidateName && `Meet ${p.candidateName}`, p.role].filter(Boolean).join(' · ')}
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          <WorkflowBulletList bullets={p.bullets} start={55} />
        </div>
        <div
          style={{
            marginTop: 28,
            color: COLORS.ink,
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.3,
            opacity: interpolate(frame, [120, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          {p.support}
        </div>
      </div>
      <Sequence from={endStart}>
        <EndCard cta={p.cta} startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
