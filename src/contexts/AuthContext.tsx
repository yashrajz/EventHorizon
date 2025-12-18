import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
 * Replace with real API later
 */
const MOCK_USERS: Record<string, { password: string; user: User }> = {
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
  "attendant@eventhorizon.com": {
    password: "attendant123",
    user: {
      id: "3",
      name: "Conference Manager",
      email: "attendant@eventhorizon.com",
      role: "attendant",
    },
  },
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

  // Restore session from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Sign in using mock credentials
   */
  const signIn = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const record = MOCK_USERS[email];
    if (!record || record.password !== password) {
      return false;
    }

    setUser(record.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record.user));
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
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
