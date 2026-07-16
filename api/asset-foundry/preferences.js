import { json } from '../_lib/asset-foundry/auth.js';
import { withAuth, parseJson, methodNotAllowed } from '../_lib/asset-foundry/http.js';
import { loadPreferences, setPin, summarizeProfile } from '../_lib/asset-foundry/preferences.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await withAuth(req, res);
    if (!session) return;
    const profile = await loadPreferences();
    return json(res, 200, {
      ok: true,
      profile,
      summary: summarizeProfile(profile),
      learningLabel:
        'Preference-guided generation · MedVirtual taste profile · Approval-informed prompting. Does not fine-tune OpenAI models.',
    });
  }

  if (req.method === 'PATCH') {
    const session = await withAuth(req, res, { mutate: true });
    if (!session) return;
    const body = await parseJson(req, res);
    if (!body) return;
    if (!body.attribute || !body.pin) {
      return json(res, 400, { ok: false, error: 'attribute and pin required.' });
    }
    try {
      const profile = await setPin({
        reviewer: body.reviewer || 'combined',
        attribute: body.attribute,
        pin: body.pin,
      });
      return json(res, 200, { ok: true, summary: summarizeProfile(profile) });
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message });
    }
  }

  return methodNotAllowed(res, ['GET', 'PATCH']);
}
