/**
 * Dashboard Routes
 * Handles user dashboard, notifications, and saved celebrities
 */

import express from 'express';
import {
  getUserDashboard,
  getNotifications,
  markNotificationRead,
  addSavedCelebrity,
  removeSavedCelebrity
} from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard/user - Get complete dashboard data
router.get('/user', getUserDashboard);

// GET /api/dashboard/notifications - Get user notifications
router.get('/notifications', getNotifications);

// PATCH /api/dashboard/notifications/:id/read - Mark notification as read
router.patch('/notifications/:id/read', markNotificationRead);

// POST /api/saved/add - Add celebrity to favorites
router.post('/saved/add', addSavedCelebrity);

// DELETE /api/saved/remove - Remove celebrity from favorites
router.delete('/saved/remove', removeSavedCelebrity);

export default router;
