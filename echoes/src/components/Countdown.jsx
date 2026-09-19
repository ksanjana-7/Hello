/**
 * Countdown — live countdown timer for a locked capsule.
 * Updates every second via setInterval.
 */

import { useState, useEffect } from 'react';

function pad(n) {
  return String(n).padStart(2, '0');
}

function getTimeLeft(unlockDate) {
  const now  = Date.now();
  const end  = new Date(unlockDate).getTime();
  const diff = end - now;

  if (diff <= 0) return null;

  const totalSecs = Math.floor(diff / 1000);
  const days      = Math.floor(totalSecs / 86400);
  const hours     = Math.floor((totalSecs % 86400) / 3600);
  const mins      = Math.floor((totalSecs % 3600)  / 60);
  const secs      = totalSecs % 60;

  return { days, hours, mins, secs };
}

export default function Countdown({ unlockDate, onUnlock }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(unlockDate));

  useEffect(() => {
    const tick = () => {
      const t = getTimeLeft(unlockDate);
      setTimeLeft(t);
      if (!t && onUnlock) onUnlock();
    };

    tick(); // immediate
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [unlockDate, onUnlock]);

  if (!timeLeft) return null;

  const segments = [
    { value: timeLeft.days,  label: 'Days'  },
    { value: timeLeft.hours, label: 'Hrs'   },
    { value: timeLeft.mins,  label: 'Min'   },
    { value: timeLeft.secs,  label: 'Sec'   },
  ];

  // Hide days segment if 0 days left for compactness
  const shown = timeLeft.days === 0
    ? segments.slice(1)
    : segments;

  return (
    <div className="flex items-center gap-3">
      {shown.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="countdown-seg">
            <span className="countdown-num">{pad(value)}</span>
            <span className="countdown-label">{label}</span>
          </div>
          {i < shown.length - 1 && (
            <span style={{ color: '#475569', fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
