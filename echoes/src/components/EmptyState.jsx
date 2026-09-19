/**
 * EmptyState — shown when there are no capsules yet.
 */

export default function EmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      {/* Illustrated envelope */}
      <div className="relative mb-10 float-animation">
        <svg
          width="120"
          height="96"
          viewBox="0 0 120 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Envelope body */}
          <rect
            x="4" y="24"
            width="112" height="68"
            rx="8"
            fill="rgba(13,27,62,0.8)"
            stroke="rgba(99,102,241,0.4)"
            strokeWidth="1.5"
          />
          {/* Envelope flap */}
          <path
            d="M4 32 L60 62 L116 32 L116 24 Q116 24 60 56 Q4 24 4 24 Z"
            fill="rgba(99,102,241,0.15)"
            stroke="rgba(99,102,241,0.3)"
            strokeWidth="1"
          />
          {/* Diagonal fold lines */}
          <line x1="4"  y1="92" x2="52" y2="58" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
          <line x1="116" y1="92" x2="68" y2="58" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
          {/* Stars inside */}
          <circle cx="35" cy="75" r="2" fill="rgba(251,191,36,0.6)" />
          <circle cx="60" cy="80" r="1.5" fill="rgba(251,191,36,0.4)" />
          <circle cx="85" cy="73" r="2.5" fill="rgba(251,191,36,0.5)" />
          {/* Question mark / lock icon above */}
          <circle cx="60" cy="12" r="11" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
          <text x="60" y="17" textAnchor="middle" fill="#818cf8" fontSize="13" fontFamily="serif">✦</text>
        </svg>

        {/* Glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <h2
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 400,
          color: '#e2e8f0',
          marginBottom: '0.75rem',
          letterSpacing: '-0.01em',
        }}
      >
        Your story hasn't started yet.
      </h2>

      <p
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: '1.1rem',
          color: '#64748b',
          fontStyle: 'italic',
          maxWidth: '400px',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
        }}
      >
        Write a letter to the person you'll become. Seal it. Let time do the rest.
      </p>

      <button
        id="empty-state-create-btn"
        className="btn-primary glow-pulse"
        onClick={onCreateClick}
        style={{ fontSize: '0.95rem', padding: '0.875rem 2rem' }}
      >
        ✦ &nbsp; Write your first capsule
      </button>
    </div>
  );
}
