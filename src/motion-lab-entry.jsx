import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player } from '@remotion/player';
import { FeedbackPanel, RejectedTray, useCreativeFeedback } from './components/CreativeFeedback.jsx';
import { LayeredAdComposition } from './remotion/compositions/LayeredAd.jsx';
import { MOTION_DEFAULTS, STORAGE_KEYS, STATUSES } from './remotion/data/motionDefaults.js';
import './motion-lab.css';

const COMPOSITIONS = {
  'MV-TYPE-ON-01': LayeredAdComposition,
  'MV-SLIDE-BUILD-01': LayeredAdComposition,
};

function loadMotionBatch() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.motionBatch);
    if (!raw) return structuredClone(MOTION_DEFAULTS);
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed?.concepts;
    if (!Array.isArray(list) || list.length !== MOTION_DEFAULTS.length) return structuredClone(MOTION_DEFAULTS);
    return list.map((c, i) => sanitizeMotion(c, MOTION_DEFAULTS[i]));
  } catch {
    return structuredClone(MOTION_DEFAULTS);
  }
}

function sanitizeMotion(c, fallback) {
  const base = { ...(fallback || {}), ...(c || {}) };
  base.bullets = Array.isArray(base.bullets)
    ? base.bullets.slice(0, 3).map((b) => String(b ?? '').replace(/<[^>]*>/g, ''))
    : fallback?.bullets || [];
  ['headline', 'headlineTwo', 'support', 'cta', 'internalNotes'].forEach((k) => {
    if (k in base) base[k] = String(base[k] ?? '').replace(/<[^>]*>/g, '');
  });
  if (!STATUSES.includes(base.status)) base.status = 'Draft';
  base.durationInFrames = Math.min(600, Math.max(240, Number(base.durationInFrames) || 300));
  return base;
}

function MotionCard({ item, index, onChange, feedback, onFeedback }) {
  const playerRef = useRef(null);
  const Component = COMPOSITIONS[item.compositionId];
  const duration = item.durationInFrames || 300;
  const inputProps = useMemo(
    () => ({ ...item, showSafeZones: Boolean(item.showSafeZones) }),
    [item],
  );

  const bind = (key, value) => onChange(index, { [key]: value });

  const exportStill = async (kind) => {
    const player = playerRef.current;
    if (!player) return;
    let target = 0;
    if (kind === 'middle') target = Math.floor(duration / 2);
    if (kind === 'end') target = Math.max(0, duration - 15);
    player.seekTo(target);
    await new Promise((r) => setTimeout(r, 120));
    const el = document.getElementById(`mcl-player-${index}`)?.querySelector('div');
    if (!window.htmlToImage || !el) {
      alert('Still export unavailable — use Remotion render for production frames.');
      return;
    }
    try {
      const dataUrl = await window.htmlToImage.toPng(el, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
        style: { width: '1080px', height: '1920px', transform: 'none' },
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `medvirtual-motion-${item.compositionId.toLowerCase()}-${kind}-1080x1920.png`;
      a.click();
    } catch (err) {
      console.error(err);
      alert('Still export failed');
    }
  };

  if (!Component) return null;

  return (
    <article className="mcl-card" id={item.compositionId}>
      <header className="mcl-card__head">
        <div className="mcl-num">Motion {index + 1}</div>
        <h2>{item.name}</h2>
        <p className="mcl-id">{item.compositionId}</p>
        <span className="mcl-status" data-status={item.status}>
          {item.status}
        </span>
      </header>

      <div className="mcl-player-wrap" id={`mcl-player-${index}`}>
        <Player
          ref={playerRef}
          component={Component}
          inputProps={inputProps}
          durationInFrames={duration}
          compositionWidth={1080}
          compositionHeight={1920}
          fps={30}
          style={{ width: '100%', aspectRatio: '1080 / 1920', borderRadius: 8 }}
          controls
          loop
          autoPlay={false}
          clickToPlay
          initiallyMuted
          doubleClickToFullscreen={false}
        />
      </div>

      <div className="mcl-controls">
        <label>
          Status
          <select value={item.status} onChange={(e) => bind('status', e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Animation intensity
          <select
            value={item.animationIntensity || 'standard'}
            onChange={(e) => bind('animationIntensity', e.target.value)}
          >
            <option value="subtle">Subtle</option>
            <option value="standard">Standard</option>
            <option value="energetic">Energetic</option>
          </select>
        </label>
        <label>
          Duration (frames @ 30fps)
          <input
            type="range"
            min={240}
            max={600}
            value={duration}
            onChange={(e) => bind('durationInFrames', Number(e.target.value))}
          />
          <span className="mcl-hint">
            {(duration / 30).toFixed(1)}s · max 20s
          </span>
        </label>
        <label className="mcl-check">
          <input
            type="checkbox"
            checked={Boolean(item.showSafeZones)}
            onChange={(e) => bind('showSafeZones', e.target.checked)}
          />
          Show safe-zone guides (preview only)
        </label>
        <label>
          Headline
          <input value={item.headline || ''} onChange={(e) => bind('headline', e.target.value)} />
        </label>
        <label>
          Headline line 2
          <input value={item.headlineTwo || ''} onChange={(e) => bind('headlineTwo', e.target.value)} />
        </label>
        <label>
          Support
          <input value={item.support || ''} onChange={(e) => bind('support', e.target.value)} />
        </label>
        {[0, 1, 2].map((i) => (
          <label key={i}>
            Bullet {i + 1}
            <input
              value={(item.bullets || [])[i] || ''}
              onChange={(e) => {
                const bullets = [...(item.bullets || ['', '', ''])];
                bullets[i] = e.target.value;
                bind('bullets', bullets);
              }}
            />
          </label>
        ))}
        <label>
          CTA
          <input value={item.cta || ''} onChange={(e) => bind('cta', e.target.value)} />
        </label>
        <label>
          Human PNG layer
          <input value={item.humanSrc || ''} onChange={(e) => bind('humanSrc', e.target.value)} />
        </label>
        <label>
          Internal notes
          <textarea
            rows={2}
            value={item.internalNotes || ''}
            onChange={(e) => bind('internalNotes', e.target.value)}
          />
        </label>
      </div>

      <div className="mcl-actions">
        <button type="button" onClick={() => playerRef.current?.play()}>
          Play
        </button>
        <button type="button" onClick={() => playerRef.current?.pause()}>
          Pause
        </button>
        <button
          type="button"
          onClick={() => {
            playerRef.current?.seekTo(0);
          }}
        >
          Restart
        </button>
        <button
          type="button"
          onClick={async () => {
            await exportStill('first');
            alert(
              'Exported first-frame still (9:16). For 4:5 and 1:1: crop in graphics or rebuild from approved masters.',
            );
          }}
        >
          Export first frame
        </button>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(JSON.stringify(item, null, 2));
          }}
        >
          Copy composition JSON
        </button>
        <a className="mcl-link" href="/vma-approved.html">
          Approved masters
        </a>
        <a className="mcl-link" href="/vma-video.html">
          Video specs
        </a>
      </div>

      <FeedbackPanel
        id={`motion:${item.compositionId}`}
        value={feedback[`motion:${item.compositionId}`]}
        onChange={onFeedback}
      />

      <details className="mcl-render">
        <summary>Open in Remotion Studio / render commands</summary>
        <pre>{`npm run remotion:studio
remotion render src/remotion/index.js ${item.compositionId} .local-masters/renders/${item.compositionId.toLowerCase()}.mp4

# Output lands in .local-masters/renders/ (gitignored)`}</pre>
      </details>
    </article>
  );
}

function ElementLibrary({ projects, feedback, onFeedback, onRestore }) {
  const allElements = projects.flatMap((project) =>
    (project.elements || []).map((element) => ({
      ...element,
      name: `${project.name} · ${element.label}`,
      feedbackId: `element:${project.compositionId}:${element.id}`,
    })),
  );

  return (
    <section className="element-library">
      <header>
        <div>
          <p className="mcl-eyebrow">Build components first</p>
          <h2>Video Element Library</h2>
          <p>Approve the human, headline, benefits/icons, and CTA separately. Templates only assemble approved layers.</p>
        </div>
      </header>

      {projects.map((project) => (
        <section className="element-project" key={project.compositionId}>
          <div className="element-project__head">
            <div>
              <strong>{project.name}</strong>
              <span>{project.compositionId}</span>
            </div>
            <span className="element-project__rule">No flattened static</span>
          </div>
          <div className="element-grid">
            {(project.elements || [])
              .filter((element) => feedback[`element:${project.compositionId}:${element.id}`]?.vote !== 'down')
              .map((element) => {
                const feedbackId = `element:${project.compositionId}:${element.id}`;
                return (
                  <article className="element-card" key={element.id}>
                    <div className="element-card__type">{element.type}</div>
                    {element.type === 'human' ? (
                      <div className="element-card__human">
                        <img src={element.value} alt={`${project.name} isolated admin element`} />
                      </div>
                    ) : (
                      <div className={`element-card__sample type-${element.type}`}>{element.value}</div>
                    )}
                    <div className="element-card__meta">
                      <strong>{element.label}</strong>
                      <span data-status={element.status}>{element.status}</span>
                    </div>
                    <FeedbackPanel id={feedbackId} value={feedback[feedbackId]} onChange={onFeedback} compact />
                  </article>
                );
              })}
          </div>
        </section>
      ))}

      <RejectedTray items={allElements} feedback={feedback} onRestore={onRestore} />
    </section>
  );
}

function MotionLabApp() {
  const [batch, setBatch] = useState(loadMotionBatch);
  const { feedback, update: updateFeedback, restore: restoreFeedback } = useCreativeFeedback();

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.motionBatch,
      JSON.stringify({ version: 1, savedAt: new Date().toISOString(), concepts: batch }),
    );
  }, [batch]);

  const onChange = useCallback((index, patch) => {
    setBatch((prev) => {
      const next = [...prev];
      next[index] = sanitizeMotion({ ...next[index], ...patch }, MOTION_DEFAULTS[index]);
      return next;
    });
  }, []);

  return (
    <div className="mcl-app">
      <header className="mcl-hero">
        <h1>Motion Concept Lab</h1>
        <p>
          Two approved techniques: <b>Type-on Hook</b> and <b>Slide Build</b>. Every video is assembled from
          separate human, headline, benefit/icon, and CTA layers.
        </p>
      </header>

      <div className="mcl-toolbar">
        <button
          type="button"
          className="primary"
          onClick={() => {
            if (confirm('Reset both layered motion projects to defaults?')) {
              setBatch(structuredClone(MOTION_DEFAULTS));
            }
          }}
        >
          Reset motion batch
        </button>
        <a className="mcl-btn" href="/vma-approved.html">
          Approved masters
        </a>
        <a className="mcl-btn" href="/ideas.html">
          New ad ideas
        </a>
        <a className="mcl-btn" href="/vma-video.html">
          Specs &amp; handoff
        </a>
      </div>

      <ElementLibrary
        projects={batch}
        feedback={feedback}
        onFeedback={updateFeedback}
        onRestore={restoreFeedback}
      />

      <div className="mcl-section-head">
        <p className="mcl-eyebrow">Assemble approved elements</p>
        <h2>Video Template Previews</h2>
        <p>Thumbs down removes a render from the active lab. Leave a note so the next version addresses the failure.</p>
      </div>

      <div className="mcl-grid">
        {batch
          .filter((item) => feedback[`motion:${item.compositionId}`]?.vote !== 'down')
          .map((item) => {
            const index = batch.findIndex((candidate) => candidate.compositionId === item.compositionId);
            return (
              <MotionCard
                key={item.compositionId}
                item={item}
                index={index}
                onChange={onChange}
                feedback={feedback}
                onFeedback={updateFeedback}
              />
            );
          })}
      </div>

      <RejectedTray
        items={batch.map((item) => ({ ...item, feedbackId: `motion:${item.compositionId}` }))}
        feedback={feedback}
        onRestore={restoreFeedback}
      />

      <section className="mcl-notes">
        <h2>Preview vs production render</h2>
        <p>
          Browser preview uses <code>@remotion/player</code> (starts muted — Meta plays silent first). Local MP4
          renders use <code>npm run remotion:studio</code> into <code>.local-masters/renders/</code>.
        </p>
      </section>
    </div>
  );
}

const mount = document.getElementById('motion-lab-root');
if (mount) {
  createRoot(mount).render(
    <React.StrictMode>
      <MotionLabApp />
    </React.StrictMode>,
  );
}
