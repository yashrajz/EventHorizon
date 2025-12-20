import { EventsAPIService } from "./base";
import { EventbriteAPI } from "./eventbrite";
import { TicketmasterAPI } from "./ticketmaster";
import { MockAPI } from "./mock";

/**
 * Events API Factory
 * Creates the appropriate API service based on environment configuration
 */
export class EventsAPIFactory {
  private static instance: EventsAPIService | null = null;

  static getAPI(): EventsAPIService {
    if (this.instance) {
      return this.instance;
    }

    const provider = import.meta.env.VITE_EVENTS_API_PROVIDER || 'mock';

    switch (provider) {
      case 'eventbrite': {
        const apiKey = import.meta.env.VITE_EVENTBRITE_API_KEY;
        if (!apiKey) {
          console.warn('Eventbrite API key not found, falling back to mock data');
          this.instance = new MockAPI();
        } else {
          this.instance = new EventbriteAPI(apiKey);
        }
        break;
      }

      case 'ticketmaster': {
        const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
        if (!apiKey) {
          console.warn('Ticketmaster API key not found, falling back to mock data');
          this.instance = new MockAPI();
        } else {
          this.instance = new TicketmasterAPI(apiKey);
        }
        break;
      }

      case 'mock':
      default:
        this.instance = new MockAPI();
        break;
    }

    return this.instance;
  }

  static resetInstance(): void {
    this.instance = null;
  }
}

// Export convenience function
export const getEventsAPI = () => EventsAPIFactory.getAPI();
