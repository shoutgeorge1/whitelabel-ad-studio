import { getSession, json } from '../../../_lib/asset-foundry/auth.js';
import { methodNotAllowed } from '../../../_lib/asset-foundry/http.js';
import { loadAssetRecord, getBytes } from '../../../_lib/asset-foundry/store.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const session = getSession(req);
  if (!session) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Authentication required.' }));
    return;
  }

  const id = req.query?.id;
  if (!id || /[^a-zA-Z0-9_-]/.test(id)) {
    return json(res, 400, { ok: false, error: 'Invalid id.' });
  }

  const asset = await loadAssetRecord(id);
  if (!asset || asset.status === 'Deleted') {
    return json(res, 404, { ok: false, error: 'Not found.' });
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const wantThumb = url.searchParams.get('thumb') === '1';
  const path = wantThumb && asset.thumbnailPath ? asset.thumbnailPath : asset.imagePath;
  if (!path) return json(res, 404, { ok: false, error: 'No media.' });

  // Path must stay under asset-foundry/
  if (!path.startsWith('asset-foundry/') || path.includes('..')) {
    return json(res, 400, { ok: false, error: 'Invalid media path.' });
  }

  const buf = await getBytes(path);
  if (!buf) return json(res, 404, { ok: false, error: 'Media missing.' });

  const ext = path.split('.').pop();
  const type =
    ext === 'webp' ? 'image/webp' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';

  res.statusCode = 200;
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.setHeader('Content-Length', buf.length);
  res.end(buf);
}
