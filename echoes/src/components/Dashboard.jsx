/**
 * Dashboard — the capsule grid/list view.
 * Splits capsules into unlocked-first, then by created_at desc (already sorted by DB).
 */

import CapsuleCard from './CapsuleCard';
import EmptyState  from './EmptyState';

function isUnlocked(unlockDate) {
  return new Date(unlockDate) <= new Date();
}

export default function Dashboard({ capsules, onDelete, onCreateClick }) {
  if (capsules.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  // Sort: unlocked first, then locked (DB already sorts by created_at desc within each group)
  const unlocked = capsules.filter((c) => isUnlocked(c.unlock_date));
  const locked   = capsules.filter((c) => !isUnlocked(c.unlock_date));
  const sorted   = [...unlocked, ...locked];

  return (
    <div style={{ padding: '0 1rem 4rem' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 400,
              color: '#e2e8f0',
              letterSpacing: '-0.01em',
            }}
          >
            Your capsules
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.78rem',
              color: '#475569',
              marginTop: '0.2rem',
            }}
          >
            {capsules.length} {capsules.length === 1 ? 'capsule' : 'capsules'} ·{' '}
            {unlocked.length} open
          </p>
        </div>

        <button
          id="dashboard-create-btn"
          className="btn-primary"
          onClick={onCreateClick}
          style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
        >
          + New capsule
        </button>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
          gap: '1.25rem',
        }}
      >
        {sorted.map((capsule) => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
