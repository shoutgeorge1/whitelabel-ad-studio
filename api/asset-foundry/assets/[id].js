import { json } from '../../../_lib/asset-foundry/auth.js';
import { withAuth, parseJson, methodNotAllowed } from '../../../_lib/asset-foundry/http.js';
import { getAsset, publicize, deletePendingAsset } from '../../../_lib/asset-foundry/assets-api.js';

export default async function handler(req, res) {
  const id = req.query?.id;
  if (!id || /[^a-zA-Z0-9_-]/.test(id)) {
    return json(res, 400, { ok: false, error: 'Invalid asset id.' });
  }

  if (req.method === 'GET') {
    const session = await withAuth(req, res);
    if (!session) return;
    const asset = await getAsset(id);
    if (!asset || asset.status === 'Deleted') {
      return json(res, 404, { ok: false, error: 'Asset not found.' });
    }
    return json(res, 200, { ok: true, asset: publicize(asset) });
  }

  if (req.method === 'DELETE') {
    const session = await withAuth(req, res, { mutate: true });
    if (!session) return;
    const body = (await parseJson(req, res).catch(() => ({}))) || {};
    const result = await deletePendingAsset(id, {
      reviewer: body.reviewer || session.identity,
      reason: body.reason || 'manual delete',
    });
    return json(res, result.status || (result.ok ? 200 : 400), result);
  }

  return methodNotAllowed(res, ['GET', 'DELETE']);
}
