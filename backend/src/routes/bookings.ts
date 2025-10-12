import { Router } from 'express';
import { createBooking, getBooking, listUserBookings, cancelBooking } from '../controllers/bookingController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, createBooking);
router.get('/', authenticate, listUserBookings);
router.get('/:id', optionalAuth, getBooking);
router.patch('/:id/cancel', authenticate, cancelBooking);

export default router;
