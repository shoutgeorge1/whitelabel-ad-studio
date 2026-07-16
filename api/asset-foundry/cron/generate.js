import { json } from '../../_lib/asset-foundry/auth.js';
import { methodNotAllowed, healthPayload, checkSpendAllowed, estimateBatchCostUsd } from '../../_lib/asset-foundry/http.js';
import { getConfig } from '../../_lib/asset-foundry/config.js';
import { runBatchGeneration } from '../../_lib/asset-foundry/openai.js';
import { writeAudit } from '../../_lib/asset-foundry/store.js';
import { listAssets } from '../../_lib/asset-foundry/assets-api.js';

/**
 * Optional daily auto-generate. Disabled unless ASSET_FOUNDRY_AUTO_GENERATE=true
 * and CRON_SECRET matches Authorization bearer.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') return methodNotAllowed(res, ['GET', 'POST']);

  const cfg = getConfig();
  if (!cfg.autoGenerate) {
    return json(res, 200, {
      ok: true,
      skipped: true,
      reason: 'ASSET_FOUNDRY_AUTO_GENERATE is false (default).',
    });
  }

  const secret = process.env.CRON_SECRET || process.env.ASSET_FOUNDRY_CRON_SECRET;
  const auth = req.headers.authorization || '';
  if (!secret || auth !== `Bearer ${secret}`) {
    return json(res, 401, { ok: false, error: 'Invalid cron secret.' });
  }

  if (!healthPayload().generationEnabled) {
    return json(res, 503, { ok: false, error: 'Generation not configured.' });
  }

  const { assets: pending } = await listAssets({
    status: ['Generated', 'Pending Review'],
    limit: 40,
  });
  if (pending.length >= 8) {
    await writeAudit({ type: 'cron-skip', reason: 'pending-queue-full', pending: pending.length });
    return json(res, 200, { ok: true, skipped: true, reason: 'Pending review queue is full.' });
  }

  const est = estimateBatchCostUsd('draft', 4);
  const spend = await checkSpendAllowed(est, 4);
  if (!spend.ok) return json(res, 402, { ok: false, error: spend.error });

  const result = await runBatchGeneration(
    {
      lane: 'healthcare-operations',
      vertical: 'none',
      concept: 'Administrative workflow',
      sceneType: 'Abstract operational scene',
      subjectPosition: 'no-person',
      copySpace: 'wide-negative-space',
      cameraTreatment: 'Premium commercial',
      lighting: 'Soft studio daylight',
      realism: 'Premium commercial',
      format: '4:5',
      quality: 'draft',
      additionalDirection: 'Automated backlog fill — preference-guided, brand-safe, no people required.',
    },
    { createdBy: 'Auto', generationReason: 'cron-auto' },
  );

  await writeAudit({ type: 'cron-generate', ok: result.ok, count: result.assets?.length || 0 });
  return json(res, result.ok ? 200 : 500, result);
}
