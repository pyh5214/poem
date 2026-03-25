import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { fileStorageService } from './fileStorageService';
import {
  Postcard,
  PostcardRow,
  PostcardWithUser,
  PostcardRowWithUser,
  CreatePostcardRequest,
  PostcardListResponse,
  PoetOption
} from '../types';

/**
 * Convert DB row (snake_case) to Postcard (camelCase)
 */
function rowToPostcard(row: PostcardRow): Postcard {
  return {
    id: row.id,
    title: row.title,
    poem: row.poem,
    poetStyle: row.poet_style as PoetOption,
    musicPrompt: row.music_prompt,
    imagePath: row.image_path,
    audioPath: row.audio_path,
    duration: row.duration,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Convert DB row with user data (snake_case) to PostcardWithUser (camelCase)
 */
function rowToPostcardWithUser(row: PostcardRowWithUser): PostcardWithUser {
  return {
    id: row.id,
    title: row.title,
    poem: row.poem,
    poetStyle: row.poet_style as PoetOption,
    musicPrompt: row.music_prompt,
    imagePath: row.image_path,
    audioPath: row.audio_path,
    duration: row.duration,
    userId: row.user_id,
    isPublic: row.is_public === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const postcardService = {
  /**
   * Create a new postcard
   */
  create(request: CreatePostcardRequest, userId: string, isPublic: boolean = false): PostcardWithUser {
    const id = uuidv4();
    const now = new Date().toISOString();

    let imagePath: string | null = null;
    let audioPath: string | null = null;

    // Save files if provided
    if (request.imageData) {
      imagePath = fileStorageService.saveImage(id, request.imageData);
    }
    if (request.audioData) {
      audioPath = fileStorageService.saveAudio(id, request.audioData);
    }

    const stmt = db.prepare(`
      INSERT INTO postcards (id, title, poem, poet_style, music_prompt, image_path, audio_path, duration, user_id, is_public, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      request.title || null,
      request.poem,
      request.poetStyle,
      request.musicPrompt || null,
      imagePath,
      audioPath,
      request.duration || null,
      userId,
      isPublic ? 1 : 0,
      now,
      now
    );

    return {
      id,
      title: request.title || null,
      poem: request.poem,
      poetStyle: request.poetStyle,
      musicPrompt: request.musicPrompt || null,
      imagePath,
      audioPath,
      duration: request.duration || null,
      userId,
      isPublic,
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Get postcard by ID (with optional ownership check for private postcards)
   */
  getById(id: string, requestingUserId?: string): PostcardWithUser | null {
    const stmt = db.prepare('SELECT * FROM postcards WHERE id = ?');
    const row = stmt.get(id) as PostcardRowWithUser | undefined;

    if (!row) return null;

    // If postcard is private, verify ownership or deny access if no user
    if (row.is_public === 0) {
      if (!requestingUserId || row.user_id !== requestingUserId) {
        return null;
      }
    }

    return rowToPostcardWithUser(row);
  },

  /**
   * List postcards with pagination (deprecated - use listPublic or listByUser)
   */
  list(page: number = 1, limit: number = 20): PostcardListResponse {
    const offset = (page - 1) * limit;

    const countStmt = db.prepare('SELECT COUNT(*) as total FROM postcards');
    const { total } = countStmt.get() as { total: number };

    const stmt = db.prepare(`
      SELECT * FROM postcards
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(limit, offset) as PostcardRow[];

    return {
      items: rows.map(rowToPostcard),
      total,
      page,
      limit
    };
  },

  /**
   * List public postcards for gallery
   */
  listPublic(page: number = 1, limit: number = 20): PostcardListResponse {
    const offset = (page - 1) * limit;

    const countStmt = db.prepare('SELECT COUNT(*) as total FROM postcards WHERE is_public = 1');
    const { total } = countStmt.get() as { total: number };

    const stmt = db.prepare(`
      SELECT * FROM postcards
      WHERE is_public = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(limit, offset) as PostcardRowWithUser[];

    return {
      items: rows.map(rowToPostcardWithUser),
      total,
      page,
      limit
    };
  },

  /**
   * List postcards by user (all their postcards, both public and private)
   */
  listByUser(userId: string, page: number = 1, limit: number = 20): PostcardListResponse {
    const offset = (page - 1) * limit;

    const countStmt = db.prepare('SELECT COUNT(*) as total FROM postcards WHERE user_id = ?');
    const { total } = countStmt.get(userId) as { total: number };

    const stmt = db.prepare(`
      SELECT * FROM postcards
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(userId, limit, offset) as PostcardRowWithUser[];

    return {
      items: rows.map(rowToPostcardWithUser),
      total,
      page,
      limit
    };
  },

  /**
   * Delete postcard by ID (with ownership verification)
   */
  delete(id: string, userId: string): boolean {
    // Get postcard first to verify ownership and delete files
    const stmt = db.prepare('SELECT * FROM postcards WHERE id = ? AND user_id = ?');
    const row = stmt.get(id, userId) as PostcardRowWithUser | undefined;

    if (!row) return false;

    const postcard = rowToPostcardWithUser(row);

    // Delete associated files
    if (postcard.imagePath) {
      fileStorageService.deleteFile(postcard.imagePath);
    }
    if (postcard.audioPath) {
      fileStorageService.deleteFile(postcard.audioPath);
    }

    // Delete from DB
    const deleteStmt = db.prepare('DELETE FROM postcards WHERE id = ? AND user_id = ?');
    const result = deleteStmt.run(id, userId);

    return result.changes > 0;
  },

  /**
   * Update postcard visibility
   */
  updateVisibility(id: string, userId: string, isPublic: boolean): boolean {
    const stmt = db.prepare(`
      UPDATE postcards
      SET is_public = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `);

    const now = new Date().toISOString();
    const result = stmt.run(isPublic ? 1 : 0, now, id, userId);

    return result.changes > 0;
  },

  /**
   * List all postcards (admin only)
   */
  listAll(page: number = 1, limit: number = 20): PostcardListResponse {
    const offset = (page - 1) * limit;

    const countStmt = db.prepare('SELECT COUNT(*) as total FROM postcards');
    const { total } = countStmt.get() as { total: number };

    const stmt = db.prepare(`
      SELECT * FROM postcards
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(limit, offset) as PostcardRowWithUser[];

    return {
      items: rows.map(rowToPostcardWithUser),
      total,
      page,
      limit
    };
  },

  /**
   * Force delete postcard (admin only, no ownership check)
   */
  forceDelete(id: string): boolean {
    const stmt = db.prepare('SELECT * FROM postcards WHERE id = ?');
    const row = stmt.get(id) as PostcardRowWithUser | undefined;

    if (!row) return false;

    const postcard = rowToPostcardWithUser(row);

    // Delete associated files
    if (postcard.imagePath) {
      fileStorageService.deleteFile(postcard.imagePath);
    }
    if (postcard.audioPath) {
      fileStorageService.deleteFile(postcard.audioPath);
    }

    // Delete from DB
    const deleteStmt = db.prepare('DELETE FROM postcards WHERE id = ?');
    const result = deleteStmt.run(id);

    return result.changes > 0;
  }
};
