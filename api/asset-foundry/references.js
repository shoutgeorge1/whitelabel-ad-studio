import { json } from '../_lib/asset-foundry/auth.js';
import { withAuth, parseJson, methodNotAllowed } from '../_lib/asset-foundry/http.js';
import { putJson, getJson, makeAssetId } from '../_lib/asset-foundry/store.js';
import { listAssets, publicize } from '../_lib/asset-foundry/assets-api.js';

const REF_PATH = 'asset-foundry/references/board.json';

const CATEGORIES = [
  'George Approved',
  'Shared Approved',
  'Composition Reference',
  'Lighting Reference',
  'Workplace Reference',
  'Prop Reference',
  'Avoid',
  'Competitor Principle Only',
];

async function loadBoard() {
  return (
    (await getJson(REF_PATH)) || {
      version: 1,
      updatedAt: null,
      references: [],
    }
  );
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await withAuth(req, res);
    if (!session) return;
    const board = await loadBoard();
    // Also surface approved library items as candidate references
    const { assets } = await listAssets({
      status: ['Approved', 'Promoted', 'George Liked'],
      limit: 40,
    });
    return json(res, 200, {
      ok: true,
      categories: CATEGORIES,
      references: board.references,
      approvedCandidates: assets.map(publicize),
      maxPerRequest: 3,
    });
  }

  if (req.method === 'POST') {
    const session = await withAuth(req, res, { mutate: true });
    if (!session) return;
    const body = await parseJson(req, res);
    if (!body) return;

    const board = await loadBoard();
    const ref = {
      id: body.id || makeAssetId('ref'),
      createdAt: new Date().toISOString(),
      createdBy: session.identity,
      category: CATEGORIES.includes(body.category) ? body.category : 'Shared Approved',
      sourceAssetId: body.sourceAssetId || null,
      thumbnailUrl: body.sourceAssetId ? `/api/asset-foundry/media/${body.sourceAssetId}?thumb=1` : null,
      owner: body.owner || session.identity,
      approvalStatus: body.approvalStatus || 'approved',
      allowedUse: String(body.allowedUse || '').slice(0, 400),
      prohibitedUse: String(body.prohibitedUse || '').slice(0, 400),
      borrow: String(body.borrow || 'composition / lighting principles').slice(0, 300),
      doNotCopy: String(body.doNotCopy || 'logos, faces (unless consented), branded UI').slice(0, 300),
      containsRealPerson: Boolean(body.containsRealPerson),
      consentStatus: body.consentStatus || null,
      maySendToImageApi: body.category === 'Competitor Principle Only' ? false : Boolean(body.maySendToImageApi !== false),
      role: body.role || 'composition only',
    };
    board.references = [ref, ...board.references.filter((r) => r.id !== ref.id)].slice(0, 200);
    board.updatedAt = new Date().toISOString();
    await putJson(REF_PATH, board);
    return json(res, 200, { ok: true, reference: ref });
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}
