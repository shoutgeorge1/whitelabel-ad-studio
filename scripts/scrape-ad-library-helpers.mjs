/**
 * Helpers shared by Competitor Wall live refresh.
 * Used when saving Meta Ad Library extracts into public/assets/competitors/live-snapshots.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LIVE_DIR = path.join(__dirname, '..', 'public', 'assets', 'competitors', 'live');
export const LIVE_JSON = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'competitors',
  'live-snapshots.json',
);

export function loadLiveSnapshots() {
  if (!fs.existsSync(LIVE_JSON)) {
    return { updatedAt: null, sources: {} };
  }
  return JSON.parse(fs.readFileSync(LIVE_JSON, 'utf8'));
}

export function saveLiveSnapshots(data) {
  fs.mkdirSync(path.dirname(LIVE_JSON), { recursive: true });
  fs.mkdirSync(LIVE_DIR, { recursive: true });
  fs.writeFileSync(LIVE_JSON, JSON.stringify(data, null, 2) + '\n');
}

/** Normalize a scraped ad block into Wall fields */
export function normalizeAd(raw, competitorId, index, imagePath) {
  const primary =
    raw.primary ||
    raw.primaryText ||
    (Array.isArray(raw.lines)
      ? raw.lines.find(
          (l) =>
            l &&
            !/^Library ID/i.test(l) &&
            !/^Started running/i.test(l) &&
            !/^Platforms$/i.test(l) &&
            !/^See ad details$/i.test(l) &&
            !/^Open Dropdown/i.test(l) &&
            !/^Sponsored$/i.test(l) &&
            l.length > 20,
        )
      : '') ||
    '';
  return {
    libraryId: String(raw.id || raw.libraryId || ''),
    started: raw.started || raw.startedRunning || null,
    platforms: raw.platforms || [],
    primaryText: String(primary || '').trim(),
    headline: String(raw.headline || '').trim(),
    description: String(raw.description || '').trim(),
    cta: String(raw.cta || '').trim(),
    image: imagePath || null,
    advertiser: raw.advertiser || null,
    index,
  };
}
