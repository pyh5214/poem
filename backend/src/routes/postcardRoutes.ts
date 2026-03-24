import { Router } from 'express';
import { postcardController } from '../controllers/postcardController';

const router = Router();

// POST /create-postcard - 통합 API (이미지 → 시 → 음악 → 저장)
router.post('/create-postcard', postcardController.createFull);

// POST /postcards - Create new postcard
router.post('/postcards', postcardController.create);

// GET /postcards - List postcards with pagination
router.get('/postcards', postcardController.list);

// GET /postcards/:id - Get single postcard
router.get('/postcards/:id', postcardController.getById);

// DELETE /postcards/:id - Delete postcard
router.delete('/postcards/:id', postcardController.delete);

// GET /postcards/:id/image - Serve image file
router.get('/postcards/:id/image', postcardController.getImage);

// GET /postcards/:id/audio - Serve audio file
router.get('/postcards/:id/audio', postcardController.getAudio);

export default router;
