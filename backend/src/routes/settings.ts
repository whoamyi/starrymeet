import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getSettings,
  updateSettings,
  deleteAccount
} from '../controllers/settingsController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/settings - Get user settings
router.get('/', getSettings);

// PUT /api/settings - Update user settings
router.put('/', updateSettings);

// DELETE /api/settings/account - Delete user account
router.delete('/account', deleteAccount);

export default router;
