import { Router } from 'express';
import { createPaymentIntent, handleStripeWebhook } from '../controllers/paymentController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/create-intent', optionalAuth, createPaymentIntent);
router.post('/webhook', handleStripeWebhook);

export default router;
