import { Router } from 'express';
import { postcardController } from '../controllers/postcardController';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

// POST /create-postcard - 통합 API (이미지 → 시 → 음악 → 저장) - 로그인 필수
router.post('/create-postcard', requireAuth, postcardController.createFull);

// POST /postcards - Create new postcard - 로그인 필수
router.post('/postcards', requireAuth, postcardController.create);

// GET /postcards - List user's own postcards - 로그인 필수
router.get('/postcards', requireAuth, postcardController.list);

// GET /postcards/public - List public postcards (gallery) - 로그인 불필요
router.get('/postcards/public', postcardController.listPublic);

// GET /postcards/:id - Get single postcard (public or owned) - 로그인 선택
router.get('/postcards/:id', optionalAuth, postcardController.getById);

// PATCH /postcards/:id/visibility - Toggle visibility - 로그인 필수
router.patch('/postcards/:id/visibility', requireAuth, postcardController.toggleVisibility);

// DELETE /postcards/:id - Delete postcard (owned only) - 로그인 필수
router.delete('/postcards/:id', requireAuth, postcardController.delete);

// GET /postcards/:id/image - Serve image file (public or owned) - 로그인 선택
router.get('/postcards/:id/image', optionalAuth, postcardController.getImage);

// GET /postcards/:id/audio - Serve audio file (public or owned) - 로그인 선택
router.get('/postcards/:id/audio', optionalAuth, postcardController.getAudio);

export default router;
