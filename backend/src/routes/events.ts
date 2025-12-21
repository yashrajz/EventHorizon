import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Event from '../models/Event';

const router = express.Router();

// Submit event
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    
    const eventData = {
      ...req.body,
      createdBy: userId,
      status: 'pending',
      submittedAt: new Date(),
      views: 0
    };
    
    const event = await Event.create(eventData);
    
    res.status(201).json({ 
      success: true, 
      data: event,
      message: 'Event submitted successfully for review'
    });
  } catch (error: any) {
    console.error('Error submitting event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit event' 
    });
  }
});

// Get user's events (my-events route)
router.get('/my-events', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    
    const events = await Event.find({ createdBy: userId })
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: events 
    });
  } catch (error: any) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch events' 
    });
  }
});

// Get approved events
router.get('/approved', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .sort({ startDate: 1 });
    
    res.json({ 
      success: true, 
      data: events 
    });
  } catch (error: any) {
    console.error('Error fetching approved events:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch events' 
    });
  }
});

export default router;