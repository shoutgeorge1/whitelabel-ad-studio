import React from 'react';
import { Composition } from 'remotion';
import { LayeredAdComposition } from './compositions/LayeredAd.jsx';
import { MOTION_DEFAULTS } from './data/motionDefaults.js';

const byId = Object.fromEntries(MOTION_DEFAULTS.map((m) => [m.compositionId, m]));

function propsFrom(id) {
  const m = byId[id] || {};
  return { ...m, showSafeZones: false };
}

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MV-TYPE-ON-01"
        component={LayeredAdComposition}
        durationInFrames={byId['MV-TYPE-ON-01']?.durationInFrames || 300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propsFrom('MV-TYPE-ON-01')}
      />
      <Composition
        id="MV-SLIDE-BUILD-01"
        component={LayeredAdComposition}
        durationInFrames={byId['MV-SLIDE-BUILD-01']?.durationInFrames || 330}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propsFrom('MV-SLIDE-BUILD-01')}
      />
    </>
  );
};
