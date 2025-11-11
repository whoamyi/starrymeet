import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getMessages,
  sendMessage,
  markMessageAsRead,
  getUserConversations,
  getCelebrityMessages
} from '../controllers/messagesController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/messages/conversations - Get user's conversations grouped by celebrity
router.get('/conversations', getUserConversations);

// GET /api/messages/celebrity/:celebrityId - Get messages with specific celebrity
router.get('/celebrity/:celebrityId', getCelebrityMessages);

// GET /api/messages - Get all messages (legacy)
router.get('/', getMessages);

// POST /api/messages - Send a new message (now requires celebrity_id)
router.post('/', sendMessage);

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', markMessageAsRead);

export default router;
