import { Router } from 'express';
import { generateMusicFromImage } from '../controllers/musicController';

const router = Router();

/**
 * POST /generate-music
 * 이미지 기반 배경음악 생성
 *
 * Request body:
 * - imageData: string (base64 data URL)
 * - poetStyle: 'A' | 'B' | 'C' | 'D'
 *
 * Response:
 * - audioData: string (base64 encoded MP3)
 * - duration: number (seconds)
 * - prompt: string (generated music prompt)
 */
router.post('/generate-music', generateMusicFromImage);

export default router;
