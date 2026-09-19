/**
 * useCapsules — React hook that wraps the DB module.
 * Components never touch SQL directly.
 */

import { useState, useEffect, useCallback } from 'react';
import { initDb, createCapsule as dbCreate, getCapsules as dbGet, deleteCapsule as dbDelete } from '../lib/db';

export function useCapsules() {
  const [capsules,  setCapsules]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Initialize DB and load data
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initDb();
        if (!cancelled) {
          setCapsules(dbGet());
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to initialise database');
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const createCapsule = useCallback(async (data) => {
    const capsule = await dbCreate(data);
    setCapsules(dbGet());
    return capsule;
  }, []);

  const deleteCapsule = useCallback(async (id) => {
    await dbDelete(id);
    setCapsules(dbGet());
  }, []);

  return { capsules, loading, error, createCapsule, deleteCapsule };
}
