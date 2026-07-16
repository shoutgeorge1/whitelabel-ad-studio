/**
 * Shared request helpers for Foundry API routes.
 */
import {
  requireSession,
  requireOrigin,
  readBody,
  json,
  configStatus,
} from './auth.js';
import { getConfig, COST_TABLE_USD, SIZE_PRESETS, QUALITY_MODES, estimateBatchCostUsd } from './config.js';

export async function withAuth(req, res, { mutate = false } = {}) {
  if (mutate && !requireOrigin(req, res)) return null;
  const session = requireSession(req, res);
  return session;
}

export function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow.join(', '));
  json(res, 405, { ok: false, error: 'Method not allowed.' });
}

export async function parseJson(req, res) {
  try {
    return await readBody(req);
  } catch (err) {
    json(res, 400, { ok: false, error: err.message || 'Invalid body' });
    return null;
  }
}

export function healthPayload() {
  const status = configStatus();
  return {
    ok: true,
    service: 'medvirtual-ai-asset-foundry',
    ...status,
    costTableUsd: COST_TABLE_USD,
    sizePresets: SIZE_PRESETS,
    qualityModes: QUALITY_MODES,
  };
}

export async function budgetPayload() {
  const cfg = getConfig();
  return {
    dailyLimit: cfg.dailyLimit,
    estimate: {
      draft1: estimateBatchCostUsd('draft', 1),
      draft4: estimateBatchCostUsd('draft', 4),
      review4: estimateBatchCostUsd('review', 4),
    },
  };
}

export { estimateBatchCostUsd, json, getConfig };
