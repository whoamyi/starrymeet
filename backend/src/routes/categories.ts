/**
 * Category Routes
 * Handles category listing for browse filters
 */

import express from 'express';
import { getCategories } from '../controllers/categoryController';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', getCategories);

export default router;
