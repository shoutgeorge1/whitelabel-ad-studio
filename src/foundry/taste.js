/**
 * Client-side taste profile (mirrors server preference logic for IndexedDB).
 * Application-level only — does not fine-tune OpenAI models.
 */

const ATTRS = [
  'natural-lighting',
  'studio-lighting',
  'subject-left',
  'subject-right',
  'centered-subject',
  'wide-copy-space',
  'tight-crop',
  'workplace-scene',
  'editorial-portrait',
  'dimensional-prop',
  'glass-effect',
  'warm-neutral',
  'light-cyan',
  'deep-teal',
  'documentary-realism',
  'premium-commercial',
  'human-led',
  'prop-led',
  'minimal-composition',
  'vertical-specificity',
  'abstract-metaphor',
  'home-office',
  'professional-office',
  'natural-smile',
  'focused-expression',
];

const WEIGHTS = {
  thumbs_up: 1,
  thumbs_down: -1.2,
  more_like_this: 2,
  approve: 2.5,
  production: 2.2,
  reject: -2,
  privacy_delete: 0,
};

function emptyReviewer() {
  return {
    scores: Object.fromEntries(ATTRS.map((a) => [a, { score: 0, n: 0, lastAt: null }])),
    pins: {},
  };
}

export function emptyProfile() {
  return {
    version: 1,
    updatedAt: null,
    george: emptyReviewer(),
    graphics: emptyReviewer(),
    combined: emptyReviewer(),
    evidenceNotes:
      'Application-level taste profile. Does not fine-tune or retrain OpenAI models. Preference-guided prompting only.',
  };
}

function reviewerKey(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('graphics')) return 'graphics';
  return 'george';
}

export function applyFeedback(profile, { reviewer, action, attributes = [], tags = [] }) {
  const next = structuredClone(profile || emptyProfile());
  const key = reviewerKey(reviewer);
  const weight = WEIGHTS[action] ?? 0;
  if (weight === 0 && action === 'privacy_delete') return next;

  const attrs = attributes.length ? attributes : inferAttrsFromTags(tags);
  const now = new Date().toISOString();

  for (const attr of attrs) {
    if (!ATTRS.includes(attr)) continue;
    const entry = next[key].scores[attr] || { score: 0, n: 0, lastAt: null };
    entry.n += 1;
    entry.score = Math.max(-5, Math.min(5, entry.score + weight * 0.35));
    entry.lastAt = now;
    next[key].scores[attr] = entry;

    const combined = next.combined.scores[attr] || { score: 0, n: 0, lastAt: null };
    combined.n += 1;
    combined.score = Math.max(-5, Math.min(5, combined.score + weight * 0.35));
    combined.lastAt = now;
    next.combined.scores[attr] = combined;
  }

  next.updatedAt = now;
  return next;
}

export function summarizeProfile(profile) {
  const minN = 3;
  const list = (bucket) => {
    const rows = Object.entries(bucket?.scores || {}).map(([k, v]) => ({
      attribute: k,
      score: Math.round((v.score || 0) * 100) / 100,
      evidence: v.n || 0,
      strong: (v.n || 0) >= minN,
    }));
    return {
      approved: rows.filter((r) => r.strong && r.score > 0.4).sort((a, b) => b.score - a.score),
      rejected: rows.filter((r) => r.strong && r.score < -0.4).sort((a, b) => a.score - b.score),
      insufficient: rows.filter((r) => !r.strong).slice(0, 12),
      pins: bucket?.pins || {},
    };
  };
  return {
    evidenceNotes: profile.evidenceNotes,
    updatedAt: profile.updatedAt,
    george: list(profile.george),
    graphics: list(profile.graphics),
    combined: list(profile.combined),
  };
}

export function topHints(profile, limit = 6) {
  const entries = Object.entries(profile?.combined?.scores || {})
    .map(([k, v]) => ({ k, score: v.score || 0, n: v.n || 0 }))
    .filter((e) => e.n >= 3 && e.score > 0.3)
    .sort((a, b) => b.score - a.score);
  return entries.slice(0, limit).map((e) => e.k);
}

function inferAttrsFromTags(tags) {
  const map = {
    Believable: ['documentary-realism', 'human-led'],
    'Natural person': ['human-led', 'documentary-realism'],
    'Strong copy space': ['wide-copy-space'],
    Premium: ['premium-commercial'],
    'Good lighting': ['natural-lighting'],
    'Good composition': ['minimal-composition'],
    'Correct workplace': ['workplace-scene', 'home-office'],
    'Strong prop': ['dimensional-prop', 'prop-led'],
    'Looks fake': ['documentary-realism'],
    'Too glossy': ['premium-commercial'],
    'Too much cyan': ['light-cyan'],
    'No copy space': ['wide-copy-space'],
    'Call-center feel': ['workplace-scene'],
  };
  const attrs = [];
  for (const t of tags || []) if (map[t]) attrs.push(...map[t]);
  return [...new Set(attrs)];
}

export { ATTRS };
