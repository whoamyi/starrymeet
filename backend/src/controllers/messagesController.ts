import { Request, Response } from 'express';
import { Message, User, Celebrity, Conversation } from '../models';
import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/database';

// Get all messages for user (sent and received)
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_user_id: req.user!.id },
          { to_user_id: req.user!.id }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'avatar_url']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'first_name', 'last_name', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Format messages to match frontend expectations
    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      from_user_id: msg.from_user_id,
      to_user_id: msg.to_user_id,
      booking_id: msg.booking_id,
      subject: msg.subject,
      message: msg.message,
      read_status: msg.read_status,
      created_at: msg.created_at,
      from_first_name: msg.sender?.first_name,
      from_last_name: msg.sender?.last_name,
      from_image: msg.sender?.avatar_url,
      to_first_name: msg.recipient?.first_name,
      to_last_name: msg.recipient?.last_name
    }));

    res.json({
      success: true,
      data: formattedMessages
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch messages' }
    });
  }
};

// Send a new message (updated to support celebrity context)
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { celebrity_id, subject, message, booking_id } = req.body;
    const userId = req.user!.id;

    if (!message || !celebrity_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'Celebrity ID and message are required' }
      });
    }

    // Verify celebrity exists
    const celebrity = await Celebrity.findByPk(celebrity_id);
    if (!celebrity) {
      return res.status(404).json({
        success: false,
        error: { message: 'Celebrity not found' }
      });
    }

    // Create message from user to celebrity
    const newMessage = await Message.create({
      from_user_id: userId,
      celebrity_id,
      subject,
      message,
      booking_id,
      is_from_admin: false
    });

    // Create or update conversation
    const [conversation, created] = await Conversation.findOrCreate({
      where: {
        user_id: userId,
        celebrity_id
      },
      defaults: {
        user_id: userId,
        celebrity_id,
        last_message_at: new Date(),
        last_message_preview: message.substring(0, 150),
        unread_count_admin: 1,
        unread_count_user: 0,
        status: 'active'
      }
    });

    if (!created) {
      // Update existing conversation
      await conversation.update({
        last_message_at: new Date(),
        last_message_preview: message.substring(0, 150),
        unread_count_admin: sequelize.literal('unread_count_admin + 1')
      });
    }

    res.json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send message' }
    });
  }
};

// Mark message as read
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [updatedRows] = await Message.update(
      { read_status: true },
      {
        where: {
          id,
          to_user_id: req.user!.id
        }
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Message not found' }
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to mark message as read' }
    });
  }
};

/**
 * GET /api/messages/conversations
 * Get user's conversations grouped by celebrity (Telegram-style)
 */
export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const conversations = await Conversation.findAll({
      where: {
        user_id: userId,
        status: 'active'
      },
      include: [
        {
          model: Celebrity,
          attributes: ['id', 'display_name', 'avatar_url', 'username']
        }
      ],
      order: [['last_message_at', 'DESC']]
    });

    res.json({
      success: true,
      data: conversations
    });
  } catch (error: any) {
    console.error('Error fetching user conversations:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch conversations' }
    });
  }
};

/**
 * GET /api/messages/celebrity/:celebrityId
 * Get message thread between user and specific celebrity
 */
export const getCelebrityMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { celebrityId } = req.params;

    // Get messages (hide admin identity - show as if from celebrity)
    const messages = await sequelize.query(`
      SELECT
        m.id,
        m.message,
        m.created_at,
        m.read_status,
        CASE
          WHEN m.is_from_admin = true THEN :celebrityId
          ELSE m.from_user_id
        END as from_user_id,
        CASE
          WHEN m.is_from_admin = true THEN false
          ELSE true
        END as is_from_user
      FROM messages m
      WHERE m.celebrity_id = :celebrityId
        AND (m.from_user_id = :userId OR m.is_from_admin = true)
      ORDER BY m.created_at ASC
    `, {
      replacements: { userId, celebrityId },
      type: QueryTypes.SELECT
    });

    // Mark messages from celebrity as read
    await Message.update(
      { read_status: true },
      {
        where: {
          celebrity_id: celebrityId,
          is_from_admin: true,
          read_status: false
        }
      }
    );

    // Update conversation unread count for user
    await Conversation.update(
      { unread_count_user: 0 },
      {
        where: {
          user_id: userId,
          celebrity_id: celebrityId
        }
      }
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    console.error('Error fetching celebrity messages:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch messages' }
    });
  }
};
