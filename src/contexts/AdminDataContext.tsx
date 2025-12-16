import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import {
  mockAdminEvents,
  mockRegistrations,
  mockUsers,
  mockSiteSettings,
} from "@/data/adminMockData";
import type { AdminEvent, Registration, User, SiteSettings } from "@/types/admin";

interface AdminDataContextType {
  // Events
  events: AdminEvent[];
  getEvent: (id: string) => AdminEvent | undefined;
  createEvent: (event: Omit<AdminEvent, "id" | "createdAt" | "updatedAt">) => void;
  updateEvent: (id: string, updates: Partial<AdminEvent>) => void;
  deleteEvent: (id: string) => void;

  // Registrations
  registrations: Registration[];
  getRegistrationsByEvent: (eventId: string) => Registration[];

  // Users
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;

  // Settings
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AdminEvent[]>(mockAdminEvents);
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);

  // Event operations
  const getEvent = useCallback(
    (id: string) => {
      return events.find((event) => event.id === id);
    },
    [events]
  );

  const createEvent = useCallback((eventData: Omit<AdminEvent, "id" | "createdAt" | "updatedAt">) => {
    const newEvent: AdminEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registrations: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<AdminEvent>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      )
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  // Registration operations
  const getRegistrationsByEvent = useCallback(
    (eventId: string) => {
      return registrations.filter((reg) => reg.eventId === eventId);
    },
    [registrations]
  );

  // User operations
  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );
  }, []);

  // Settings operations
  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const value = useMemo(
    () => ({
      events,
      getEvent,
      createEvent,
      updateEvent,
      deleteEvent,
      registrations,
      getRegistrationsByEvent,
      users,
      updateUser,
      settings,
      updateSettings,
    }),
    [
      events,
      getEvent,
      createEvent,
      updateEvent,
      deleteEvent,
      registrations,
      getRegistrationsByEvent,
      users,
      updateUser,
      settings,
      updateSettings,
    ]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return context;
}
