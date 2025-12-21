import express from 'express';
import {
  signup,
  signin,
  verifyEmail,
  resendVerificationEmail,
  getCurrentUser
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Signup
router.post('/signup', signup);

// Signin
router.post('/signin', signin);

// Verify email
router.post('/verify-email/:token', verifyEmail);

// Resend verification email
router.post('/resend-verification', resendVerificationEmail);

// Get current user
router.get('/me', authenticate, getCurrentUser);

export default router;