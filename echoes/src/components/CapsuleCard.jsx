/**
 * CapsuleCard — displays a single time capsule.
 *
 * - Locked: shows countdown, envelope-sealed styling
 * - Unlocked: "Open" button triggers reveal animation, shows message
 * - Delete: two-step confirm before calling onDelete
 */

import { useState, useCallback } from 'react';
import Countdown from './Countdown';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });
}

function isUnlocked(unlockDate) {
  return new Date(unlockDate) <= new Date();
}

export default function CapsuleCard({ capsule, onDelete }) {
  const [unlocked,      setUnlocked]      = useState(() => isUnlocked(capsule.unlock_date));
  const [opened,        setOpened]        = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting,      setDeleting]      = useState(false);

  const handleUnlock = useCallback(() => setUnlocked(true), []);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(capsule.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  // ── Visual states ───────────────────────────────────────────────────────────
  const cardBorderColor = unlocked
    ? 'rgba(45, 212, 191, 0.25)'
    : 'rgba(99, 102, 241, 0.2)';

  const cardGlow = opened
    ? '0 0 48px rgba(45,212,191,0.12), 0 8px 40px rgba(0,0,0,0.5)'
    : undefined;

  return (
    <div
      className="glass-card envelope-card"
      style={{
        borderColor: cardBorderColor,
        boxShadow: cardGlow,
        transition: 'all 0.4s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative top-fold for envelope look */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: unlocked
            ? 'linear-gradient(90deg, transparent, rgba(45,212,191,0.6), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)',
        }}
      />

      <div style={{ padding: '1.5rem 1.75rem' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.875rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: '1.25rem',
                fontWeight: 400,
                color: '#e2e8f0',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {capsule.title}
            </h3>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.72rem',
                color: '#475569',
                marginTop: '0.3rem',
                letterSpacing: '0.02em',
              }}
            >
              Written {formatDate(capsule.created_at)}
            </p>
          </div>

          {/* Status badge */}
          <span className={`badge ${unlocked ? 'badge-unlocked' : 'badge-locked'}`}>
            {unlocked ? '✦ Open' : '⏳ Sealed'}
          </span>
        </div>

        {/* Divider */}
        <div className="divider" style={{ margin: '0.75rem 0' }} />

        {/* Locked state — countdown */}
        {!unlocked && (
          <div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#475569',
                marginBottom: '0.5rem',
              }}
            >
              Unlocks in
            </p>
            <Countdown
              unlockDate={capsule.unlock_date}
              onUnlock={handleUnlock}
            />
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: '0.85rem',
                color: '#334155',
                fontStyle: 'italic',
                marginTop: '0.75rem',
              }}
            >
              Sealed until {formatDate(capsule.unlock_date)}
            </p>
          </div>
        )}

        {/* Unlocked but not opened */}
        {unlocked && !opened && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: '0.95rem',
                color: '#2dd4bf',
                fontStyle: 'italic',
              }}
            >
              This capsule is ready to be opened.
            </p>
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: '0.85rem',
                color: '#475569',
                fontStyle: 'italic',
              }}
            >
              Unlocked on {formatDate(capsule.unlock_date)}
            </p>
            <button
              id={`open-capsule-${capsule.id}`}
              className="btn-primary"
              onClick={() => setOpened(true)}
              style={{
                alignSelf: 'flex-start',
                background: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
              }}
            >
              ✦ &nbsp; Open capsule
            </button>
          </div>
        )}

        {/* Opened — revealed message */}
        {unlocked && opened && (
          <div className="reveal-animate">
            {/* Decorative quote mark */}
            <div
              style={{
                fontSize: '3rem',
                lineHeight: 1,
                color: 'rgba(99,102,241,0.2)',
                fontFamily: 'Georgia, serif',
                marginBottom: '-0.5rem',
                userSelect: 'none',
              }}
            >
              "
            </div>
            <p className="message-text" style={{ marginBottom: '1rem' }}>
              {capsule.message}
            </p>
            <div
              style={{
                fontSize: '3rem',
                lineHeight: 1,
                color: 'rgba(99,102,241,0.2)',
                fontFamily: 'Georgia, serif',
                textAlign: 'right',
                marginTop: '-1rem',
                userSelect: 'none',
              }}
            >
              "
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="divider" style={{ margin: '0.875rem 0 0.5rem' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!confirmDelete ? (
            <button
              id={`delete-capsule-${capsule.id}`}
              className="btn-danger"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#fb7185' }}>
                Are you sure?
              </span>
              <button
                id={`delete-confirm-${capsule.id}`}
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
                style={{ background: 'rgba(251,113,133,0.15)' }}
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                id={`delete-cancel-${capsule.id}`}
                className="btn-secondary"
                onClick={() => setConfirmDelete(false)}
                style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
