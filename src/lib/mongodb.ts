// MongoDB connection configuration
export interface DatabaseConfig {
  mongoUri: string;
  dbName: string;
}

// Environment variables
const config: DatabaseConfig = {
  mongoUri: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017',
  dbName: import.meta.env.VITE_DB_NAME || 'eventhorizon'
};

export default config;

// User interface for MongoDB
export interface MongoUser {
  _id?: string;
  name: string;
  email: string;
  password?: string; // Only for creation, not returned
  role: 'admin' | 'superadmin' | 'attendant' | 'user';
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Profile interface for MongoDB
export interface MongoProfile {
  _id?: string;
  userId: string;
  full_name: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Event interface for MongoDB
export interface MongoEvent {
  _id?: string;
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
  createdBy: string; // User ID
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  adminNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: MongoUser;
  token?: string;
  message?: string;
  error?: string;
}

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage on init
    this.token = localStorage.getItem('eventhorizon:auth:token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('eventhorizon:auth:token', token);
    } else {
      localStorage.removeItem('eventhorizon:auth:token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async signup(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signin(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async signout(): Promise<void> {
    this.setToken(null);
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/auth/verify-email/${token}`, {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse<MongoProfile>> {
    return this.request<ApiResponse<MongoProfile>>('/profile');
  }

  async updateProfile(profileData: Partial<MongoProfile>): Promise<ApiResponse<MongoProfile>> {
    return this.request<ApiResponse<MongoProfile>>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<MongoUser>> {
    return this.request<ApiResponse<MongoUser>>('/auth/me');
  }

  // Events methods
  async getApprovedEvents(): Promise<ApiResponse<MongoEvent[]>> {
    return this.request<ApiResponse<MongoEvent[]>>('/events/approved');
  }

  async submitEvent(eventData: Partial<MongoEvent>): Promise<ApiResponse<MongoEvent>> {
    return this.request<ApiResponse<MongoEvent>>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getUserEvents(): Promise<ApiResponse<MongoEvent[]>> {
    return this.request<ApiResponse<MongoEvent[]>>('/events/my-events');
  }

  // Admin methods
  async getPendingEvents(): Promise<ApiResponse<MongoEvent[]>> {
    return this.request<ApiResponse<MongoEvent[]>>('/admin/events/pending');
  }

  async approveEvent(eventId: string, adminNotes?: string): Promise<ApiResponse<MongoEvent>> {
    return this.request<ApiResponse<MongoEvent>>(`/admin/events/${eventId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  }

  async rejectEvent(eventId: string, adminNotes: string): Promise<ApiResponse<MongoEvent>> {
    return this.request<ApiResponse<MongoEvent>>(`/admin/events/${eventId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('eventhorizon:auth:token');
};

// Helper function to get stored token
export const getStoredToken = (): string | null => {
  return localStorage.getItem('eventhorizon:auth:token');
};