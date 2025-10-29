import { Router } from 'express';
import {
  signup,
  signin,
  verify,
  signout,
  forgotPassword,
  getMe,
  register,
  login
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// New authentication endpoints
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verify', authenticate, verify);
router.post('/signout', authenticate, signout);
router.post('/forgot-password', forgotPassword);

// Legacy endpoints (for backward compatibility)
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;
