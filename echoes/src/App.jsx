/**
 * App.jsx — root component.
 *
 * Renders:
 * - Starfield background (pure CSS/JS, no canvas library)
 * - Header with branding
 * - Dashboard / EmptyState
 * - CapsuleForm modal (slide-up overlay)
 * - Loading & error states
 */

import { useState, useEffect, useRef } from 'react';
import { useCapsules }  from './hooks/useCapsules';
import Dashboard        from './components/Dashboard';
import CapsuleForm      from './components/CapsuleForm';

// ─── Starfield ────────────────────────────────────────────────────────────────

function Starfield() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const STAR_COUNT = 160;
    const fragment   = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const size     = Math.random() * 2.5 + 0.5;
      const baseOpac = Math.random() * 0.5 + 0.1;
      const duration = Math.random() * 4 + 2;
      const delay    = Math.random() * 6;

      Object.assign(star.style, {
        width:    `${size}px`,
        height:   `${size}px`,
        left:     `${Math.random() * 100}%`,
        top:      `${Math.random() * 100}%`,
        '--base-opacity': baseOpac,
        '--duration':     `${duration}s`,
        '--delay':        `${delay}s`,
      });

      fragment.appendChild(star);
    }

    container.appendChild(fragment);
    return () => { container.innerHTML = ''; };
  }, []);

  return (
    <>
      {/* Nebula blobs */}
      <div
        className="nebula-blob"
        style={{
          width: '60vw',
          height: '60vw',
          top: '-20vw',
          left: '-15vw',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)',
        }}
      />
      <div
        className="nebula-blob"
        style={{
          width: '50vw',
          height: '50vw',
          bottom: '-10vw',
          right: '-10vw',
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)',
        }}
      />
      <div
        className="nebula-blob"
        style={{
          width: '30vw',
          height: '30vw',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 65%)',
        }}
      />

      {/* Stars */}
      <div ref={containerRef} className="starfield" aria-hidden="true" />
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ onCreateClick }) {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: 'clamp(3rem, 8vw, 5.5rem) 1rem clamp(2rem, 5vw, 3rem)',
      }}
    >
      {/* Logo / wordmark */}
      <div style={{ marginBottom: '0.5rem' }}>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#6366f1',
          }}
        >
          ✦ &nbsp; E C H O E S &nbsp; ✦
        </span>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 400,
          color: '#e2e8f0',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          marginBottom: '1rem',
          maxWidth: '700px',
          margin: '0 auto 1rem',
        }}
      >
        A message to the person
        <br />
        <em style={{ color: '#818cf8', fontStyle: 'italic' }}>you'll become.</em>
      </h1>

      {/* Sub-headline */}
      <p
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: '#64748b',
          fontStyle: 'italic',
          maxWidth: '460px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.65,
        }}
      >
        Write letters to your future self. Seal them in time.
        Rediscover them when the moment arrives.
      </p>

      {/* CTA */}
      <button
        id="header-create-btn"
        className="btn-primary glow-pulse"
        onClick={onCreateClick}
        style={{ fontSize: '0.95rem', padding: '0.875rem 2.25rem' }}
      >
        ✦ &nbsp; Seal a capsule
      </button>

      {/* Subtle divider */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)',
          margin: 'clamp(2rem, 5vw, 3.5rem) auto 0',
          maxWidth: '480px',
        }}
      />
    </header>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        background: '#050816',
      }}
    >
      <div className="spinner" />
      <p
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: '1.1rem',
          color: '#475569',
          fontStyle: 'italic',
        }}
      >
        Opening the archive…
      </p>
    </div>
  );
}

// ─── Error screen ─────────────────────────────────────────────────────────────

function ErrorScreen({ message }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: '#050816',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '2.5rem' }}>⚠️</span>
      <h2
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: '1.5rem',
          color: '#fb7185',
        }}
      >
        Something went wrong
      </h2>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#64748b', maxWidth: '380px' }}>
        {message}
      </p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { capsules, loading, error, createCapsule, deleteCapsule } = useCapsules();
  const [showForm, setShowForm] = useState(false);

  // Close on Escape
  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape') setShowForm(false);
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  async function handleCreate(data) {
    await createCapsule(data);
    setShowForm(false);
  }

  if (loading) return <><Starfield /><LoadingScreen /></>;
  if (error)   return <><Starfield /><ErrorScreen message={error} /></>;

  return (
    <>
      <Starfield />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header onCreateClick={() => setShowForm(true)} />

        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
          <Dashboard
            capsules={capsules}
            onDelete={deleteCapsule}
            onCreateClick={() => setShowForm(true)}
          />
        </main>

        <footer
          style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            color: '#1e293b',
          }}
        >
          ECHOES · A TIME CAPSULE FOR YOUR FUTURE SELF
        </footer>
      </div>

      {/* Modal: Create form */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <CapsuleForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}
