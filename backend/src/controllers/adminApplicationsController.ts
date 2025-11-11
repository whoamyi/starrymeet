import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Celebrity } from '../models';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';

/**
 * GET /api/admin/applications/overview
 * Get overview of all applications grouped by celebrity
 */
export const getApplicationsOverview = async (req: AuthRequest, res: Response) => {
  try {
    const overview = await sequelize.query(`
      SELECT
        c.id as celebrity_id,
        c.display_name as celebrity_name,
        c.avatar_url as celebrity_avatar,
        cat.name as category,
        COUNT(a.id) as total_applications,
        COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN a.status = 'under_review' THEN 1 END) as under_review_count,
        COUNT(CASE WHEN a.status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected_count,
        MAX(a.created_at) as latest_application_at
      FROM celebrities_new c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN meeting_applications a ON a.celebrity_id = c.id
      WHERE c.status = 'active'
      GROUP BY c.id, c.display_name, c.avatar_url, cat.name
      HAVING COUNT(a.id) > 0
      ORDER BY pending_count DESC, latest_application_at DESC
    `, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: overview
    });
  } catch (error: any) {
    console.error('Error fetching applications overview:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch applications overview' }
    });
  }
};

/**
 * GET /api/admin/applications/celebrity/:celebrityId
 * Get all applications for a specific celebrity with filtering
 */
export const getCelebrityApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { celebrityId } = req.params;
    const { status, type, limit = 50, offset = 0 } = req.query;

    // Build WHERE clause
    let whereClause = 'a.celebrity_id = :celebrityId';
    const replacements: any = { celebrityId, limit: Number(limit), offset: Number(offset) };

    if (status) {
      whereClause += ' AND a.status = :status';
      replacements.status = status;
    }

    if (type) {
      whereClause += ' AND a.application_type = :type';
      replacements.type = type;
    }

    const applications = await sequelize.query(`
      SELECT
        a.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM meeting_applications a
      JOIN users u ON a.user_id = u.id
      WHERE ${whereClause}
      ORDER BY
        CASE
          WHEN a.status = 'pending' THEN 1
          WHEN a.status = 'under_review' THEN 2
          WHEN a.status = 'approved' THEN 3
          WHEN a.status = 'rejected' THEN 4
          WHEN a.status = 'cancelled' THEN 5
        END,
        a.created_at DESC
      LIMIT :limit OFFSET :offset
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Get total count for pagination
    const countResult = await sequelize.query(`
      SELECT COUNT(*) as total
      FROM meeting_applications a
      WHERE ${whereClause}
    `, {
      replacements: { celebrityId, status, type },
      type: QueryTypes.SELECT
    }) as any[];

    res.json({
      success: true,
      data: applications,
      pagination: {
        total: countResult[0].total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error: any) {
    console.error('Error fetching celebrity applications:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch applications' }
    });
  }
};

/**
 * GET /api/admin/applications/:applicationId
 * Get detailed view of a specific application
 */
export const getApplicationDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.params;

    const application = await sequelize.query(`
      SELECT
        a.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        u.phone as user_phone,
        u.avatar_url as user_avatar,
        c.display_name as celebrity_name,
        c.avatar_url as celebrity_avatar,
        reviewer.first_name as reviewer_first_name,
        reviewer.last_name as reviewer_last_name
      FROM meeting_applications a
      JOIN users u ON a.user_id = u.id
      JOIN celebrities_new c ON a.celebrity_id = c.id
      LEFT JOIN users reviewer ON a.reviewed_by = reviewer.id
      WHERE a.id = :applicationId
    `, {
      replacements: { applicationId },
      type: QueryTypes.SELECT
    });

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
    console.error('Error fetching application detail:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch application' }
    });
  }
};

/**
 * PATCH /api/admin/applications/:applicationId/status
 * Update application status with review notes
 */
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status, review_notes } = req.body;
    const adminUserId = req.user?.userId || req.user?.id;

    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid status. Must be: pending, under_review, approved, rejected, or cancelled' }
      });
    }

    // Check if application exists
    const application = await sequelize.query(`
      SELECT id FROM meeting_applications WHERE id = :applicationId
    `, {
      replacements: { applicationId },
      type: QueryTypes.SELECT
    });

    if (!application || application.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    // Update application
    await sequelize.query(`
      UPDATE meeting_applications
      SET
        status = :status,
        review_notes = :review_notes,
        reviewed_by = :reviewed_by,
        reviewed_at = NOW(),
        updated_at = NOW()
      WHERE id = :applicationId
    `, {
      replacements: {
        applicationId,
        status,
        review_notes: review_notes || null,
        reviewed_by: adminUserId
      },
      type: QueryTypes.UPDATE
    });

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to update application status' }
    });
  }
};

/**
 * GET /api/admin/applications/stats
 * Get overall application statistics for admin dashboard
 */
export const getApplicationStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await sequelize.query(`
      SELECT
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(CASE WHEN application_type = 'professional' THEN 1 END) as professional_count,
        COUNT(CASE WHEN application_type = 'personal' THEN 1 END) as personal_count,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as applications_today,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as applications_this_week,
        COUNT(DISTINCT celebrity_id) as celebrities_with_applications
      FROM meeting_applications
    `, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error: any) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch application statistics' }
    });
  }
};

/**
 * GET /api/admin/applications/recent
 * Get recent applications across all celebrities
 */
export const getRecentApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const recentApplications = await sequelize.query(`
      SELECT
        a.id,
        a.application_number,
        a.application_type,
        a.status,
        a.created_at,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        c.display_name as celebrity_name,
        c.avatar_url as celebrity_avatar,
        c.id as celebrity_id
      FROM meeting_applications a
      JOIN users u ON a.user_id = u.id
      JOIN celebrities_new c ON a.celebrity_id = c.id
      ORDER BY a.created_at DESC
      LIMIT :limit
    `, {
      replacements: { limit: Number(limit) },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: recentApplications
    });
  } catch (error: any) {
    console.error('Error fetching recent applications:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch recent applications' }
    });
  }
};

/**
 * POST /api/admin/applications/:applicationId/notes
 * Add internal notes to an application
 */
export const addApplicationNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;
    const adminUserId = req.user?.userId || req.user?.id;

    if (!notes) {
      return res.status(400).json({
        success: false,
        error: { message: 'Notes are required' }
      });
    }

    // Update application with notes
    await sequelize.query(`
      UPDATE meeting_applications
      SET
        review_notes = CASE
          WHEN review_notes IS NULL THEN :notes
          ELSE CONCAT(review_notes, '\n\n---\n\n', :notes)
        END,
        updated_at = NOW()
      WHERE id = :applicationId
    `, {
      replacements: { applicationId, notes },
      type: QueryTypes.UPDATE
    });

    res.json({
      success: true,
      message: 'Notes added successfully'
    });
  } catch (error: any) {
    console.error('Error adding application notes:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to add notes' }
    });
  }
};
