# MongoDB Backend Setup Guide for EventHorizon

This guide provides step-by-step instructions to set up a MongoDB backend for your EventHorizon application with authentication, event submission, and admin approval features.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Server Setup](#backend-server-setup)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Environment Configuration](#environment-configuration)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Prerequisites

Before starting, ensure you have:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Git

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign up for a free account
   - Create a new project named "EventHorizon"

2. **Create a Database Cluster**
   - Click "Build a Database"
   - Select "Shared" for free tier
   - Choose your cloud provider and region
   - Name your cluster (e.g., "eventhorizon-cluster")

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a user with username and password
   - Select "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add `0.0.0.0/0` for development (restrict in production)

5. **Get Connection String**
   - Go to "Database" and click "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Option 2: Local MongoDB Installation

1. **Install MongoDB Community Server**
   - Download from [MongoDB Downloads](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your operating system

2. **Start MongoDB Service**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Connection String for Local MongoDB**
   ```
   mongodb://localhost:27017/eventhorizon
   ```

## Backend Server Setup

### 1. Create Backend Directory

```bash
# Navigate to your project root
cd "e:\EventHorizon FINAAAAALLLLLLL\EventHorizon"

# Create backend directory
mkdir backend
cd backend
```

### 2. Initialize Node.js Project

```bash
npm init -y
```

### 3. Install Dependencies

```bash
# Core dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install express-validator multer helmet express-rate-limit

# Development dependencies
npm install --save-dev nodemon @types/node typescript ts-node
npm install --save-dev @types/express @types/mongoose @types/bcryptjs @types/jsonwebtoken
```

### 4. Create TypeScript Configuration

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## Backend Implementation

### 1. Create Server Structure

```bash
mkdir src
cd src
mkdir models routes middleware controllers utils
```

### 2. Create Main Server File

Create `src/server.ts`:
```typescript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import eventRoutes from './routes/events';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventhorizon')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });
```

### 3. Create Environment File

Create `.env` in the backend root:
```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here
DB_NAME=eventhorizon

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email Configuration (for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
```

### 4. Create Database Models

Create `src/models/User.ts`:
```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'superadmin' | 'attendant' | 'user';
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'attendant', 'user'],
    default: 'user'
  },
  avatar: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
```

Create `src/models/Profile.ts`:
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  full_name: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  avatar_url: String
}, {
  timestamps: true
});

export default mongoose.model<IProfile>('Profile', profileSchema);
```

Create `src/models/Event.ts`:
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  locationType: 'IRL' | 'Online' | 'Hybrid';
  venue?: string;
  city: string;
  country?: string;
  tags: string[];
  organizer: string;
  eventUrl: string;
  registrationUrl: string;
  coverImage: string;
  category: string;
  price: 'Free' | 'Paid';
  priceAmount?: string;
  views: number;
  createdBy: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  adminNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required']
  },
  locationType: {
    type: String,
    enum: ['IRL', 'Online', 'Hybrid'],
    required: [true, 'Location type is required']
  },
  venue: String,
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  country: String,
  tags: [{
    type: String,
    trim: true
  }],
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  eventUrl: {
    type: String,
    required: [true, 'Event URL is required']
  },
  registrationUrl: {
    type: String,
    required: [true, 'Registration URL is required']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  price: {
    type: String,
    enum: ['Free', 'Paid'],
    required: [true, 'Price type is required']
  },
  priceAmount: String,
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'draft'],
    default: 'pending'
  },
  adminNotes: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ status: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ city: 1 });
eventSchema.index({ category: 1 });

export default mongoose.model<IEvent>('Event', eventSchema);
```

### 5. Create Authentication Middleware

Create `src/middleware/auth.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    next();
  };
};
```

### 6. Create Routes

Create `src/routes/auth.ts`:
```typescript
import express from 'express';
import { body } from 'express-validator';
import {
  signup,
  signin,
  verifyEmail,
  getCurrentUser,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Signup
router.post('/signup', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], signup);

// Signin
router.post('/signin', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], signin);

// Verify email
router.post('/verify-email/:token', verifyEmail);

// Get current user
router.get('/me', authenticate, getCurrentUser);

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], forgotPassword);

// Reset password
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], resetPassword);

export default router;
```

## Environment Configuration

Update your frontend `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_MONGODB_URI=your_mongodb_connection_string
VITE_DB_NAME=eventhorizon
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Start Frontend Development Server
```bash
cd ../
npm run dev
```

### 3. Verify Setup
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/verify-email/:token` - Email verification
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Events
- `GET /api/events/approved` - Get approved events
- `POST /api/events` - Submit new event
- `GET /api/events/my-events` - Get user's events

### Admin
- `GET /api/admin/events/pending` - Get pending events
- `PUT /api/admin/events/:id/approve` - Approve event
- `PUT /api/admin/events/:id/reject` - Reject event

## Testing

### 1. Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Event Submission
```bash
# Submit event (requires authentication token)
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Event","description":"Test Description",...}'
```

## Deployment

### Backend Deployment (Heroku Example)
```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
# Install Vercel CLI
npm i -g vercel
vercel --prod
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Password Hashing**: Implemented with bcryptjs
4. **Rate Limiting**: Applied to prevent abuse
5. **Input Validation**: Using express-validator
6. **CORS Configuration**: Restrict to your domain in production

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check connection string
   - Verify network access in MongoDB Atlas
   - Ensure MongoDB service is running (local installation)

2. **CORS Issues**
   - Update CORS configuration in backend
   - Check frontend URL in environment variables

3. **Authentication Errors**
   - Verify JWT secret is set
   - Check token format in requests

4. **Email Verification Issues**
   - Configure SMTP settings
   - Check email templates

### Debug Mode

Set `DEBUG=true` in your environment to enable detailed logging.

## Next Steps

1. Implement email verification service
2. Add file upload for event images
3. Set up monitoring and logging
4. Add automated tests
5. Configure CI/CD pipeline
6. Add API documentation with Swagger

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review MongoDB and Node.js documentation
3. Create an issue in the project repository

---

This setup provides a robust foundation for your EventHorizon application with MongoDB integration, authentication, and admin capabilities.