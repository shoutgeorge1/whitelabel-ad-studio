/**
 * Local Foundry API for Vite development (filesystem store under .local-masters).
 * Usage: node --env-file=.env.local scripts/asset-foundry/local-api.mjs
 */
import http from 'http';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const PORT = Number(process.env.ASSET_FOUNDRY_API_PORT || 3456);

process.env.ASSET_FOUNDRY_LOCAL_STORE = process.env.ASSET_FOUNDRY_LOCAL_STORE || 'true';
process.chdir(ROOT);

const STATIC = [
  ['POST', '/api/asset-foundry/login', 'api/asset-foundry/login.js'],
  ['GET', '/api/asset-foundry/login', 'api/asset-foundry/login.js'],
  ['POST', '/api/asset-foundry/logout', 'api/asset-foundry/logout.js'],
  ['GET', '/api/asset-foundry/session', 'api/asset-foundry/session.js'],
  ['GET', '/api/asset-foundry/health', 'api/asset-foundry/health.js'],
  ['GET', '/api/asset-foundry/generate', 'api/asset-foundry/generate.js'],
  ['POST', '/api/asset-foundry/generate', 'api/asset-foundry/generate.js'],
  ['POST', '/api/asset-foundry/test-generation', 'api/asset-foundry/test-generation.js'],
  ['POST', '/api/asset-foundry/edit', 'api/asset-foundry/edit.js'],
  ['GET', '/api/asset-foundry/assets', 'api/asset-foundry/assets.js'],
  ['GET', '/api/asset-foundry/preferences', 'api/asset-foundry/preferences.js'],
  ['PATCH', '/api/asset-foundry/preferences', 'api/asset-foundry/preferences.js'],
  ['GET', '/api/asset-foundry/references', 'api/asset-foundry/references.js'],
  ['POST', '/api/asset-foundry/references', 'api/asset-foundry/references.js'],
  ['GET', '/api/asset-foundry/export/approved', 'api/asset-foundry/export/approved.js'],
  ['POST', '/api/asset-foundry/cron/generate', 'api/asset-foundry/cron/generate.js'],
  ['GET', '/api/asset-foundry/cron/generate', 'api/asset-foundry/cron/generate.js'],
];

const DYNAMIC = [
  [/^\/api\/asset-foundry\/assets\/([^/]+)$/, 'api/asset-foundry/assets/[id].js', ['GET', 'DELETE']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/vote$/, 'api/asset-foundry/assets/[id]/vote.js', ['POST']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/review$/, 'api/asset-foundry/assets/[id]/review.js', ['POST']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/approve$/, 'api/asset-foundry/assets/[id]/approve.js', ['POST']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/promote$/, 'api/asset-foundry/assets/[id]/promote.js', ['POST']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/archive$/, 'api/asset-foundry/assets/[id]/archive.js', ['POST']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/more-like-this$/, 'api/asset-foundry/assets/[id]/more-like-this.js', ['POST']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/revise$/, 'api/asset-foundry/assets/[id]/revise.js', ['POST']],
  [/^\/api\/asset-foundry\/assets\/([^/]+)\/mark-synced$/, 'api/asset-foundry/assets/[id]/mark-synced.js', ['POST']],
  [/^\/api\/asset-foundry\/media\/([^/]+)$/, 'api/asset-foundry/media/[id].js', ['GET']],
];

function resolveRoute(method, pathname) {
  const clean = pathname.replace(/\/$/, '') || '/';
  for (const [m, p, file] of STATIC) {
    if (m === method && clean === p) return { file, query: {} };
  }
  for (const [re, file, methods] of DYNAMIC) {
    const match = clean.match(re);
    if (match && methods.includes(method)) {
      return { file, query: { id: decodeURIComponent(match[1]) } };
    }
  }
  return null;
}

async function loadHandler(rel) {
  const abs = path.join(ROOT, rel);
  const mod = await import(pathToFileURL(abs).href);
  return mod.default;
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const u = new URL(req.url || '/', `http://localhost:${PORT}`);
    const resolved = resolveRoute(req.method, u.pathname);
    if (!resolved) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: 'Not found', path: u.pathname }));
      return;
    }
    u.searchParams.forEach((v, k) => {
      resolved.query[k] = v;
    });
    req.query = resolved.query;
    const handler = await loadHandler(resolved.file);
    await handler(req, res);
  } catch (err) {
    console.error('[foundry-local-api]', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: err.message || 'Server error' }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`Asset Foundry local API → http://localhost:${PORT}`);
  console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'set' : 'MISSING'}`);
  console.log(`ASSET_FOUNDRY_PASSWORD: ${process.env.ASSET_FOUNDRY_PASSWORD ? 'set' : 'MISSING'}`);
  console.log(`ASSET_FOUNDRY_SESSION_SECRET: ${process.env.ASSET_FOUNDRY_SESSION_SECRET ? 'set' : 'MISSING'}`);
});
