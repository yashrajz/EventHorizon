import { BaseEventsAPI, EventSearchParams } from "./base";
import { Event, mockEvents } from "@/data/events";

/**
 * Mock API for development/testing
 * Falls back to static mock data
 */
export class MockAPI extends BaseEventsAPI {
  constructor() {
    super('', '');
  }

  async fetchEvents(params?: EventSearchParams): Promise<Event[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let events = [...mockEvents];

    // Apply filters
    if (params?.query) {
      const query = params.query.toLowerCase();
      events = events.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (params?.location && params.location !== 'All Locations') {
      events = events.filter(e => 
        e.city === params.location || 
        e.locationType === params.location
      );
    }

    if (params?.category && params.category !== 'All') {
      events = events.filter(e => e.category === params.category);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return events.slice(start, end);
  }

  async fetchEventById(id: string): Promise<Event | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockEvents.find(e => e.id === id) || null;
  }
}
