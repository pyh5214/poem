import { Router, Request, Response } from 'express';
import poemRoutes from './poemRoutes';
import musicRoutes from './musicRoutes';
import postcardRoutes from './postcardRoutes';
import { config } from '../config';
import { HealthResponse } from '../types';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Server is running normally.',
    apiKeySet: !!config.apiKey,
    geminiKeySet: !!config.geminiApiKey
  } as HealthResponse);
});

// Poem routes
router.use('/', poemRoutes);

// Music routes
router.use('/', musicRoutes);

// Postcard routes
router.use('/', postcardRoutes);

export default router;
