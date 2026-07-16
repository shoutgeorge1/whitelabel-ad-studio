import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SAFE_ZONE } from './constants.js';

export function SafeZoneOverlay({ visible }) {
  if (!visible) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${SAFE_ZONE.top}px solid rgba(39,230,250,0.12)`,
          borderBottomWidth: SAFE_ZONE.bottom,
          borderLeftWidth: SAFE_ZONE.left,
          borderRightWidth: SAFE_ZONE.right,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: SAFE_ZONE.top,
          left: SAFE_ZONE.left,
          right: SAFE_ZONE.right,
          bottom: SAFE_ZONE.bottom,
          border: '1px dashed rgba(39,230,250,0.55)',
        }}
      />
    </AbsoluteFill>
  );
}
