#!/usr/bin/env node
/**
 * Generate video editor handoff markdown from image inventory + variations catalog.
 * Does not create videos — metadata and docs only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/image-inventory.json'), 'utf8'));
const videoMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/video-production-metadata.json'), 'utf8'));
const catalogPath = path.join(ROOT, 'public/exports/image-tests/variations-catalog.json');

if (!fs.existsSync(catalogPath)) {
  console.error('Run npm run generate:images first');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const kept = catalog.kept || [];

function getVideoFields(source) {
  const defaults = videoMeta.familyDefaults[source.family] || {};
  return {
    static_use: source.video?.static_use ?? defaults.static_use ?? 'yes',
    remotion_use: source.video?.remotion_use ?? defaults.remotion_use ?? 'medium',
    veo_video_use: source.video?.veo_video_use ?? defaults.veo_video_use ?? 'low',
    editor_use: source.video?.editor_use ?? defaults.editor_use ?? 'medium',
    best_video_format: source.video?.best_video_format ?? defaults.best_video_format ?? 'voiceover',
    recommended_angle: source.video?.recommended_angle ?? source.placeholderLabel,
    recommended_script_style: source.video?.recommended_script_style ?? defaults.recommended_script_style ?? '',
    video_editor_notes: source.video?.video_editor_notes ?? defaults.video_editor_notes ?? '',
    veo_prompt_notes: source.video?.veo_prompt_notes ?? defaults.veo_prompt_notes ?? '',
    compliance_risks: source.video?.compliance_risks ?? defaults.compliance_risks ?? [],
    do_not_use_for: source.video?.do_not_use_for ?? defaults.do_not_use_for ?? [],
  };
}

const sourceById = Object.fromEntries(inventory.sources.map((s) => [s.id, s]));
const enriched = kept.map((v) => ({
  ...v,
  video: getVideoFields(sourceById[v.sourceId] || {}),
}));

const heroSections = new Set(['approved', 'first_batch', 'person_left', 'person_right', 'person_center']);
const heroes = enriched.filter((v) => heroSections.has(v.boardSection));
const vertical = enriched.filter((v) => v.aspectRatio === '9x16' && heroSections.has(v.boardSection));
const feed45 = enriched.filter((v) => v.aspectRatio === '4x5' && heroSections.has(v.boardSection));
const remotionCandidates = enriched.filter((v) => ['high', 'medium'].includes(v.video.remotion_use) && v.boardSection !== 'reject');
const veoCandidates = enriched.filter((v) => ['high', 'medium'].includes(v.video.veo_video_use) && v.boardSection !== 'reject');
const useLater = enriched.filter((v) => v.boardSection === 'usable_later');
const rejected = [
  ...inventory.sources.filter((s) => s.boardTier === 'reject'),
  ...(catalog.rejected || []),
];

function mdList(items) {
  return items.length ? items.map((i) => `- ${i}`).join('\n') : '- None';
}

function variationRow(v) {
  return `| ${v.variationId} | \`${v.previewPath}\` | ${v.placeholderLabel} | ${v.cropLabel} | ${v.video.recommended_angle} | ${v.video.best_video_format} | ${v.video.remotion_use} | ${v.video.veo_video_use} |`;
}

// --- video-editor-handoff.md ---
const handoff = `# MedVirtual Video Editor Handoff

> **Status:** Planning only — no final videos, scripts, or Veo prompts yet.

## Project Goal

Create short, mobile-first Meta ad videos from approved MedVirtual creative assets.

## Priority Formats

- **9:16** vertical videos (primary)
- **4:5** feed videos (secondary)
- Static-to-motion variants
- Simple voiceover or text-led videos

## Editing Style

**Use:** native Meta/Instagram feel, large text overlays, readable captions, simple motion, light zooms/pans, clean transitions, first-frame hook, clear CTA.

**Avoid:** overly polished corporate look, heavy gradients, tiny text, fake dashboards, fake testimonials, patient medical imagery, overcomplicated motion graphics.

## Compliance — Do Not

- Fake testimonials or "As a real clinic owner…" framing
- Fake doctor endorsements
- Patient stories or PHI on screen
- Guaranteed savings/outcomes
- Exact pricing unless verified

**Safe framing:** practice operations POV, office workflow scenario, remote medical assistant explainer, voiceover narration.

---

## Approved Hero Image Candidates (12)

| Variation ID | Path | Angle | Crop | Video Format | Remotion | Veo |
|--------------|------|-------|------|--------------|----------|-----|
${heroes.map(variationRow).join('\n')}

### Per-hero editor notes

${heroes.map((v) => `#### ${v.variationId}
- **Source:** \`public/assets/${v.sourceFolder || 'ai-images'}/${v.sourceFile}\`
- **Description:** ${sourceById[v.sourceId]?.description || ''}
- **Editor:** ${v.video.video_editor_notes}
- **Veo (draft):** ${v.video.veo_prompt_notes}
- **Warnings:** ${v.warnings?.join('; ') || 'None'}
- **Do not use for:** ${v.video.do_not_use_for.join(', ')}
`).join('\n')}

---

## First Video Batch Recommendation

**5 short-form concepts · 15–25 sec each · 9:16 first · 4:5 when possible**

| # | Angle | Hook Direction | Suggested Hero Image |
|---|-------|----------------|----------------------|
| 1 | Missed Calls | Answer more patient calls | IMG_AI_003 or IMG_AI_010 (9:16) |
| 2 | Front Desk Overload | Give your team backup | IMG_AI_002 or IMG_AI_010 (4:5) |
| 3 | Scheduling Bottleneck | Keep the calendar moving | IMG_AI_009 (4:5/9:16) |
| 4 | Hiring Gap | Add support without another in-office hire | IMG_AI_007 or IMG_AI_004 |
| 5 | Admin Backlog | Clear repetitive back-office work | IMG_AI_003 or IMG_AI_009 |

---

## What the Editor Needs Next

1. Final approved hooks (5) from George/Chris
2. Short voiceover scripts (5) — practice-ops POV only
3. Static poster frames exported from hero crops
4. Brand logo SVG from \`public/assets/logo/medvirtual-logo.svg\`
5. CTA text approval (Book a Demo / See How It Works)
6. Music/SFX preferences (optional)

Regenerate this file: \`npm run generate:handoff\`
`;

// --- future-veo-video-concepts.md ---
const veoConcepts = `# Future Veo Video Concepts

> **Draft structures only — not final production prompts.**

## Veo Safety Rules

- No fake testimonials
- No fake doctor endorsements
- No patient stories or PHI
- No guaranteed savings/outcomes
- Prefer: practice operations POV, office scenario, remote assistant explainer, voiceover

---

${[
  { name: 'Headset Medical Admin', scene: 'Admin wearing headset at laptop in bright office', image: 'AI_007, AI_010', speaker: 'Voiceover only — not on-camera testimonial', hook: 'When patient calls keep coming in…', unsafe: 'Fake doctor, patient outcomes' },
  { name: 'Busy Schedule Review', scene: 'Office manager reviewing calendar on screen', image: 'AI_009', speaker: 'Narrator / POV', hook: 'When scheduling becomes the bottleneck…', unsafe: 'Guaranteed fill rate' },
  { name: 'Front Desk Ringing', scene: 'Phone activity while admin multitasks at desk', image: 'AI_002, AI_003', speaker: 'Scenario B-roll + VO', hook: 'Your front desk is buried…', unsafe: 'Real patient names' },
  { name: 'Remote Assistant Handling Calls', scene: 'Calm professional on headset managing calls', image: 'AI_010 9:16', speaker: 'Explainer VO', hook: 'Remote medical support for busy practices', unsafe: 'HIPAA claims unless verified' },
  { name: 'Follow-Up Tasks', scene: 'Admin completing follow-up checklist at laptop', image: 'AI_003', speaker: 'VO + screen text', hook: 'Keep patient communication moving', unsafe: 'Patient satisfaction guarantees' },
  { name: 'Calm Workflow After Support', scene: 'Organized desk, admin working smoothly', image: 'AI_004', speaker: 'VO', hook: 'Add admin capacity without another hire', unsafe: 'Overnight transformation claims' },
  { name: 'Back-Office Checklist', scene: 'Checklist items completing on screen', image: 'AI_008 background', speaker: 'Motion text + VO', hook: 'Clear repetitive back-office work', unsafe: 'Exact cost savings %' },
  { name: 'Scheduling Support', scene: 'Calendar UI motion, admin at side', image: 'AI_009', speaker: 'VO', hook: 'Keep the calendar moving', unsafe: 'Zero no-shows promise' },
  { name: 'Insurance Verification Support', scene: 'Admin reviewing documents at desk', image: 'AI_006', speaker: 'VO', hook: 'Support for verification workflow', unsafe: 'Coverage guarantees' },
  { name: 'Book a Demo Explainer', scene: 'Clean laptop/interface, branded office', image: 'LP assets later', speaker: 'VO + CTA card', hook: 'See how remote support works', unsafe: 'Fake product UI data' },
].map((c, i) => `## ${i + 1}. ${c.name}

- **Visual scene:** ${c.scene}
- **Source image ref:** ${c.image}
- **Speaker type:** ${c.speaker}
- **Safe script angle:** ${c.hook}
- **Unsafe claims to avoid:** ${c.unsafe}
- **First-frame hook:** ${c.hook}
- **Voiceover idea:** Practice operations narrator — problem → support option → CTA
- **Editor notes:** Use approved static crop as first frame; subtle motion only
- **Remotion integration:** TEXT_ON_IMAGE_NATIVE or STATIC_TO_SHORT template
`).join('\n')}
`;

// --- remotion-template-planning.md ---
const remotion = `# Remotion Template Planning

> **Planning only — no Remotion components built yet.**

## Template Overview

| Template | Best Image Types | Duration | Ratios | First-Frame Rule |
|----------|------------------|----------|--------|------------------|
| STATIC_TO_SHORT | Hero headset/laptop crops | 15–20s | 9:16, 4:5 | Use approved crop as frame 1 |
| PROBLEM_SOLUTION | Teal/navy admin, office scenes | 20–25s | 9:16 | Hook text on frame 1 |
| CHECKLIST_REVEAL | Wide office, workflow images | 15–20s | 9:16, 4:5 | Checklist animates over B-roll |
| TEXT_ON_IMAGE_NATIVE | All hero crops | 12–18s | 9:16, 4:5 | Large hook, native Meta feel |
| DEMO_OFFER | Landing/interface (later) | 15s | 4:5 | CTA visible by 3s |
| TALKING_HEAD_FRAME | Blue scrubs headset only | 15–25s | 9:16 | Face + headset clear — VO only, not fake testimonial |

---

## 1. STATIC_TO_SHORT

- **Best images:** IMG_AI_003, AI_007, AI_010 hero crops
- **Props:** hook text, 2–3 bullet lines, CTA, logo
- **Sequence:** static frame → Ken Burns 5% → text stagger in → CTA pulse
- **Editor notes:** Match competitor native feel — not corporate

## 2. PROBLEM_SOLUTION

- **Best images:** AI_002, AI_009, AI_003
- **Props:** problem line, solution line, CTA
- **Sequence:** problem text → image hold → solution text → CTA
- **Editor notes:** No fear-based medical language

## 3. CHECKLIST_REVEAL

- **Best images:** AI_008, AI_009 (icons simplified)
- **Props:** 3 checklist items max
- **Sequence:** items tick in over 6s → CTA
- **Editor notes:** Hide floating icons if they clash

## 4. TEXT_ON_IMAGE_NATIVE

- **Best images:** All 12 hero crops
- **Props:** hook, subline, CTA button
- **Sequence:** hook frame 1 → hold → CTA end card
- **Editor notes:** Primary template for first batch

## 5. DEMO_OFFER

- **Best images:** Landing page / interface (phase 2)
- **Props:** Book a Demo CTA
- **Sequence:** interface pan → CTA
- **Editor notes:** Verify UI is generic, no PHI

## 6. TALKING_HEAD_FRAME

- **Best images:** AI_007, AI_010 (9:16)
- **Props:** VO track only — no lip-sync testimonial
- **Sequence:** hold on admin → text overlays → CTA
- **Editor notes:** **Do not** imply real customer on camera without legal approval
`;

// --- creative-asset-shortlist.md ---
const shortlist = `# Creative Asset Shortlist

For George and the video editor. Generated from curated image pass.

## 1. First-Batch Images (${heroes.length})

${heroes.map((v) => `- **${v.variationId}** — ${v.cropLabel} — ${v.placeholderLabel} — [preview](${v.previewPath})`).join('\n')}

## 2. Best Vertical Candidates (${vertical.length})

${vertical.map((v) => `- ${v.variationId} (${v.video.veo_video_use} Veo potential)`).join('\n')}

## 3. Best 4:5 Candidates (${feed45.length})

${feed45.map((v) => `- ${v.variationId}`).join('\n')}

## 4. Best Remotion Candidates (top ${Math.min(10, remotionCandidates.filter((v) => v.video.remotion_use === 'high').length)})

${remotionCandidates.filter((v) => v.video.remotion_use === 'high').slice(0, 10).map((v) => `- ${v.variationId} — ${v.video.best_video_format}`).join('\n')}

## 5. Best Future Veo Candidates (top ${Math.min(8, veoCandidates.filter((v) => v.video.veo_video_use === 'high').length)})

${veoCandidates.filter((v) => v.video.veo_video_use === 'high').slice(0, 8).map((v) => `- ${v.variationId} — ${v.video.veo_prompt_notes.slice(0, 80)}…`).join('\n')}

## 6. Use Later (${useLater.length})

${useLater.map((v) => `- ${v.variationId} — ${v.sourceFile} (headshot / trust creative)`).join('\n')}

## 7. Reject / Do Not Use

${rejected.map((r) => `- ${r.variationId || r.id} — ${r.rejectReason || r.description || r.recommendedUse}`).join('\n')}

---

## Image Family Summary

| Family | Static | Remotion | Veo | Notes |
|--------|--------|----------|-----|-------|
| Blue scrubs + headset | ✅ First batch | High | High | Top video family |
| Teal blouse admin | ✅ First batch | High | High | Missed calls, scheduling |
| White blouse admin | ✅ Careful | Medium | Medium | Edge crops only |
| Navy scrubs admin | ✅ Layout | Medium | Medium | Icon clutter risk |
| Wide office | Background | Medium | Low | B-roll / checklist |
| Landing headshots | Later | Low | Low | No fake talking-head |
`;

fs.writeFileSync(path.join(ROOT, 'video-editor-handoff.md'), handoff);
fs.writeFileSync(path.join(ROOT, 'future-veo-video-concepts.md'), veoConcepts);
fs.writeFileSync(path.join(ROOT, 'remotion-template-planning.md'), remotion);
fs.writeFileSync(path.join(ROOT, 'creative-asset-shortlist.md'), shortlist);

// Enriched catalog with video metadata
fs.writeFileSync(
  path.join(ROOT, 'public/exports/image-tests/variations-catalog.json'),
  JSON.stringify({ ...catalog, kept: enriched, videoProductionReady: true }, null, 2),
);

console.log('Handoff docs generated:');
console.log('  video-editor-handoff.md');
console.log('  future-veo-video-concepts.md');
console.log('  remotion-template-planning.md');
console.log('  creative-asset-shortlist.md');
