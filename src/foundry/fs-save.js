/**
 * File System Access API helpers for saving approved assets into the project folder.
 */

export function supportsFileSystemAccess() {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
}

export async function chooseApprovedFolder() {
  const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
  return handle;
}

export async function verifyPermission(dirHandle) {
  if (!dirHandle) return false;
  const opts = { mode: 'readwrite' };
  if ((await dirHandle.queryPermission(opts)) === 'granted') return true;
  if ((await dirHandle.requestPermission(opts)) === 'granted') return true;
  return false;
}

function suggestFolder(asset) {
  if (asset.lane === 'real-va-workplace') return 'real-va';
  if (asset.lane === 'saas-props') return 'props';
  if (asset.lane === 'healthcare-operations') return 'operations';
  if (asset.vertical === 'dental') return 'dental';
  if (asset.vertical === 'veterinary') return 'veterinary';
  if (asset.vertical === 'behavioral-health') return 'behavioral-health';
  if (asset.vertical === 'billing-rcm') return 'billing';
  if (asset.vertical === 'general-medical') return 'medical';
  return 'experimental';
}

function suggestFilename(asset) {
  const lane = (asset.lane || 'asset').replace(/[^a-z0-9]+/gi, '-').slice(0, 24);
  const date = (asset.createdAt || new Date().toISOString()).slice(0, 10).replace(/-/g, '');
  const short = String(asset.id || '').split('_').pop() || 'x';
  return `mv-ai-${lane}-${date}-${short}.png`;
}

async function ensureDir(parent, name) {
  return parent.getDirectoryHandle(name, { create: true });
}

async function writeFile(dir, name, data, { confirmOverwrite } = {}) {
  try {
    await dir.getFileHandle(name);
    if (confirmOverwrite) {
      const ok = await confirmOverwrite(name);
      if (!ok) return { skipped: true, name };
    }
  } catch {
    /* new file */
  }
  const fh = await dir.getFileHandle(name, { create: true });
  const writable = await fh.createWritable();
  await writable.write(data);
  await writable.close();
  return { saved: true, name };
}

export async function saveApprovedToFolder(dirHandle, asset, { confirmOverwrite } = {}) {
  const ok = await verifyPermission(dirHandle);
  if (!ok) throw new Error('Folder permission denied');

  const category = suggestFolder(asset);
  const catDir = await ensureDir(dirHandle, category);
  const filename = suggestFilename(asset);
  const metaName = filename.replace(/\.png$/i, '.json');

  if (!asset.imageBlob) throw new Error('Missing image blob');

  const imgResult = await writeFile(catDir, filename, asset.imageBlob, { confirmOverwrite });
  if (imgResult.skipped) return { skipped: true, filename };

  const meta = {
    id: asset.id,
    batchId: asset.batchId,
    createdAt: asset.createdAt,
    lane: asset.lane,
    vertical: asset.vertical,
    concept: asset.concept,
    promptSystem: asset.promptSystem,
    promptFinal: asset.promptFinal,
    votes: asset.votes,
    feedbackTags: asset.feedbackTags,
    aiDisclosure: asset.aiDisclosure,
    recommendedCopyPlacement: asset.copySpace,
    subjectPosition: asset.subjectPosition,
    format: asset.format,
    width: asset.width,
    height: asset.height,
    parentAssetId: asset.parentAssetId,
    status: 'Saved to Project',
    personType: asset.personType,
    preferenceAttributes: asset.preferenceAttributes,
  };

  await writeFile(catDir, metaName, new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' }));

  // Best-effort manifest update
  try {
    const manifestHandle = await dirHandle.getFileHandle('manifest.json', { create: true });
    let manifest = { version: 1, updatedAt: null, assets: [] };
    try {
      const file = await manifestHandle.getFile();
      const text = await file.text();
      if (text.trim()) manifest = JSON.parse(text);
    } catch {
      /* empty */
    }
    const entry = {
      id: asset.id,
      src: `/assets/ai-approved/${category}/${filename}`,
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
    };
    manifest.assets = [entry, ...(manifest.assets || []).filter((a) => a.id !== asset.id)];
    manifest.updatedAt = new Date().toISOString();
    const w = await manifestHandle.createWritable();
    await w.write(JSON.stringify(manifest, null, 2));
    await w.close();
  } catch {
    /* manifest optional */
  }

  return {
    saved: true,
    filename,
    metaName,
    category,
    relativePath: `${category}/${filename}`,
  };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export { suggestFolder, suggestFilename };
