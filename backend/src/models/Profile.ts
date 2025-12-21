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
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  avatar_url: String
}, {
  timestamps: true
});

export default mongoose.model<IProfile>('Profile', profileSchema);