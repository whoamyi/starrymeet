import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getSavedCelebrities,
  saveCelebrity,
  unsaveCelebrity
} from '../controllers/savedController';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/saved - Get all saved celebrities
router.get('/', getSavedCelebrities);

// GET /api/saved/check/:celebrity_id - Check if celebrity is saved
router.get('/check/:celebrity_id', async (req, res) => {
  try {
    const { celebrity_id } = req.params;
    const user_id = (req as any).user?.id;

    if (!user_id) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }

    const result = await sequelize.query(
      'SELECT id FROM saved_celebrities WHERE user_id = :user_id AND celebrity_id = :celebrity_id LIMIT 1',
      {
        replacements: { user_id, celebrity_id },
        type: QueryTypes.SELECT
      }
    );

    res.json({
      success: true,
      data: {
        is_saved: result.length > 0
      }
    });
  } catch (error: any) {
    console.error('Error checking saved status:', error);
    res.json({ success: true, data: { is_saved: false } });
  }
});

// POST /api/saved - Save a celebrity
router.post('/', saveCelebrity);

// DELETE /api/saved/:celebrity_id - Remove saved celebrity
router.delete('/:celebrity_id', unsaveCelebrity);

export default router;
