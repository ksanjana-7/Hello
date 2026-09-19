/**
 * db.js — sql.js SQLite wrapper with IndexedDB persistence
 *
 * Initializes a SQLite database (loaded from IndexedDB if available),
 * creates the capsules schema, and exposes CRUD helpers.
 * After every write the DB is serialized back to IndexedDB so data
 * survives page refreshes.
 */

import * as _sqljs from 'sql.js';
const initSqlJs = _sqljs.default ?? _sqljs;

const IDB_DB_NAME = 'echoes-storage';
const IDB_STORE    = 'db';
const IDB_KEY      = 'echoes-db';

let _db = null; // sql.js Database instance

// ─── IndexedDB helpers ──────────────────────────────────────────────────────

function openIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess  = (e) => resolve(e.target.result);
    req.onerror    = (e) => reject(e.target.error);
  });
}

async function loadFromIdb() {
  const idb = await openIdb();
  return new Promise((resolve, reject) => {
    const tx  = idb.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
    req.onsuccess = (e) => resolve(e.target.result ?? null);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function saveToIdb(uint8Array) {
  const idb = await openIdb();
  return new Promise((resolve, reject) => {
    const tx  = idb.transaction(IDB_STORE, 'readwrite');
    const req = tx.objectStore(IDB_STORE).put(uint8Array, IDB_KEY);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

// ─── Persistence helper ──────────────────────────────────────────────────────

async function persist() {
  if (!_db) return;
  const data = _db.export();
  await saveToIdb(data);
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS capsules (
    id          TEXT    PRIMARY KEY,
    title       TEXT    NOT NULL,
    message     TEXT    NOT NULL,
    unlock_date TEXT    NOT NULL,
    created_at  TEXT    NOT NULL
  );
`;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Initialise sql.js and load (or create) the database.
 * Must be awaited before calling any other export.
 */
export async function initDb() {
  if (_db) return _db;

  const SQL = await initSqlJs({
    locateFile: () => '/sql-wasm.wasm',
  });

  const saved = await loadFromIdb();

  if (saved) {
    _db = new SQL.Database(saved);
  } else {
    _db = new SQL.Database();
    _db.run(SCHEMA);
    await persist();
  }

  // Always ensure schema exists (idempotent for existing DBs)
  _db.run(SCHEMA);

  return _db;
}

/**
 * Create a new time capsule.
 * @param {{ title: string, message: string, unlock_date: string }} capsule
 */
export async function createCapsule({ title, message, unlock_date }) {
  if (!_db) throw new Error('DB not initialized');

  const id         = crypto.randomUUID();
  const created_at = new Date().toISOString();

  _db.run(
    'INSERT INTO capsules (id, title, message, unlock_date, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, title, message, unlock_date, created_at]
  );

  await persist();
  return { id, title, message, unlock_date, created_at };
}

/**
 * Retrieve all capsules, newest first.
 * @returns {Array<{ id, title, message, unlock_date, created_at }>}
 */
export function getCapsules() {
  if (!_db) return [];

  const stmt    = _db.prepare('SELECT * FROM capsules ORDER BY created_at DESC');
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }

  stmt.free();
  return results;
}

/**
 * Delete a capsule by id.
 * @param {string} id
 */
export async function deleteCapsule(id) {
  if (!_db) throw new Error('DB not initialized');

  _db.run('DELETE FROM capsules WHERE id = ?', [id]);
  await persist();
}
