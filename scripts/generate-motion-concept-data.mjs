/**
 * Sync Remotion default props from VMA motion data.
 * Run: node scripts/generate-motion-concept-data.mjs
 * (also called by generate:motion-lab)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildVmaMotionDefaults,
  MOTION_STATUSES,
  MOTION_STORAGE_KEYS,
} from './vma-motion-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'remotion', 'data', 'motionDefaults.js');
const JSON_OUT = path.join(ROOT, 'public', 'assets', 'concept-lab', 'motion-defaults.json');

const motion = buildVmaMotionDefaults();

const js = `/** Auto-generated from scripts/vma-motion-data.mjs — do not edit by hand */
export const MOTION_DEFAULTS = ${JSON.stringify(motion, null, 2)};

export const STATIC_BATCH = [];

export const STORAGE_KEYS = ${JSON.stringify(MOTION_STORAGE_KEYS, null, 2)};

export const STATUSES = ${JSON.stringify(MOTION_STATUSES, null, 2)};
`;

fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
fs.writeFileSync(OUT, js);
fs.writeFileSync(
  JSON_OUT,
  JSON.stringify({ motion, storageKeys: MOTION_STORAGE_KEYS, statuses: MOTION_STATUSES }, null, 2),
);
console.log('VMA motion defaults written');
