export const POSTCARDS_SCHEMA = `
CREATE TABLE IF NOT EXISTS postcards (
  id TEXT PRIMARY KEY,
  title TEXT,
  poem TEXT NOT NULL,
  poet_style TEXT NOT NULL,
  music_prompt TEXT,
  image_path TEXT,
  audio_path TEXT,
  duration REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_postcards_created_at ON postcards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_postcards_poet_style ON postcards(poet_style);
`;
