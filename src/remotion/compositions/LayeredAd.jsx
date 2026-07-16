import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandMark, EndCard } from '../components/EndCard.jsx';
import { BenefitLayer, HumanLayer } from '../components/VideoElements.jsx';
import { SafeZoneOverlay } from '../components/SafeZoneOverlay.jsx';
import { SAFE_ZONE, intensityFactor } from '../components/constants.js';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

const DEFAULTS = {
  template: 'type-on',
  headline: 'Stop missing patient calls.',
  headlineTwo: 'Hire a Virtual Medical Admin.',
  support: 'Dedicated staff who join your team.',
  bullets: ['Answer calls', 'Book patients', 'Handle intake'],
  icons: ['phone', 'calendar', 'intake'],
  cta: 'Book a Demo',
  humanSrc: '/assets/video-elements/people/admin-cobalt.png',
  background: '#0B1F3A',
  accent: '#00E5FF',
  animationIntensity: 'standard',
  showSafeZones: false,
};

function TypeOnProject({ p, frame, fps, durationInFrames }) {
  const k = intensityFactor(p.animationIntensity);
  const typeProgress = interpolate(frame, [8, 78 / k], [0, 1], clamp);
  const reveal = `${Math.round(typeProgress * 100)}%`;
  const human = spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 95 * k } });
  const support = interpolate(frame, [104, 126], [0, 1], clamp);
  const endStart = durationInFrames - 70;

  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(145deg, ${p.background}, #061526)` }} />
      <div style={{ position: 'absolute', top: 260, left: SAFE_ZONE.left, width: 700 }}>
        <div style={{ color: '#7CE0FF', fontSize: 28, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Virtual Medical Admin
        </div>
        <div style={{ marginTop: 18, position: 'relative', overflow: 'hidden', width: reveal }}>
          <div style={{ width: 700, color: '#fff', fontSize: 76, fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.02 }}>
            {p.headline}
          </div>
        </div>
        <div style={{ width: 5, height: 78, background: p.accent, marginTop: -80, marginLeft: `calc(${reveal} - 2px)`, opacity: frame % 16 < 9 ? 1 : 0 }} />
        <div style={{ marginTop: 32, color: p.accent, fontSize: 43, fontWeight: 850, lineHeight: 1.08, opacity: support }}>
          {p.headlineTwo}
        </div>
        <div style={{ marginTop: 24, color: '#d8e7ef', fontSize: 29, fontWeight: 650, opacity: support }}>{p.support}</div>
      </div>

      <HumanLayer
        src={p.humanSrc}
        style={{
          width: 690,
          height: 920,
          right: -65,
          bottom: 145,
          opacity: Math.min(1, Math.max(0, human)),
          transform: `translateX(${(1 - Math.min(1, Math.max(0, human))) * 170}px)`,
        }}
      />

      <AbsoluteFill style={{ top: 1160, left: SAFE_ZONE.left, right: SAFE_ZONE.right }}>
        {(p.bullets || []).slice(0, 3).map((label, index) => {
          const enter = spring({ frame: frame - 118 - index * 13, fps, config: { damping: 17, stiffness: 105 * k } });
          return (
            <BenefitLayer
              key={label}
              label={label}
              icon={(p.icons || [])[index]}
              accent={p.accent}
              style={{
                width: 430,
                marginBottom: 14,
                opacity: Math.min(1, Math.max(0, enter)),
                transform: `translateX(${(1 - Math.min(1, Math.max(0, enter))) * -80}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {frame >= endStart ? <EndCard cta={p.cta} dark logoVariant="white" startFrame={endStart} /> : null}
    </>
  );
}

function SlideBuildProject({ p, frame, fps, durationInFrames }) {
  const k = intensityFactor(p.animationIntensity);
  const headline = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 105 * k } });
  const human = spring({ frame: frame - 34, fps, config: { damping: 17, stiffness: 92 * k } });
  const endStart = durationInFrames - 70;

  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(160deg, ${p.background} 0%, #071b2d 100%)` }} />
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.left,
          top: 250,
          width: 690,
          color: '#fff',
          fontSize: 78,
          fontWeight: 900,
          letterSpacing: '-0.045em',
          lineHeight: 1.02,
          opacity: Math.min(1, Math.max(0, headline)),
          transform: `translateX(${(1 - Math.min(1, Math.max(0, headline))) * -180}px)`,
        }}
      >
        {p.headline}
        <div style={{ color: p.accent }}>{p.headlineTwo}</div>
      </div>

      <HumanLayer
        src={p.humanSrc}
        style={{
          width: 720,
          height: 1040,
          right: -105,
          bottom: 50,
          opacity: Math.min(1, Math.max(0, human)),
          transform: `translateX(${(1 - Math.min(1, Math.max(0, human))) * 250}px)`,
        }}
      />

      <div style={{ position: 'absolute', top: 560, left: SAFE_ZONE.left, width: 540 }}>
        <div style={{ marginBottom: 24, color: '#d8e7ef', fontSize: 30, fontWeight: 700, lineHeight: 1.25, maxWidth: 520 }}>
          {p.support}
        </div>
        {(p.bullets || []).slice(0, 3).map((label, index) => {
          const enter = spring({ frame: frame - 68 - index * 19, fps, config: { damping: 15, stiffness: 120 * k } });
          return (
            <BenefitLayer
              key={label}
              label={label}
              icon={(p.icons || [])[index]}
              accent={p.accent}
              style={{
                marginBottom: 18,
                opacity: Math.min(1, Math.max(0, enter)),
                transform: `translateX(${(1 - Math.min(1, Math.max(0, enter))) * -130}px)`,
              }}
            />
          );
        })}
      </div>

      {frame >= endStart ? <EndCard cta={p.cta} dark logoVariant="white" startFrame={endStart} /> : null}
    </>
  );
}

export const LayeredAdComposition = (props) => {
  const p = { ...DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: '"Be Vietnam", Inter, Arial, sans-serif', overflow: 'hidden' }}>
      {p.template === 'slide-build' ? (
        <SlideBuildProject p={p} frame={frame} fps={fps} durationInFrames={durationInFrames} />
      ) : (
        <TypeOnProject p={p} frame={frame} fps={fps} durationInFrames={durationInFrames} />
      )}
      <BrandMark dark top={SAFE_ZONE.top} />
      <SafeZoneOverlay visible={p.showSafeZones} />
    </AbsoluteFill>
  );
};
