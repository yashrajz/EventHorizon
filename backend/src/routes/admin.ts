import express from 'express';
import { authenticate, requireSuperUser, AuthRequest } from '../middleware/auth';
import Event from '../models/Event';

const router = express.Router();

// Get pending events
router.get('/events/pending', authenticate, requireSuperUser, async (req: AuthRequest, res) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('createdBy', 'name email')
      .sort({ submittedAt: -1 });
    
    res.json({ 
      success: true, 
      data: events 
    });
  } catch (error: any) {
    console.error('Error fetching pending events:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch pending events' 
    });
  }
});

// Get all events (for admin dashboard)
router.get('/events', authenticate, requireSuperUser, async (req: AuthRequest, res) => {
  try {
    const { status } = req.query;
    
    let filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ submittedAt: -1 });
    
    res.json({ 
      success: true, 
      data: events 
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch events' 
    });
  }
});

// Approve event
router.put('/events/:id/approve', authenticate, requireSuperUser, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    event.status = 'approved';
    event.reviewedAt = new Date();
    event.reviewedBy = req.user?._id;
    if (adminNotes) {
      event.adminNotes = adminNotes;
    }
    
    await event.save();
    
    res.json({ 
      success: true, 
      data: event,
      message: 'Event approved successfully' 
    });
  } catch (error: any) {
    console.error('Error approving event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to approve event' 
    });
  }
});

// Reject event
router.put('/events/:id/reject', authenticate, requireSuperUser, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    event.status = 'rejected';
    event.reviewedAt = new Date();
    event.reviewedBy = req.user?._id;
    if (adminNotes) {
      event.adminNotes = adminNotes;
    }
    
    await event.save();
    
    res.json({ 
      success: true, 
      data: event,
      message: 'Event rejected' 
    });
  } catch (error: any) {
    console.error('Error rejecting event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to reject event' 
    });
  }
});

// Get event statistics
router.get('/stats', authenticate, requireSuperUser, async (req: AuthRequest, res) => {
  try {
    const [totalEvents, pendingEvents, approvedEvents, rejectedEvents] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: 'pending' }),
      Event.countDocuments({ status: 'approved' }),
      Event.countDocuments({ status: 'rejected' })
    ]);
    
    res.json({ 
      success: true, 
      data: {
        total: totalEvents,
        pending: pendingEvents,
        approved: approvedEvents,
        rejected: rejectedEvents
      }
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch statistics' 
    });
  }
});

// Delete event
router.delete('/events/:id', authenticate, requireSuperUser, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    await Event.findByIdAndDelete(id);
    
    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete event' 
    });
  }
});

// Export all events to CSV
router.get('/events/export/csv', authenticate, requireSuperUser, async (req: AuthRequest, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ submittedAt: -1 });
    
    // CSV headers
    const headers = [
      'Title', 'Description', 'Start Date', 'End Date', 'Start Time', 'End Time',
      'Location Type', 'Venue', 'City', 'Country', 'Category', 'Tags',
      'Organizer', 'Price', 'Price Amount', 'Status', 'Submitted At',
      'Submitted By Name', 'Submitted By Email', 'Event URL', 'Registration URL'
    ];
    
    // Convert events to CSV rows
    const rows = events.map(event => [
      event.title,
      event.description.replace(/"/g, '""'), // Escape quotes
      new Date(event.startDate).toLocaleDateString(),
      new Date(event.endDate).toLocaleDateString(),
      event.startTime,
      event.endTime,
      event.locationType,
      event.venue || '',
      event.city,
      event.country || '',
      event.category,
      event.tags.join('; '),
      event.organizer,
      event.price,
      event.priceAmount || '',
      event.status,
      new Date(event.submittedAt).toLocaleString(),
      (event.createdBy as any)?.name || '',
      (event.createdBy as any)?.email || '',
      event.eventUrl,
      event.registrationUrl
    ]);
    
    // Build CSV content
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="events-export-${Date.now()}.csv"`);
    res.send(csvContent);
    
  } catch (error: any) {
    console.error('Error exporting events:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to export events' 
    });
  }
});

export default router;