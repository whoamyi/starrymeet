import { Request, Response } from 'express';
import { Message, User } from '../models';
import { Op } from 'sequelize';

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

// Send a new message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { to_user_id, subject, message, booking_id } = req.body;

    if (!message || !to_user_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'Recipient and message are required' }
      });
    }

    const newMessage = await Message.create({
      from_user_id: req.user!.id,
      to_user_id,
      subject,
      message,
      booking_id
    });

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
