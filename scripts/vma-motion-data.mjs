/**
 * VMA Motion Concept Lab defaults.
 *
 * Videos are assembled from independent layers. Never animate a flattened
 * approved static. The only retained techniques are Type-on Hook + Slide Build.
 */

export const MOTION_STATUSES = ['Draft', 'In Review', 'Approved', 'Needs Revision'];

export const MOTION_STORAGE_KEYS = {
  motionBatch: 'mv_vma_motion_batch_v2',
  promote: 'mv_vma_motion_promote_v1',
  feedback: 'mv_creative_feedback_v1',
};

const layer = (id, type, label, value, status = 'Ready') => ({ id, type, label, value, status });

/** Two approved motion techniques, each with a self-contained layer manifest. */
export function buildVmaMotionDefaults() {
  return [
    {
      compositionId: 'MV-TYPE-ON-01',
      name: 'Type-on Hook',
      template: 'type-on',
      durationInFrames: 300,
      fps: 30,
      width: 1080,
      height: 1920,
      conceptId: 'VMA-LAYERED-01',
      status: 'Draft',
      animationIntensity: 'standard',
      showSafeZones: false,
      muted: true,
      headline: 'Stop missing patient calls.',
      headlineTwo: 'Hire a Virtual Medical Admin.',
      support: 'Dedicated staff who join your team.',
      bullets: ['Answer calls', 'Book patients', 'Handle intake'],
      icons: ['phone', 'calendar', 'intake'],
      cta: 'Book a Demo',
      cards: ['Answer calls', 'Book patients', 'Handle intake'],
      humanSrc: '/assets/video-elements/people/admin-cobalt.png',
      background: '#0B1F3A',
      accent: '#00E5FF',
      role: 'Virtual Medical Admin',
      audience: 'Busy medical practices',
      theme: 'cobalt-cyan',
      lane: 'type-on-hook',
      internalNotes: 'Approved technique: type-on hook. Every visible item is a separate layer.',
      elements: [
        layer('type-human', 'human', 'Human PNG', '/assets/video-elements/people/admin-cobalt.png'),
        layer('type-headline', 'headline', 'Headline', 'Stop missing patient calls.'),
        layer('type-benefits', 'benefits', 'Benefits + icons', 'Answer calls · Book patients · Handle intake'),
        layer('type-cta', 'cta', 'CTA', 'Book a Demo'),
      ],
    },
    {
      compositionId: 'MV-SLIDE-BUILD-01',
      name: 'Slide Build',
      template: 'slide-build',
      durationInFrames: 330,
      fps: 30,
      width: 1080,
      height: 1920,
      conceptId: 'VMA-LAYERED-02',
      status: 'Draft',
      animationIntensity: 'standard',
      showSafeZones: false,
      muted: true,
      headline: 'Your front desk is drowning.',
      headlineTwo: 'Hire a virtual medical admin.',
      support: 'Dedicated full-time staff who answer every call, book patients, and verify insurance — as part of your team.',
      bullets: ['Answer patient calls', 'Book appointments', 'Verify insurance'],
      icons: ['phone', 'calendar', 'shield'],
      cta: 'Book a Demo',
      cards: ['Answer patient calls', 'Book appointments', 'Verify insurance'],
      humanSrc: '/assets/video-elements/people/admin-cobalt.png',
      background: '#0B1F3A',
      accent: '#00E5FF',
      role: 'Virtual Medical Admin',
      audience: 'Overloaded front desks',
      theme: 'cobalt-cyan',
      lane: 'slide-build',
      internalNotes: 'Approved technique: human, headline and benefit cards slide independently. Problem → solution message.',
      elements: [
        layer('slide-human', 'human', 'Human PNG', '/assets/video-elements/people/admin-cobalt.png'),
        layer('slide-headline', 'headline', 'Headline', 'Your front desk is drowning → hire a virtual medical admin.'),
        layer('slide-benefits', 'benefits', 'Benefits + icons', 'Answer patient calls · Book appointments · Verify insurance'),
        layer('slide-cta', 'cta', 'CTA', 'Book a Demo'),
      ],
    },
  ];
}
