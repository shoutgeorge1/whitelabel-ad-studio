import OpenAI from 'openai';
import crypto from 'crypto';
import { getConfig, QUALITY_MODES, SIZE_PRESETS, estimateCostUsd } from './config.js';
import { composePrompt, deriveAttributes, topPreferenceHints } from './prompts.js';
import { loadPreferences } from './preferences.js';

export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key });
}

export function mapQuality(uiQuality) {
  const mode = QUALITY_MODES[uiQuality] || QUALITY_MODES.review;
  return mode.openai;
}

export function resolveSize(formatId) {
  return SIZE_PRESETS[formatId] || SIZE_PRESETS.portrait;
}

function sanitizePrompt(text) {
  return String(text || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ')
    .trim()
    .slice(0, 4000);
}

function safeError(err) {
  return String(err?.message || err || 'Unknown error')
    .replace(/sk-[a-zA-Z0-9_-]+/g, '[redacted]')
    .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
    .slice(0, 400);
}

export function makeAssetId(lane = 'gen') {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const laneSlug = String(lane).replace(/[^a-z0-9]+/gi, '-').slice(0, 20) || 'gen';
  const rand = crypto.randomBytes(3).toString('hex');
  return `mvaf_${ymd}_${laneSlug}_${rand}`;
}

export function makeBatchId() {
  return `batch_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

/**
 * Call Images API once. Returns base64 for client IndexedDB storage.
 */
export async function generateOneImage({ prompt, size, quality, outputFormat = 'png' }) {
  const client = getOpenAI();
  const model = getConfig().model;
  const openaiQuality = mapQuality(quality);

  const result = await client.images.generate({
    model,
    prompt,
    size: size.size,
    quality: openaiQuality,
    output_format: outputFormat,
    n: 1,
  });

  const item = result.data?.[0];
  if (!item?.b64_json) throw new Error('Empty generation response');
  return {
    b64: item.b64_json,
    requestId: result._request_id || null,
    usage: result.usage || null,
    outputFormat,
  };
}

/**
 * Compose + generate a single asset. Returns metadata + base64 (no secret store required).
 */
export async function runSingleGeneration(input, { createdBy = 'George' } = {}) {
  const cfg = getConfig();
  if (!cfg.hasOpenAI) {
    return { ok: false, error: 'OPENAI_API_KEY is not configured. Generation disabled.' };
  }

  const qualityUi = input.quality === 'draft' ? 'draft' : 'review';
  if (input.lane === 'real-talent-reference') {
    if (!input.consentAdvertising || !input.consentImageEdit) {
      return {
        ok: false,
        error: 'Real Talent Reference requires confirmed advertising and image-editing consent.',
      };
    }
  }

  const size = resolveSize(input.format || 'portrait');
  const prefs = await loadPreferences().catch(() => null);
  const hints = prefs ? topPreferenceHints(prefs) : [];
  const composed = composePrompt({ ...input, variantIndex: input.variantIndex ?? 0 }, hints);
  const promptFinal = sanitizePrompt(input.promptOverride || composed.systemComposed);
  const id = input.assetId || makeAssetId(input.lane || 'gen');
  const unitCost = estimateCostUsd(qualityUi, 1);

  try {
    const gen = await generateOneImage({
      prompt: promptFinal,
      size,
      quality: qualityUi,
      outputFormat: 'png',
    });

    const asset = {
      id,
      batchId: input.batchId || makeBatchId(),
      parentAssetId: input.parentAssetId || null,
      rootAssetId: input.rootAssetId || input.parentAssetId || id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      reviewer: null,
      status: 'Pending Review',
      lane: input.lane,
      vertical: input.vertical || 'none',
      concept: input.concept || '',
      sceneType: input.sceneType || '',
      subjectType:
        input.lane === 'real-talent-reference'
          ? 'real-person-reference-edit'
          : input.subjectPosition === 'no-person' || input.lane === 'saas-props'
            ? 'no-person'
            : 'synthetic-representative-person',
      subjectPosition: input.subjectPosition || 'right',
      copySpace: input.copySpace || 'left',
      cameraTreatment: input.cameraTreatment || '',
      lighting: input.lighting || '',
      realism: input.realism || '',
      format: size.id,
      width: size.width,
      height: size.height,
      quality: qualityUi,
      outputFormat: 'png',
      model: cfg.model,
      promptSystem: composed.systemComposed,
      promptFinal,
      promptHash: composed.promptHash,
      referenceIds: input.referenceIds || [],
      referenceRoles: input.referenceRoles || [],
      estimatedCostUsd: unitCost,
      usage: gen.usage || null,
      openaiRequestId: gen.requestId,
      aiDisclosure: 'AI-generated raw visual asset',
      personId: input.personId || null,
      personType:
        input.lane === 'real-talent-reference' ? 'real-person-reference-edit' : 'synthetic-representative-person',
      consentStatus:
        input.lane === 'real-talent-reference'
          ? {
              advertising: Boolean(input.consentAdvertising),
              imageEdit: Boolean(input.consentImageEdit),
            }
          : null,
      identityReviewStatus: input.lane === 'real-talent-reference' ? 'required' : 'n/a',
      votes: [],
      feedbackTags: [],
      internalNotes: [],
      preferenceAttributes: composed.preferenceAttributes.length
        ? composed.preferenceAttributes
        : deriveAttributes(input),
      approvedBy: null,
      approvedAt: null,
      projectSaveStatus: 'unsaved',
      projectFilename: null,
      usageHistory: [],
      generationReason: input.generationReason || 'manual',
      variantIndex: input.variantIndex ?? 0,
      mimeType: 'image/png',
    };

    return {
      ok: true,
      asset,
      imageBase64: gen.b64,
      estimatedCostUsd: unitCost,
    };
  } catch (err) {
    console.error('[foundry] generate failed', safeError(err));
    return { ok: false, error: safeError(err) };
  }
}

export async function runConnectionTest({ createdBy = 'George' } = {}) {
  return runSingleGeneration(
    {
      lane: 'saas-props',
      vertical: 'none',
      concept: 'Organized workflow',
      sceneType: 'Background plate',
      subjectPosition: 'no-person',
      copySpace: 'wide-negative-space',
      cameraTreatment: 'Isolated object photography',
      lighting: 'Soft studio daylight',
      realism: 'Dimensional 3D',
      format: 'square',
      quality: 'draft',
      variantIndex: 0,
      generationReason: 'connection-test',
      additionalDirection:
        'Premium abstract healthcare operations background with calendar, phone, inbox and document-inspired shapes, large empty copy space, no people, no text, no letters, no numbers, no logos, no watermark.',
    },
    { createdBy },
  );
}

/** Strip binary / path fields for JSON responses */
export function publicAsset(asset) {
  if (!asset) return null;
  const { imageBlob, thumbBlob, imageBase64, imagePath, thumbnailPath, ...rest } = asset;
  return {
    ...rest,
    hasImage: Boolean(imageBlob || imageBase64 || imagePath),
    hasThumbnail: Boolean(thumbBlob || thumbnailPath),
  };
}

/**
 * Legacy multi-image helper (unused by v1 UI — kept for older routes).
 * Prefer four sequential client calls to /generate.
 */
export async function runBatchGeneration(input, opts = {}) {
  const count = Math.min(4, Math.max(1, Number(input.count) || 4));
  const batchId = input.batchId || makeBatchId();
  const assets = [];
  const errors = [];
  for (let i = 0; i < count; i++) {
    const result = await runSingleGeneration(
      { ...input, batchId, variantIndex: i },
      opts,
    );
    if (result.ok) assets.push(publicAsset(result.asset));
    else errors.push({ index: i, error: result.error });
  }
  if (!assets.length) return { ok: false, error: errors[0]?.error || 'Generation failed.', errors };
  return { ok: true, assets, batch: { id: batchId }, partial: assets.length < count, errors };
}

export { safeError, sanitizePrompt as sanitizePromptOverride };
