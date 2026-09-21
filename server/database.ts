import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dataDirectory = path.resolve('data');

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