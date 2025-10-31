import { Request, Response } from 'express';
import { SavedCelebrity, Celebrity } from '../models';

// Get all saved celebrities for user
export const getSavedCelebrities = async (req: Request, res: Response) => {
  try {
    const saved = await SavedCelebrity.findAll({
      where: { user_id: req.user!.id },
      include: [
        {
          model: Celebrity,
          as: 'Celebrity',
          attributes: ['id', 'display_name', 'username', 'avatar_url', 'category', 'bio', 'is_active']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Format for frontend
    const formattedSaved = saved.map((item: any) => ({
      id: item.id,
      celebrity_id: item.celebrity_id,
      saved_at: item.created_at,
      ...item.Celebrity?.dataValues
    }));

    res.json({
      success: true,
      data: formattedSaved
    });
  } catch (error) {
    console.error('Saved celebrities fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch saved celebrities' }
    });
  }
};

// Save a celebrity
export const saveCelebrity = async (req: Request, res: Response) => {
  try {
    const { celebrity_id } = req.body;

    if (!celebrity_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'Celebrity ID is required' }
      });
    }

    // Check if already saved
    const existing = await SavedCelebrity.findOne({
      where: {
        user_id: req.user!.id,
        celebrity_id
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: { message: 'Celebrity already saved' }
      });
    }

    await SavedCelebrity.create({
      user_id: req.user!.id,
      celebrity_id
    });

    res.json({
      success: true,
      message: 'Celebrity saved successfully'
    });
  } catch (error) {
    console.error('Save celebrity error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to save celebrity' }
    });
  }
};

// Remove saved celebrity
export const unsaveCelebrity = async (req: Request, res: Response) => {
  try {
    const { celebrity_id } = req.params;

    const deletedRows = await SavedCelebrity.destroy({
      where: {
        user_id: req.user!.id,
        celebrity_id
      }
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Saved celebrity not found' }
      });
    }

    res.json({
      success: true,
      message: 'Celebrity removed from saved'
    });
  } catch (error) {
    console.error('Unsave celebrity error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to remove celebrity' }
    });
  }
};
