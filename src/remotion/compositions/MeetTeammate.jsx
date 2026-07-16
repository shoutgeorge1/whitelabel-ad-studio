import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandMark, EndCard } from '../components/EndCard.jsx';
import { SafeZoneOverlay } from '../components/SafeZoneOverlay.jsx';
import {
  CaptionTrack,
  RealPersonVideo,
  RoleLowerThird,
  WorkflowBulletList,
} from '../components/RealPersonVideo.jsx';
import { COLORS, SAFE_ZONE } from '../components/constants.js';

const DEFAULTS = {
  candidateName: 'Jessica',
  role: 'Jr. Medical Admin',
  spokenLine: 'Hi, I’m Jessica. I support medical practices with customer service, healthcare support, and admin coordination.',
  bullets: ['Customer service', 'Healthcare support', 'Admin coordination'],
  cta: 'Request an Interview',
  posterSrc: '/assets/real-people/jessica/vertical-reference-1080x1920.jpg',
  videoSrc: null,
  captionPhrases: [],
  captionStyle: 'subtle',
  showCaptions: true,
  showSafeZones: false,
  volume: 0,
  crop: { x: 50, y: 28, zoom: 1.05 },
};

export const MeetTeammateComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const phrases =
    p.captionPhrases?.length > 0
      ? p.captionPhrases
      : String(p.spokenLine || '')
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
  const bulletsOp = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const endStart = durationInFrames - 70;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deep, fontFamily: '"Be Vietnam", Inter, Arial, sans-serif' }}>
      <RealPersonVideo src={p.videoSrc} posterSrc={p.posterSrc} volume={p.volume} crop={p.crop} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(13,84,107,0.35) 0%, rgba(13,84,107,0.15) 40%, rgba(6,30,40,0.72) 100%)',
        }}
      />
      <BrandMark dark top={SAFE_ZONE.top} />
      <RoleLowerThird name={p.candidateName} role={p.role} start={36} />
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.left,
          right: SAFE_ZONE.right,
          top: SAFE_ZONE.top + 220,
          opacity: bulletsOp,
        }}
      >
        <WorkflowBulletList bullets={p.bullets} start={100} dark />
      </div>
      {p.showCaptions ? <CaptionTrack phrases={phrases} styleMode={p.captionStyle} /> : null}
      <Sequence from={endStart}>
        <EndCard cta={p.cta} dark logoVariant="white" startFrame={0} />
      </Sequence>
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
