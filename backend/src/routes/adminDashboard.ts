/**
 * Admin Dashboard Routes
 * Overview statistics and celebrity management for admin panel
 */

import express from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';
import {
  getDashboardStats,
  getCelebrityOverview,
  getRecentActivity
} from '../controllers/adminDashboardController';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/dashboard/stats - Overall dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/admin/dashboard/celebrity-overview - Celebrity grid with metrics
router.get('/celebrity-overview', getCelebrityOverview);

// GET /api/admin/dashboard/recent-activity - Recent activity feed
router.get('/recent-activity', getRecentActivity);

export default router;
