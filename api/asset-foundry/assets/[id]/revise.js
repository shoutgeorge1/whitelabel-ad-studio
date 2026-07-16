import { json } from '../../../_lib/asset-foundry/auth.js';
import {
  withAuth,
  parseJson,
  methodNotAllowed,
  checkSpendAllowed,
  estimateBatchCostUsd,
  healthPayload,
} from '../../../_lib/asset-foundry/http.js';
import { getAsset, publicize } from '../../../_lib/asset-foundry/assets-api.js';
import { runBatchGeneration } from '../../../_lib/asset-foundry/openai.js';
import { saveAssetRecord } from '../../../_lib/asset-foundry/store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const session = await withAuth(req, res, { mutate: true });
  if (!session) return;

  if (!healthPayload().generationEnabled) {
    return json(res, 503, { ok: false, error: 'Generation disabled.' });
  }

  const parent = await getAsset(req.query?.id);
  if (!parent) return json(res, 404, { ok: false, error: 'Parent asset not found.' });

  const body = await parseJson(req, res);
  if (!body) return;
  const instruction = String(body.instruction || '').trim().slice(0, 800);
  if (!instruction) return json(res, 400, { ok: false, error: 'Revision instruction required.' });

  const quality = body.quality || 'review';
  const est = estimateBatchCostUsd(quality, 1);
  const spend = await checkSpendAllowed(est, 1);
  if (!spend.ok) return json(res, 402, { ok: false, error: spend.error });

  // Mark parent as revision requested; keep original immutable
  parent.status = 'Revision Requested';
  parent.updatedAt = new Date().toISOString();
  await saveAssetRecord(parent);

  const result = await runBatchGeneration(
    {
      lane: parent.lane,
      vertical: parent.vertical,
      concept: parent.concept,
      sceneType: parent.sceneType,
      subjectPosition: body.subjectPosition || parent.subjectPosition,
      copySpace: body.copySpace || parent.copySpace,
      cameraTreatment: parent.cameraTreatment,
      lighting: body.lighting || parent.lighting,
      realism: parent.realism,
      format: body.format || parent.format,
      quality,
      count: 1,
      confirmFinal: body.confirmFinal,
      additionalDirection: `Revision of ${parent.id}. Instruction: ${instruction}. Preserve the original as a separate record; produce a new derivative.`,
      parentAssetId: parent.id,
      rootAssetId: parent.rootAssetId || parent.id,
      personId: parent.personId,
      consentAdvertising: parent.consentStatus?.advertising,
      consentImageEdit: parent.consentStatus?.imageEdit,
    },
    { createdBy: session.identity, generationReason: 'revise' },
  );

  return json(res, result.ok ? 200 : 500, {
    ...result,
    parent: publicize(parent),
    note: 'Original asset preserved. New derivative created.',
  });
}
