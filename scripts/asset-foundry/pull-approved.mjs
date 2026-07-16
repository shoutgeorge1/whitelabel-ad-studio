/**
 * Pull approved Foundry assets into public/assets/ai-approved/
 * Does NOT commit or push.
 *
 * Usage:
 *   FOUNDRY_SYNC_BASE=https://your-deploy.vercel.app \
 *   FOUNDRY_SYNC_PASSWORD=... \
 *   npm run assets:pull-approved
 *
 * Local:
 *   FOUNDRY_SYNC_BASE=http://localhost:3456 \
 *   node --env-file=.env.local scripts/asset-foundry/pull-approved.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const DEST_ROOT = path.join(ROOT, 'public/assets/ai-approved');
const MANIFEST = path.join(DEST_ROOT, 'manifest.json');

const BASE = (process.env.FOUNDRY_SYNC_BASE || 'http://localhost:3456').replace(/\/$/, '');
const PASSWORD = process.env.FOUNDRY_SYNC_PASSWORD || process.env.ASSET_FOUNDRY_PASSWORD || '';
const FORCE = process.env.FOUNDRY_SYNC_FORCE === '1';

async function ask(q) {
  if (FORCE) return true;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(q, (ans) => {
      rl.close();
      resolve(/^y(es)?$/i.test(ans.trim()));
    });
  });
}

async function login() {
  if (!PASSWORD) throw new Error('Set FOUNDRY_SYNC_PASSWORD or ASSET_FOUNDRY_PASSWORD');
  const res = await fetch(`${BASE}/api/asset-foundry/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: BASE },
    body: JSON.stringify({ password: PASSWORD, identity: 'George' }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'Login failed');
  const setCookie = res.headers.getSetCookie?.() || [];
  const cookieHeader =
    setCookie.map((c) => c.split(';')[0]).join('; ') ||
    (res.headers.get('set-cookie') || '').split(',').map((c) => c.split(';')[0].trim()).join('; ');
  return cookieHeader;
}

async function loadManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  } catch {
    return { version: 1, updatedAt: null, assets: [] };
  }
}

async function main() {
  console.log(`Syncing from ${BASE}`);
  const cookie = await login();
  const headers = { Cookie: cookie, Origin: BASE };

  const listRes = await fetch(`${BASE}/api/asset-foundry/export/approved?unsynced=1`, { headers });
  const list = await listRes.json();
  if (!listRes.ok || !list.ok) throw new Error(list.error || 'Export failed');

  if (!list.assets?.length) {
    console.log('No unsynced approved assets.');
    return;
  }

  console.log(`Found ${list.assets.length} unsynced approved asset(s).`);
  const manifest = await loadManifest();
  const byId = new Map(manifest.assets.map((a) => [a.id, a]));
  let saved = 0;
  let skipped = 0;

  for (const asset of list.assets) {
    const folder = asset.suggestedFolder || 'operations';
    const filename = asset.suggestedFilename || `${asset.id}.png`;
    const dir = path.join(DEST_ROOT, folder);
    await fs.mkdir(dir, { recursive: true });
    const outPath = path.join(dir, filename);
    const rel = path.relative(path.join(ROOT, 'public'), outPath);

    try {
      await fs.access(outPath);
      const overwrite = await ask(`Exists ${rel} — overwrite? [y/N] `);
      if (!overwrite) {
        skipped += 1;
        continue;
      }
    } catch {
      /* new file */
    }

    const mediaRes = await fetch(`${BASE}${asset.downloadPath}`, { headers });
    if (!mediaRes.ok) {
      console.warn(`Skip ${asset.id}: media ${mediaRes.status}`);
      continue;
    }
    const buf = Buffer.from(await mediaRes.arrayBuffer());
    await fs.writeFile(outPath, buf);

    const metaPath = outPath.replace(/\.(png|jpg|jpeg|webp)$/i, '') + '.meta.json';
    await fs.writeFile(
      metaPath,
      JSON.stringify(
        {
          ...asset,
          repositoryPath: `/${rel.replace(/\\/g, '/')}`,
          syncedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    byId.set(asset.id, {
      id: asset.id,
      src: `/${rel.replace(/\\/g, '/')}`,
      lane: asset.lane,
      vertical: asset.vertical,
      concept: asset.concept,
      subjectType: asset.subjectType,
      format: asset.format,
      copySpace: asset.copySpace,
      subjectPosition: asset.subjectPosition,
      kind: asset.subjectType === 'no-person' ? 'ai-prop' : 'ai-approved',
      source: 'asset-foundry',
      syncedAt: new Date().toISOString(),
    });

    // Mark synced remotely after local write succeeds
    try {
      await fetch(`${BASE}/api/asset-foundry/assets/${asset.id}/mark-synced`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryPath: `/${rel.replace(/\\/g, '/')}`,
          reviewer: 'sync-script',
        }),
      });
    } catch {
      console.warn(`Saved locally but mark-synced failed for ${asset.id}`);
    }

    saved += 1;
    console.log(`✓ ${rel}`);
  }

  manifest.assets = [...byId.values()].sort((a, b) => String(b.syncedAt).localeCompare(String(a.syncedAt)));
  manifest.updatedAt = new Date().toISOString();
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

  console.log(`\nDone. Saved ${saved}, skipped ${skipped}. Manifest: public/assets/ai-approved/manifest.json`);
  console.log('No git commit was created.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
