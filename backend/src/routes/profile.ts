import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { Response } from 'express';

const router = express.Router();

// Get profile
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return profile data
    res.json({
      success: true,
      data: {
        full_name: user.name,
        email: user.email,
        bio: user.bio || null,
        location: user.location || null,
        website: user.website || null,
        avatar_url: user.avatar || null,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// Update profile
router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { full_name, bio, location, website, avatar_url } = req.body;
    
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    if (full_name) user.name = full_name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (avatar_url !== undefined) user.avatar = avatar_url;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        full_name: user.name,
        email: user.email,
        bio: user.bio || null,
        location: user.location || null,
        website: user.website || null,
        avatar_url: user.avatar || null,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

export default router;