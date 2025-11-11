/**
 * Admin Applications Routes
 * Celebrity-grouped application management for admin panel
 */

import express from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';
import {
  getApplicationsOverview,
  getCelebrityApplications,
  getApplicationDetail,
  updateApplicationStatus,
  getApplicationStats,
  getRecentApplications,
  addApplicationNotes
} from '../controllers/adminApplicationsController';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/applications/overview - Overview of all applications grouped by celebrity
router.get('/overview', getApplicationsOverview);

// GET /api/admin/applications/stats - Overall application statistics
router.get('/stats', getApplicationStats);

// GET /api/admin/applications/recent - Recent applications across all celebrities
router.get('/recent', getRecentApplications);

// GET /api/admin/applications/celebrity/:celebrityId - Get applications for specific celebrity
router.get('/celebrity/:celebrityId', getCelebrityApplications);

// GET /api/admin/applications/:applicationId - Get detailed application view
router.get('/:applicationId', getApplicationDetail);

// PATCH /api/admin/applications/:applicationId/status - Update application status
router.patch('/:applicationId/status', updateApplicationStatus);

// POST /api/admin/applications/:applicationId/notes - Add internal notes
router.post('/:applicationId/notes', addApplicationNotes);

export default router;
