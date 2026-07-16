import React, { useCallback, useEffect, useState } from 'react';

export const FEEDBACK_KEY = 'mv_creative_feedback_v1';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useCreativeFeedback() {
  const [feedback, setFeedback] = useState(readAll);

  useEffect(() => {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
  }, [feedback]);

  const update = useCallback((id, patch) => {
    setFeedback((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const restore = useCallback((id) => {
    setFeedback((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  return { feedback, update, restore };
}

export function FeedbackPanel({ id, value = {}, onChange, compact = false }) {
  return (
    <div className={`creative-feedback${compact ? ' compact' : ''}`}>
      <div className="creative-feedback__vote" aria-label="Creative feedback">
        <span>Does this work?</span>
        <button
          type="button"
          className={value.vote === 'up' ? 'selected up' : 'up'}
          aria-pressed={value.vote === 'up'}
          onClick={() => onChange(id, { vote: value.vote === 'up' ? null : 'up' })}
        >
          👍 <span>Works</span>
        </button>
        <button
          type="button"
          className={value.vote === 'down' ? 'selected down' : 'down'}
          aria-pressed={value.vote === 'down'}
          onClick={() => onChange(id, { vote: 'down' })}
        >
          👎 <span>Remove</span>
        </button>
      </div>
      <label>
        Note
        <textarea
          rows={compact ? 2 : 3}
          value={value.note || ''}
          placeholder="What works? What should change?"
          onChange={(event) => onChange(id, { note: event.target.value })}
        />
      </label>
      <p className="creative-feedback__hint">Thumbs down hides this item. Your note stays saved in this browser.</p>
    </div>
  );
}

export function RejectedTray({ items, feedback, onRestore }) {
  const rejected = items.filter((item) => feedback[item.feedbackId || item.id]?.vote === 'down');
  if (!rejected.length) return null;

  return (
    <details className="rejected-tray">
      <summary>Rejected items ({rejected.length})</summary>
      {rejected.map((item) => {
        const id = item.feedbackId || item.id;
        return (
          <div className="rejected-tray__item" key={id}>
            <div>
              <strong>{item.name || item.label || id}</strong>
              {feedback[id]?.note ? <p>{feedback[id].note}</p> : null}
            </div>
            <button type="button" onClick={() => onRestore(id)}>
              Restore
            </button>
          </div>
        );
      })}
    </details>
  );
}
