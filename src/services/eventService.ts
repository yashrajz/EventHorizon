import { apiClient } from '../lib/mongodb';
import { mockEvents, type Event as MockEvent } from '../data/events';

// Convert MongoDB event to display format
const convertMongoEvent = (event: any): MockEvent => ({
  id: String(event._id || event.id), // Convert to string for consistency
  title: event.title,
  description: event.description || '',
  date: event.startDate || event.start_date,
  startTime: event.startTime || '10:00',
  endTime: event.endTime || '17:00',
  timezone: event.timezone || 'UTC',
  locationType: event.locationType === 'IRL' ? 'IRL' :
                event.locationType === 'Online' ? 'Online' : 'Hybrid',
  venue: event.venue,
  city: event.city,
  country: event.country,
  tags: event.tags || [],
  organizer: event.organizer || 'Unknown',
  eventUrl: event.eventUrl || '',
  registrationUrl: event.registrationUrl || '',
  coverImage: event.coverImage || `https://picsum.photos/seed/${event._id || event.id}/800/600`,
  category: event.category,
  views: event.views || 0,
  price: event.price === 'Free' ? 'Free' : 'Paid',
  priceAmount: event.priceAmount,
});

export const eventService = {
  async getEvents(): Promise<MockEvent[]> {
    try {
      const response = await apiClient.getApprovedEvents();
      
      if (!response.success || !response.data) {
        console.warn('MongoDB API error, falling back to mock data:', response.error);
        return mockEvents;
      }

      if (response.data.length === 0) {
        return mockEvents;
      }

      return response.data.map(convertMongoEvent);
    } catch (error) {
      console.warn('Error fetching events from MongoDB API, using mock data:', error);
      return mockEvents;
    }
  },

  async getEvent(id: string): Promise<MockEvent | null> {
    try {
      // For individual events, we'll need to get all events and filter
      // or create a new API endpoint for single event retrieval
      const response = await apiClient.getApprovedEvents();
      
      if (!response.success || !response.data) {
        console.warn('MongoDB API error, falling back to mock data:', response.error);
        return mockEvents.find((e: MockEvent) => e.id === id) || null;
      }

      const event = response.data.find((e: any) => String(e._id) === id || String(e.id) === id);
      return event ? convertMongoEvent(event) : null;
    } catch (error) {
      console.warn('Error fetching event from MongoDB API, using mock data:', error);
      return mockEvents.find((e: MockEvent) => e.id === id) || null;
    }
  },

  async createEvent(eventData: Partial<MockEvent>): Promise<{ success: boolean; event?: MockEvent; error?: string }> {
    try {
      const mongoEventData = {
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.date ? new Date(eventData.date) : new Date(),
        endDate: eventData.date ? new Date(eventData.date) : new Date(), // Assuming single day events for now
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        timezone: eventData.timezone,
        locationType: eventData.locationType,
        venue: eventData.venue,
        city: eventData.city,
        country: eventData.country,
        tags: eventData.tags,
        organizer: eventData.organizer,
        eventUrl: eventData.eventUrl,
        registrationUrl: eventData.registrationUrl,
        coverImage: eventData.coverImage,
        category: eventData.category,
        price: eventData.price,
        priceAmount: eventData.priceAmount,
      };

      const response = await apiClient.submitEvent(mongoEventData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create event');
      }

      return {
        success: true,
        event: response.data ? convertMongoEvent(response.data) : undefined
      };
    } catch (error: any) {
      console.error('Error creating event:', error);
      return {
        success: false,
        error: error.message || 'Failed to create event. Please try again.'
      };
    }
  },

  async updateEvent(id: string, eventData: Partial<MockEvent>): Promise<{ success: boolean; event?: MockEvent; error?: string }> {
    try {
      // Note: This would require an update event API endpoint in the backend
      // For now, we'll return a mock success response
      console.warn('Event update not yet implemented in MongoDB API');
      return {
        success: false,
        error: 'Event update not yet implemented'
      };
    } catch (error: any) {
      console.error('Error updating event:', error);
      return {
        success: false,
        error: error.message || 'Failed to update event. Please try again.'
      };
    }
  },

  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Note: This would require a delete event API endpoint in the backend
      const response = await apiClient.deleteEvent(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete event');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete event. Please try again.'
      };
    }
  },

  async searchEvents(query: string, filters?: {
    category?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MockEvent[]> {
    try {
      const response = await apiClient.getApprovedEvents();
      
      if (!response.success || !response.data) {
        console.warn('MongoDB API error, falling back to mock data:', response.error);
        return this.filterMockEvents(query, filters);
      }

      const events = response.data.map(convertMongoEvent);
      return this.filterEvents(events, query, filters);
    } catch (error) {
      console.warn('Error searching events from MongoDB API, using mock data:', error);
      return this.filterMockEvents(query, filters);
    }
  },

  // Helper method to filter events
  filterEvents(events: MockEvent[], query?: string, filters?: {
    category?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }): MockEvent[] {
    return events.filter((event: MockEvent) => {
      const matchesQuery = !query || 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !filters?.category || event.category === filters.category;
      const matchesLocation = !filters?.location || 
        event.city.toLowerCase().includes(filters.location.toLowerCase());
      
      // Simple date filtering - can be enhanced based on requirements
      const matchesDateRange = (!filters?.startDate && !filters?.endDate) ||
        (filters?.startDate && event.date >= filters.startDate) ||
        (filters?.endDate && event.date <= filters.endDate);
      
      return matchesQuery && matchesCategory && matchesLocation && matchesDateRange;
    });
  },

  // Helper method to filter mock events
  filterMockEvents(query?: string, filters?: {
    category?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }): MockEvent[] {
    return this.filterEvents(mockEvents, query, filters);
  }
};

export default eventService;