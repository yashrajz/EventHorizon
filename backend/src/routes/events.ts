import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Event from '../models/Event';
import { Response } from 'express';

const router = express.Router();

// Submit event
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user?._id,
      status: 'pending'
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event submitted successfully and is pending approval',
      data: event
    });
  } catch (error: any) {
    console.error('Submit event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting event'
    });
  }
});

// Get user's submitted events
router.get('/my-events', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ createdBy: req.user?._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error: any) {
    console.error('Get user events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching events'
    });
  }
});

// Get approved events (public)
router.get('/approved', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error: any) {
    console.error('Get approved events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching events'
    });
  }
});

export default router;