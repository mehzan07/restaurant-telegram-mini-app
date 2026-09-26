import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------
// Database configuration
// ---------------------------------------------------------
//
// Local development:
//   DATABASE_DIR is not set, so SQLite uses:
//   ./data/restaurant.db
//
// Production / Railway:
//   DATABASE_DIR can point to a persistent Railway volume,
//   for example:
//   /data
//
// This allows the same application code to work both
// locally and in production.
// ---------------------------------------------------------

const dataDirectory = process.env.DATABASE_DIR
  ? path.resolve(process.env.DATABASE_DIR)
  : path.resolve('data');

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const databasePath = path.join(dataDirectory, 'restaurant.db');

export const db = new Database(databasePath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    guests TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    seating_area TEXT NOT NULL,
    full_name TEXT NOT NULL,
    country_code TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    special_requests TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )
`);

console.log(`SQLite database ready: ${databasePath}`);