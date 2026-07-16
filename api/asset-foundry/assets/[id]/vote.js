import { json } from '../../../_lib/asset-foundry/auth.js';
import { withAuth, parseJson, methodNotAllowed } from '../../../_lib/asset-foundry/http.js';
import { voteAsset } from '../../../_lib/asset-foundry/assets-api.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const session = await withAuth(req, res, { mutate: true });
  if (!session) return;
  const id = req.query?.id;
  const body = await parseJson(req, res);
  if (!body) return;
  const result = await voteAsset(id, {
    reviewer: body.reviewer || session.identity,
    direction: body.direction,
    tags: body.tags,
    note: body.note,
  });
  return json(res, result.status || (result.ok ? 200 : 400), result);
}
