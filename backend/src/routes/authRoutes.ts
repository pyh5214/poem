import { Router } from 'express';
import * as authController from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Google OAuth flow
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// User endpoints
router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/logout', requireAuth, authController.logout);

export default router;
