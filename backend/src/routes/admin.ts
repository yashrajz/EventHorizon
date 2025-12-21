import express from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get pending events
router.get('/events/pending', authenticate, authorize(['admin', 'superadmin']), (req, res) => {
  res.json({ success: true, message: 'Pending events route - coming soon' });
});

// Approve event
router.put('/events/:id/approve', authenticate, authorize(['admin', 'superadmin']), (req, res) => {
  res.json({ success: true, message: 'Approve event route - coming soon' });
});

// Reject event
router.put('/events/:id/reject', authenticate, authorize(['admin', 'superadmin']), (req, res) => {
  res.json({ success: true, message: 'Reject event route - coming soon' });
});

export default router;