import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

// Note: Express Request extension is declared in ../types/index.ts

// Authentication middleware - requires valid JWT
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.substring(7);
  const payload = authService.verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const user = authService.findById(payload.userId);

  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  if (user.isBlocked) {
    res.status(403).json({ error: 'Account is blocked' });
    return;
  }

  req.user = user;
  next();
};

// Optional authentication - attaches user if token is valid, but doesn't require it
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);

    if (payload) {
      const user = authService.findById(payload.userId);
      if (user && !user.isBlocked) {
        req.user = user;
      }
    }
  }

  next();
};

// Admin middleware - requires admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
};
