import { BaseEventsAPI, EventSearchParams } from "./base";
import { Event } from "@/data/events";

/**
 * Ticketmaster Discovery API Integration
 * Documentation: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 */
export class TicketmasterAPI extends BaseEventsAPI {
  constructor(apiKey: string) {
    super(apiKey, 'https://app.ticketmaster.com/discovery/v2');
  }

  async fetchEvents(params?: EventSearchParams): Promise<Event[]> {
    const queryParams = new URLSearchParams({
      apikey: this.apiKey,
      keyword: params?.query || '',
      city: params?.location || '',
      size: (params?.limit || 20).toString(),
      sort: 'date,asc',
    });

    const data = await this.fetchAPI(`/events.json?${queryParams}`);
    
    return data._embedded?.events?.map((event: any) => this.transformEvent(event)) || [];
  }

  async fetchEventById(id: string): Promise<Event | null> {
    try {
      const data = await this.fetchAPI(`/events/${id}.json?apikey=${this.apiKey}`);
      return this.transformEvent(data);
    } catch {
      return null;
    }
  }

  private transformEvent(eventData: any): Event {
    const venue = eventData._embedded?.venues?.[0];
    const dates = eventData.dates?.start;

    return {
      id: eventData.id,
      title: eventData.name,
      description: eventData.info || eventData.pleaseNote || 'No description available',
      date: dates?.localDate || new Date().toISOString().split('T')[0],
      startTime: dates?.localTime || '00:00',
      endTime: '23:59',
      timezone: dates?.timezone || 'UTC',
      locationType: 'IRL',
      venue: venue?.name,
      city: venue?.city?.name,
      country: venue?.country?.name,
      tags: eventData.classifications?.map((c: any) => c.segment?.name).filter(Boolean) || [],
      organizer: eventData.promoter?.name || 'Ticketmaster',
      eventUrl: eventData.url,
      registrationUrl: eventData.url,
      coverImage: eventData.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      views: Math.floor(Math.random() * 10000) + 1000,
      price: eventData.priceRanges?.[0] ? 'Paid' : 'Free',
      priceAmount: eventData.priceRanges?.[0] ? `$${eventData.priceRanges[0].min} - $${eventData.priceRanges[0].max}` : undefined,
      category: eventData.classifications?.[0]?.segment?.name || 'Event',
    };
  }
}
