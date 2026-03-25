export const USERS_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profile_image TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_blocked INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  last_login_at TEXT,
  CHECK (role IN ('user', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

export const POSTCARDS_SCHEMA = `
CREATE TABLE IF NOT EXISTS postcards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  poem TEXT NOT NULL,
  poet_style TEXT NOT NULL,
  music_prompt TEXT,
  image_path TEXT,
  audio_path TEXT,
  duration REAL,
  is_public INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_postcards_created_at ON postcards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_postcards_poet_style ON postcards(poet_style);
CREATE INDEX IF NOT EXISTS idx_postcards_user_id ON postcards(user_id);
CREATE INDEX IF NOT EXISTS idx_postcards_is_public ON postcards(is_public);
`;

export const SYSTEM_SETTINGS_SCHEMA = `
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_system_settings_updated_at ON system_settings(updated_at DESC);
`;
