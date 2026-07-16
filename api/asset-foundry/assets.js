import { json } from '../_lib/asset-foundry/auth.js';
import { withAuth, methodNotAllowed } from '../_lib/asset-foundry/http.js';
import { listAssets, publicize } from '../_lib/asset-foundry/assets-api.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const session = await withAuth(req, res);
  if (!session) return;

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const status = url.searchParams.get('status');
  const q = url.searchParams.get('q') || '';
  const limit = Math.min(80, Number(url.searchParams.get('limit') || 40));
  const cursor = url.searchParams.get('cursor') || '0';
  const lane = url.searchParams.get('lane');
  const vertical = url.searchParams.get('vertical');

  const statusList = status ? status.split(',').map((s) => s.trim()) : null;
  const { assets, nextCursor, hasMore } = await listAssets({ status: statusList, limit, cursor });

  let filtered = assets;
  if (lane) filtered = filtered.filter((a) => a.lane === lane);
  if (vertical) filtered = filtered.filter((a) => a.vertical === vertical);
  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter((a) =>
      [a.id, a.batchId, a.concept, a.lane, a.promptFinal, a.status].join(' ').toLowerCase().includes(needle),
    );
  }

  return json(res, 200, {
    ok: true,
    assets: filtered.map(publicize),
    nextCursor,
    hasMore,
  });
}
