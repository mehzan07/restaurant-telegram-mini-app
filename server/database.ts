import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dataDirectory = process.env.DATABASE_DIR
  ? path.resolve(process.env.DATABASE_DIR)
  : path.resolve('data');

if (!fs.existsSync(dataDirectory)) fs.mkdirSync(dataDirectory, { recursive: true });
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

// Safe V9 migration for existing V8 databases.
const columns = new Set(
  (db.prepare('PRAGMA table_info(reservations)').all() as Array<{ name: string }>).map((c) => c.name)
);
const addColumn = (name: string, sql: string) => {
  if (!columns.has(name)) db.exec(`ALTER TABLE reservations ADD COLUMN ${sql}`);
};
addColumn('status', "status TEXT NOT NULL DEFAULT 'confirmed'");
addColumn('source', "source TEXT NOT NULL DEFAULT 'online'");
addColumn('updated_at', 'updated_at TEXT');
addColumn('admin_notes', "admin_notes TEXT NOT NULL DEFAULT ''");
addColumn('arrived_at', 'arrived_at TEXT');

console.log(`SQLite database ready: ${databasePath}`);
