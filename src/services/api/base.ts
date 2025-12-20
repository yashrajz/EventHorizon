import { Event } from "@/data/events";

/**
 * Base API Service Interface
 * All event API providers must implement this interface
 */
export interface EventsAPIService {
  fetchEvents(params?: EventSearchParams): Promise<Event[]>;
  fetchEventById(id: string): Promise<Event | null>;
}

export interface EventSearchParams {
  query?: string;
  location?: string;
  category?: string;
  dateRange?: string;
  page?: number;
  limit?: number;
}

/**
 * Transform external API event data to our Event interface
 */
export abstract class BaseEventsAPI implements EventsAPIService {
  protected apiKey: string;
  protected baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  abstract fetchEvents(params?: EventSearchParams): Promise<Event[]>;
  abstract fetchEventById(id: string): Promise<Event | null>;

  protected async fetchAPI(endpoint: string, options?: RequestInit): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Fetch Error:', error);
      throw error;
    }
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
