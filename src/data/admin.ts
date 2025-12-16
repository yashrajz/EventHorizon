export type AdminRole = "admin" | "superadmin";

export type EventStatus = "Draft" | "Published" | "Cancelled";

export interface TicketType {
  id: string;
  name: string;
  type: "Free" | "Paid" | "VIP";
  price?: number;
  limit?: number;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  locationType: "Online" | "Offline";
  venue?: string;
  city?: string;
  country?: string;
  bannerUrl?: string;
  registrationUrl?: string;
  status: EventStatus;
  ticketTypes: TicketType[];
  ticketLimit?: number;
  views: number;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  banned?: boolean;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketTypeId: string;
  createdAt: string;
}

export interface AdminSettings {
  theme: "dark" | "light";
  registrationsEnabled: boolean;
  siteTitle: string;
  siteLogoUrl?: string;
}

const KEY_EVENTS = "eventhorizon:admin:events";
const KEY_USERS = "eventhorizon:admin:users";
const KEY_REGS = "eventhorizon:admin:registrations";
const KEY_SETTINGS = "eventhorizon:admin:settings";

const uid = () => Math.random().toString(36).slice(2, 10);

function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  try {
    window.dispatchEvent(new CustomEvent("eventhorizon:admin:update", { detail: { key } }));
  } catch {}
}

export const AdminRepo = {
  getEvents(): AdminEvent[] {
    return read<AdminEvent[]>(KEY_EVENTS, seedEvents());
  },
  saveEvent(event: Omit<AdminEvent, "id" | "createdAt" | "views"> & Partial<Pick<AdminEvent, "id" | "createdAt" | "views">>): AdminEvent {
    const all = AdminRepo.getEvents();
    const isNew = !event.id;
    const next: AdminEvent = {
      id: event.id || uid(),
      createdAt: event.createdAt || new Date().toISOString(),
      views: event.views ?? 0,
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      timezone: event.timezone,
      locationType: event.locationType,
      venue: event.venue,
      city: event.city,
      country: event.country,
      bannerUrl: event.bannerUrl,
      registrationUrl: event.registrationUrl,
      status: event.status,
      ticketTypes: event.ticketTypes || [],
      ticketLimit: event.ticketLimit,
    };
    const updated = isNew ? [next, ...all] : all.map((e) => (e.id === next.id ? next : e));
    write(KEY_EVENTS, updated);
    return next;
  },
  deleteEvent(id: string) {
    const all = AdminRepo.getEvents();
    write(KEY_EVENTS, all.filter((e) => e.id !== id));
  },
  getUsers(): AdminUser[] {
    return read<AdminUser[]>(KEY_USERS, seedUsers());
  },
  setUserBanned(id: string, banned: boolean) {
    const all = AdminRepo.getUsers();
    write(KEY_USERS, all.map((u) => (u.id === id ? { ...u, banned } : u)));
  },
  getRegistrations(): Registration[] {
    return read<Registration[]>(KEY_REGS, []);
  },
  getRegistrationsByEvent(eventId: string): Registration[] {
    return AdminRepo.getRegistrations().filter((r) => r.eventId === eventId);
  },
  addRegistration(reg: Omit<Registration, "id" | "createdAt">) {
    const all = AdminRepo.getRegistrations();
    const next: Registration = { ...reg, id: uid(), createdAt: new Date().toISOString() };
    write(KEY_REGS, [next, ...all]);
    return next;
  },
  exportRegistrationsCsv(eventId: string): string {
    const regs = AdminRepo.getRegistrationsByEvent(eventId);
    const users = AdminRepo.getUsers();
    const header = ["Registration ID", "Event ID", "User", "Ticket Type", "Created At"];
    const rows = regs.map((r) => {
      const user = users.find((u) => u.id === r.userId);
      return [r.id, r.eventId, user ? `${user.name} <${user.email}>` : r.userId, r.ticketTypeId, r.createdAt];
    });
    return [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  },
  getSettings(): AdminSettings {
    return read<AdminSettings>(KEY_SETTINGS, {
      theme: "dark",
      registrationsEnabled: true,
      siteTitle: "EventHorizon",
      siteLogoUrl: "",
    });
  },
  saveSettings(next: AdminSettings) {
    write(KEY_SETTINGS, next);
  },
};

function seedEvents(): AdminEvent[] {
  const base: AdminEvent[] = [
    {
      id: uid(),
      title: "Founder Meetup",
      description: "Monthly meetup for founders",
      category: "Meetup",
      date: new Date().toISOString().slice(0, 10),
      startTime: "18:00",
      endTime: "20:00",
      timezone: "IST",
      locationType: "Offline",
      venue: "T-Hub",
      city: "Hyderabad",
      country: "India",
      bannerUrl: "",
      status: "Published",
      ticketTypes: [
        { id: uid(), name: "General", type: "Free" },
        { id: uid(), name: "VIP", type: "VIP", price: 1500 },
      ],
      ticketLimit: 200,
      views: 1200,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      title: "AI Hackathon",
      description: "36-hour hackathon",
      category: "Hackathon",
      date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "18:00",
      timezone: "IST",
      locationType: "Online",
      bannerUrl: "",
      status: "Draft",
      ticketTypes: [{ id: uid(), name: "Team", type: "Paid", price: 2500 }],
      ticketLimit: 100,
      views: 5400,
      createdAt: new Date().toISOString(),
    },
  ];
  write(KEY_EVENTS, base);
  return base;
}

function seedUsers(): AdminUser[] {
  const base: AdminUser[] = [
    { id: uid(), name: "Alice", email: "alice@example.com" },
    { id: uid(), name: "Bob", email: "bob@example.com" },
    { id: uid(), name: "Carol", email: "carol@example.com" },
  ];
  write(KEY_USERS, base);
  return base;
}
