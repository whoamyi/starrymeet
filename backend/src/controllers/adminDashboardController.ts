import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';

/**
 * GET /api/admin/dashboard/stats
 * Get comprehensive dashboard statistics for admin overview
 */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get messaging stats
    const messagingStats = await sequelize.query(`
      SELECT
        COUNT(DISTINCT conv.id) as total_conversations,
        COALESCE(SUM(conv.unread_count_admin), 0) as total_unread_messages,
        COUNT(DISTINCT CASE WHEN conv.last_message_at >= NOW() - INTERVAL '24 hours' THEN conv.id END) as conversations_today
      FROM conversations conv
      WHERE conv.status = 'active'
    `, {
      type: QueryTypes.SELECT
    });

    // Get application stats
    const applicationStats = await sequelize.query(`
      SELECT
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_applications,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as applications_today
      FROM meeting_applications
    `, {
      type: QueryTypes.SELECT
    });

    // Get booking stats (if bookings table exists)
    const bookingStats = await sequelize.query(`
      SELECT
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN booking_date >= CURRENT_DATE THEN 1 END) as upcoming_bookings
      FROM bookings
    `, {
      type: QueryTypes.SELECT
    });

    // Get celebrity stats
    const celebrityStats = await sequelize.query(`
      SELECT
        COUNT(*) as total_celebrities,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_celebrities,
        COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_celebrities
      FROM celebrities_new
    `, {
      type: QueryTypes.SELECT
    });

    // Get user stats
    const userStats = await sequelize.query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as users_this_week,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as users_this_month
      FROM users
      WHERE role = 'user'
    `, {
      type: QueryTypes.SELECT
    });

    // Combine all stats
    const dashboardStats = {
      messaging: messagingStats[0],
      applications: applicationStats[0],
      bookings: bookingStats[0],
      celebrities: celebrityStats[0],
      users: userStats[0]
    };

    res.json({
      success: true,
      data: dashboardStats
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch dashboard statistics' }
    });
  }
};

/**
 * GET /api/admin/dashboard/celebrity-overview
 * Get celebrity list with key metrics for dashboard grid
 */
export const getCelebrityOverview = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;

    let whereClause = "c.status = 'active'";
    const replacements: any = {};

    if (category) {
      whereClause += " AND cat.name = :category";
      replacements.category = category;
    }

    const celebrities = await sequelize.query(`
      SELECT
        c.id,
        c.display_name,
        c.avatar_url,
        c.username,
        cat.name as category,
        c.is_verified,
        c.is_featured,
        COUNT(DISTINCT conv.id) as conversation_count,
        COALESCE(SUM(conv.unread_count_admin), 0) as unread_messages,
        COUNT(DISTINCT CASE WHEN a.status IN ('pending', 'under_review') THEN a.id END) as pending_applications,
        c.total_bookings
      FROM celebrities_new c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN conversations conv ON conv.celebrity_id = c.id AND conv.status = 'active'
      LEFT JOIN meeting_applications a ON a.celebrity_id = c.id
      WHERE ${whereClause}
      GROUP BY c.id, c.display_name, c.avatar_url, c.username, cat.name, c.is_verified, c.is_featured, c.total_bookings
      ORDER BY unread_messages DESC, pending_applications DESC, c.display_name ASC
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: celebrities
    });
  } catch (error: any) {
    console.error('Error fetching celebrity overview:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch celebrity overview' }
    });
  }
};

/**
 * GET /api/admin/dashboard/recent-activity
 * Get recent activity across all features
 */
export const getRecentActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const recentActivity = await sequelize.query(`
      SELECT * FROM (
        -- Recent messages
        SELECT
          'message' as type,
          m.id,
          m.created_at,
          u.first_name || ' ' || u.last_name as user_name,
          c.display_name as celebrity_name,
          c.id as celebrity_id,
          SUBSTRING(m.message, 1, 100) as preview
        FROM messages m
        JOIN users u ON m.from_user_id = u.id
        JOIN celebrities_new c ON m.celebrity_id = c.id
        WHERE m.is_from_admin = false

        UNION ALL

        -- Recent applications
        SELECT
          'application' as type,
          a.id,
          a.created_at,
          a.first_name || ' ' || a.last_name as user_name,
          c.display_name as celebrity_name,
          c.id as celebrity_id,
          a.application_type || ' application - ' || a.status as preview
        FROM meeting_applications a
        JOIN celebrities_new c ON a.celebrity_id = c.id

        UNION ALL

        -- Recent bookings
        SELECT
          'booking' as type,
          b.id,
          b.created_at,
          u.first_name || ' ' || u.last_name as user_name,
          c.display_name as celebrity_name,
          c.id as celebrity_id,
          b.meeting_type || ' meeting - ' || b.status as preview
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        JOIN celebrities_new c ON b.celebrity_id = c.id
      ) AS combined_activity
      ORDER BY created_at DESC
      LIMIT :limit
    `, {
      replacements: { limit: Number(limit) },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: recentActivity
    });
  } catch (error: any) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch recent activity' }
    });
  }
};
