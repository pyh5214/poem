import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { config } from '../config';
import { User, UserRow, AuthTokenPayload, AuthTokens, GoogleProfile, UserRole } from '../types';

// Convert database row to User object
const rowToUser = (row: UserRow): User => ({
  id: row.id,
  googleId: row.google_id,
  email: row.email,
  name: row.name,
  profileImage: row.profile_image,
  role: row.role as UserRole,
  isBlocked: row.is_blocked === 1,
  createdAt: row.created_at,
  lastLoginAt: row.last_login_at,
});

// Find user by Google ID
export const findByGoogleId = (googleId: string): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE google_id = ?');
  const row = stmt.get(googleId) as UserRow | undefined;
  return row ? rowToUser(row) : null;
};

// Find user by ID
export const findById = (id: string): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const row = stmt.get(id) as UserRow | undefined;
  return row ? rowToUser(row) : null;
};

// Find user by email
export const findByEmail = (email: string): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const row = stmt.get(email) as UserRow | undefined;
  return row ? rowToUser(row) : null;
};

// Create or update user from Google OAuth
export const upsertFromGoogle = (profile: GoogleProfile): User => {
  const existingUser = findByGoogleId(profile.id);
  const now = new Date().toISOString();

  if (existingUser) {
    // Update last login and profile info
    const stmt = db.prepare(`
      UPDATE users SET
        name = ?,
        profile_image = ?,
        last_login_at = ?
      WHERE google_id = ?
    `);
    stmt.run(profile.name, profile.picture || null, now, profile.id);
    return { ...existingUser, name: profile.name, profileImage: profile.picture || null, lastLoginAt: now };
  }

  // Create new user
  const id = uuidv4();
  const isAdmin = profile.email === config.adminEmail;
  const role: UserRole = isAdmin ? 'admin' : 'user';

  const stmt = db.prepare(`
    INSERT INTO users (id, google_id, email, name, profile_image, role, is_blocked, created_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
  `);
  stmt.run(id, profile.id, profile.email, profile.name, profile.picture || null, role, now, now);

  return {
    id,
    googleId: profile.id,
    email: profile.email,
    name: profile.name,
    profileImage: profile.picture || null,
    role,
    isBlocked: false,
    createdAt: now,
    lastLoginAt: now,
  };
};

// Generate JWT token
export const generateTokens = (user: User): AuthTokens => {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // Parse expiresIn to seconds for response
  const expiresInSeconds = parseExpiresIn(config.jwt.expiresIn);

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiresInSeconds,
  });

  return { accessToken, expiresIn: expiresInSeconds };
};

// Verify JWT token
export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

// Helper to parse expiresIn string to seconds
const parseExpiresIn = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60; // default 7 days

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 7 * 24 * 60 * 60;
  }
};
