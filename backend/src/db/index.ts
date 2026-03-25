import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { USERS_SCHEMA, POSTCARDS_SCHEMA, SYSTEM_SETTINGS_SCHEMA } from './schema';

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'postcards.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create database connection
const db: DatabaseType = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema (order matters due to foreign keys)
db.exec(USERS_SCHEMA);
db.exec(POSTCARDS_SCHEMA);
db.exec(SYSTEM_SETTINGS_SCHEMA);

export default db;
