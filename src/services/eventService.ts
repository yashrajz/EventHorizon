import { supabase } from '../lib/supabase';
import type { Event as SupabaseEvent } from '../lib/supabase';
import { mockEvents, type Event as MockEvent } from '../data/events';

// Convert Supabase event to display format
const convertSupabaseEvent = (event: SupabaseEvent): MockEvent => ({
  id: String(event.id), // Convert to string for consistency
  title: event.title,
  description: event.description || '',
  date: event.start_date,
  startTime: event.start_time || '10:00',
  endTime: event.end_time || '17:00',
  timezone: event.timezone || 'UTC',
  locationType: event.format === 'in-person' ? 'IRL' :
                event.format === 'online' ? 'Online' : 'Hybrid',
  venue: event.venue,
  city: event.city,
  country: event.country,
  tags: event.tags || [],
  organizer: event.organizer_name || 'Unknown',
  eventUrl: event.registration_url || '',
  registrationUrl: event.registration_url || '',
  coverImage: event.cover_image_url || event.image_url || `https://picsum.photos/seed/${event.id}/800/600`,
  category: event.category,
  views: 0, // Default views count
  price: event.price_type === 'free' ? 'Free' : 'Paid',
  priceAmount: event.price_type === 'paid' && event.price_amount ?
    `${event.currency || 'USD'} ${event.price_amount}` : undefined,
});

// Convert display event to Supabase format
const convertToSupabaseEvent = (event: MockEvent): Partial<SupabaseEvent> => ({
  title: event.title,
  description: event.description,
  start_date: event.date,
  start_time: event.startTime,
  end_time: event.endTime,
  location: event.venue || event.city,
  city: event.city,
  image_url: event.coverImage,
  category: event.category,
});

export const eventService = {
  async getEvents(): Promise<MockEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockEvents;
      }

      if (!data || data.length === 0) {
        return mockEvents;
      }

      return data.map(convertSupabaseEvent);
    } catch (error) {
      console.warn('Error fetching events, using mock data:', error);
      return mockEvents;
    }
  },

  async getEvent(id: string): Promise<MockEvent | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockEvents.find((e: MockEvent) => e.id === id) || null;
      }

      return data ? convertSupabaseEvent(data) : null;
    } catch (error) {
      console.warn('Error fetching event, using mock data:', error);
      return mockEvents.find((e: MockEvent) => e.id === id) || null;
    }
  },

  async createEvent(eventData: Partial<MockEvent>): Promise<{ success: boolean; event?: MockEvent; error?: string }> {
    try {
      const supabaseEvent = convertToSupabaseEvent(eventData as MockEvent);
      
      const { data, error } = await supabase
        .from('events')
        .insert(supabaseEvent)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        event: convertSupabaseEvent(data)
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        success: false,
        error: 'Failed to create event. Please try again.'
      };
    }
  },

  async updateEvent(id: string, eventData: Partial<MockEvent>): Promise<{ success: boolean; event?: MockEvent; error?: string }> {
    try {
      const supabaseEvent = convertToSupabaseEvent(eventData as MockEvent);
      
      const { data, error } = await supabase
        .from('events')
        .update(supabaseEvent)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        event: convertSupabaseEvent(data)
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        success: false,
        error: 'Failed to update event. Please try again.'
      };
    }
  },

  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        error: 'Failed to delete event. Please try again.'
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
      let supabaseQuery = supabase
        .from('events')
        .select('*');

      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (filters?.category) {
        supabaseQuery = supabaseQuery.eq('category', filters.category);
      }

      if (filters?.location) {
        supabaseQuery = supabaseQuery.ilike('city', `%${filters.location}%`);
      }

      if (filters?.startDate) {
        supabaseQuery = supabaseQuery.gte('start_date', filters.startDate);
      }

      if (filters?.endDate) {
        supabaseQuery = supabaseQuery.lte('start_date', filters.endDate);
      }

      const { data, error } = await supabaseQuery.order('start_date', { ascending: true });

      if (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        // Filter mock events based on query and filters
        return mockEvents.filter((event: MockEvent) => {
          const matchesQuery = !query || 
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.description.toLowerCase().includes(query.toLowerCase());
          
          const matchesCategory = !filters?.category || event.category === filters.category;
          const matchesLocation = !filters?.location || 
            event.city.toLowerCase().includes(filters.location.toLowerCase());
          
          return matchesQuery && matchesCategory && matchesLocation;
        });
      }

      return data ? data.map(convertSupabaseEvent) : [];
    } catch (error) {
      console.warn('Error searching events, using mock data:', error);
      // Filter mock events based on query
      return mockEvents.filter((event: MockEvent) => 
        !query || 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};

export default eventService;