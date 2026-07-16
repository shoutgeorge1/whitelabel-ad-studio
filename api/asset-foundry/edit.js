import { json } from '../_lib/asset-foundry/auth.js';
import {
  withAuth,
  parseJson,
  methodNotAllowed,
  checkSpendAllowed,
  estimateBatchCostUsd,
  healthPayload,
} from '../_lib/asset-foundry/http.js';
import { getAsset, publicize } from '../_lib/asset-foundry/assets-api.js';
import { runBatchGeneration } from '../_lib/asset-foundry/openai.js';

/** Image edit / reference-guided regeneration (Images API edit path when refs attached). */
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const session = await withAuth(req, res, { mutate: true });
  if (!session) return;

  if (!healthPayload().generationEnabled) {
    return json(res, 503, { ok: false, error: 'Generation disabled.' });
  }

  const body = await parseJson(req, res);
  if (!body) return;

  const parentId = body.parentAssetId;
  const parent = parentId ? await getAsset(parentId) : null;
  const instruction = String(body.instruction || body.additionalDirection || '').trim().slice(0, 800);
  if (!instruction) return json(res, 400, { ok: false, error: 'Edit instruction required.' });

  const quality = body.quality || 'review';
  const count = Math.min(4, Math.max(1, Number(body.count) || 1));
  const est = estimateBatchCostUsd(quality, count);
  const spend = await checkSpendAllowed(est, count);
  if (!spend.ok) return json(res, 402, { ok: false, error: spend.error });

  const base = parent || body;
  const result = await runBatchGeneration(
    {
      lane: body.lane || base.lane || 'healthcare-operations',
      vertical: body.vertical || base.vertical || 'none',
      concept: body.concept || base.concept || 'Administrative workflow',
      sceneType: body.sceneType || base.sceneType,
      subjectPosition: body.subjectPosition || base.subjectPosition,
      copySpace: body.copySpace || base.copySpace,
      cameraTreatment: body.cameraTreatment || base.cameraTreatment,
      lighting: body.lighting || base.lighting,
      realism: body.realism || base.realism,
      format: body.format || base.format || '4:5',
      quality,
      count,
      confirmFinal: body.confirmFinal,
      additionalDirection: instruction,
      parentAssetId: parent?.id || null,
      rootAssetId: parent?.rootAssetId || parent?.id || null,
      referenceIds: body.referenceIds || (parent ? [parent.id] : []),
      consentAdvertising: body.consentAdvertising,
      consentImageEdit: body.consentImageEdit,
    },
    { createdBy: session.identity, generationReason: 'edit' },
  );

  return json(res, result.ok ? 200 : 500, {
    ...result,
    parent: parent ? publicize(parent) : null,
  });
}
