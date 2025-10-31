import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getSavedCelebrities,
  saveCelebrity,
  unsaveCelebrity
} from '../controllers/savedController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/saved - Get all saved celebrities
router.get('/', getSavedCelebrities);

// POST /api/saved - Save a celebrity
router.post('/', saveCelebrity);

// DELETE /api/saved/:celebrity_id - Remove saved celebrity
router.delete('/:celebrity_id', unsaveCelebrity);

export default router;
