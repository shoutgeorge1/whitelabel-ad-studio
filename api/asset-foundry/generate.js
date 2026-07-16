import { json } from '../_lib/asset-foundry/auth.js';
import {
  withAuth,
  parseJson,
  methodNotAllowed,
  estimateBatchCostUsd,
  healthPayload,
  getConfig,
} from '../_lib/asset-foundry/http.js';
import { runSingleGeneration, makeAssetId, makeBatchId } from '../_lib/asset-foundry/openai.js';
import { composePrompt, topPreferenceHints, PRESETS } from '../_lib/asset-foundry/prompts.js';
import { loadPreferences } from '../_lib/asset-foundry/preferences.js';
import { LANES, VERTICALS, SIZE_PRESETS, QUALITY_MODES } from '../_lib/asset-foundry/config.js';

const activeByIdentity = new Map();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await withAuth(req, res);
    if (!session) return;
    const prefs = await loadPreferences().catch(() => null);
    return json(res, 200, {
      ok: true,
      presets: PRESETS,
      lanes: LANES,
      verticals: VERTICALS,
      sizes: SIZE_PRESETS,
      qualities: QUALITY_MODES,
      preferenceHints: prefs ? topPreferenceHints(prefs) : [],
      health: healthPayload(),
      orchestration:
        'Browser sends four sequential one-image requests. Server generates exactly one image per POST.',
    });
  }

  if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  const session = await withAuth(req, res, { mutate: true });
  if (!session) return;

  const cfg = getConfig();
  const body = await parseJson(req, res);
  if (!body) return;

  if (!LANES.includes(body.lane)) {
    return json(res, 400, { ok: false, error: 'Invalid creative lane.' });
  }
  if (body.vertical && !VERTICALS.includes(body.vertical)) {
    return json(res, 400, { ok: false, error: 'Invalid vertical.' });
  }
  if (body.format && !SIZE_PRESETS[body.format]) {
    return json(res, 400, { ok: false, error: 'Invalid format preset. Use square, portrait, vertical, or landscape.' });
  }
  if (body.quality && !QUALITY_MODES[body.quality]) {
    return json(res, 400, { ok: false, error: 'Invalid quality. Use draft or review.' });
  }

  const quality = body.quality === 'draft' ? 'draft' : 'review';
  const est = estimateBatchCostUsd(quality, 1);

  if (body.previewOnly) {
    const prefs = await loadPreferences().catch(() => null);
    const composed = composePrompt(body, prefs ? topPreferenceHints(prefs) : []);
    return json(res, 200, {
      ok: true,
      preview: true,
      promptSystem: composed.systemComposed,
      promptHash: composed.promptHash,
      estimatedCostUsd: est,
      exclusionsSummary: composed.exclusionsSummary,
    });
  }

  if (!healthPayload().generationEnabled) {
    return json(res, 503, {
      ok: false,
      error: cfg.localDev
        ? 'OPENAI_API_KEY is missing.'
        : 'Asset Foundry generation is not configured for this environment.',
      health: healthPayload(),
    });
  }

  const lockKey = session.identity || 'producer';
  const inflight = activeByIdentity.get(lockKey) || 0;
  if (inflight >= 2) {
    return json(res, 429, { ok: false, error: 'Too many concurrent generation requests. Wait for one to finish.' });
  }

  activeByIdentity.set(lockKey, inflight + 1);
  try {
    const result = await runSingleGeneration(
      {
        ...body,
        quality,
        batchId: body.batchId || makeBatchId(),
        assetId: body.assetId || makeAssetId(body.lane),
        variantIndex: Number.isFinite(body.variantIndex) ? body.variantIndex : 0,
      },
      { createdBy: session.identity || 'George' },
    );
    if (!result.ok) return json(res, 500, result);
    return json(res, 200, result);
  } catch (err) {
    console.error('[foundry/generate]', err?.message);
    return json(res, 500, { ok: false, error: 'Generation failed.' });
  } finally {
    const n = (activeByIdentity.get(lockKey) || 1) - 1;
    if (n <= 0) activeByIdentity.delete(lockKey);
    else activeByIdentity.set(lockKey, n);
  }
}
