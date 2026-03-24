import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { fileStorageService } from './fileStorageService';
import {
  Postcard,
  PostcardRow,
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

export const postcardService = {
  /**
   * Create a new postcard
   */
  create(request: CreatePostcardRequest): Postcard {
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
      INSERT INTO postcards (id, title, poem, poet_style, music_prompt, image_path, audio_path, duration, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Get postcard by ID
   */
  getById(id: string): Postcard | null {
    const stmt = db.prepare('SELECT * FROM postcards WHERE id = ?');
    const row = stmt.get(id) as PostcardRow | undefined;

    if (!row) return null;
    return rowToPostcard(row);
  },

  /**
   * List postcards with pagination
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
   * Delete postcard by ID
   */
  delete(id: string): boolean {
    // Get postcard first to delete files
    const postcard = this.getById(id);
    if (!postcard) return false;

    // Delete associated files
    if (postcard.imagePath) {
      fileStorageService.deleteFile(postcard.imagePath);
    }
    if (postcard.audioPath) {
      fileStorageService.deleteFile(postcard.audioPath);
    }

    // Delete from DB
    const stmt = db.prepare('DELETE FROM postcards WHERE id = ?');
    const result = stmt.run(id);

    return result.changes > 0;
  }
};
