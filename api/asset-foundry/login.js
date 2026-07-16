import {
  validatePassword,
  setSessionCookie,
  checkLoginRateLimit,
  clientIp,
  json,
  requireOrigin,
} from '../_lib/asset-foundry/auth.js';
import { parseJson, methodNotAllowed, healthPayload } from '../_lib/asset-foundry/http.js';
import { REVIEWERS, isLocalDevEnvironment } from '../_lib/asset-foundry/config.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return json(res, 200, { ok: true, hint: 'POST to authenticate.' });
  }
  if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  if (!requireOrigin(req, res)) return;

  const body = await parseJson(req, res);
  if (!body) return;

  const ip = clientIp(req);
  const limit = checkLoginRateLimit(ip);
  if (!limit.ok) {
    return json(res, 429, { ok: false, error: 'Too many login attempts. Try again later.' });
  }

  const identity = REVIEWERS.includes(body.identity) ? body.identity : 'George';

  // Local development: unlock without production password
  if (isLocalDevEnvironment() && process.env.OPENAI_API_KEY) {
    setSessionCookie(res, identity);
    return json(res, 200, {
      ok: true,
      session: { identity, authenticated: true, localDev: true },
    });
  }

  if (!process.env.ASSET_FOUNDRY_PASSWORD || !process.env.ASSET_FOUNDRY_SESSION_SECRET) {
    return json(res, 503, {
      ok: false,
      error: 'Asset Foundry generation is not configured for this environment.',
      health: healthPayload(),
    });
  }

  if (!validatePassword(body.password)) {
    return json(res, 401, { ok: false, error: 'Invalid password.' });
  }

  setSessionCookie(res, identity);
  return json(res, 200, {
    ok: true,
    session: { identity, authenticated: true },
  });
}
