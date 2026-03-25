import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

// Statistics
router.get('/stats', adminController.getStats);
router.get('/stats/daily', adminController.getDailyStats);

// User management
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id/block', adminController.toggleBlock);
router.patch('/users/:id/role', adminController.updateRole);
router.delete('/users/:id', adminController.deleteUser);

// Postcard management
router.get('/postcards', adminController.listAllPostcards);
router.delete('/postcards/:id', adminController.forceDeletePostcard);

// System settings
router.get('/settings', adminController.getSettings);
router.patch('/settings', adminController.updateSetting);
router.delete('/settings/:key', adminController.deleteSetting);

export default router;
