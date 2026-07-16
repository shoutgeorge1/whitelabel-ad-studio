/**
 * MedVirtual AI Asset Foundry — local-first client
 * Server: one image per request. Client: IndexedDB + Generate Four orchestration.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  listAssets,
  saveAsset,
  updateAsset,
  deleteAsset,
  saveBatch,
  getPreferences,
  savePreferences,
  assetFromGenerationResult,
  getMeta,
  setMeta,
  revokeUrls,
} from './storage.js';
import { emptyProfile, applyFeedback, summarizeProfile, topHints } from './taste.js';
import {
  supportsFileSystemAccess,
  chooseApprovedFolder,
  saveApprovedToFolder,
  downloadBlob,
  suggestFilename,
} from './fs-save.js';
import './foundry.css';

const LIKE_TAGS = [
  'Believable',
  'Natural person',
  'Strong copy space',
  'Premium',
  'Good lighting',
  'Good composition',
  'Correct workplace',
  'Strong prop',
  'Strong vertical relevance',
  'Feels like MedVirtual',
  'Fresh direction',
  'Easy to build an ad around',
];

const MISS_TAGS = [
  'Looks fake',
  'Too generic',
  'Too stock-like',
  'Too posed',
  'Too glossy',
  'Too cheap-looking',
  'Wrong person',
  'Wrong workplace',
  'Bad hands',
  'Bad face',
  'No copy space',
  'Too busy',
  'Too blue',
  'Too much cyan',
  'Fake dashboard',
  'Recruitment feel',
  'Call-center feel',
  'Wrong vertical',
  'Weak concept',
  'Unusable crop',
  'Text artifacts',
  'Privacy concern',
  'Below our standard',
];

const MORE_CHANGES = [
  'More natural',
  'More premium',
  'Different representative person',
  'Wider copy space',
  'Person farther left',
  'Person farther right',
  'Cleaner background',
  'More realistic workplace',
  'Less cyan',
  'Less glossy',
  'More documentary',
  'More healthcare-specific',
  'More dental-specific',
  'Different camera angle',
  'Same visual idea, new variation',
];

const DEFAULT_FORM = {
  lane: 'raw-parts',
  vertical: 'none',
  concept: 'Face / headshot cutout',
  sceneType: 'Isolated portrait cutout',
  subjectPosition: 'center',
  copySpace: 'wide-negative-space',
  cameraTreatment: 'Eye-level editorial',
  lighting: 'Soft studio daylight',
  realism: 'Premium commercial',
  format: 'square',
  quality: 'draft',
  explorationLevel: 'balanced',
  additionalDirection:
    'Raw design ingredients for the graphics team — face, person, icons, callout badges. Never pink. Not a finished Meta ad.',
  promptOverride: '',
  consentAdvertising: false,
  consentImageEdit: false,
};

/** Matches server RAW_PART_ROTATION — four ingredients per Generate Four. */
const RAW_PART_ROTATION = [
  {
    concept: 'Face / headshot cutout',
    sceneType: 'Isolated portrait cutout',
    subjectPosition: 'center',
    copySpace: 'wide-negative-space',
    cameraTreatment: 'Eye-level editorial',
    lighting: 'Soft studio daylight',
    realism: 'Premium commercial',
    additionalDirection:
      'Tight head-and-shoulders of a credible female virtual medical administrator, clean solid or soft gradient background, sharp face detail, usable as a cutout plate. No long marketing copy.',
  },
  {
    concept: 'Person / talent plate',
    sceneType: 'Desk-based work scene',
    subjectPosition: 'right',
    copySpace: 'left',
    cameraTreatment: 'Natural documentary',
    lighting: 'Natural window light',
    realism: 'Natural',
    additionalDirection:
      'Upper-body or mid shot of a professional virtual medical admin at a clean desk with laptop, open left side for compositing. Scrubs lime/cobalt/cyan/yellow/navy — never pink.',
  },
  {
    concept: 'Icon / symbol pack',
    sceneType: 'Dimensional prop',
    subjectPosition: 'no-person',
    copySpace: 'wide-negative-space',
    cameraTreatment: 'Isolated object photography',
    lighting: 'Clean high-key',
    realism: 'Dimensional 3D',
    additionalDirection:
      'Isolated premium icon set on a clean background: phone, calendar, insurance shield, checkmark. Easy to extract. No long paragraphs.',
  },
  {
    concept: 'Callout / badge / text chip',
    sceneType: 'Graphic element plate',
    subjectPosition: 'no-person',
    copySpace: 'wide-negative-space',
    cameraTreatment: 'Isolated object photography',
    lighting: 'Clean high-key',
    realism: 'Dimensional 3D',
    additionalDirection:
      'Raw graphic badge / benefit-chip / callout ribbon plate with simple placeholder lettering. Lime, yellow, cobalt, cyan, navy, black, white — never pink. Not a finished ad.',
  },
];

async function api(path, { method = 'GET', body } = {}) {
  const opts = { method, credentials: 'include', headers: {} };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(path, opts);
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : { ok: res.ok };
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function useObjectUrl(blob) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!blob) {
      setUrl('');
      return undefined;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

function AssetImage({ asset, full = false, className, onClick }) {
  const blob = full ? asset.imageBlob || asset.thumbBlob : asset.thumbBlob || asset.imageBlob;
  const url = useObjectUrl(blob);
  if (!url) return <div className="af-img-placeholder" aria-hidden="true" />;
  return (
    <img
      className={className}
      src={url}
      alt={`AI-generated ${asset.concept || asset.lane} — raw design ingredient`}
      loading="lazy"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    />
  );
}

function FoundryApp() {
  const [tab, setTab] = useState('generate');
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [identity, setIdentity] = useState(() => localStorage.getItem('mvaf-reviewer') || 'George');
  const [loginError, setLoginError] = useState('');
  const [health, setHealth] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [presets, setPresets] = useState({});
  const [promptPreview, setPromptPreview] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [genError, setGenError] = useState('');
  const [assets, setAssets] = useState([]);
  const [prefs, setPrefs] = useState(emptyProfile());
  const [toast, setToast] = useState('');
  const [voteModal, setVoteModal] = useState(null);
  const [moreModal, setMoreModal] = useState(null);
  const [reviseModal, setReviseModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [folderReady, setFolderReady] = useState(false);
  const [libFilter, setLibFilter] = useState({ lane: '', person: '', saved: '' });
  const dirHandleRef = useRef(null);
  const generateLock = useRef(false);
  const urlCache = useRef([]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const refreshAssets = useCallback(async () => {
    const list = await listAssets();
    setAssets(list);
  }, []);

  const refreshPrefs = useCallback(async () => {
    const p = (await getPreferences()) || emptyProfile();
    setPrefs(p);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const data = await api('/api/asset-foundry/session');
      setHealth(data.health || null);
      if (data.authenticated || data.health?.localDev) {
        setSession({ authenticated: true, identity: data.identity || identity, localDev: data.health?.localDev });
      } else {
        setSession(null);
      }
      return data;
    } catch {
      setSession(null);
      return null;
    } finally {
      setLoadingSession(false);
    }
  }, [identity]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  useEffect(() => {
    (async () => {
      await refreshSession();
      await refreshAssets();
      await refreshPrefs();
      try {
        const meta = await api('/api/asset-foundry/generate');
        setPresets(meta.presets || {});
        setHealth(meta.health || null);
      } catch {
        /* unauthenticated production */
      }
    })();
    return () => revokeUrls(urlCache.current);
  }, [refreshSession, refreshAssets, refreshPrefs]);

  useEffect(() => {
    localStorage.setItem('mvaf-reviewer', identity);
  }, [identity]);

  const queue = useMemo(
    () =>
      assets.filter((a) =>
        ['Generated', 'Pending Review', 'George Liked', 'Revision Requested'].includes(
          a.status,
        ),
      ),
    [assets],
  );

  const library = useMemo(
    () => assets.filter((a) => ['Approved', 'Saved to Project'].includes(a.status)),
    [assets],
  );

  const filteredLibrary = useMemo(() => {
    return library.filter((a) => {
      if (libFilter.lane && a.lane !== libFilter.lane) return false;
      if (libFilter.person === 'person' && a.subjectType === 'no-person') return false;
      if (libFilter.person === 'prop' && a.subjectType !== 'no-person') return false;
      if (libFilter.saved === 'saved' && a.projectSaveStatus !== 'saved') return false;
      if (libFilter.saved === 'unsaved' && a.projectSaveStatus === 'saved') return false;
      return true;
    });
  }, [library, libFilter]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      if (health?.localDev) {
        await api('/api/asset-foundry/login', {
          method: 'POST',
          body: { password: password || 'local', identity, localDev: true },
        }).catch(() => null);
        await refreshSession();
        flash('Local producer mode');
        return;
      }
      await api('/api/asset-foundry/login', { method: 'POST', body: { password, identity } });
      setPassword('');
      await refreshSession();
      flash('Signed in');
    } catch (err) {
      setLoginError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await api('/api/asset-foundry/logout', { method: 'POST', body: {} });
    } catch {
      /* ignore */
    }
    setSession(null);
    flash('Signed out');
  }

  function applyPreset(id) {
    const p = presets[id];
    if (!p) return;
    setForm((f) => ({ ...f, ...p, promptOverride: '' }));
    flash(p.label);
  }

  async function previewPrompt() {
    setGenError('');
    try {
      const data = await api('/api/asset-foundry/generate', {
        method: 'POST',
        body: { ...form, previewOnly: true },
      });
      setPromptPreview(data.promptSystem || '');
      setForm((f) => ({ ...f, promptOverride: f.promptOverride || data.promptSystem || '' }));
    } catch (err) {
      setGenError(err.message);
    }
  }

  async function runOneGeneration(payload) {
    const data = await api('/api/asset-foundry/generate', { method: 'POST', body: payload });
    if (!data.ok || !data.imageBase64) throw new Error(data.error || 'No image returned');
    return assetFromGenerationResult(data);
  }

  async function generateFour() {
    if (generateLock.current || generating) return;
    const unreviewed = queue.filter((a) => a.status === 'Pending Review' || a.status === 'Generated');
    if (unreviewed.length) {
      const ok = window.confirm('There are unreviewed images. Start a new four-image batch anyway?');
      if (!ok) return;
    }
    if (form.lane === 'real-talent-reference' && (!form.consentAdvertising || !form.consentImageEdit)) {
      setGenError('Real Talent Reference requires both consent checkboxes.');
      return;
    }

    generateLock.current = true;
    setGenerating(true);
    setGenError('');
    setProgress('Preparing');
    setTab('review');

    const batchId = `batch_${Date.now().toString(36)}`;
    const results = [];
    const errors = [];

    try {
      await saveBatch({
        id: batchId,
        createdAt: new Date().toISOString(),
        settings: { ...form },
        assetIds: [],
        status: 'in-progress',
      });

      for (let i = 0; i < 4; i++) {
        setProgress(`Generating ${i + 1} of 4`);
        try {
          const part =
            form.lane === 'raw-parts' ? RAW_PART_ROTATION[i % RAW_PART_ROTATION.length] : null;
          const record = await runOneGeneration({
            ...form,
            ...(part || {}),
            // Keep a short kit note; override clears once composing begins
            additionalDirection: [form.additionalDirection, part?.additionalDirection]
              .filter(Boolean)
              .join(' '),
            // For raw kit, each part gets its own composed prompt (ignore override after first)
            promptOverride: form.lane === 'raw-parts' ? undefined : form.promptOverride || undefined,
            batchId,
            variantIndex: i,
            quality: form.quality === 'draft' ? 'draft' : 'review',
          });
          results.push(record);
          await refreshAssets();
        } catch (err) {
          errors.push({ index: i, error: err.message });
          // no automatic retry
        }
      }

      await saveBatch({
        id: batchId,
        createdAt: new Date().toISOString(),
        settings: { ...form },
        assetIds: results.map((r) => r.id),
        status: errors.length ? 'partial' : 'complete',
        errors,
      });

      setProgress(errors.length ? `Complete with ${errors.length} failure(s)` : 'Complete');
      if (errors.length) setGenError(errors.map((e) => `#${e.index + 1}: ${e.error}`).join(' · '));
      flash(errors.length ? `Partial batch · ${results.length}/4` : 'Four images ready');
    } finally {
      setGenerating(false);
      generateLock.current = false;
      setTimeout(() => setProgress(''), 4000);
    }
  }

  async function testConnection() {
    if (generateLock.current || generating) return;
    generateLock.current = true;
    setGenerating(true);
    setProgress('Connection test · Draft square');
    setGenError('');
    try {
      const data = await api('/api/asset-foundry/test-generation', { method: 'POST', body: {} });
      if (!data.imageBase64) throw new Error(data.error || 'No image');
      await assetFromGenerationResult(data);
      await refreshAssets();
      setTab('review');
      flash('Connection test OK');
    } catch (err) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
      generateLock.current = false;
      setProgress('');
    }
  }

  async function persistPrefs(next) {
    setPrefs(next);
    await savePreferences(next);
  }

  async function submitVote() {
    if (!voteModal) return;
    const { asset, direction, tags, note } = voteModal;
    const vote = {
      at: new Date().toISOString(),
      reviewer: identity,
      direction,
      tags,
      note: String(note || '').slice(0, 400),
    };
    let status = asset.status;
    if (direction === 'up') {
      status = 'George Liked';
    } else {
      status = 'Rejected';
    }
    await updateAsset(asset.id, {
      votes: [...(asset.votes || []), vote],
      feedbackTags: [...new Set([...(asset.feedbackTags || []), ...tags])],
      status,
      reviewer: identity,
    });
    const next = applyFeedback(prefs, {
      reviewer: identity,
      action: direction === 'up' ? 'thumbs_up' : 'thumbs_down',
      attributes: asset.preferenceAttributes || [],
      tags,
    });
    await persistPrefs(next);
    setVoteModal(null);
    await refreshAssets();
    flash(direction === 'up' ? 'Liked' : 'Rejected');
  }

  async function approve(asset) {
    if (asset.personType === 'real-person-reference-edit') {
      const ok = window.confirm(
        'Identity review: face recognizable, skin tone accurate, role accurate, consent confirmed?',
      );
      if (!ok) return;
    }
    await updateAsset(asset.id, {
      status: 'Approved',
      approvedBy: identity,
      approvedAt: new Date().toISOString(),
      identityReviewStatus: asset.personType === 'real-person-reference-edit' ? 'confirmed' : asset.identityReviewStatus,
    });
    const next = applyFeedback(prefs, {
      reviewer: identity,
      action: 'approve',
      attributes: asset.preferenceAttributes || [],
    });
    await persistPrefs(next);
    await refreshAssets();
    flash('Approved');
  }

  async function chooseFolder() {
    try {
      const handle = await chooseApprovedFolder();
      dirHandleRef.current = handle;
      setFolderReady(true);
      await setMeta('hasFolder', true);
      flash('Approved asset folder ready');
    } catch (err) {
      if (err?.name !== 'AbortError') flash(err.message || 'Folder pick cancelled');
    }
  }

  async function approveAndSave(asset) {
    await approve(asset);
    const fresh = (await listAssets()).find((a) => a.id === asset.id) || asset;
    if (supportsFileSystemAccess() && dirHandleRef.current) {
      try {
        const result = await saveApprovedToFolder(dirHandleRef.current, fresh, {
          confirmOverwrite: async (name) => window.confirm(`Overwrite existing file ${name}?`),
        });
        if (result.skipped) {
          flash('Save skipped');
          return;
        }
        await updateAsset(fresh.id, {
          status: 'Saved to Project',
          projectSaveStatus: 'saved',
          projectFilename: result.relativePath,
        });
        const next = applyFeedback(prefs, {
          reviewer: identity,
          action: 'production',
          attributes: fresh.preferenceAttributes || [],
        });
        await persistPrefs(next);
        await refreshAssets();
        flash(`Saved · ${result.relativePath}`);
        return;
      } catch (err) {
        flash(`Approve ok · save failed: ${err.message}`);
      }
    }
    // Fallback download
    if (fresh.imageBlob) {
      downloadBlob(fresh.imageBlob, suggestFilename(fresh));
      const meta = {
        id: fresh.id,
        batchId: fresh.batchId,
        lane: fresh.lane,
        concept: fresh.concept,
        promptFinal: fresh.promptFinal,
        aiDisclosure: fresh.aiDisclosure,
        copySpace: fresh.copySpace,
        status: 'Approved',
      };
      downloadBlob(new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' }), suggestFilename(fresh).replace(/\.png$/, '.json'));
      flash('Downloaded image + metadata (move into public/assets/ai-approved/)');
    }
  }

  async function generateMoreLikeParent(parent, { changes = [], note = '', reason = 'more-like-this' } = {}) {
    if (!parent || generateLock.current) return;
    generateLock.current = true;
    setGenerating(true);
    setTab('review');
    const batchId = `batch_${Date.now().toString(36)}_mlt`;
    setProgress('More like this · preparing');

    const nextPrefs = applyFeedback(prefs, {
      reviewer: identity,
      action: 'more_like_this',
      attributes: parent.preferenceAttributes || [],
    });
    await persistPrefs(nextPrefs);

    const base = {
      lane: parent.lane || 'raw-parts',
      vertical: parent.vertical,
      concept: parent.concept,
      sceneType: parent.sceneType,
      subjectPosition: parent.subjectPosition,
      copySpace: parent.copySpace,
      cameraTreatment: parent.cameraTreatment,
      lighting: parent.lighting,
      realism: parent.realism,
      format:
        parent.format === '1:1'
          ? 'square'
          : parent.format === '4:5' || parent.format === '9:16'
            ? 'portrait'
            : parent.format || 'square',
      quality: 'review',
      parentAssetId: parent.id,
      rootAssetId: parent.rootAssetId || parent.id,
      additionalDirection: [
        'Create closely related RAW design ingredients — same kind of asset the team downloaded.',
        'Keep it a usable part (face, person, icon, callout, etc.), not a finished Meta ad.',
        'Never pink. Never MedVirtual.ai logos.',
        changes.length ? `Adjustments: ${changes.join('; ')}.` : '',
        note ? `Producer note: ${String(note).slice(0, 400)}` : '',
      ]
        .filter(Boolean)
        .join(' '),
      generationReason: reason,
    };

    try {
      for (let i = 0; i < 4; i++) {
        setProgress(`More like this · ${i + 1} of 4`);
        try {
          await runOneGeneration({ ...base, batchId, variantIndex: i });
          await refreshAssets();
        } catch (err) {
          setGenError(err.message);
        }
      }
      flash('Generated 4 more like the downloaded asset');
    } finally {
      setMoreModal(null);
      setGenerating(false);
      generateLock.current = false;
      setProgress('');
    }
  }

  async function runMoreLikeThis() {
    if (!moreModal) return;
    await generateMoreLikeParent(moreModal.asset, {
      changes: moreModal.changes || [],
      note: moreModal.note || '',
    });
  }

  /** Download = “I want more like this” — save file, then generate four related raw parts. */
  async function downloadAndMoreLike(asset) {
    if (!asset?.imageBlob) {
      flash('No image file yet');
      return;
    }
    downloadBlob(asset.imageBlob, suggestFilename(asset));
    flash('Downloaded · generating 4 more like this…');
    setLightbox(null);
    await generateMoreLikeParent(asset, {
      reason: 'download-more-like-this',
      note: 'Triggered because the producer downloaded this raw asset.',
    });
  }

  async function runRevise() {
    if (!reviseModal?.instruction || generateLock.current) return;
    generateLock.current = true;
    setGenerating(true);
    const parent = reviseModal.asset;
    try {
      await updateAsset(parent.id, { status: 'Revision Requested' });
      setProgress('Revising…');
      await runOneGeneration({
        lane: parent.lane,
        vertical: parent.vertical,
        concept: parent.concept,
        sceneType: parent.sceneType,
        subjectPosition: parent.subjectPosition,
        copySpace: parent.copySpace,
        cameraTreatment: parent.cameraTreatment,
        lighting: parent.lighting,
        realism: parent.realism,
        format: parent.format === '1:1' ? 'square' : parent.format || 'portrait',
        quality: 'review',
        parentAssetId: parent.id,
        rootAssetId: parent.rootAssetId || parent.id,
        additionalDirection: `Revision of ${parent.id}: ${reviseModal.instruction}`,
        variantIndex: 1,
        generationReason: 'revise',
      });
      await refreshAssets();
      flash('Revision created · original kept');
      setReviseModal(null);
    } catch (err) {
      flash(err.message);
    } finally {
      setGenerating(false);
      generateLock.current = false;
      setProgress('');
    }
  }

  const estimated = useMemo(() => {
    const table = health?.costTableUsd || { low: 0.005, medium: 0.041 };
    const q = form.quality === 'draft' ? 'low' : 'medium';
    return Math.round((table[q] || 0.041) * 4 * 1000) / 1000;
  }, [form.quality, health]);

  const summary = useMemo(() => summarizeProfile(prefs), [prefs]);
  const hints = useMemo(() => topHints(prefs), [prefs]);

  if (loadingSession) return <div className="af-loading">Loading Foundry…</div>;

  const needsProdLogin = !session?.authenticated && health && !health.localDev && !health.generationEnabled;

  if (!session?.authenticated && !health?.localDev) {
    return (
      <div className="af-login">
        <div className="af-login-card">
          <p className="af-eyebrow">Producer access</p>
          <h1>AI Asset Foundry</h1>
          <p className="af-lede">
            Raw design ingredients — people, faces, icons, callouts. Click to enlarge. Download keeps the file and generates four more like it.
          </p>
          {needsProdLogin || !health?.hasOpenAI ? (
            <div className="af-warn" role="status">
              Asset Foundry generation is not configured for this environment.
            </div>
          ) : null}
          <form onSubmit={handleLogin}>
            <label>
              Reviewer identity
                <select value={identity} onChange={(e) => setIdentity(e.target.value)}>
                {['George', 'Graphics Team'].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!health?.localDev}
              />
            </label>
            {loginError && (
              <p className="af-error" role="alert">
                {loginError}
              </p>
            )}
            <button type="submit" className="af-btn af-btn-primary">
              Sign in
            </button>
          </form>
          <p className="af-fine">Preference-guided generation · does not retrain OpenAI models.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="af-app">
      <div className="af-toolbar">
        <div>
          <p className="af-eyebrow">Private · Creative Lab</p>
          <h1>AI Asset Foundry</h1>
          <p className="af-lede">
            Raw design ingredients — people, faces, icons, callouts. Click to enlarge. Download keeps the file and generates four more like it.
          </p>
        </div>
        <div className="af-toolbar-meta">
          <label className="af-inline">
            Reviewing as
            <select value={identity} onChange={(e) => setIdentity(e.target.value)} aria-label="Reviewer identity">
              {['George', 'Graphics Team'].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          {health?.localDev && <span className="af-pill">Local producer</span>}
          <button type="button" className="af-btn af-btn-ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>

      {!health?.generationEnabled && (
        <div className="af-warn" role="status">
          Asset Foundry generation is not configured for this environment.
        </div>
      )}

      {(progress || generating) && (
        <div className="af-progress" role="status" aria-live="polite">
          {progress || 'Working…'}
        </div>
      )}

      <nav className="af-tabs" aria-label="Foundry views">
        {[
          ['generate', 'Generate'],
          ['review', 'Review Queue'],
          ['library', 'Approved Library'],
          ['taste', 'Taste Profile'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'active' : ''}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => setTab(id)}
          >
            {label}
            {id === 'review' && queue.length ? <span className="af-count">{queue.length}</span> : null}
          </button>
        ))}
      </nav>

      {tab === 'generate' && (
        <section className="af-panel" aria-label="Generate">
          <div className="af-presets">
            {Object.values(presets).map((p) => (
              <button key={p.id} type="button" onClick={() => applyPreset(p.id)}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="af-grid-form">
            <Field label="Creative lane">
              <select value={form.lane} onChange={(e) => setForm({ ...form, lane: e.target.value })}>
                <option value="raw-parts">Raw parts kit (default)</option>
                <option value="real-va-workplace">Real VA Workplace</option>
                <option value="healthcare-operations">Healthcare Operations</option>
                <option value="saas-props">Premium Props</option>
                <option value="vertical-specific">Vertical-Specific</option>
                <option value="real-talent-reference">Approved Real Talent Reference</option>
              </select>
            </Field>
            <Field label="Practice vertical">
              <select value={form.vertical} onChange={(e) => setForm({ ...form, vertical: e.target.value })}>
                <option value="none">None / general</option>
                <option value="general-medical">General medical</option>
                <option value="dental">Dental</option>
                <option value="veterinary">Veterinary</option>
                <option value="behavioral-health">Behavioral health</option>
                <option value="billing-rcm">Billing / RCM</option>
              </select>
            </Field>
            <Field label="Asset / concept">
              <select value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })}>
                {[
                  'Face / headshot cutout',
                  'Person / talent plate',
                  'Icon / symbol pack',
                  'Callout / badge / text chip',
                  'Background / color plate',
                  'Too many calls',
                  'Scheduling overload',
                  'Patient intake backlog',
                  'Insurance verification',
                  'Billing support',
                  'Real person behind the work',
                  'Dedicated team member',
                  'Front-office pressure',
                  'Organized workflow',
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Scene / part type">
              <select value={form.sceneType} onChange={(e) => setForm({ ...form, sceneType: e.target.value })}>
                {[
                  'Isolated portrait cutout',
                  'Desk-based work scene',
                  'Dimensional prop',
                  'Graphic element plate',
                  'Background plate',
                  'Real workplace',
                  'Editorial portrait',
                  'Environmental portrait',
                  'Abstract operational scene',
                  'Human plus workflow',
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Subject placement">
              <select
                value={form.subjectPosition}
                onChange={(e) => setForm({ ...form, subjectPosition: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="center">Center</option>
                <option value="lower-third">Lower section</option>
                <option value="no-person">No person</option>
              </select>
            </Field>
            <Field label="Copy-space location">
              <select value={form.copySpace} onChange={(e) => setForm({ ...form, copySpace: e.target.value })}>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="wide-negative-space">Wide negative space</option>
              </select>
            </Field>
            <Field label="Camera">
              <select
                value={form.cameraTreatment}
                onChange={(e) => setForm({ ...form, cameraTreatment: e.target.value })}
              >
                {[
                  'Natural documentary',
                  'Eye-level editorial',
                  'Premium commercial',
                  'Medium workplace shot',
                  'Environmental portrait',
                  'Wide operational scene',
                  'Isolated object photography',
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Lighting">
              <select value={form.lighting} onChange={(e) => setForm({ ...form, lighting: e.target.value })}>
                {[
                  'Natural window light',
                  'Soft studio daylight',
                  'Warm neutral office light',
                  'Bright healthcare SaaS',
                  'Deep teal premium',
                  'Clean high-key',
                  'Controlled cinematic',
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Realism">
              <select value={form.realism} onChange={(e) => setForm({ ...form, realism: e.target.value })}>
                {['Natural', 'Editorial', 'Premium commercial', 'Stylized but believable', 'Dimensional 3D', 'Abstract'].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
            </Field>
            <Field label="Format">
              <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                <option value="square">Square · 1024×1024</option>
                <option value="portrait">Portrait · 1024×1536</option>
                <option value="vertical">Vertical · 1024×1536</option>
                <option value="landscape">Landscape · 1536×1024</option>
              </select>
            </Field>
            <Field label="Quality">
              <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })}>
                <option value="draft">Draft · low cost</option>
                <option value="review">Review · default</option>
              </select>
            </Field>
            <Field label="Exploration">
              <select
                value={form.explorationLevel}
                onChange={(e) => setForm({ ...form, explorationLevel: e.target.value })}
              >
                <option value="follow">Follow approvals closely</option>
                <option value="balanced">Balanced</option>
                <option value="push">Push slightly</option>
                <option value="wildcard">Brand-safe wildcard</option>
              </select>
            </Field>
          </div>

          {form.lane === 'real-talent-reference' && (
            <div className="af-consent" role="group" aria-label="Consent">
              <p className="af-warn">Manual identity review required before approval.</p>
              <label>
                <input
                  type="checkbox"
                  checked={form.consentAdvertising}
                  onChange={(e) => setForm({ ...form, consentAdvertising: e.target.checked })}
                />
                Advertising use approved
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.consentImageEdit}
                  onChange={(e) => setForm({ ...form, consentImageEdit: e.target.checked })}
                />
                Image-editing use approved
              </label>
            </div>
          )}

          <Field label="Additional direction">
            <textarea
              rows={3}
              maxLength={600}
              value={form.additionalDirection}
              onChange={(e) => setForm({ ...form, additionalDirection: e.target.value })}
              placeholder="Optional note — raw ingredient direction"
            />
          </Field>

          <div className="af-guardrails">
            <strong>Raw parts</strong>
            <span>
              Face · person · icons · callout badges · never pink · not finished ads · click image to enlarge ·
              Download = keep file + make 4 more like it
            </span>
          </div>
          {form.lane === 'raw-parts' && (
            <p className="af-fine">
              Generate Four rotates: 1 face cutout · 2 talent plate · 3 icon pack · 4 callout/badge chip.
            </p>
          )}

          {hints.length > 0 && (
            <p className="af-fine">Taste hints (n≥3): {hints.join(', ')}</p>
          )}

          <div className="af-prompt-box">
            <div className="af-prompt-actions">
              <button type="button" className="af-btn" onClick={previewPrompt}>
                Compose prompt
              </button>
              <span className="af-est">Est. four ~${estimated}</span>
            </div>
            <label>
              Final prompt (editable)
              <textarea
                rows={8}
                value={form.promptOverride || promptPreview}
                onChange={(e) => setForm({ ...form, promptOverride: e.target.value })}
                spellCheck={false}
              />
            </label>
            <p className="af-fine">
              Four sequential one-image API calls · preference-guided prompting · does not fine-tune OpenAI
            </p>
          </div>

          {genError && (
            <p className="af-error" role="alert">
              {genError}
            </p>
          )}

          <div className="af-primary-row">
            <button
              type="button"
              className="af-btn af-btn-primary af-btn-xl"
              onClick={generateFour}
              disabled={generating || !health?.generationEnabled}
            >
              {generating
                ? 'Generating…'
                : form.lane === 'raw-parts'
                  ? 'Generate raw kit (4)'
                  : 'Generate Four'}
            </button>
            <button type="button" className="af-btn" onClick={testConnection} disabled={generating}>
              Test connection (1× Draft)
            </button>
          </div>
        </section>
      )}

      {tab === 'review' && (
        <section className="af-panel" aria-label="Review queue">
          {!queue.length && <p className="af-empty">No pending assets. Generate a batch to start.</p>}
          <p className="af-fine" style={{ marginBottom: '0.85rem' }}>
            Click any image to enlarge. <b>Download</b> saves the PNG and automatically generates four more like it.
          </p>
          <div className="af-review-grid">
            {queue.map((asset) => (
              <article key={asset.id} className="af-card">
                <button
                  type="button"
                  className="af-card-media af-card-media-btn"
                  style={{ aspectRatio: `${asset.width || 1} / ${asset.height || 1}` }}
                  onClick={() => setLightbox(asset)}
                  aria-label={`Enlarge ${asset.concept || asset.lane}`}
                >
                  <AssetImage asset={asset} />
                </button>
                <div className="af-card-body">
                  <div className="af-status">{asset.status}</div>
                  <h3>{asset.concept || asset.lane}</h3>
                  <p className="af-meta">
                    {asset.id} · {asset.format} · {asset.quality}
                  </p>
                  <div className="af-actions">
                    <button
                      type="button"
                      className="af-approve"
                      onClick={() => downloadAndMoreLike(asset)}
                      disabled={generating}
                    >
                      Download (+ 4 more)
                    </button>
                    <button type="button" onClick={() => setLightbox(asset)}>
                      Enlarge
                    </button>
                    <button type="button" onClick={() => setVoteModal({ asset, direction: 'up', tags: [], note: '' })}>
                      Thumbs Up
                    </button>
                    <button type="button" onClick={() => setVoteModal({ asset, direction: 'down', tags: [], note: '' })}>
                      Thumbs Down
                    </button>
                    <button type="button" onClick={() => setMoreModal({ asset, changes: [], note: '' })}>
                      More Like This
                    </button>
                    <button type="button" onClick={() => setReviseModal({ asset, instruction: '' })}>
                      Revise
                    </button>
                    <button type="button" onClick={() => approveAndSave(asset)}>
                      Approve & Save
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await updateAsset(asset.id, { status: 'Archived' });
                        await refreshAssets();
                      }}
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      className="af-danger"
                      onClick={async () => {
                        if (!window.confirm('Delete this pending asset?')) return;
                        await deleteAsset(asset.id);
                        await refreshAssets();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'library' && (
        <section className="af-panel" aria-label="Approved library">
          <div className="af-lib-toolbar">
            {supportsFileSystemAccess() ? (
              <button type="button" className="af-btn af-btn-primary" onClick={chooseFolder}>
                {folderReady ? 'Change Approved Asset Folder' : 'Choose Approved Asset Folder'}
              </button>
            ) : (
              <p className="af-fine">File System Access API unavailable — use Download on each asset.</p>
            )}
            <select aria-label="Filter lane" value={libFilter.lane} onChange={(e) => setLibFilter({ ...libFilter, lane: e.target.value })}>
              <option value="">All lanes</option>
              <option value="raw-parts">Raw parts</option>
              <option value="real-va-workplace">Real VA</option>
              <option value="healthcare-operations">Operations</option>
              <option value="saas-props">Props</option>
              <option value="vertical-specific">Vertical</option>
            </select>
            <select
              aria-label="Filter person"
              value={libFilter.person}
              onChange={(e) => setLibFilter({ ...libFilter, person: e.target.value })}
            >
              <option value="">Person / prop</option>
              <option value="person">With person</option>
              <option value="prop">No person</option>
            </select>
            <select
              aria-label="Filter saved"
              value={libFilter.saved}
              onChange={(e) => setLibFilter({ ...libFilter, saved: e.target.value })}
            >
              <option value="">Saved / unsaved</option>
              <option value="saved">Saved to project</option>
              <option value="unsaved">Not saved</option>
            </select>
          </div>
          {!filteredLibrary.length && <p className="af-empty">No approved assets yet.</p>}
          <div className="af-lib-grid">
            {filteredLibrary.map((asset) => (
              <article key={asset.id} className="af-lib-card">
                <button
                  type="button"
                  className="af-lib-media-btn"
                  onClick={() => setLightbox(asset)}
                  aria-label={`Enlarge ${asset.concept || asset.lane}`}
                >
                  <AssetImage asset={asset} />
                </button>
                <div>
                  <strong>{asset.concept || asset.lane}</strong>
                  <p className="af-meta">
                    {asset.id} · {asset.projectSaveStatus || 'unsaved'}
                  </p>
                  <div className="af-actions">
                    <button
                      type="button"
                      className="af-approve"
                      onClick={() => downloadAndMoreLike(asset)}
                      disabled={generating}
                    >
                      Download (+ 4 more)
                    </button>
                    <button type="button" onClick={() => approveAndSave(asset)}>
                      Save to project
                    </button>
                    <button type="button" onClick={() => setMoreModal({ asset, changes: [], note: '' })}>
                      More Like This
                    </button>
                    <a className="af-btn" href="/ideas.html">
                      New Ad Ideas
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'taste' && (
        <section className="af-panel" aria-label="Taste profile">
          <p className="af-lede">
            MedVirtual taste profile — preference-guided prompting. Votes do not fine-tune OpenAI models.
          </p>
          <div className="af-taste-grid">
            {['combined', 'george', 'graphics'].map((key) => (
              <div key={key} className="af-taste-col">
                <h3>{key}</h3>
                <h4>Favored</h4>
                <ul>
                  {(summary[key]?.approved || []).slice(0, 8).map((r) => (
                    <li key={r.attribute}>
                      {r.attribute} <span>(n={r.evidence})</span>
                    </li>
                  ))}
                  {!summary[key]?.approved?.length && <li className="af-muted">Insufficient evidence</li>}
                </ul>
                <h4>Avoided</h4>
                <ul>
                  {(summary[key]?.rejected || []).slice(0, 8).map((r) => (
                    <li key={r.attribute}>
                      {r.attribute} <span>(n={r.evidence})</span>
                    </li>
                  ))}
                  {!summary[key]?.rejected?.length && <li className="af-muted">Insufficient evidence</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {toast && (
        <div className="af-toast" role="status">
          {toast}
        </div>
      )}

      {voteModal && (
        <Modal
          title={voteModal.direction === 'up' ? 'What worked?' : 'What missed?'}
          onClose={() => setVoteModal(null)}
          onConfirm={submitVote}
        >
          <div className="af-tags">
            {(voteModal.direction === 'up' ? LIKE_TAGS : MISS_TAGS).map((t) => (
              <button
                key={t}
                type="button"
                className={voteModal.tags.includes(t) ? 'on' : ''}
                onClick={() =>
                  setVoteModal({
                    ...voteModal,
                    tags: voteModal.tags.includes(t)
                      ? voteModal.tags.filter((x) => x !== t)
                      : [...voteModal.tags, t].slice(0, 8),
                  })
                }
              >
                {t}
              </button>
            ))}
          </div>
          <label>
            Internal note
            <input
              value={voteModal.note}
              onChange={(e) => setVoteModal({ ...voteModal, note: e.target.value })}
              maxLength={400}
            />
          </label>
        </Modal>
      )}

      {moreModal && (
        <Modal title="More like this" onClose={() => setMoreModal(null)} onConfirm={runMoreLikeThis}>
          <p>Four related images linked to {moreModal.asset.id}. Original preserved.</p>
          <div className="af-tags">
            {MORE_CHANGES.map((t) => (
              <button
                key={t}
                type="button"
                className={moreModal.changes.includes(t) ? 'on' : ''}
                onClick={() =>
                  setMoreModal({
                    ...moreModal,
                    changes: moreModal.changes.includes(t)
                      ? moreModal.changes.filter((x) => x !== t)
                      : [...moreModal.changes, t].slice(0, 6),
                  })
                }
              >
                {t}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {reviseModal && (
        <Modal title="Revise" onClose={() => setReviseModal(null)} onConfirm={runRevise}>
          <label>
            Instruction
            <textarea
              rows={4}
              value={reviseModal.instruction}
              onChange={(e) => setReviseModal({ ...reviseModal, instruction: e.target.value })}
              maxLength={800}
              placeholder="More copy space, move person right, less cyan…"
            />
          </label>
        </Modal>
      )}

      {lightbox && (
        <div
          className="af-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged raw asset"
          onClick={() => setLightbox(null)}
        >
          <div className="af-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <AssetImage asset={lightbox} full className="af-lightbox-img" />
            <div className="af-lightbox-bar">
              <div>
                <strong>{lightbox.concept || lightbox.lane}</strong>
                <p className="af-meta">{lightbox.id}</p>
              </div>
              <div className="af-actions">
                <button
                  type="button"
                  className="af-approve"
                  onClick={() => downloadAndMoreLike(lightbox)}
                  disabled={generating}
                >
                  Download (+ 4 more)
                </button>
                <button type="button" onClick={() => setLightbox(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="af-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, children, onClose, onConfirm }) {
  return (
    <div className="af-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="af-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <div className="af-modal-actions">
          <button type="button" className="af-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="af-btn af-btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById('foundry-root');
if (root) createRoot(root).render(<FoundryApp />);
