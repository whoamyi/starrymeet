/**
 * Dashboard Controller
 * Handles user dashboard data aggregation
 */

import { Request, Response } from 'express';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

/**
 * GET /api/dashboard/user
 * Get complete user dashboard data
 */
export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Get upcoming meetings
    const upcomingQuery = `
      SELECT
        b.id,
        b.booking_number,
        b.status,
        b.booking_date as meeting_date,
        30 as duration_minutes,
        (b.total_cents / 100.0) as total_amount,
        c.display_name as celebrity_name,
        c.slug as celebrity_slug,
        c.avatar_url as celebrity_image,
        cat.name as category,
        b.meeting_type,
        '' as location
      FROM bookings b
      JOIN celebrities_new c ON b.celebrity_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE b.user_id = :user_id
        AND b.status IN ('confirmed', 'payment_complete')
        AND b.booking_date > NOW()::date
      ORDER BY b.booking_date ASC
      LIMIT 10
    `;

    // Get past meetings
    const pastQuery = `
      SELECT
        b.id,
        b.booking_number,
        b.status,
        b.booking_date as meeting_date,
        30 as duration_minutes,
        (b.total_cents / 100.0) as total_amount,
        b.completed_at,
        c.display_name as celebrity_name,
        c.slug as celebrity_slug,
        c.avatar_url as celebrity_image,
        cat.name as category,
        b.meeting_type,
        CASE
          WHEN r.id IS NOT NULL THEN TRUE
          ELSE FALSE
        END as has_review
      FROM bookings b
      JOIN celebrities_new c ON b.celebrity_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN reviews r ON b.id = r.booking_id
      WHERE b.user_id = :user_id
        AND b.status = 'completed'
      ORDER BY b.completed_at DESC
      LIMIT 10
    `;

    // Get pending requests
    const pendingQuery = `
      SELECT
        b.id,
        b.booking_number,
        b.status,
        b.booking_date as meeting_date,
        30 as duration_minutes,
        (b.total_cents / 100.0) as total_amount,
        b.created_at,
        c.display_name as celebrity_name,
        c.slug as celebrity_slug,
        c.avatar_url as celebrity_image,
        cat.name as category,
        b.meeting_type,
        '' as location
      FROM bookings b
      JOIN celebrities_new c ON b.celebrity_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE b.user_id = :user_id
        AND b.status IN ('pending_approval', 'approved', 'payment_pending')
      ORDER BY b.created_at DESC
      LIMIT 10
    `;

    // Get saved celebrities
    const savedQuery = `
      SELECT
        sc.id as saved_id,
        sc.created_at as saved_at,
        c.id as celebrity_id,
        c.display_name as name,
        c.slug,
        c.avatar_url,
        c.base_price_cents / 100.0 as min_price,
        cat.name as category,
        cs.tier
      FROM saved_celebrities sc
      JOIN celebrities_new c ON sc.celebrity_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
      WHERE sc.user_id = :user_id
        AND c.is_active = true
      ORDER BY sc.created_at DESC
      LIMIT 20
    `;

    // Get notifications
    const notificationsQuery = `
      SELECT
        id,
        type,
        title,
        message,
        link,
        read_status,
        created_at
      FROM notifications
      WHERE user_id = :user_id
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get summary stats
    const statsQuery = `
      SELECT
        COUNT(DISTINCT CASE WHEN b.status IN ('confirmed', 'payment_complete') AND b.meeting_date > NOW() THEN b.id END) as upcoming_count,
        COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_count,
        COUNT(DISTINCT CASE WHEN b.status IN ('pending_approval', 'approved', 'payment_pending') THEN b.id END) as pending_count,
        COUNT(DISTINCT sc.celebrity_id) as saved_count,
        COUNT(DISTINCT CASE WHEN n.read_status = FALSE THEN n.id END) as unread_notifications_count
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      LEFT JOIN saved_celebrities sc ON u.id = sc.user_id
      LEFT JOIN notifications n ON u.id = n.user_id
      WHERE u.id = :user_id
    `;

    // Execute all queries in parallel with error handling
    const [
      upcomingMeetings,
      pastMeetings,
      pendingRequests,
      savedCelebrities,
      notifications,
      stats
    ] = await Promise.all([
      sequelize.query(upcomingQuery, { replacements: { user_id }, type: QueryTypes.SELECT }).catch(err => {
        console.error('Error fetching upcoming meetings:', err);
        return [];
      }),
      sequelize.query(pastQuery, { replacements: { user_id }, type: QueryTypes.SELECT }).catch(err => {
        console.error('Error fetching past meetings:', err);
        return [];
      }),
      sequelize.query(pendingQuery, { replacements: { user_id }, type: QueryTypes.SELECT }).catch(err => {
        console.error('Error fetching pending requests:', err);
        return [];
      }),
      sequelize.query(savedQuery, { replacements: { user_id }, type: QueryTypes.SELECT }).catch(err => {
        console.error('Error fetching saved celebrities:', err);
        return [];
      }),
      sequelize.query(notificationsQuery, { replacements: { user_id }, type: QueryTypes.SELECT }).catch(err => {
        console.error('Error fetching notifications:', err);
        return [];
      }),
      sequelize.query(statsQuery, { replacements: { user_id }, type: QueryTypes.SELECT }).catch(err => {
        console.error('Error fetching stats:', err);
        return [{ upcoming_count: 0, completed_count: 0, pending_count: 0, saved_count: 0, unread_notifications_count: 0 }];
      })
    ]);

    res.json({
      success: true,
      data: {
        upcoming_meetings: upcomingMeetings || [],
        past_meetings: pastMeetings || [],
        pending_requests: pendingRequests || [],
        saved_celebrities: savedCelebrities || [],
        notifications: notifications || [],
        stats: stats[0] || { upcoming_count: 0, completed_count: 0, pending_count: 0, saved_count: 0, unread_notifications_count: 0 }
      }
    });

  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    console.error('Error stack:', error.stack);
    console.error('User ID:', (req as any).user?.id);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to fetch dashboard data',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};

/**
 * GET /api/dashboard/notifications
 * Get user notifications
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const { limit = 20, offset = 0, unread_only = false } = req.query;

    let whereClause = 'WHERE user_id = :user_id';
    if (unread_only === 'true') {
      whereClause += ' AND read_status = FALSE';
    }

    const query = `
      SELECT
        id,
        type,
        title,
        message,
        link,
        read_status,
        created_at
      FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT :limit
      OFFSET :offset
    `;

    const notifications = await sequelize.query(query, {
      replacements: {
        user_id,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: {
        notifications
      }
    });

  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * PATCH /api/dashboard/notifications/:id/read
 * Mark notification as read
 */
export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = (req as any).user?.id;

    await sequelize.query(
      `UPDATE notifications
       SET read_status = TRUE
       WHERE id = :id AND user_id = :user_id`,
      {
        replacements: { id, user_id },
        type: QueryTypes.UPDATE
      }
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * POST /api/saved/add
 * Add celebrity to favorites
 */
export const addSavedCelebrity = async (req: Request, res: Response) => {
  try {
    const { celebrity_id } = req.body;
    const user_id = (req as any).user?.id;

    if (!celebrity_id) {
      return res.status(400).json({
        success: false,
        error: 'Celebrity ID is required'
      });
    }

    // Check if already saved
    const checkQuery = `
      SELECT id FROM saved_celebrities
      WHERE user_id = :user_id AND celebrity_id = :celebrity_id
      LIMIT 1
    `;

    const existing = await sequelize.query(checkQuery, {
      replacements: { user_id, celebrity_id },
      type: QueryTypes.SELECT
    });

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: 'Celebrity already in favorites'
      });
    }

    // Add to saved
    await sequelize.query(
      `INSERT INTO saved_celebrities (user_id, celebrity_id)
       VALUES (:user_id, :celebrity_id)`,
      {
        replacements: { user_id, celebrity_id },
        type: QueryTypes.INSERT
      }
    );

    res.json({
      success: true,
      message: 'Celebrity added to favorites'
    });

  } catch (error: any) {
    console.error('Error adding saved celebrity:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * DELETE /api/saved/remove
 * Remove celebrity from favorites
 */
export const removeSavedCelebrity = async (req: Request, res: Response) => {
  try {
    const { celebrity_id } = req.body;
    const user_id = (req as any).user?.id;

    if (!celebrity_id) {
      return res.status(400).json({
        success: false,
        error: 'Celebrity ID is required'
      });
    }

    await sequelize.query(
      `DELETE FROM saved_celebrities
       WHERE user_id = :user_id AND celebrity_id = :celebrity_id`,
      {
        replacements: { user_id, celebrity_id },
        type: QueryTypes.DELETE
      }
    );

    res.json({
      success: true,
      message: 'Celebrity removed from favorites'
    });

  } catch (error: any) {
    console.error('Error removing saved celebrity:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
