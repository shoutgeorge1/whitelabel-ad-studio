import { json } from '../../../_lib/asset-foundry/auth.js';
import { withAuth, parseJson, methodNotAllowed } from '../../../_lib/asset-foundry/http.js';
import { markSynced } from '../../../_lib/asset-foundry/assets-api.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const session = await withAuth(req, res, { mutate: true });
  if (!session) return;
  const body = await parseJson(req, res);
  if (!body) return;
  const result = await markSynced(req.query?.id, {
    repositoryPath: String(body.repositoryPath || '').slice(0, 400),
    reviewer: body.reviewer || session.identity,
  });
  return json(res, result.status || (result.ok ? 200 : 400), result);
}
