/** Auto-generated from scripts/vma-motion-data.mjs — do not edit by hand */
export const MOTION_DEFAULTS = [
  {
    "compositionId": "MV-TYPE-ON-01",
    "name": "Type-on Hook",
    "template": "type-on",
    "durationInFrames": 300,
    "fps": 30,
    "width": 1080,
    "height": 1920,
    "conceptId": "VMA-LAYERED-01",
    "status": "Draft",
    "animationIntensity": "standard",
    "showSafeZones": false,
    "muted": true,
    "headline": "Stop missing patient calls.",
    "headlineTwo": "Hire a Virtual Medical Admin.",
    "support": "Dedicated staff who join your team.",
    "bullets": [
      "Answer calls",
      "Book patients",
      "Handle intake"
    ],
    "icons": [
      "phone",
      "calendar",
      "intake"
    ],
    "cta": "Book a Demo",
    "cards": [
      "Answer calls",
      "Book patients",
      "Handle intake"
    ],
    "humanSrc": "/assets/video-elements/people/admin-cobalt.png",
    "background": "#0B1F3A",
    "accent": "#00E5FF",
    "role": "Virtual Medical Admin",
    "audience": "Busy medical practices",
    "theme": "cobalt-cyan",
    "lane": "type-on-hook",
    "internalNotes": "Approved technique: type-on hook. Every visible item is a separate layer.",
    "elements": [
      {
        "id": "type-human",
        "type": "human",
        "label": "Human PNG",
        "value": "/assets/video-elements/people/admin-cobalt.png",
        "status": "Ready"
      },
      {
        "id": "type-headline",
        "type": "headline",
        "label": "Headline",
        "value": "Stop missing patient calls.",
        "status": "Ready"
      },
      {
        "id": "type-benefits",
        "type": "benefits",
        "label": "Benefits + icons",
        "value": "Answer calls · Book patients · Handle intake",
        "status": "Ready"
      },
      {
        "id": "type-cta",
        "type": "cta",
        "label": "CTA",
        "value": "Book a Demo",
        "status": "Ready"
      }
    ]
  },
  {
    "compositionId": "MV-SLIDE-BUILD-01",
    "name": "Slide Build",
    "template": "slide-build",
    "durationInFrames": 330,
    "fps": 30,
    "width": 1080,
    "height": 1920,
    "conceptId": "VMA-LAYERED-02",
    "status": "Draft",
    "animationIntensity": "standard",
    "showSafeZones": false,
    "muted": true,
    "headline": "Your front desk is drowning.",
    "headlineTwo": "Hire a virtual medical admin.",
    "support": "Dedicated full-time staff who answer every call, book patients, and verify insurance — as part of your team.",
    "bullets": [
      "Answer patient calls",
      "Book appointments",
      "Verify insurance"
    ],
    "icons": [
      "phone",
      "calendar",
      "shield"
    ],
    "cta": "Book a Demo",
    "cards": [
      "Answer patient calls",
      "Book appointments",
      "Verify insurance"
    ],
    "humanSrc": "/assets/video-elements/people/admin-cobalt.png",
    "background": "#0B1F3A",
    "accent": "#00E5FF",
    "role": "Virtual Medical Admin",
    "audience": "Overloaded front desks",
    "theme": "cobalt-cyan",
    "lane": "slide-build",
    "internalNotes": "Approved technique: human, headline and benefit cards slide independently. Problem → solution message.",
    "elements": [
      {
        "id": "slide-human",
        "type": "human",
        "label": "Human PNG",
        "value": "/assets/video-elements/people/admin-cobalt.png",
        "status": "Ready"
      },
      {
        "id": "slide-headline",
        "type": "headline",
        "label": "Headline",
        "value": "Your front desk is drowning → hire a virtual medical admin.",
        "status": "Ready"
      },
      {
        "id": "slide-benefits",
        "type": "benefits",
        "label": "Benefits + icons",
        "value": "Answer patient calls · Book appointments · Verify insurance",
        "status": "Ready"
      },
      {
        "id": "slide-cta",
        "type": "cta",
        "label": "CTA",
        "value": "Book a Demo",
        "status": "Ready"
      }
    ]
  }
];

export const STATIC_BATCH = [];

export const STORAGE_KEYS = {
  "motionBatch": "mv_vma_motion_batch_v2",
  "promote": "mv_vma_motion_promote_v1",
  "feedback": "mv_creative_feedback_v1"
};

export const STATUSES = [
  "Draft",
  "In Review",
  "Approved",
  "Needs Revision"
];
