require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'attendant', 'user'],
    default: 'user'
  },
  avatar: String,
  isEmailVerified: {
    type: Boolean,
    default: true // Set to true for development
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Validate email
const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email.toLowerCase());
};

// Auth Routes
// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 50 characters'
      });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      isEmailVerified: true // Skip email verification for development
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// Signin
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signin'
    });
  }
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EventHorizon Backend is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected'
  });
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      console.log('📝 Please update your .env file with your MongoDB connection string');
      return;
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('🗄️  Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('📝 Please check your MongoDB connection string in the .env file');
  }
};

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`💡 Test the API at: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
};

// Initialize
connectDB();
startServer();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});