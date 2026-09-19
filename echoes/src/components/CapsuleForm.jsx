/**
 * CapsuleForm — create a new time capsule.
 * Validates: non-empty title/message, unlock_date must be in the future.
 */

import { useState } from 'react';

const MIN_DATE_OFFSET_MINUTES = 1;

function minAllowedDate() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + MIN_DATE_OFFSET_MINUTES);
  // Format for datetime-local: "YYYY-MM-DDTHH:mm"
  return d.toISOString().slice(0, 16);
}

export default function CapsuleForm({ onSubmit, onCancel, loading }) {
  const [title,       setTitle]       = useState('');
  const [message,     setMessage]     = useState('');
  const [unlockDate,  setUnlockDate]  = useState('');
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);

  function validate() {
    const e = {};
    if (!title.trim())       e.title   = 'Please give your capsule a title.';
    if (!message.trim())     e.message = 'The message cannot be empty.';
    if (!unlockDate) {
      e.unlockDate = 'Please choose an unlock date.';
    } else {
      const chosen = new Date(unlockDate);
      const now    = new Date();
      if (chosen <= now) e.unlockDate = 'Unlock date must be in the future.';
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        title:       title.trim(),
        message:     message.trim(),
        unlock_date: new Date(unlockDate).toISOString(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-card modal-content" style={{ padding: '2rem 2.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: '1.65rem',
                fontWeight: 400,
                color: '#e2e8f0',
                letterSpacing: '-0.01em',
              }}
            >
              Seal a new capsule
            </h2>
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: '0.95rem',
                color: '#64748b',
                fontStyle: 'italic',
                marginTop: '0.25rem',
              }}
            >
              Words sealed in time, waiting to be rediscovered.
            </p>
          </div>
          <button
            id="capsule-form-close-btn"
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#475569',
              fontSize: '1.4rem',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>
        <div className="divider" style={{ marginTop: '1.25rem', marginBottom: 0 }} />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="capsule-title" className="form-label">
            Capsule Title
          </label>
          <input
            id="capsule-title"
            type="text"
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="A letter to my future self…"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
            maxLength={120}
          />
          {errors.title && (
            <p style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem', fontFamily: 'Inter, sans-serif' }}>
              {errors.title}
            </p>
          )}
        </div>

        {/* Message */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="capsule-message" className="form-label">
            Your Message
          </label>
          <textarea
            id="capsule-message"
            className={`form-textarea ${errors.message ? 'error' : ''}`}
            placeholder="Dear future me,&#10;&#10;I'm writing this from a moment you might have forgotten…"
            value={message}
            onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
            rows={8}
          />
          {errors.message && (
            <p style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem', fontFamily: 'Inter, sans-serif' }}>
              {errors.message}
            </p>
          )}
        </div>

        {/* Unlock date */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="capsule-unlock-date" className="form-label">
            Unlock Date &amp; Time
          </label>
          <input
            id="capsule-unlock-date"
            type="datetime-local"
            className={`form-input ${errors.unlockDate ? 'error' : ''}`}
            value={unlockDate}
            min={minAllowedDate()}
            onChange={(e) => { setUnlockDate(e.target.value); setErrors((p) => ({ ...p, unlockDate: '' })); }}
            style={{ colorScheme: 'dark' }}
          />
          {errors.unlockDate && (
            <p style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem', fontFamily: 'Inter, sans-serif' }}>
              {errors.unlockDate}
            </p>
          )}
          <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '0.4rem', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
            The capsule will remain sealed until this moment arrives.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            id="capsule-form-cancel-btn"
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            id="capsule-form-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={submitting || loading}
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Sealing…
              </span>
            ) : (
              '✦  Seal the capsule'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
