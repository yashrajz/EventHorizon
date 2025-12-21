import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get profile
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Profile route - coming soon' });
});

// Update profile
router.put('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Update profile route - coming soon' });
});

export default router;