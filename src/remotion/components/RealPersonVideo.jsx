import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SAFE_ZONE, publicSrc } from './constants.js';

export function RoleLowerThird({ name, role, start = 0 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_ZONE.left,
        bottom: SAFE_ZONE.bottom + 120,
        opacity: Math.min(1, Math.max(0, enter)),
        transform: `translateY(${(1 - Math.min(1, Math.max(0, enter))) * 24}px)`,
        background: 'rgba(13,84,107,0.88)',
        borderRadius: 14,
        padding: '16px 22px',
        maxWidth: 720,
        zIndex: 12,
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
      }}
    >
      <div style={{ color: '#fff', fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em' }}>{name}</div>
      <div style={{ color: COLORS.bright, fontSize: 24, fontWeight: 650, marginTop: 4 }}>{role}</div>
    </div>
  );
}

export function WorkflowBulletList({ bullets = [], start = 0, dark = false }) {
  const frame = useCurrentFrame();
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 14 }}>
      {bullets.slice(0, 3).map((b, i) => {
        const op = interpolate(frame, [start + i * 10, start + i * 10 + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <li
            key={`${b}-${i}`}
            style={{
              opacity: op,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              color: dark ? '#fff' : COLORS.ink,
              fontSize: 30,
              fontWeight: 700,
              fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
            }}
          >
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: COLORS.cyan, flexShrink: 0 }} />
            {b}
          </li>
        );
      })}
    </ul>
  );
}

export function CaptionTrack({ phrases = [], styleMode = 'subtle' }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!phrases?.length) return null;
  const usable = phrases.filter(Boolean);
  if (!usable.length) return null;
  const slot = Math.max(20, Math.floor((durationInFrames * 0.55) / usable.length));
  const idx = Math.min(usable.length - 1, Math.floor(Math.max(0, frame - 40) / slot));
  const local = Math.max(0, frame - 40 - idx * slot);
  const op = interpolate(local, [0, 8, slot - 8, slot], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const energetic = styleMode === 'energetic';
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        bottom: SAFE_ZONE.bottom + 280,
        textAlign: 'center',
        opacity: op,
        zIndex: 14,
        pointerEvents: 'none',
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: energetic ? 'rgba(7,121,153,0.92)' : 'rgba(15,23,42,0.72)',
          color: '#fff',
          fontSize: energetic ? 34 : 30,
          fontWeight: 700,
          lineHeight: 1.25,
          padding: '12px 18px',
          borderRadius: 12,
          maxWidth: 900,
        }}
      >
        {usable[idx]}
      </div>
    </div>
  );
}

export function PainHookScene({ line, lineTwo, start = 0 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - start, fps, config: { damping: 16, stiffness: 110 } });
  const b = spring({ frame: frame - start - 18, fps, config: { damping: 16, stiffness: 110 } });
  return (
    <div
      style={{
        paddingTop: SAFE_ZONE.top + 100,
        paddingLeft: SAFE_ZONE.left,
        paddingRight: SAFE_ZONE.right,
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          color: '#fff',
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.08,
          opacity: Math.min(1, Math.max(0, a)),
          transform: `translateY(${(1 - Math.min(1, Math.max(0, a))) * 30}px)`,
        }}
      >
        {line}
      </div>
      {lineTwo ? (
        <div
          style={{
            marginTop: 12,
            color: COLORS.bright,
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            opacity: Math.min(1, Math.max(0, b)),
          }}
        >
          {lineTwo}
        </div>
      ) : null}
    </div>
  );
}

export function HumanReveal({ src, name, role, start = 0 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 100 } });
  return (
    <div
      style={{
        position: 'absolute',
        right: SAFE_ZONE.right,
        bottom: SAFE_ZONE.bottom + 80,
        width: 420,
        opacity: Math.min(1, Math.max(0, enter)),
        transform: `translateY(${(1 - Math.min(1, Math.max(0, enter))) * 40}px)`,
        zIndex: 10,
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          border: '3px solid #fff',
          boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
          height: 520,
          background: '#0D546B',
        }}
      >
        <Img src={publicSrc(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {(name || role) && (
        <div style={{ marginTop: 14, color: '#fff' }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{name}</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.bright }}>{role}</div>
        </div>
      )}
    </div>
  );
}

/** Poster still or optional local/public video — never crashes on missing media */
export function RealPersonVideo({
  src,
  posterSrc,
  volume = 0,
  objectFit = 'cover',
  crop = { x: 50, y: 40, zoom: 1 },
}) {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 300], [1.04, 1], { extrapolateRight: 'clamp' });
  const zoom = Number(crop?.zoom) || 1;
  const pos = `${crop?.x ?? 50}% ${crop?.y ?? 40}%`;
  const waiting = !src;

  if (src && (src.startsWith('blob:') || src.startsWith('data:'))) {
    return (
      <AbsoluteFill style={{ transform: `scale(${scale * zoom})`, transformOrigin: pos }}>
        <video
          src={src}
          muted={volume <= 0}
          playsInline
          style={{ width: '100%', height: '100%', objectFit, objectPosition: pos }}
        />
      </AbsoluteFill>
    );
  }

  if (src) {
    return (
      <AbsoluteFill style={{ transform: `scale(${scale * zoom})`, transformOrigin: pos }}>
        <OffthreadVideo
          src={publicSrc(src)}
          volume={volume}
          style={{ width: '100%', height: '100%', objectFit, objectPosition: pos }}
          acceptableTimeShiftInSeconds={1}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ transform: `scale(${scale * zoom})`, transformOrigin: pos }}>
      <Img
        src={publicSrc(posterSrc)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos }}
      />
      {waiting ? (
        <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'flex-end', padding: 24 }}>
          <div
            style={{
              background: 'rgba(15,23,42,0.75)',
              color: '#F0F5FF',
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 14px',
              borderRadius: 10,
              fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
            }}
          >
            Awaiting approved footage
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
}
