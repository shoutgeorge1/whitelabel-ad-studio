import { json } from '../../_lib/asset-foundry/auth.js';
import { withAuth, methodNotAllowed } from '../../_lib/asset-foundry/http.js';
import { listAssets, publicize } from '../../_lib/asset-foundry/assets-api.js';

/**
 * Export approved (unsynced) assets for local sync script.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const session = await withAuth(req, res);
  if (!session) return;

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const unsyncedOnly = url.searchParams.get('unsynced') !== '0';

  const { assets } = await listAssets({ status: ['Approved', 'Promoted'], limit: 100 });
  let list = assets;
  if (unsyncedOnly) {
    list = list.filter((a) => a.repositorySyncStatus !== 'synced');
  }

  return json(res, 200, {
    ok: true,
    count: list.length,
    assets: list.map((a) => ({
      ...publicize(a),
      downloadPath: `/api/asset-foundry/media/${a.id}`,
      suggestedFolder: suggestFolder(a),
      suggestedFilename: suggestFilename(a),
    })),
  });
}

function suggestFolder(a) {
  if (a.lane === 'real-va-workplace') return 'real-va';
  if (a.lane === 'saas-props') return 'saas-props';
  if (a.lane === 'healthcare-operations') return 'operations';
  if (a.vertical === 'dental') return 'dental';
  if (a.vertical === 'billing-rcm') return 'billing';
  if (a.vertical === 'general-medical') return 'medical';
  if ((a.concept || '').toLowerCase().includes('schedul')) return 'scheduling';
  if (a.subjectType === 'no-person') return 'backgrounds';
  if (a.lane === 'controlled-exploration') return 'experimental';
  return 'operations';
}

function suggestFilename(a) {
  const lane = (a.lane || 'asset').slice(0, 20);
  return `${a.id}_${lane}.${a.outputFormat || 'png'}`;
}
