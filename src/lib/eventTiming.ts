import { Event } from "@/data/events";

export type EventStatus = "upcoming" | "live" | "ended" | "removed";

export interface EventTiming {
  status: EventStatus;
  startsIn: string | null;
  endsIn: string | null;
  startTime: Date;
  endTime: Date;
  isAutoRemoved: boolean;
}

// Parse event date and time into Date object
export const parseEventDateTime = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

// Get event timing information
export const getEventTiming = (event: Event): EventTiming => {
  const now = new Date();
  const startTime = parseEventDateTime(event.date, event.startTime);
  const endTime = parseEventDateTime(event.date, event.endTime);
  const threeHoursAfterEnd = new Date(endTime.getTime() + 3 * 60 * 60 * 1000);

  // Check if event should be auto-removed (3 hours after end)
  const isAutoRemoved = now > threeHoursAfterEnd;

  let status: EventStatus;
  if (isAutoRemoved) {
    status = "removed";
  } else if (now >= startTime && now <= endTime) {
    status = "live";
  } else if (now < startTime) {
    status = "upcoming";
  } else {
    status = "ended";
  }

  return {
    status,
    startsIn: status === "upcoming" ? formatTimeDiff(startTime, now) : null,
    endsIn: status === "live" ? formatTimeDiff(endTime, now) : null,
    startTime,
    endTime,
    isAutoRemoved,
  };
};

// Format time difference in human-readable format
const formatTimeDiff = (future: Date, now: Date): string => {
  const diff = future.getTime() - now.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

// Format absolute time for display
export const formatEventTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Filter out auto-removed events
export const filterActiveEvents = (events: Event[]): Event[] => {
  return events.filter(event => {
    const timing = getEventTiming(event);
    return !timing.isAutoRemoved;
  });
};

// Get countdown text for upcoming events
export const getCountdownText = (timing: EventTiming): string => {
  if (timing.status === "live") {
    return `Live now • Ends in ${timing.endsIn}`;
  } else if (timing.status === "upcoming") {
    return `Starts in ${timing.startsIn}`;
  } else if (timing.status === "ended") {
    return "Event ended";
  }
  return "";
};
