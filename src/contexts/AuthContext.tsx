import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiClient, type MongoUser, isAuthenticated as checkAuth } from "@/lib/mongodb";

/**
 * Unified Authentication Context
 * Handles all user types: admin, superadmin, attendant, and normal users
 */

export type UserRole = "admin" | "superadmin" | "attendant" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading?: boolean; // Alias for compatibility
  profile?: any; // User profile data
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  getRedirectPath: () => string;
  updateProfile?: (data: any) => Promise<void>; // Profile update function
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Convert MongoDB user to app user format
const convertMongoUserToUser = (mongoUser: MongoUser): User => ({
  id: mongoUser._id!,
  name: mongoUser.name,
  email: mongoUser.email,
  role: mongoUser.role,
  avatar: mongoUser.avatar,
  isEmailVerified: mongoUser.isEmailVerified,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const loadUser = async () => {
      if (checkAuth()) {
        try {
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data) {
            setUser(convertMongoUserToUser(response.data));
          } else {
            // Invalid token, clear it
            apiClient.signout();
          }
        } catch (error) {
          console.error('Error loading user:', error);
          apiClient.signout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await apiClient.signup({ name, email, password });
      
      if (response.success) {
        return { 
          success: true, 
          error: undefined 
        };
      } else {
        return { 
          success: false, 
          error: response.error || 'Signup failed' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Signup failed' 
      };
    }
  }, []);

  /**
   * Sign in using email and password
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.signin({ email, password });
      
      if (response.success && response.user) {
        const convertedUser = convertMongoUserToUser(response.user);
        setUser(convertedUser);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Invalid credentials' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Sign in failed' 
      };
    }
  }, []);

  /**
   * Sign in with Google OAuth (placeholder for future implementation)
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      // TODO: Implement Google OAuth with MongoDB backend
      console.warn('Google OAuth not yet implemented with MongoDB backend');
      return false;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return false;
    }
  }, []);

  /**
   * Sign out and clear session
   */
  const signOut = useCallback(() => {
    setUser(null);
    apiClient.signout();
  }, []);

  /**
   * Check if user has one of the required roles
   */
  const hasRole = useCallback(
    (roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  /**
   * Get redirect path based on role
   */
  const getRedirectPath = useCallback(() => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
      case "superadmin":
        return "/admin";
      case "attendant":
        return "/attendant";
      default:
        return "/dashboard";
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      loading: isLoading, // Alias for compatibility
      profile: null, // Placeholder for profile data
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      hasRole,
      getRedirectPath,
      updateProfile: async (_data: any) => {}, // Placeholder function
    }),
    [user, isLoading, signIn, signUp, signInWithGoogle, signOut, hasRole, getRedirectPath]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
