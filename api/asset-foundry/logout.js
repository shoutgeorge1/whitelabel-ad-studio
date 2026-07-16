import { clearSessionCookie, requireOrigin, json } from '../_lib/asset-foundry/auth.js';
import { methodNotAllowed } from '../_lib/asset-foundry/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!requireOrigin(req, res)) return;
  clearSessionCookie(res);
  return json(res, 200, { ok: true });
}
