/**
 * IndexedDB persistence for MedVirtual AI Asset Foundry (local-first).
 * Abstraction so remote storage can be added later.
 */

const DB_NAME = 'mv-asset-foundry-v1';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('assets')) {
        const store = db.createObjectStore('assets', { keyPath: 'id' });
        store.createIndex('by_status', 'status', { unique: false });
        store.createIndex('by_batch', 'batchId', { unique: false });
        store.createIndex('by_created', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('batches')) {
        db.createObjectStore('batches', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

async function withStore(storeName, mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let result;
    try {
      result = fn(store);
    } catch (err) {
      reject(err);
      return;
    }
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'));
  });
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveAsset(asset) {
  await withStore('assets', 'readwrite', (store) => {
    store.put(asset);
  });
  return asset;
}

export async function getAsset(id) {
  return withStore('assets', 'readonly', (store) => reqToPromise(store.get(id)));
}

export async function listAssets() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('assets', 'readonly');
    const req = tx.objectStore('assets').getAll();
    req.onsuccess = () => {
      const list = (req.result || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function updateAsset(id, patch) {
  const existing = await getAsset(id);
  if (!existing) return null;
  const next = { ...existing, ...patch, id, updatedAt: new Date().toISOString() };
  await saveAsset(next);
  return next;
}

export async function deleteAsset(id) {
  await withStore('assets', 'readwrite', (store) => {
    store.delete(id);
  });
}

export async function saveBatch(batch) {
  await withStore('batches', 'readwrite', (store) => {
    store.put(batch);
  });
  return batch;
}

export async function listBatches() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('batches', 'readonly');
    const req = tx.objectStore('batches').getAll();
    req.onsuccess = () => {
      const list = (req.result || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function savePreferences(profile) {
  await withStore('preferences', 'readwrite', (store) => {
    store.put({ id: 'taste', ...profile });
  });
  return profile;
}

export async function getPreferences() {
  const row = await withStore('preferences', 'readonly', (store) => reqToPromise(store.get('taste')));
  return row || null;
}

export async function setMeta(key, value) {
  await withStore('meta', 'readwrite', (store) => {
    store.put({ key, value });
  });
}

export async function getMeta(key) {
  const row = await withStore('meta', 'readonly', (store) => reqToPromise(store.get(key)));
  return row?.value;
}

/** Convert base64 PNG to Blob + object URL helpers */
export function b64ToBlob(b64, mime = 'image/png') {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function assetFromGenerationResult(result) {
  const blob = b64ToBlob(result.imageBase64, result.asset.mimeType || 'image/png');
  const thumbBlob = await makeThumbnailBlob(blob);
  const record = {
    ...result.asset,
    imageBlob: blob,
    thumbBlob,
  };
  await saveAsset(record);
  return record;
}

async function makeThumbnailBlob(blob) {
  try {
    const bmp = await createImageBitmap(blob);
    const maxW = 480;
    const scale = Math.min(1, maxW / bmp.width);
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    return await new Promise((resolve) => canvas.toBlob((b) => resolve(b || blob), 'image/webp', 0.78));
  } catch {
    return blob;
  }
}

export function revokeUrls(urls) {
  (urls || []).forEach((u) => {
    try {
      URL.revokeObjectURL(u);
    } catch {
      /* ignore */
    }
  });
}
