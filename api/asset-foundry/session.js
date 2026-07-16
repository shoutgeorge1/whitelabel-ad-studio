import { getSession, json } from '../_lib/asset-foundry/auth.js';
import { healthPayload, budgetPayload, methodNotAllowed } from '../_lib/asset-foundry/http.js';
import { REVIEWERS } from '../_lib/asset-foundry/config.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const session = getSession(req);
  const health = healthPayload();
  let budget = null;
  try {
    budget = await budgetPayload();
  } catch {
    budget = null;
  }
  return json(res, 200, {
    ok: true,
    authenticated: Boolean(session),
    identity: session?.identity || null,
    localDev: Boolean(session?.localDev || health.localDev),
    reviewers: REVIEWERS,
    health,
    budget,
  });
}
