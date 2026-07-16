/**
 * Sync video Remotion defaults from video-production-data.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VIDEO_FORMATS, buildVideoAssignments, videoClientPayload } from './video-production-data.mjs';
import { talentBullets, LAB_TALENT } from './concept-lab-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const jessica = LAB_TALENT.find((t) => t.id === 'jessica');
const chelsea = LAB_TALENT.find((t) => t.id === 'chelsea');
const carmen = LAB_TALENT.find((t) => t.id === 'carmen');

const VIDEO_DEFAULTS = [
  {
    compositionId: 'MV-MEET-TEAMMATE-01',
    name: 'Meet Your Next Teammate',
    durationInFrames: 360,
    candidateName: jessica?.firstName || 'Jessica',
    role: jessica?.title || 'Jr. Medical Admin',
    spokenLine:
      'Hi, I’m Jessica. I support medical practices with customer service, healthcare support, and admin coordination.',
    bullets: talentBullets('jessica'),
    cta: 'Request an Interview',
    posterSrc: jessica?.verticalPath || '/assets/real-people/jessica/vertical-reference-1080x1920.jpg',
    videoSrc: null,
    captionPhrases: [],
    captionStyle: 'subtle',
    showCaptions: true,
    volume: 0,
    crop: { x: 50, y: 28, zoom: 1.05 },
    status: 'Waiting for Footage',
  },
  {
    compositionId: 'MV-REAL-WORKDAY-01',
    name: 'A Real Person Behind the Work',
    durationInFrames: 360,
    headline: 'Your front desk does not need another app.',
    headlineTwo: 'It may need another person.',
    support: 'Add dedicated virtual staff to your practice team.',
    bullets: ['Scheduling', 'Patient communication', 'Admin support'],
    cta: 'Meet Available Talent',
    candidateName: chelsea?.firstName || 'Chelsea',
    role: chelsea?.title || 'Dental Virtual Assistant',
    posterSrc: chelsea?.verticalPath || '/assets/real-people/chelsea/vertical-reference-1080x1920.jpg',
    videoSrc: null,
    volume: 0,
    crop: { x: 55, y: 35, zoom: 1.08 },
    status: 'Waiting for Footage',
  },
  {
    compositionId: 'MV-OVERLOAD-SUPPORT-01',
    name: 'From Overload to Support',
    durationInFrames: 330,
    headline: 'Too many calls.',
    headlineTwo: 'Not enough day.',
    support: 'Meet dedicated virtual staff who work as part of your practice.',
    cards: ['Calls', 'Scheduling', 'Follow-ups'],
    cta: 'Request an Interview',
    candidateName: carmen?.firstName || 'Carmen',
    role: carmen?.title || 'Medical Biller',
    posterSrc: carmen?.verticalPath || '/assets/real-people/carmen/vertical-reference-1080x1920.jpg',
    status: 'Not Started',
  },
  {
    compositionId: 'MV-VERTICAL-PRACTICE-01',
    name: 'Built for Your Practice',
    durationInFrames: 360,
    eyebrow: 'FOR DENTAL PRACTICES',
    headline: 'Scheduling taking over the front desk?',
    support: 'Add a dedicated Dental Admin who works as part of your practice.',
    bullets: VIDEO_FORMATS[3].defaultBullets,
    cta: 'Request an Interview',
    candidateName: chelsea?.firstName || 'Chelsea',
    role: chelsea?.title || 'Dental Virtual Assistant',
    posterSrc: chelsea?.verticalPath || '/assets/real-people/chelsea/vertical-reference-1080x1920.jpg',
    videoSrc: null,
    volume: 0,
    crop: { x: 58, y: 32, zoom: 1.06 },
    status: 'Not Started',
  },
];

const outJs = path.join(ROOT, 'src', 'remotion', 'data', 'videoDefaults.js');
const outJson = path.join(ROOT, 'public', 'assets', 'concept-lab', 'video-payload.json');

fs.writeFileSync(
  outJs,
  `/** Auto-generated — do not edit by hand */
export const VIDEO_DEFAULTS = ${JSON.stringify(VIDEO_DEFAULTS, null, 2)};
`,
);

const payload = videoClientPayload();
payload.videoDefaults = VIDEO_DEFAULTS;
payload.formatsMeta = VIDEO_FORMATS;
fs.writeFileSync(outJson, JSON.stringify(payload, null, 2));

console.log('Video Remotion defaults + payload written');
console.log('Assignments:', buildVideoAssignments().length);
