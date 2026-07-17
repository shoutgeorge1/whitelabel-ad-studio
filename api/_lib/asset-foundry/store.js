import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { getConfig } from './config.js';

const PREFIX = 'asset-foundry';

function repoRoot() {
  // api/_lib/asset-foundry → repo root
  return path.resolve(process.cwd());
}

function localRoot() {
  return path.join(repoRoot(), '.local-masters', 'asset-foundry');
}

function shouldUseBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function ensureLocalDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function putBlob(pathname, data, contentType) {
  const { put } = await import('@vercel/blob');
  const result = await put(pathname, data, {
    access: 'private',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { url: result.url, pathname: result.pathname || pathname, store: 'blob' };
}

async function getBlob(pathname) {
  const { head, get } = await import('@vercel/blob');
  try {
    // Prefer download via URL from list/head
    const listed = await listPath(pathname);
    if (!listed) return null;
    const res = await fetch(listed.url, {
      headers: process.env.BLOB_READ_WRITE_TOKEN
        ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
        : {},
    });
    // Private blobs need get() with token in newer SDK
  } catch {
    /* fall through */
  }
  const { get: blobGet } = await import('@vercel/blob');
  const result = await blobGet(pathname, { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!result) return null;
  const ab = await result.blob.arrayBuffer();
  return Buffer.from(ab);
}

async function listPath(prefix) {
  const { list } = await import('@vercel/blob');
  const { blobs } = await list({
    prefix,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    limit: 1,
  });
  return blobs[0] || null;
}

async function putLocal(pathname, data, contentType) {
  const full = path.join(localRoot(), pathname.replace(/^asset-foundry\//, ''));
  await ensureLocalDir(path.dirname(full));
  await fs.writeFile(full, data);
  return { url: `local://${pathname}`, pathname, store: 'local', contentType };
}

async function getLocal(pathname) {
  const full = path.join(localRoot(), pathname.replace(/^asset-foundry\//, ''));
  try {
    return await fs.readFile(full);
  } catch {
    return null;
  }
}

async function listLocal(prefix, limit = 50, cursor = 0) {
  const rel = prefix.replace(/^asset-foundry\//, '').replace(/\/$/, '');
  const dir = path.join(localRoot(), rel);
  let names = [];
  try {
    names = await fs.readdir(dir);
  } catch {
    return { items: [], nextCursor: null };
  }
  names = names.filter((n) => n.endsWith('.json') || !n.includes('.')).sort().reverse();
  const slice = names.slice(Number(cursor) || 0, (Number(cursor) || 0) + limit);
  const items = [];
  for (const name of slice) {
    const full = path.join(dir, name);
    const stat = await fs.stat(full);
    if (stat.isFile()) {
      items.push({
        pathname: `${PREFIX}/${rel}/${name}`.replace(/\/+/g, '/'),
        url: `local://${PREFIX}/${rel}/${name}`,
      });
    }
  }
  const next = (Number(cursor) || 0) + limit;
  return { items, nextCursor: next < names.length ? String(next) : null };
}

export async function putBytes(pathname, data, contentType = 'application/octet-stream') {
  const p = pathname.startsWith(PREFIX) ? pathname : `${PREFIX}/${pathname}`;
  if (shouldUseBlob()) return putBlob(p, data, contentType);
  return putLocal(p, Buffer.isBuffer(data) ? data : Buffer.from(data), contentType);
}

export async function putJson(pathname, obj) {
  const body = Buffer.from(JSON.stringify(obj, null, 2), 'utf8');
  return putBytes(pathname, body, 'application/json');
}

export async function getBytes(pathname) {
  const p = pathname.startsWith(PREFIX) ? pathname : `${PREFIX}/${pathname}`;
  if (shouldUseBlob()) {
    try {
      const { get } = await import('@vercel/blob');
      const result = await get(p, { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN });
      if (!result?.blob) {
        // Fallback: list + fetch
        const { list } = await import('@vercel/blob');
        const { blobs } = await list({ prefix: p, token: process.env.BLOB_READ_WRITE_TOKEN, limit: 5 });
        const hit = blobs.find((b) => b.pathname === p) || blobs[0];
        if (!hit) return null;
        const res = await fetch(hit.url);
        if (!res.ok) return null;
        return Buffer.from(await res.arrayBuffer());
      }
      return Buffer.from(await result.blob.arrayBuffer());
    } catch (err) {
      console.error('[foundry-store] getBytes blob error', err?.message);
      return null;
    }
  }
  return getLocal(p);
}

export async function getJson(pathname) {
  const buf = await getBytes(pathname);
  if (!buf) return null;
  try {
    return JSON.parse(buf.toString('utf8'));
  } catch {
    return null;
  }
}

export async function listJson(prefix, { limit = 40, cursor = '0' } = {}) {
  const p = prefix.startsWith(PREFIX) ? prefix : `${PREFIX}/${prefix}`;
  if (shouldUseBlob()) {
    const { list } = await import('@vercel/blob');
    const opts = {
      prefix: p.endsWith('/') ? p : `${p}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      limit,
    };
    if (cursor && cursor !== '0') opts.cursor = cursor;
    const result = await list(opts);
    const items = [];
    for (const b of result.blobs || []) {
      if (!b.pathname.endsWith('.json')) continue;
      try {
        const res = await fetch(b.url);
        if (!res.ok) continue;
        const data = await res.json();
        items.push({ pathname: b.pathname, data, url: b.url });
      } catch {
        /* skip corrupt */
      }
    }
    return { items, nextCursor: result.cursor || null, hasMore: Boolean(result.hasMore) };
  }
  const listed = await listLocal(p, limit, cursor);
  const items = [];
  for (const it of listed.items) {
    const data = await getJson(it.pathname);
    if (data) items.push({ pathname: it.pathname, data, url: it.url });
  }
  return { items, nextCursor: listed.nextCursor, hasMore: Boolean(listed.nextCursor) };
}

export function makeAssetId(lane = 'gen') {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const laneSlug = String(lane).replace(/[^a-z0-9]+/gi, '-').slice(0, 24) || 'gen';
  const rand = crypto.randomBytes(4).toString('hex');
  return `mvaf_${ymd}_${laneSlug}_${rand}`;
}

export function makeBatchId() {
  return `batch_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

export function assetRecordPath(id) {
  return `${PREFIX}/records/${id}.json`;
}

export function batchRecordPath(id) {
  return `${PREFIX}/batches/${id}.json`;
}

export function preferencesPath() {
  return `${PREFIX}/preferences/taste-profile.json`;
}

export function spendPath() {
  return `${PREFIX}/preferences/spend.json`;
}

export function imagePath(statusFolder, id, ext = 'png') {
  return `${PREFIX}/images/${statusFolder}/${id}.${ext}`;
}

export function thumbPath(id) {
  return `${PREFIX}/thumbnails/${id}.webp`;
}

export async function saveAssetRecord(asset) {
  await putJson(assetRecordPath(asset.id), asset);
  return asset;
}

export async function loadAssetRecord(id) {
  if (!id || /[^a-zA-Z0-9_-]/.test(id)) return null;
  return getJson(assetRecordPath(id));
}

export async function listAssets({ status, limit = 40, cursor = '0' } = {}) {
  const { items, nextCursor, hasMore } = await listJson(`${PREFIX}/records`, { limit, cursor });
  let assets = items.map((i) => i.data).filter(Boolean);
  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    assets = assets.filter((a) => statuses.includes(a.status));
  }
  assets.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return { assets, nextCursor, hasMore };
}

export async function getSpend() {
  const data = (await getJson(spendPath())) || { days: {}, months: {}, updatedAt: null };
  return data;
}

export async function addSpend(usd, imageCount = 1) {
  const data = await getSpend();
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  data.days[day] = data.days[day] || { usd: 0, images: 0 };
  data.months[month] = data.months[month] || { usd: 0, images: 0 };
  data.days[day].usd = Math.round((data.days[day].usd + usd) * 1000) / 1000;
  data.days[day].images += imageCount;
  data.months[month].usd = Math.round((data.months[month].usd + usd) * 1000) / 1000;
  data.months[month].images += imageCount;
  data.updatedAt = now.toISOString();
  await putJson(spendPath(), data);
  return data;
}

export async function checkSpendAllowed(estUsd, imageCount) {
  const c = getConfig();
  const spend = await getSpend();
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  const dayUsed = spend.days[day]?.images || 0;
  const monthUsd = spend.months[month]?.usd || 0;
  if (dayUsed + imageCount > c.dailyLimit) {
    return {
      ok: false,
      error: `Daily image limit reached (${c.dailyLimit}). Remaining today: ${Math.max(0, c.dailyLimit - dayUsed)}.`,
    };
  }
  if (monthUsd + estUsd > c.monthlyBudgetUsd) {
    return {
      ok: false,
      error: `Monthly internal budget reached ($${c.monthlyBudgetUsd}). MTD ~$${monthUsd}.`,
    };
  }
  return {
    ok: true,
    remainingDailyImages: Math.max(0, c.dailyLimit - dayUsed),
    remainingMonthlyUsd: Math.round((c.monthlyBudgetUsd - monthUsd) * 1000) / 1000,
  };
}

export async function writeAudit(event) {
  const id = `audit_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
  const record = { id, at: new Date().toISOString(), ...event };
  try {
    await putJson(`${PREFIX}/audit/${id}.json`, record);
  } catch (err) {
    console.error('[foundry-store] audit failed', err?.message);
  }
  return record;
}

export { PREFIX, shouldUseBlob, localRoot };
