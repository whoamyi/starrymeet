import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getMessages,
  sendMessage,
  markMessageAsRead
} from '../controllers/messagesController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/messages - Get all messages
router.get('/', getMessages);

// POST /api/messages - Send a new message
router.post('/', sendMessage);

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', markMessageAsRead);

export default router;
