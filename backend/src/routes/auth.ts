import express from 'express';
import {
  signup,
  signin,
  verifyEmail,
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

// Get current user
router.get('/me', authenticate, getCurrentUser);

export default router;