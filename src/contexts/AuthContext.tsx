import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Unified Authentication Context
 * Handles all user types: admin, conference attendant, and normal users
 */

export type UserRole = "admin" | "superadmin" | "attendant" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "eventhorizon:auth:user";

/**
 * Mock user database
 * In production, replace with actual API calls
 */
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  // Admin users
  "admin@eventhorizon.com": {
    password: "admin123",
    user: {
      id: "1",
      name: "Admin User",
      email: "admin@eventhorizon.com",
      role: "admin",
    },
  },
  "super@eventhorizon.com": {
    password: "super123",
    user: {
      id: "2",
      name: "Super Admin",
      email: "super@eventhorizon.com",
      role: "superadmin",
    },
  },
  // Conference Attendant
  "attendant@eventhorizon.com": {
    password: "attendant123",
    user: {
      id: "3",
      name: "Conference Manager",
      email: "attendant@eventhorizon.com",
      role: "attendant",
    },
  },
  // Normal users
  "user@example.com": {
    password: "user123",
    user: {
      id: "4",
      name: "John Doe",
      email: "user@example.com",
      role: "user",
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user session from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Sign in with email and password
   * Returns true if authentication successful
   */
  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[email];
    
    if (!mockUser || mockUser.password !== password) {
      return false;
    }

    // Successful authentication
    setUser(mockUser.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser.user));
    return true;
  }, []);

  /**
   * Sign out and clear session
   */
  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Check if user has one of the specified roles
   */
  const hasRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  /**
   * Get redirect path based on user role
   * Used after login to send users to their appropriate dashboard
   */
  const getRedirectPath = useCallback((): string => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
      case "superadmin":
        return "/admin";
      case "attendant":
        return "/attendant";
      case "user":
      default:
        return "/";
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
      hasRole,
      getRedirectPath,
    }),
    [user, isLoading, signIn, signOut, hasRole, getRedirectPath]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
