import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Role = "admin" | "superadmin";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AdminAuthState {
  user: AdminUser | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

const STORAGE_KEY = "eventhorizon:admin:user";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      let parsed: AdminUser | null = null;
      try {
        parsed = JSON.parse(raw) as AdminUser;
      } catch {
        parsed = null;
      }
      if (parsed) setUser(parsed);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const valid =
      (email === "admin@eventhorizon.dev" && password === "admin123") ||
      (email === "super@eventhorizon.dev" && password === "super123");
    if (!valid) return false;
    const nextUser: AdminUser = {
      id: email,
      name: email.startsWith("super") ? "Super Admin" : "Admin",
      email,
      role: email.startsWith("super") ? "superadmin" : "admin",
    };
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return true;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasRole = useCallback((roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value = useMemo(() => ({ user, signIn, signOut, hasRole }), [user, signIn, signOut, hasRole]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

