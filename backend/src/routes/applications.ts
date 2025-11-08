/**
 * Applications Routes
 * Handles professional and personal meeting applications
 */

import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  submitProfessionalApplication,
  submitPersonalApplication,
  getUserApplications,
  getApplicationById,
  updateApplicationStatus
} from '../controllers/applicationController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// POST /api/applications/professional - Submit professional application
router.post('/professional', submitProfessionalApplication);

// POST /api/applications/personal - Submit personal application
router.post('/personal', submitPersonalApplication);

// GET /api/applications - Get user's applications
router.get('/', getUserApplications);

// GET /api/applications/:id - Get specific application
router.get('/:id', getApplicationById);

// PATCH /api/applications/:id/status - Update application status (admin/celebrity only)
router.patch('/:id/status', updateApplicationStatus);

export default router;
