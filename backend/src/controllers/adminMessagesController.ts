import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Message, User, Celebrity, Conversation } from '../models';
import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/database';

/**
 * GET /api/admin/messages/by-celebrity
 * Get overview of all conversations grouped by celebrity
 */
export const getConversationsByCelebrity = async (req: AuthRequest, res: Response) => {
  try {
    // Get aggregated data for each celebrity profile
    const celebritiesWithConversations = await sequelize.query(`
      SELECT
        c.id as celebrity_id,
        c.display_name as celebrity_name,
        c.avatar_url as celebrity_avatar,
        cat.name as category,
        COUNT(DISTINCT conv.id) as total_conversations,
        COALESCE(SUM(conv.unread_count_admin), 0) as total_unread
      FROM celebrities_new c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN conversations conv ON conv.celebrity_id = c.id AND conv.status = 'active'
      WHERE c.status = 'active'
      GROUP BY c.id, c.display_name, c.avatar_url, cat.name
      HAVING COUNT(DISTINCT conv.id) > 0
      ORDER BY total_unread DESC, c.display_name ASC
    `, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: celebritiesWithConversations
    });
  } catch (error: any) {
    console.error('Error fetching conversations by celebrity:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch conversations' }
    });
  }
};

/**
 * GET /api/admin/messages/celebrity/:celebrityId
 * Get all conversations for a specific celebrity profile
 */
export const getCelebrityConversations = async (req: AuthRequest, res: Response) => {
  try {
    const { celebrityId } = req.params;
    const { status = 'active' } = req.query;

    const conversations = await Conversation.findAll({
      where: {
        celebrity_id: celebrityId,
        ...(status && { status })
      },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        }
      ],
      order: [['last_message_at', 'DESC']]
    });

    res.json({
      success: true,
      data: conversations
    });
  } catch (error: any) {
    console.error('Error fetching celebrity conversations:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch conversations' }
    });
  }
};

/**
 * GET /api/admin/messages/celebrity/:celebrityId/user/:userId
 * Get message thread between celebrity and specific user
 */
export const getCelebrityUserMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { celebrityId, userId } = req.params;

    const messages = await Message.findAll({
      where: {
        celebrity_id: celebrityId,
        [Op.or]: [
          { from_user_id: userId },
          { to_user_id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'avatar_url']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Mark admin's unread messages as read
    await Message.update(
      { read_status: true },
      {
        where: {
          celebrity_id: celebrityId,
          from_user_id: userId,
          read_status: false
        }
      }
    );

    // Update conversation unread count for admin
    await Conversation.update(
      { unread_count_admin: 0 },
      {
        where: {
          celebrity_id: celebrityId,
          user_id: userId
        }
      }
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    console.error('Error fetching celebrity user messages:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch messages' }
    });
  }
};

/**
 * POST /api/admin/messages/celebrity/:celebrityId/send
 * Send message as celebrity (from admin)
 */
export const sendMessageAsCelebrity = async (req: AuthRequest, res: Response) => {
  try {
    const { celebrityId } = req.params;
    const { user_id, message: messageText } = req.body;
    const adminUserId = req.user?.userId || req.user?.id;

    if (!user_id || !messageText) {
      return res.status(400).json({
        success: false,
        error: { message: 'User ID and message are required' }
      });
    }

    // Verify celebrity exists
    const celebrity = await Celebrity.findByPk(celebrityId);
    if (!celebrity) {
      return res.status(404).json({
        success: false,
        error: { message: 'Celebrity not found' }
      });
    }

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Create message from celebrity to user (sent by admin)
    const newMessage = await Message.create({
      from_user_id: adminUserId!, // The admin's user ID
      to_user_id: user_id,
      celebrity_id: celebrityId,
      message: messageText,
      is_from_admin: true,
      admin_user_id: adminUserId,
      read_status: false
    });

    // Create or update conversation
    const [conversation, created] = await Conversation.findOrCreate({
      where: {
        user_id,
        celebrity_id: celebrityId
      },
      defaults: {
        last_message_at: new Date(),
        last_message_preview: messageText.substring(0, 150),
        unread_count_admin: 0,
        unread_count_user: 1,
        status: 'active'
      }
    });

    if (!created) {
      // Update existing conversation
      await conversation.update({
        last_message_at: new Date(),
        last_message_preview: messageText.substring(0, 150),
        unread_count_user: sequelize.literal('unread_count_user + 1')
      });
    }

    res.json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending message as celebrity:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to send message' }
    });
  }
};

/**
 * PATCH /api/admin/messages/conversation/:conversationId/status
 * Update conversation status (archive, mark as spam, etc.)
 */
export const updateConversationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'archived', 'spam'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid status. Must be: active, archived, or spam' }
      });
    }

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { message: 'Conversation not found' }
      });
    }

    await conversation.update({ status });

    res.json({
      success: true,
      message: 'Conversation status updated'
    });
  } catch (error: any) {
    console.error('Error updating conversation status:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to update conversation status' }
    });
  }
};

/**
 * GET /api/admin/messages/stats
 * Get overall messaging statistics for admin dashboard
 */
export const getMessagingStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await sequelize.query(`
      SELECT
        COUNT(DISTINCT conv.id) as total_conversations,
        COALESCE(SUM(conv.unread_count_admin), 0) as total_unread,
        COUNT(DISTINCT CASE WHEN conv.last_message_at >= NOW() - INTERVAL '24 hours' THEN conv.id END) as active_today,
        COUNT(DISTINCT conv.celebrity_id) as celebrities_with_messages
      FROM conversations conv
      WHERE conv.status = 'active'
    `, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error: any) {
    console.error('Error fetching messaging stats:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch stats' }
    });
  }
};
