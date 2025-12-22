import { apiClient } from '../lib/mongodb';
import { mockEvents, type Event as MockEvent } from '../data/events';

// Helper function to safely extract date from MongoDB date
const extractDateString = (mongoDate: string | Date): string => {
  if (typeof mongoDate === 'string') {
    // If it's an ISO string like "2025-12-25T04:30:00.000Z", extract the date part
    if (mongoDate.includes('T')) {
      return mongoDate.split('T')[0];
    }
    return mongoDate;
  }
  // If it's a Date object, convert to YYYY-MM-DD format
  return new Date(mongoDate).toISOString().split('T')[0];
};

// Convert MongoDB event to display format
const convertMongoEvent = (event: any): MockEvent => {
  console.log('🖼️ Converting MongoDB event:', event.title, 'coverImage:', event.coverImage);
  
  return {
    id: String(event._id || event.id), // Convert to string for consistency
    title: event.title,
    description: event.description || '',
    // Extract just the date part, ignoring timezone issues
    date: extractDateString(event.startDate || event.start_date || new Date()),
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
    // Use the actual coverImage from MongoDB, fallback to generated image only if no coverImage provided
    coverImage: event.coverImage || `https://picsum.photos/seed/${event._id || event.id}/800/600`,
    category: event.category,
    views: event.views || 0,
    price: event.price === 'Free' ? 'Free' : 'Paid',
    priceAmount: event.priceAmount,
  };
};

export const eventService = {
  async getEvents(): Promise<MockEvent[]> {
    try {
      console.log('🔄 EventService: Fetching approved events from MongoDB...');
      const response = await apiClient.getApprovedEvents();
      
      console.log('📋 EventService: Raw response:', response);
      
      if (!response.success || !response.data) {
        console.warn('⚠️ EventService: MongoDB API error, falling back to mock data:', response.error);
        return mockEvents;
      }

      if (response.data.length === 0) {
        console.log('ℹ️ EventService: No approved events found, returning mock events');
        return mockEvents;
      }

      console.log('✅ EventService: Successfully converted', response.data.length, 'MongoDB events');
      const convertedEvents = response.data.map(convertMongoEvent);
      console.log('🎯 EventService: Converted events:', convertedEvents);
      return convertedEvents;
    } catch (error) {
      console.warn('❌ EventService: Error fetching events from MongoDB API, using mock data:', error);
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