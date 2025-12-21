import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Submit event
router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Submit event route - coming soon' });
});

// Get user events
router.get('/user', authenticate, (req, res) => {
  res.json({ success: true, message: 'User events route - coming soon' });
});

export default router;