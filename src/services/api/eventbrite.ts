import { BaseEventsAPI, EventSearchParams } from "./base";
import { Event } from "@/data/events";

/**
 * Eventbrite API Integration
 * Documentation: https://www.eventbrite.com/platform/api
 */
export class EventbriteAPI extends BaseEventsAPI {
  constructor(apiKey: string) {
    super(apiKey, 'https://www.eventbriteapi.com/v3');
  }

  async fetchEvents(params?: EventSearchParams): Promise<Event[]> {
    const queryParams = new URLSearchParams({
      token: this.apiKey,
      'location.address': params?.location || 'online',
      'q': params?.query || '',
      'sort_by': 'date',
      'expand': 'venue,organizer',
    });

    const data = await this.fetchAPI(`/events/search/?${queryParams}`);
    
    return data.events?.map((event: any) => this.transformEvent(event)) || [];
  }

  async fetchEventById(id: string): Promise<Event | null> {
    try {
      const data = await this.fetchAPI(`/events/${id}/?token=${this.apiKey}&expand=venue,organizer`);
      return this.transformEvent(data);
    } catch {
      return null;
    }
  }

  private transformEvent(eventData: any): Event {
    const venue = eventData.venue;
    const isOnline = eventData.online_event || !venue;

    return {
      id: eventData.id,
      title: eventData.name.text,
      description: eventData.description.text || eventData.summary || 'No description available',
      date: eventData.start.local.split('T')[0],
      startTime: eventData.start.local.split('T')[1]?.substring(0, 5) || '00:00',
      endTime: eventData.end.local.split('T')[1]?.substring(0, 5) || '23:59',
      timezone: eventData.start.timezone,
      locationType: isOnline ? 'Online' : 'IRL',
      venue: venue?.name,
      city: venue?.address?.city,
      country: venue?.address?.country,
      tags: eventData.category ? [eventData.category.name] : [],
      organizer: eventData.organizer?.name || 'Eventbrite',
      eventUrl: eventData.url,
      registrationUrl: eventData.url,
      coverImage: eventData.logo?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      views: Math.floor(Math.random() * 10000) + 1000,
      price: eventData.is_free ? 'Free' : 'Paid',
      priceAmount: eventData.ticket_availability?.minimum_ticket_price?.display,
      category: eventData.category?.name || 'Conference',
    };
  }
}
