import { json } from '../_lib/asset-foundry/auth.js';
import { withAuth, methodNotAllowed, healthPayload, getConfig } from '../_lib/asset-foundry/http.js';
import { runConnectionTest } from '../_lib/asset-foundry/openai.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const session = await withAuth(req, res, { mutate: true });
  if (!session) return;

  if (!healthPayload().generationEnabled) {
    const cfg = getConfig();
    return json(res, 503, {
      ok: false,
      error: cfg.localDev
        ? 'OPENAI_API_KEY is missing.'
        : 'Asset Foundry generation is not configured for this environment.',
      health: healthPayload(),
    });
  }

  const result = await runConnectionTest({ createdBy: session.identity || 'George' });
  if (!result.ok) return json(res, 500, result);
  return json(res, 200, result);
}
