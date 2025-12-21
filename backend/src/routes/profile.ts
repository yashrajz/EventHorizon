import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Profile from '../models/Profile';

const router = express.Router();

// Get profile
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    
    let profile = await Profile.findOne({ userId });
    
    // If no profile exists, create one with default values
    if (!profile) {
      profile = await Profile.create({
        userId,
        full_name: req.user?.name || 'User',
        bio: '',
        location: '',
        website: '',
        avatar_url: req.user?.avatar || ''
      });
    }
    
    res.json({ 
      success: true, 
      data: profile 
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch profile' 
    });
  }
});

// Update profile
router.put('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    const { full_name, bio, location, website, avatar_url } = req.body;
    
    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      // Create new profile
      profile = await Profile.create({
        userId,
        full_name: full_name || req.user?.name || 'User',
        bio,
        location,
        website,
        avatar_url
      });
    } else {
      // Update existing profile
      profile.full_name = full_name || profile.full_name;
      if (bio !== undefined) profile.bio = bio;
      if (location !== undefined) profile.location = location;
      if (website !== undefined) profile.website = website;
      if (avatar_url !== undefined) profile.avatar_url = avatar_url;
      
      await profile.save();
    }
    
    res.json({ 
      success: true, 
      data: profile 
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update profile' 
    });
  }
});

export default router;