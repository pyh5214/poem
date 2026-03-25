import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { adminService } from '../services/adminService';
import { postcardService } from '../services/postcardService';
import { ErrorResponse, UserRole } from '../types';

export const adminController = {
  // GET /admin/stats - Get overall statistics
  getStats(_req: Request, res: Response): void {
    try {
      const stats = adminService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        error: 'Failed to get statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // GET /admin/stats/daily - Get daily stats for charts
  getDailyStats(req: Request, res: Response): void {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const stats = adminService.getDailyStats(Math.min(days, 365));
      res.json(stats);
    } catch (error) {
      console.error('Error getting daily stats:', error);
      res.status(500).json({
        error: 'Failed to get daily statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // GET /admin/users - List all users
  listUsers(req: Request, res: Response): void {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const search = req.query.search as string | undefined;

      const result = userService.list(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({
        error: 'Failed to list users',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // GET /admin/users/:id - Get user details
  getUser(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const user = userService.getById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' } as ErrorResponse);
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({
        error: 'Failed to get user',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // PATCH /admin/users/:id/block - Block/unblock user
  toggleBlock(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { isBlocked } = req.body;

      if (typeof isBlocked !== 'boolean') {
        res.status(400).json({ error: 'isBlocked must be a boolean' } as ErrorResponse);
        return;
      }

      // Prevent blocking yourself
      if (req.user?.id === id) {
        res.status(400).json({ error: 'Cannot block yourself' } as ErrorResponse);
        return;
      }

      const user = userService.setBlocked(id, isBlocked);

      if (!user) {
        res.status(404).json({ error: 'User not found' } as ErrorResponse);
        return;
      }

      res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
    } catch (error) {
      console.error('Error toggling block:', error);
      res.status(500).json({
        error: 'Failed to update user',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // PATCH /admin/users/:id/role - Update user role
  updateRole(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' } as ErrorResponse);
        return;
      }

      // Prevent demoting yourself
      if (req.user?.id === id && role === 'user') {
        res.status(400).json({ error: 'Cannot demote yourself' } as ErrorResponse);
        return;
      }

      const user = userService.setRole(id, role as UserRole);

      if (!user) {
        res.status(404).json({ error: 'User not found' } as ErrorResponse);
        return;
      }

      res.json({ message: `User role updated to ${role}`, user });
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({
        error: 'Failed to update user role',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // DELETE /admin/users/:id - Delete user
  deleteUser(req: Request, res: Response): void {
    try {
      const { id } = req.params;

      // Prevent deleting yourself
      if (req.user?.id === id) {
        res.status(400).json({ error: 'Cannot delete yourself' } as ErrorResponse);
        return;
      }

      const success = userService.delete(id);

      if (!success) {
        res.status(404).json({ error: 'User not found' } as ErrorResponse);
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        error: 'Failed to delete user',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // GET /admin/postcards - List all postcards (admin view)
  listAllPostcards(req: Request, res: Response): void {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const result = postcardService.listAll(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error listing postcards:', error);
      res.status(500).json({
        error: 'Failed to list postcards',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // DELETE /admin/postcards/:id - Force delete postcard
  forceDeletePostcard(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const success = postcardService.forceDelete(id);

      if (!success) {
        res.status(404).json({ error: 'Postcard not found' } as ErrorResponse);
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting postcard:', error);
      res.status(500).json({
        error: 'Failed to delete postcard',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // GET /admin/settings - Get all system settings
  getSettings(_req: Request, res: Response): void {
    try {
      const settings = adminService.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error getting settings:', error);
      res.status(500).json({
        error: 'Failed to get settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // PATCH /admin/settings - Update system setting
  updateSetting(req: Request, res: Response): void {
    try {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        res.status(400).json({ error: 'key and value are required' } as ErrorResponse);
        return;
      }

      const setting = adminService.setSetting(key, value, req.user!.id);
      res.json(setting);
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(500).json({
        error: 'Failed to update setting',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  // DELETE /admin/settings/:key - Delete system setting
  deleteSetting(req: Request, res: Response): void {
    try {
      const { key } = req.params;
      const success = adminService.deleteSetting(key);

      if (!success) {
        res.status(404).json({ error: 'Setting not found' } as ErrorResponse);
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting setting:', error);
      res.status(500).json({
        error: 'Failed to delete setting',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },
};
