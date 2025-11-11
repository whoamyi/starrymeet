/**
 * Admin Messages Routes
 * Celebrity-grouped messaging interface for admin panel
 */

import express from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';
import {
  getConversationsByCelebrity,
  getCelebrityConversations,
  getCelebrityUserMessages,
  sendMessageAsCelebrity,
  updateConversationStatus,
  getMessagingStats
} from '../controllers/adminMessagesController';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/messages/by-celebrity - Overview of all conversations grouped by celebrity
router.get('/by-celebrity', getConversationsByCelebrity);

// GET /api/admin/messages/stats - Overall messaging statistics
router.get('/stats', getMessagingStats);

// GET /api/admin/messages/celebrity/:celebrityId - Get conversations for specific celebrity
router.get('/celebrity/:celebrityId', getCelebrityConversations);

// GET /api/admin/messages/celebrity/:celebrityId/user/:userId - Get message thread
router.get('/celebrity/:celebrityId/user/:userId', getCelebrityUserMessages);

// POST /api/admin/messages/celebrity/:celebrityId/send - Send message as celebrity
router.post('/celebrity/:celebrityId/send', sendMessageAsCelebrity);

// PATCH /api/admin/messages/conversation/:conversationId/status - Update conversation status
router.patch('/conversation/:conversationId/status', updateConversationStatus);

export default router;
