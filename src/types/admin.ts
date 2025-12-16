export type Role = "admin" | "superadmin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type EventStatus = "draft" | "published" | "cancelled";
export type LocationType = "online" | "offline" | "hybrid";
export type TicketType = "free" | "paid" | "vip";

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  locationType: LocationType;
  venue?: string;
  city?: string;
  country?: string;
  bannerImage: string;
  status: EventStatus;
  organizer: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  registrations: number;
  views: number;
  registrationUrl?: string;
  ticketTypes: TicketTypeConfig[];
}

export interface TicketTypeConfig {
  id: string;
  type: TicketType;
  name: string;
  price: number;
  total: number;
  available: number;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketType: TicketType;
  ticketPrice: number;
  registeredAt: string;
  status: "confirmed" | "pending" | "cancelled";
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: "active" | "banned";
  eventsJoined: number;
  lastActive: string;
  registrations: Registration[];
}

export interface SiteSettings {
  siteTitle: string;
  siteLogo: string;
  enableRegistrations: boolean;
  theme: "light" | "dark" | "system";
  maintenanceMode: boolean;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  activeUsers: number;
  revenue: number;
  eventsChange: number;
  registrationsChange: number;
  usersChange: number;
  revenueChange: number;
}

export interface ChartData {
  date: string;
  registrations: number;
  events: number;
}

export interface PopularEvent {
  id: string;
  title: string;
  registrations: number;
  revenue: number;
}
