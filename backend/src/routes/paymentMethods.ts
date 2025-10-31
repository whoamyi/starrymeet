import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod
} from '../controllers/paymentMethodsController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/payment-methods - Get all payment methods
router.get('/', getPaymentMethods);

// POST /api/payment-methods - Add new payment method
router.post('/', addPaymentMethod);

// PATCH /api/payment-methods/:id/default - Set as default
router.patch('/:id/default', setDefaultPaymentMethod);

// DELETE /api/payment-methods/:id - Delete payment method
router.delete('/:id', deletePaymentMethod);

export default router;
