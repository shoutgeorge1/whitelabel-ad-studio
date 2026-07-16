import { json } from '../_lib/asset-foundry/auth.js';
import { healthPayload, budgetPayload, methodNotAllowed } from '../_lib/asset-foundry/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const budget = await budgetPayload();
    return json(res, 200, { ...healthPayload(), budget });
  } catch (err) {
    return json(res, 200, { ...healthPayload(), budget: null, warning: 'Spend store unavailable' });
  }
}
