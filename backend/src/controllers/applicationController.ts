import { Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

/**
 * POST /api/applications/professional
 * Submit a professional meeting application
 */
export const submitProfessionalApplication = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.userId || req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const {
      celebritySlug,
      firstName,
      lastName,
      email,
      phone,
      professionalSummary,
      whyCelebrity,
      meetingGoals,
      whatYouBring,
      nextSteps,
      linkedinUrl,
      companyWebsite,
      portfolioUrl,
      socialMedia
    } = req.body;

    // Validation
    if (!celebritySlug || !firstName || !lastName || !email || !professionalSummary || !whyCelebrity || !meetingGoals || !whatYouBring || !nextSteps || !linkedinUrl) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }

    // Get celebrity ID from slug
    const celebrity = await sequelize.query(
      'SELECT id FROM celebrities_new WHERE slug = :slug AND status = \'active\'',
      {
        replacements: { slug: celebritySlug },
        type: QueryTypes.SELECT
      }
    );

    if (!celebrity || celebrity.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Celebrity not found' }
      });
    }

    const celebrity_id = (celebrity[0] as any).id;

    // Generate application number
    const application_number = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Insert application
    const result = await sequelize.query(
      `INSERT INTO meeting_applications (
        application_number,
        user_id,
        celebrity_id,
        application_type,
        first_name,
        last_name,
        email,
        phone,
        professional_summary,
        why_celebrity,
        meeting_goals,
        what_you_bring,
        next_steps,
        linkedin_url,
        company_website,
        portfolio_url,
        social_media,
        status,
        created_at
      ) VALUES (
        :application_number,
        :user_id,
        :celebrity_id,
        'professional',
        :firstName,
        :lastName,
        :email,
        :phone,
        :professionalSummary,
        :whyCelebrity,
        :meetingGoals,
        :whatYouBring,
        :nextSteps,
        :linkedinUrl,
        :companyWebsite,
        :portfolioUrl,
        :socialMedia,
        'pending',
        NOW()
      ) RETURNING id`,
      {
        replacements: {
          application_number,
          user_id,
          celebrity_id,
          firstName,
          lastName,
          email,
          phone,
          professionalSummary,
          whyCelebrity,
          meetingGoals,
          whatYouBring,
          nextSteps,
          linkedinUrl,
          companyWebsite,
          portfolioUrl,
          socialMedia
        },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({
      success: true,
      data: {
        application_number,
        message: 'Professional application submitted successfully'
      }
    });
  } catch (error: any) {
    console.error('Error submitting professional application:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to submit application' }
    });
  }
};

/**
 * POST /api/applications/personal
 * Submit a personal meeting application
 */
export const submitPersonalApplication = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.userId || req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const {
      celebritySlug,
      firstName,
      lastName,
      email,
      phone,
      yourStory,
      whatTheyMean,
      whyNow,
      meetingVision,
      yourCase,
      additionalContext,
      instagramUrl,
      personalLinks
    } = req.body;

    // Validation
    if (!celebritySlug || !firstName || !lastName || !email || !yourStory || !whatTheyMean || !whyNow || !meetingVision || !yourCase) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }

    // Get celebrity ID from slug
    const celebrity = await sequelize.query(
      'SELECT id FROM celebrities_new WHERE slug = :slug AND status = \'active\'',
      {
        replacements: { slug: celebritySlug },
        type: QueryTypes.SELECT
      }
    );

    if (!celebrity || celebrity.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Celebrity not found' }
      });
    }

    const celebrity_id = (celebrity[0] as any).id;

    // Generate application number
    const application_number = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Insert application
    await sequelize.query(
      `INSERT INTO meeting_applications (
        application_number,
        user_id,
        celebrity_id,
        application_type,
        first_name,
        last_name,
        email,
        phone,
        your_story,
        what_they_mean,
        why_now,
        meeting_vision,
        your_case,
        additional_context,
        instagram_url,
        personal_links,
        status,
        created_at
      ) VALUES (
        :application_number,
        :user_id,
        :celebrity_id,
        'personal',
        :firstName,
        :lastName,
        :email,
        :phone,
        :yourStory,
        :whatTheyMean,
        :whyNow,
        :meetingVision,
        :yourCase,
        :additionalContext,
        :instagramUrl,
        :personalLinks,
        'pending',
        NOW()
      )`,
      {
        replacements: {
          application_number,
          user_id,
          celebrity_id,
          firstName,
          lastName,
          email,
          phone,
          yourStory,
          whatTheyMean,
          whyNow,
          meetingVision,
          yourCase,
          additionalContext,
          instagramUrl,
          personalLinks
        },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({
      success: true,
      data: {
        application_number,
        message: 'Personal application submitted successfully'
      }
    });
  } catch (error: any) {
    console.error('Error submitting personal application:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to submit application' }
    });
  }
};

/**
 * GET /api/applications
 * Get user's applications
 */
export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.userId || req.user?.id;

    const applications = await sequelize.query(
      `SELECT
        a.id,
        a.application_number,
        a.application_type,
        a.status,
        a.created_at,
        c.display_name as celebrity_name,
        c.slug as celebrity_slug,
        c.avatar_url as celebrity_image,
        cat.name as category
      FROM meeting_applications a
      JOIN celebrities_new c ON a.celebrity_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE a.user_id = :user_id
      ORDER BY a.created_at DESC`,
      {
        replacements: { user_id },
        type: QueryTypes.SELECT
      }
    );

    res.json({
      success: true,
      data: applications
    });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch applications' }
    });
  }
};

/**
 * GET /api/applications/:id
 * Get specific application details
 */
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.userId || req.user?.id;

    const application = await sequelize.query(
      `SELECT a.*, c.display_name as celebrity_name, c.avatar_url as celebrity_image
      FROM meeting_applications a
      JOIN celebrities_new c ON a.celebrity_id = c.id
      WHERE a.id = :id AND a.user_id = :user_id`,
      {
        replacements: { id, user_id },
        type: QueryTypes.SELECT
      }
    );

    if (!application || application.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    res.json({
      success: true,
      data: application[0]
    });
  } catch (error: any) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch application' }
    });
  }
};

/**
 * PATCH /api/applications/:id/status
 * Update application status (admin/celebrity only)
 */
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // TODO: Add role check for admin/celebrity

    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid status' }
      });
    }

    await sequelize.query(
      `UPDATE meeting_applications
      SET status = :status, review_notes = :notes, reviewed_at = NOW()
      WHERE id = :id`,
      {
        replacements: { id, status, notes: notes || null },
        type: QueryTypes.UPDATE
      }
    );

    res.json({
      success: true,
      message: 'Application status updated'
    });
  } catch (error: any) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to update application status' }
    });
  }
};
