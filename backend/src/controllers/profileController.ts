import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: [
        'id',
        'email',
        'first_name',
        'last_name',
        'phone',
        'avatar_url',
        'role',
        'email_verified',
        'created_at',
        'updated_at'
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch profile' }
    });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, phone } = req.body;

    await User.update(
      {
        first_name,
        last_name,
        phone
      },
      {
        where: { id: req.user!.id }
      }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update profile' }
    });
  }
};

// Upload profile image
export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No image file provided' }
      });
    }

    // Get the file path/URL (assuming multer is configured)
    const imageUrl = `/uploads/${req.file.filename}`;

    await User.update(
      { avatar_url: imageUrl },
      { where: { id: req.user!.id } }
    );

    res.json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to upload image' }
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Current and new password are required' }
      });
    }

    // Get user with password
    const user = await User.findByPk(req.user!.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(current_password, user.password_hash);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: { message: 'Current password is incorrect' }
      });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await User.update(
      { password_hash: hashedPassword },
      { where: { id: req.user!.id } }
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update password' }
    });
  }
};
