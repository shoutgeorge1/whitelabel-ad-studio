import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player } from '@remotion/player';
import { MeetTeammateComposition } from './remotion/compositions/MeetTeammate.jsx';
import { RealWorkdayComposition } from './remotion/compositions/RealWorkday.jsx';
import { OverloadSupportComposition } from './remotion/compositions/OverloadSupport.jsx';
import { VerticalPracticeComposition } from './remotion/compositions/VerticalPractice.jsx';
import { VIDEO_DEFAULTS } from './remotion/data/videoDefaults.js';
import './video-lab.css';

const COMPOSITIONS = {
  'MV-MEET-TEAMMATE-01': MeetTeammateComposition,
  'MV-REAL-WORKDAY-01': RealWorkdayComposition,
  'MV-OVERLOAD-SUPPORT-01': OverloadSupportComposition,
  'MV-VERTICAL-PRACTICE-01': VerticalPracticeComposition,
};

const DATA = window.MV_VIDEO_LAB;

function fillSpoken(template, talent, verticalLabel, bullets) {
  const [s1, s2, s3] = bullets || ['scheduling', 'patient communication', 'admin support'];
  return String(template || '')
    .replace(/\{name\}/g, talent?.firstName || 'Your teammate')
    .replace(/\{vertical\}/g, (verticalLabel || 'healthcare').toLowerCase())
    .replace(/\{skill1\}/g, String(s1).toLowerCase())
    .replace(/\{skill2\}/g, String(s2).toLowerCase())
    .replace(/\{skill3\}/g, String(s3).toLowerCase());
}

function briefToText(brief) {
  return [
    `# ${brief.title}`,
    '',
    `Purpose: ${brief.purpose}`,
    `Viewer: ${brief.intendedViewer}`,
    `Person: ${brief.person.name} · ${brief.person.role}`,
    `Template: ${brief.template} (${brief.compositionId})`,
    `Tone: ${brief.tone}`,
    `CTA: ${brief.cta}`,
    `Length: ${brief.targetLength}`,
    brief.deadline ? `Deadline: ${brief.deadline}` : null,
    `Owner: ${brief.owner}`,
    '',
    brief.spokenLine ? `## Spoken line\n${brief.spokenLine}\n` : null,
    '## Shot list',
    ...brief.shotList.map((s, i) => `${i + 1}. ${s}`),
    '',
    '## Format',
    ...brief.capture.format.map((x) => `- ${x}`),
    '',
    '## Framing',
    ...brief.capture.framing.map((x) => `- ${x}`),
    '',
    '## Lighting',
    ...brief.capture.lighting.map((x) => `- ${x}`),
    '',
    '## Audio',
    ...brief.capture.audio.map((x) => `- ${x}`),
    '',
    `Background: ${brief.backgroundPreference}`,
    `Wardrobe: ${brief.wardrobe}`,
    '',
    '## Do not show',
    ...brief.doNotShow.map((x) => `- ${x}`),
    '',
    `File naming: ${brief.fileNaming}`,
    `Submission: ${brief.submission}`,
  ]
    .filter((x) => x !== null)
    .join('\n');
}

function buildBrief(form) {
  const talent = DATA.talent.find((t) => t.id === form.personId) || DATA.talent[0];
  const format = DATA.formats.find((f) => f.id === form.templateId) || DATA.formats[0];
  const vertical = DATA.verticals.find((v) => v.id === form.vertical) || DATA.verticals[0];
  const skills = (talent.listedSkills || [])
    .map((s) =>
      String(s)
        .replace(/^BPO\s*-\s*/i, '')
        .replace(/^VA\s*-\s*/i, '')
        .replace(/^Medical\s*-\s*/i, '')
        .trim(),
    )
    .filter(Boolean);
  while (skills.length < 3) skills.push(['scheduling', 'patient communication', 'admin support'][skills.length]);
  const spoken =
    form.spokenLine ||
    fillSpoken(format.defaultSpoken, talent, vertical.label, skills);

  return {
    title: `${format.workingName} — ${talent.firstName}`,
    purpose:
      'Create a short Meta ad that shows a real MedVirtual teammate so a practice owner can imagine interviewing dedicated virtual staff.',
    intendedViewer: `${vertical.label} practice owner / ops lead`,
    person: { id: talent.id, name: talent.firstName, role: talent.title },
    template: format.workingName,
    compositionId: format.compositionId,
    tone: form.tone,
    cta: form.cta,
    targetLength: form.targetLength || format.durationSec,
    deadline: form.deadline,
    owner: form.owner,
    spokenLine: form.requireAudio ? spoken : null,
    requireAudio: form.requireAudio,
    requireBroll: form.requireBroll,
    shotList: format.shotList,
    capture: DATA.captureStandard,
    backgroundPreference: form.backgroundPreference,
    wardrobe: form.wardrobe,
    doNotShow: DATA.captureStandard.background.avoid,
    fileNaming: `MV_${talent.firstName}_${format.shortName.replace(/\s+/g, '')}_take##_YYYYMMDD.mp4`,
    submission:
      'Email or hand off proxy clips to the assignment owner. Raw masters stay in .local-masters/video-source/ — never publish raw VA footage to the public site.',
    generatedAt: new Date().toISOString(),
  };
}

function CaptureBriefBuilder({ onUseTemplate }) {
  const [form, setForm] = useState({
    personId: DATA.talent[0]?.id || 'jessica',
    templateId: DATA.formats[0]?.id,
    vertical: 'medical',
    tone: DATA.tones[0],
    cta: DATA.ctas[0],
    requireAudio: true,
    requireBroll: false,
    targetLength: '10–15',
    backgroundPreference: 'Clean home office / neutral wall',
    wardrobe: DATA.captureStandard.wardrobe.join('; '),
    deadline: '07/27/2026',
    owner: 'Graphics / Video',
    spokenLine: '',
  });
  const [briefText, setBriefText] = useState('');
  const [briefJson, setBriefJson] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(DATA.promoteKey);
    if (!raw) return;
    try {
      const promoted = JSON.parse(raw);
      if (promoted?.concept) {
        const c = promoted.concept;
        setForm((f) => ({
          ...f,
          personId: c.candidateId || f.personId,
          vertical: c.vertical || f.vertical,
          cta: c.cta || f.cta,
          spokenLine: '',
          templateId:
            c.lane === 'vertical-workflow'
              ? 'MV-VERTICAL-PRACTICE-01'
              : c.lane === 'pain-human'
                ? 'MV-OVERLOAD-SUPPORT-01'
                : 'MV-MEET-TEAMMATE-01',
        }));
      }
      localStorage.removeItem(DATA.promoteKey);
    } catch {
      /* ignore */
    }
  }, []);

  const generate = () => {
    const format = DATA.formats.find((f) => f.id === form.templateId);
    const next = {
      ...form,
      requireAudio: form.requireAudio ?? format?.needsDtcAudio,
      requireBroll: form.requireBroll ?? format?.needsBroll,
    };
    const brief = buildBrief(next);
    setBriefJson(brief);
    setBriefText(briefToText(brief));
  };

  return (
    <section className="vpl-section" id="capture-brief">
      <h2>Capture brief generator</h2>
      <p className="lede">
        Build a short phone-recording brief a VA can follow in about 15–30 minutes. No cinema kit, no PHI, max one
        talking clip plus a few simple supporting shots.
      </p>
      <div className="vpl-grid-2">
        <label className="vpl-field">
          Person
          <select value={form.personId} onChange={(e) => setForm({ ...form, personId: e.target.value })}>
            {DATA.talent.map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} · {t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="vpl-field">
          Video template
          <select
            value={form.templateId}
            onChange={(e) => {
              const format = DATA.formats.find((f) => f.id === e.target.value);
              setForm({
                ...form,
                templateId: e.target.value,
                requireAudio: Boolean(format?.needsDtcAudio),
                requireBroll: Boolean(format?.needsBroll),
                targetLength: format?.durationSec || form.targetLength,
              });
              onUseTemplate?.(e.target.value);
            }}
          >
            {DATA.formats.map((f) => (
              <option key={f.id} value={f.id}>
                {f.workingName}
              </option>
            ))}
          </select>
        </label>
        <label className="vpl-field">
          Practice vertical
          <select value={form.vertical} onChange={(e) => setForm({ ...form, vertical: e.target.value })}>
            {DATA.verticals.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <label className="vpl-field">
          Tone
          <select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
            {DATA.tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="vpl-field">
          CTA
          <select value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })}>
            {DATA.ctas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="vpl-field">
          Target length
          <input value={form.targetLength} onChange={(e) => setForm({ ...form, targetLength: e.target.value })} />
        </label>
        <label className="vpl-field">
          Deadline
          <input value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </label>
        <label className="vpl-field">
          Assignment owner
          <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
        </label>
        <label className="vpl-field">
          Background preference
          <input
            value={form.backgroundPreference}
            onChange={(e) => setForm({ ...form, backgroundPreference: e.target.value })}
          />
        </label>
        <label className="vpl-field">
          Wardrobe guidance
          <input value={form.wardrobe} onChange={(e) => setForm({ ...form, wardrobe: e.target.value })} />
        </label>
        <label className="vpl-field">
          Direct-to-camera audio required?
          <select
            value={form.requireAudio ? 'yes' : 'no'}
            onChange={(e) => setForm({ ...form, requireAudio: e.target.value === 'yes' })}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="vpl-field">
          B-roll required?
          <select
            value={form.requireBroll ? 'yes' : 'no'}
            onChange={(e) => setForm({ ...form, requireBroll: e.target.value === 'yes' })}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="vpl-field" style={{ gridColumn: '1 / -1' }}>
          Spoken line (optional override)
          <textarea
            rows={2}
            value={form.spokenLine}
            onChange={(e) => setForm({ ...form, spokenLine: e.target.value })}
            placeholder="Leave blank to use the template + approved name/role skills"
          />
        </label>
      </div>
      <div className="vpl-actions">
        <button type="button" className="primary" onClick={generate}>
          Generate brief
        </button>
        <button
          type="button"
          disabled={!briefText}
          onClick={async () => {
            await navigator.clipboard.writeText(briefText);
          }}
        >
          Copy Brief
        </button>
        <button
          type="button"
          disabled={!briefText}
          onClick={() => {
            const blob = new Blob([briefText], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `medvirtual-capture-brief-${form.personId}.txt`;
            a.click();
          }}
        >
          Download Brief
        </button>
        <button type="button" disabled={!briefText} onClick={() => window.print()}>
          Print Brief
        </button>
        <button
          type="button"
          disabled={!briefJson}
          onClick={() => {
            const blob = new Blob([JSON.stringify(briefJson, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `medvirtual-capture-brief-${form.personId}.json`;
            a.click();
          }}
        >
          Export Brief JSON
        </button>
      </div>
      {briefText ? <pre className="vpl-brief-out">{briefText}</pre> : null}
    </section>
  );
}

function TemplatePreview({ activeId, setActiveId }) {
  const base = VIDEO_DEFAULTS.find((v) => v.compositionId === activeId) || VIDEO_DEFAULTS[0];
  const [draft, setDraft] = useState(base);
  const [localVideo, setLocalVideo] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [consent, setConsent] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [notes, setNotes] = useState('');
  const playerRef = useRef(null);
  const Component = COMPOSITIONS[activeId];

  useEffect(() => {
    const next = VIDEO_DEFAULTS.find((v) => v.compositionId === activeId) || VIDEO_DEFAULTS[0];
    setDraft(next);
    setLocalVideo(null);
  }, [activeId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DATA.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.previews?.[activeId]) {
        setDraft((d) => ({ ...d, ...parsed.previews[activeId], videoSrc: null }));
      }
    } catch {
      /* ignore */
    }
  }, [activeId]);

  useEffect(() => {
    const payload = {
      version: 1,
      savedAt: new Date().toISOString(),
      previews: {
        [activeId]: {
          ...draft,
          videoSrc: null,
        },
      },
      consent,
      feedback,
      notes,
    };
    localStorage.setItem(DATA.storageKey, JSON.stringify(payload));
  }, [draft, activeId, consent, feedback, notes]);

  const inputProps = useMemo(
    () => ({
      ...draft,
      videoSrc: localVideo || draft.videoSrc || null,
      showSafeZones: Boolean(draft.showSafeZones),
    }),
    [draft, localVideo],
  );

  if (!Component || !DATA) return null;

  const phrases = String(draft.spokenLine || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className={`vpl-section ${reviewMode ? 'vpl-review' : ''}`} id="templates">
      <h2>Four real-person video templates</h2>
      <p className="lede">
        Preview treatments with approved posters until footage arrives. Local uploads are browser-only previews — not
        stored on a server.
      </p>
      <div className="vpl-toolbar">
        {VIDEO_DEFAULTS.map((v) => (
          <button
            key={v.compositionId}
            type="button"
            className={v.compositionId === activeId ? 'primary' : ''}
            onClick={() => setActiveId(v.compositionId)}
          >
            {v.name}
          </button>
        ))}
        <button type="button" onClick={() => setReviewMode((r) => !r)}>
          {reviewMode ? 'Exit review' : 'Review mode'}
        </button>
      </div>

      {reviewMode ? (
        <div className="vpl-preview-grid" style={{ marginTop: '1rem' }}>
          <div className="vpl-player">
            <Player
              ref={playerRef}
              component={Component}
              inputProps={inputProps}
              durationInFrames={draft.durationInFrames || 360}
              compositionWidth={1080}
              compositionHeight={1920}
              fps={30}
              style={{ width: '100%', aspectRatio: '1080/1920', borderRadius: 8 }}
              controls
              loop
              autoPlay={false}
              initiallyMuted
            />
          </div>
          <div>
            <h3 style={{ marginTop: 0 }}>{draft.name || activeId}</h3>
            <p className="lede">Intended audience: practice owners evaluating dedicated virtual staff.</p>
            <p>
              <strong>Hook:</strong> {draft.headline || draft.spokenLine || '—'}
            </p>
            <p>
              <strong>CTA:</strong> {draft.cta}
            </p>
            <p>
              <strong>Status:</strong> {draft.status || 'Draft'}
            </p>
            <div className="vpl-toolbar">
              {DATA.reviewFeedback.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={feedback.includes(f) ? 'primary' : ''}
                  onClick={() =>
                    setFeedback((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
                  }
                >
                  {f}
                </button>
              ))}
            </div>
            <label className="vpl-field" style={{ marginTop: '0.75rem' }}>
              Feedback notes
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
          </div>
        </div>
      ) : (
        <div className="vpl-preview-grid" style={{ marginTop: '1rem' }}>
          <div className="vpl-player">
            <Player
              ref={playerRef}
              component={Component}
              inputProps={inputProps}
              durationInFrames={draft.durationInFrames || 360}
              compositionWidth={1080}
              compositionHeight={1920}
              fps={30}
              style={{ width: '100%', aspectRatio: '1080/1920', borderRadius: 8 }}
              controls
              loop
              autoPlay={false}
              initiallyMuted
            />
          </div>
          <div className="vpl-grid-2">
            <label className="vpl-field">
              Candidate name
              <input
                value={draft.candidateName || ''}
                onChange={(e) => setDraft({ ...draft, candidateName: e.target.value })}
              />
            </label>
            <label className="vpl-field">
              Role
              <input value={draft.role || ''} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
            </label>
            <label className="vpl-field" style={{ gridColumn: '1 / -1' }}>
              Spoken / support copy
              <textarea
                rows={2}
                value={draft.spokenLine || draft.support || ''}
                onChange={(e) => setDraft({ ...draft, spokenLine: e.target.value, support: e.target.value })}
              />
            </label>
            <label className="vpl-field" style={{ gridColumn: '1 / -1' }}>
              Caption phrases (one per line — manual; no auto transcription)
              <textarea
                rows={3}
                value={(draft.captionPhrases || phrases).join('\n')}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    captionPhrases: e.target.value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                    showCaptions: true,
                  })
                }
              />
            </label>
            <label className="vpl-field">
              Caption style
              <select
                value={draft.captionStyle || 'subtle'}
                onChange={(e) => setDraft({ ...draft, captionStyle: e.target.value })}
              >
                <option value="subtle">Subtle</option>
                <option value="energetic">Energetic</option>
              </select>
            </label>
            <label className="vpl-field">
              CTA
              <input value={draft.cta || ''} onChange={(e) => setDraft({ ...draft, cta: e.target.value })} />
            </label>
            <label className="vpl-field">
              Crop X
              <input
                type="range"
                min="0"
                max="100"
                value={draft.crop?.x ?? 50}
                onChange={(e) => setDraft({ ...draft, crop: { ...draft.crop, x: Number(e.target.value) } })}
              />
            </label>
            <label className="vpl-field">
              Crop Y
              <input
                type="range"
                min="0"
                max="100"
                value={draft.crop?.y ?? 40}
                onChange={(e) => setDraft({ ...draft, crop: { ...draft.crop, y: Number(e.target.value) } })}
              />
            </label>
            <label className="vpl-field">
              Zoom
              <input
                type="range"
                min="100"
                max="140"
                value={Math.round((draft.crop?.zoom || 1) * 100)}
                onChange={(e) =>
                  setDraft({ ...draft, crop: { ...draft.crop, zoom: Number(e.target.value) / 100 } })
                }
              />
            </label>
            <label className="vpl-field">
              Source volume (preview)
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((draft.volume || 0) * 100)}
                onChange={(e) => setDraft({ ...draft, volume: Number(e.target.value) / 100 })}
              />
            </label>
            <label className="vpl-field" style={{ gridColumn: '1 / -1' }}>
              Temporary local video (browser-only preview)
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setLocalVideo(URL.createObjectURL(file));
                }}
              />
            </label>
            <p className="vpl-note" style={{ gridColumn: '1 / -1' }}>
              Local uploads stay in this browser session. Register approved compressed proxies under{' '}
              <code>public/assets/</code> before sharing. Raw masters: <code>.local-masters/video-source/</code>.
            </p>
            <div className="vpl-actions" style={{ gridColumn: '1 / -1' }}>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(JSON.stringify(inputProps, null, 2));
                }}
              >
                Copy composition JSON
              </button>
              <button type="button" onClick={() => setDraft({ ...draft, showSafeZones: !draft.showSafeZones })}>
                Toggle safe zones
              </button>
              <a className="vpl-toolbar" href="/motion-concept-lab.html">
                Open Motion Lab
              </a>
            </div>
            <details style={{ gridColumn: '1 / -1' }}>
              <summary>Remotion render command</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{`npm run remotion:studio
npm run remotion:render:${
                activeId === 'MV-MEET-TEAMMATE-01'
                  ? 'meet-teammate'
                  : activeId === 'MV-REAL-WORKDAY-01'
                    ? 'real-workday'
                    : activeId === 'MV-OVERLOAD-SUPPORT-01'
                      ? 'overload-support'
                      : 'vertical-practice'
              }`}</pre>
            </details>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h3>Consent & privacy checklist</h3>
        <div className="vpl-checks">
          {DATA.consentChecks.map((c) => (
            <label key={c.id}>
              <input
                type="checkbox"
                checked={Boolean(consent[c.id])}
                onChange={(e) => setConsent({ ...consent, [c.id]: e.target.checked })}
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoLabApp() {
  const [activeId, setActiveId] = useState('MV-MEET-TEAMMATE-01');

  if (!DATA) {
    return <p style={{ padding: 24 }}>Video lab payload missing.</p>;
  }

  return (
    <div className="vpl-app">
      <header className="vpl-hero">
        <h1>Real People Video</h1>
        <p>Turn authentic VA footage into polished short-form ads. Record simply. Edit intentionally. Show that MedVirtual is made of real people.</p>
      </header>

      <div className="vpl-stages" aria-label="Production stages">
        <article>
          <h2>1. Produce Now</h2>
          <p>
            Current assignments on the <a href="/graphic-request-brief.html">Brief</a>.
          </p>
        </article>
        <article>
          <h2>2. Approved Systems</h2>
          <p>
            Reuse layouts in <a href="/template-test-board.html">Examples</a> and these four video templates.
          </p>
        </article>
        <article>
          <h2>3. Creative Lab</h2>
          <p>
            Experiments stay secondary: <a href="/ideas.html">Creative Lab</a>.
          </p>
        </article>
      </div>

      <div className="vpl-toolbar">
        <a href="/graphic-request-brief.html">Brief</a>
        <a href="/creative-concept-lab.html">Static Concepts</a>
        <a href="/motion-concept-lab.html">Motion Concepts</a>
        <a href="#capture-brief">Capture brief</a>
        <a href="#from-footage">Footage → ad guide</a>
      </div>

      <section className="vpl-section">
        <h2>Current video assignments</h2>
        <p className="lede">Four active jobs. Placeholders until approved footage is received.</p>
        <div className="vpl-assign">
          {DATA.assignments.map((a) => (
            <article key={a.id} className="vpl-card" id={a.id}>
              <div className="vpl-meta">
                <span className="vpl-pill type">{a.assignmentType}</span>
                <span className={`vpl-pill ${a.status.includes('Waiting') ? 'wait' : ''}`}>{a.status}</span>
                <span className="vpl-pill">{a.formatId}</span>
              </div>
              <h3>{a.concept}</h3>
              <dl>
                <div>
                  <dt>Talent</dt>
                  <dd>
                    {a.featuredTalent} · {a.role}
                  </dd>
                </div>
                <div>
                  <dt>Due</dt>
                  <dd>{a.dueDate}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{a.owner}</dd>
                </div>
                <div>
                  <dt>Footage</dt>
                  <dd>{a.footageStatus}</dd>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <dt>Deliverables</dt>
                  <dd>{(a.deliverables || []).join(' · ')}</dd>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <dt>Submit</dt>
                  <dd>{a.submission}</dd>
                </div>
              </dl>
              <div className="vpl-actions">
                <button type="button" className="primary" onClick={() => setActiveId(a.formatId)}>
                  Open template
                </button>
                <a href={`#capture-brief`}>Capture brief</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CaptureBriefBuilder onUseTemplate={setActiveId} />
      <TemplatePreview activeId={activeId} setActiveId={setActiveId} />

      <section className="vpl-section" id="from-footage">
        <h2>From Footage to Finished Ad</h2>
        <div className="vpl-guide">
          <ol>
            {DATA.workflowGuide.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <h3>Creative rules</h3>
        <ul className="vpl-rules">
          {DATA.creativeRules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <h3>Media workflow</h3>
        <ol className="vpl-guide">
          <li>
            Place raw source in <code>.local-masters/video-source/</code> (gitignored).
          </li>
          <li>Create an approved compressed proxy (see <code>scripts/make-video-proxy.sh</code>).</li>
          <li>Register the proxy in the public-safe video manifest before sharing.</li>
          <li>Review in this page / Remotion Studio using the proxy.</li>
          <li>Render locally with the highest-quality approved source when practical.</li>
          <li>Do not commit enormous raw or rendered files.</li>
        </ol>
      </section>
    </div>
  );
}

const mount = document.getElementById('video-lab-root');
if (mount) {
  createRoot(mount).render(
    <React.StrictMode>
      <VideoLabApp />
    </React.StrictMode>,
  );
}
