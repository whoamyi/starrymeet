import { Request, Response } from 'express';
import { User, UserPreference } from '../models';

// Get user settings/preferences
export const getSettings = async (req: Request, res: Response) => {
  try {
    let preferences = await UserPreference.findOne({
      where: { user_id: req.user!.id }
    });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = await UserPreference.create({
        user_id: req.user!.id
      });
    }

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch settings' }
    });
  }
};

// Update user settings/preferences
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const {
      email_notifications,
      sms_notifications,
      marketing_emails,
      currency,
      timezone,
      language
    } = req.body;

    await UserPreference.update(
      {
        email_notifications,
        sms_notifications,
        marketing_emails,
        currency,
        timezone,
        language
      },
      {
        where: { user_id: req.user!.id }
      }
    );

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update settings' }
    });
  }
};

// Delete user account
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    // Delete user (cascading deletes should handle related data)
    await User.destroy({
      where: { id: req.user!.id }
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete account' }
    });
  }
};
