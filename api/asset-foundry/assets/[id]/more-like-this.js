import { json } from '../../../_lib/asset-foundry/auth.js';
import {
  withAuth,
  parseJson,
  methodNotAllowed,
  checkSpendAllowed,
  estimateBatchCostUsd,
  healthPayload,
} from '../../../_lib/asset-foundry/http.js';
import { getAsset } from '../../../_lib/asset-foundry/assets-api.js';
import { runBatchGeneration } from '../../../_lib/asset-foundry/openai.js';
import { applyFeedback } from '../../../_lib/asset-foundry/preferences.js';

const CHANGE_OPTIONS = [
  'More natural',
  'More premium',
  'Different person',
  'Wider copy space',
  'Person farther left',
  'Person farther right',
  'Cleaner background',
  'More realistic workplace',
  'Less cyan',
  'Less glossy',
  'More documentary',
  'More healthcare-specific',
  'More dental-specific',
  'Different camera angle',
  'Same scene, new variation',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const session = await withAuth(req, res, { mutate: true });
  if (!session) return;

  if (!healthPayload().generationEnabled) {
    return json(res, 503, { ok: false, error: 'Generation disabled.', health: healthPayload() });
  }

  const parent = await getAsset(req.query?.id);
  if (!parent) return json(res, 404, { ok: false, error: 'Parent asset not found.' });

  const body = await parseJson(req, res);
  if (!body) return;

  const changes = (body.changes || []).filter((c) => CHANGE_OPTIONS.includes(c)).slice(0, 6);
  const est = estimateBatchCostUsd(body.quality || parent.quality || 'review', 4);
  const spend = await checkSpendAllowed(est, 4);
  if (!spend.ok) return json(res, 402, { ok: false, error: spend.error });

  await applyFeedback({
    reviewer: session.identity,
    action: 'more_like_this',
    attributes: parent.preferenceAttributes || [],
  });

  const extra = [
    'Create four related but distinct images in the same visual direction as the selected parent.',
    parent.personType === 'synthetic-representative-person'
      ? 'This is a related visual direction — do not claim it is the same employee.'
      : '',
    changes.length ? `Adjustments requested: ${changes.join('; ')}.` : '',
    body.note ? `Producer note: ${String(body.note).slice(0, 400)}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const result = await runBatchGeneration(
    {
      lane: parent.lane,
      vertical: parent.vertical,
      concept: parent.concept,
      sceneType: parent.sceneType,
      subjectPosition: parent.subjectPosition,
      copySpace: parent.copySpace,
      cameraTreatment: parent.cameraTreatment,
      lighting: parent.lighting,
      realism: parent.realism,
      format: parent.format,
      quality: body.quality || parent.quality || 'review',
      confirmFinal: body.confirmFinal,
      additionalDirection: extra,
      parentAssetId: parent.id,
      rootAssetId: parent.rootAssetId || parent.id,
      referenceIds: [parent.id],
      personId: parent.personId,
      consentAdvertising: parent.consentStatus?.advertising,
      consentImageEdit: parent.consentStatus?.imageEdit,
      generationReason: 'more-like-this',
    },
    { createdBy: session.identity, generationReason: 'more-like-this' },
  );

  return json(res, result.ok ? 200 : 500, { ...result, changeOptions: CHANGE_OPTIONS });
}
