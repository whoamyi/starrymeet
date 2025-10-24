/**
 * Celebrity Profile Routes
 * Handles celebrity cards and full profiles
 */

import express from 'express';
import {
  getCelebrityCards,
  getCelebrityProfile,
  getFeaturedCelebrities
} from '../controllers/celebrityProfileController';

const router = express.Router();

// GET /api/celebrity-profiles - Browse cards (minimal data)
router.get('/', getCelebrityCards);

// GET /api/celebrity-profiles/featured - Featured celebrities
router.get('/featured', getFeaturedCelebrities);

// GET /api/celebrity-profiles/:slug - Full profile
router.get('/:slug', getCelebrityProfile);

export default router;
