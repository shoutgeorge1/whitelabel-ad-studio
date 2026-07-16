/**
 * Asset mutation helpers used by dynamic routes.
 */
import {
  loadAssetRecord,
  saveAssetRecord,
  putBytes,
  getBytes,
  writeAudit,
  imagePath,
} from './store.js';
import { publicAsset } from './openai.js';
import { applyFeedback } from './preferences.js';
import { LIKE_TAGS, MISS_TAGS, STATUSES } from './config.js';

export { listAssets } from './store.js';

export function publicize(asset) {
  return publicAsset(asset);
}

export async function getAsset(id) {
  return loadAssetRecord(id);
}

export async function voteAsset(id, { reviewer, direction, tags = [], note = '' }) {
  const asset = await loadAssetRecord(id);
  if (!asset) return { ok: false, status: 404, error: 'Asset not found.' };
  if (!['up', 'down'].includes(direction)) return { ok: false, status: 400, error: 'Invalid vote.' };

  const allowed = direction === 'up' ? LIKE_TAGS : MISS_TAGS;
  const cleanTags = (tags || []).filter((t) => allowed.includes(t)).slice(0, 8);
  const vote = {
    at: new Date().toISOString(),
    reviewer: reviewer || 'George',
    direction,
    tags: cleanTags,
    note: String(note || '').slice(0, 400),
  };
  asset.votes = [...(asset.votes || []), vote];
  asset.feedbackTags = [...new Set([...(asset.feedbackTags || []), ...cleanTags])];
  asset.reviewer = reviewer;
  asset.updatedAt = new Date().toISOString();

  if (direction === 'up') {
    if (String(reviewer).includes('Graphics')) asset.status = 'Graphics Review';
    else asset.status = 'George Liked';
  } else {
    asset.status = 'Rejected';
  }

  await saveAssetRecord(asset);
  await applyFeedback({
    reviewer,
    action: direction === 'up' ? 'thumbs_up' : 'thumbs_down',
    attributes: asset.preferenceAttributes || [],
    tags: cleanTags,
  });
  await writeAudit({ type: 'vote', assetId: id, direction, reviewer });
  return { ok: true, asset: publicize(asset) };
}

export async function reviewAsset(id, { reviewer, status, note, identityChecklist }) {
  const asset = await loadAssetRecord(id);
  if (!asset) return { ok: false, status: 404, error: 'Asset not found.' };
  if (status && !STATUSES.includes(status)) return { ok: false, status: 400, error: 'Invalid status.' };

  if (status) asset.status = status;

  if (note) {
    asset.internalNotes = [
      ...(asset.internalNotes || []),
      { at: new Date().toISOString(), reviewer, note: String(note).slice(0, 500) },
    ];
  }
  if (identityChecklist && asset.personType === 'real-person-reference-edit') {
    asset.identityReviewStatus = identityChecklist;
  }
  asset.reviewer = reviewer || asset.reviewer;
  asset.updatedAt = new Date().toISOString();
  await saveAssetRecord(asset);
  return { ok: true, asset: publicize(asset) };
}

export async function approveAsset(id, { reviewer, identityConfirmed }) {
  const asset = await loadAssetRecord(id);
  if (!asset) return { ok: false, status: 404, error: 'Asset not found.' };

  if (asset.personType === 'real-person-reference-edit') {
    if (!identityConfirmed) {
      return {
        ok: false,
        status: 400,
        error: 'Real-person assets require identity review confirmation before approval.',
      };
    }
    asset.identityReviewStatus = 'confirmed';
  }

  // Move blob path conceptually to approved folder (copy metadata path)
  if (asset.imagePath && asset.imagePath.includes('/pending/')) {
    const buf = await getBytes(asset.imagePath);
    if (buf) {
      const ext = asset.imagePath.split('.').pop() || 'png';
      const next = imagePath('approved', asset.id, ext);
      await putBytes(next, buf, ext === 'webp' ? 'image/webp' : ext === 'jpg' ? 'image/jpeg' : 'image/png');
      asset.imagePath = next;
    }
  }

  asset.status = 'Approved';
  asset.approvedBy = reviewer || 'George';
  asset.approvedAt = new Date().toISOString();
  asset.updatedAt = asset.approvedAt;
  asset.repositorySyncStatus = asset.repositorySyncStatus || 'unsynced';
  await saveAssetRecord(asset);
  await applyFeedback({
    reviewer: asset.approvedBy,
    action: 'approve',
    attributes: asset.preferenceAttributes || [],
  });
  await writeAudit({ type: 'approve', assetId: id, reviewer: asset.approvedBy });
  return { ok: true, asset: publicize(asset) };
}

export async function promoteAsset(id, { reviewer, target }) {
  const asset = await loadAssetRecord(id);
  if (!asset) return { ok: false, status: 404, error: 'Asset not found.' };
  if (!['Approved', 'Promoted'].includes(asset.status)) {
    return { ok: false, status: 400, error: 'Only approved assets can be promoted.' };
  }
  asset.status = 'Promoted';
  asset.promotedAt = new Date().toISOString();
  asset.updatedAt = asset.promotedAt;
  asset.usageHistory = [
    ...(asset.usageHistory || []),
    { at: asset.promotedAt, reviewer, target: target || 'static-concept' },
  ];
  await saveAssetRecord(asset);
  await applyFeedback({
    reviewer,
    action: 'promoted',
    attributes: asset.preferenceAttributes || [],
  });
  return { ok: true, asset: publicize(asset) };
}

export async function archiveAsset(id, { reviewer }) {
  const asset = await loadAssetRecord(id);
  if (!asset) return { ok: false, status: 404, error: 'Asset not found.' };
  asset.status = 'Archived';
  asset.updatedAt = new Date().toISOString();
  asset.reviewer = reviewer || asset.reviewer;
  await saveAssetRecord(asset);
  return { ok: true, asset: publicize(asset) };
}

export async function deletePendingAsset(id, { reviewer, reason }) {
  const asset = await loadAssetRecord(id);
  if (!asset) return { ok: false, status: 404, error: 'Asset not found.' };
  const privacy = String(reason || '').toLowerCase().includes('privacy');
  asset.status = 'Deleted';
  asset.updatedAt = new Date().toISOString();
  asset.internalNotes = [
    ...(asset.internalNotes || []),
    { at: asset.updatedAt, reviewer, note: `Deleted: ${String(reason || 'pending cleanup').slice(0, 200)}` },
  ];
  await saveAssetRecord(asset);
  if (privacy) {
    await applyFeedback({ reviewer, action: 'privacy_delete', attributes: [] });
  }
  await writeAudit({ type: 'delete', assetId: id, reviewer, reason });
  return { ok: true, asset: publicize(asset) };
}

export async function markSynced(id, { repositoryPath, reviewer }) {
  const asset = await loadAssetRecord(id);
  if (!asset) return { ok: false, status: 404, error: 'Asset not found.' };
  if (!['Approved', 'Promoted'].includes(asset.status)) {
    return { ok: false, status: 400, error: 'Only approved assets can be marked synced.' };
  }
  asset.repositorySyncStatus = 'synced';
  asset.repositoryPath = repositoryPath || asset.repositoryPath;
  asset.updatedAt = new Date().toISOString();
  asset.internalNotes = [
    ...(asset.internalNotes || []),
    { at: asset.updatedAt, reviewer: reviewer || 'sync', note: `Synced to ${asset.repositoryPath}` },
  ];
  await saveAssetRecord(asset);
  return { ok: true, asset: publicize(asset) };
}
