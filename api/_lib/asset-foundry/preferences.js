import { PREFERENCE_ATTRIBUTES } from './config.js';
import { preferencesPath, getJson, putJson } from './store.js';

const WEIGHTS = {
  thumbs_up: 1,
  thumbs_down: -1.2,
  more_like_this: 2,
  approve: 2.5,
  promoted: 2.2,
  reject: -2,
  privacy_delete: 0, // do not treat as aesthetic
};

function emptyReviewer() {
  return { scores: Object.fromEntries(PREFERENCE_ATTRIBUTES.map((a) => [a, { score: 0, n: 0, lastAt: null }])), pins: {} };
}

export function emptyProfile() {
  return {
    version: 1,
    updatedAt: null,
    george: emptyReviewer(),
    graphics: emptyReviewer(),
    combined: emptyReviewer(),
    evidenceNotes: 'Application-level taste profile. Does not fine-tune or retrain OpenAI models. Preference-guided prompting only.',
  };
}

export async function loadPreferences() {
  const data = await getJson(preferencesPath());
  return data || emptyProfile();
}

export async function savePreferences(profile) {
  profile.updatedAt = new Date().toISOString();
  await putJson(preferencesPath(), profile);
  return profile;
}

function reviewerKey(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('graphics')) return 'graphics';
  return 'george';
}

function applyDecay(entry, now = Date.now()) {
  if (!entry.lastAt) return entry;
  const days = (now - new Date(entry.lastAt).getTime()) / (1000 * 60 * 60 * 24);
  if (days > 45) {
    entry.score *= 0.92;
  }
  return entry;
}

/**
 * Update taste profile from a review action.
 * Honest labeling: preference-guided generation / approval-informed prompting.
 */
export async function applyFeedback({ reviewer, action, attributes = [], tags = [] }) {
  const profile = await loadPreferences();
  const key = reviewerKey(reviewer);
  const bucket = profile[key] || emptyReviewer();
  const weight = WEIGHTS[action] ?? 0;
  if (weight === 0 && action === 'privacy_delete') {
    return profile;
  }

  const attrs = attributes.length ? attributes : inferAttrsFromTags(tags);
  const now = new Date().toISOString();

  for (const attr of attrs) {
    if (!PREFERENCE_ATTRIBUTES.includes(attr)) continue;
    const entry = applyDecay(bucket.scores[attr] || { score: 0, n: 0, lastAt: null });
    entry.n += 1;
    // Running mean-ish accumulation with weight
    entry.score = Math.max(-5, Math.min(5, entry.score + weight * 0.35));
    entry.lastAt = now;
    bucket.scores[attr] = entry;

    const combined = profile.combined.scores[attr] || { score: 0, n: 0, lastAt: null };
    combined.n += 1;
    combined.score = Math.max(-5, Math.min(5, combined.score + weight * 0.35));
    combined.lastAt = now;
    profile.combined.scores[attr] = combined;
  }

  profile[key] = bucket;
  return savePreferences(profile);
}

export async function setPin({ reviewer = 'combined', attribute, pin }) {
  if (!PREFERENCE_ATTRIBUTES.includes(attribute)) {
    throw new Error('Unknown attribute');
  }
  const allowed = ['always-favor', 'usually-favor', 'neutral', 'usually-avoid', 'never-use'];
  if (!allowed.includes(pin)) throw new Error('Invalid pin');
  const profile = await loadPreferences();
  const key = reviewer === 'combined' ? 'combined' : reviewerKey(reviewer);
  profile[key].pins = profile[key].pins || {};
  profile[key].pins[attribute] = pin;
  return savePreferences(profile);
}

export function summarizeProfile(profile) {
  const minN = 3;
  const list = (bucket) => {
    const rows = Object.entries(bucket?.scores || {}).map(([k, v]) => ({
      attribute: k,
      score: Math.round((v.score || 0) * 100) / 100,
      evidence: v.n || 0,
      strong: (v.n || 0) >= minN,
      lastAt: v.lastAt,
    }));
    const approved = rows.filter((r) => r.strong && r.score > 0.4).sort((a, b) => b.score - a.score);
    const rejected = rows.filter((r) => r.strong && r.score < -0.4).sort((a, b) => a.score - b.score);
    const insufficient = rows.filter((r) => !r.strong).slice(0, 12);
    return { approved, rejected, insufficient, pins: bucket?.pins || {} };
  };

  return {
    evidenceNotes: profile.evidenceNotes,
    updatedAt: profile.updatedAt,
    george: list(profile.george),
    graphics: list(profile.graphics),
    combined: list(profile.combined),
    differences: diffReviewers(profile.george, profile.graphics),
  };
}

function diffReviewers(a, b) {
  const out = [];
  for (const attr of PREFERENCE_ATTRIBUTES) {
    const sa = a?.scores?.[attr]?.score || 0;
    const sb = b?.scores?.[attr]?.score || 0;
    const na = a?.scores?.[attr]?.n || 0;
    const nb = b?.scores?.[attr]?.n || 0;
    if (na < 3 || nb < 3) continue;
    const delta = Math.round((sb - sa) * 100) / 100;
    if (Math.abs(delta) >= 0.8) {
      out.push({ attribute: attr, george: sa, graphics: sb, delta });
    }
  }
  return out.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta)).slice(0, 10);
}

function inferAttrsFromTags(tags) {
  const map = {
    Believable: ['documentary-realism', 'human-led'],
    'Natural person': ['human-led', 'documentary-realism'],
    'Strong copy space': ['wide-copy-space'],
    Premium: ['premium-commercial'],
    'Good lighting': ['natural-lighting'],
    'Good composition': ['minimal-composition'],
    'Right workplace': ['workplace-scene', 'home-office'],
    'Strong prop': ['dimensional-prop', 'prop-led'],
    'Strong vertical relevance': ['vertical-specificity'],
    'Looks fake': ['documentary-realism'],
    'Too glossy': ['premium-commercial'],
    'Too much cyan': ['light-cyan'],
    'No copy space': ['wide-copy-space'],
    'Too busy': ['minimal-composition'],
    'Call-center feel': ['workplace-scene'],
    'Below our standard': ['premium-commercial'],
  };
  const attrs = [];
  for (const t of tags || []) {
    if (map[t]) attrs.push(...map[t]);
  }
  return [...new Set(attrs)];
}
