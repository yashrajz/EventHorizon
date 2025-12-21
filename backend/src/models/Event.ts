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