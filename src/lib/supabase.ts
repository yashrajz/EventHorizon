import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnv = !supabaseUrl || !supabaseAnonKey;

let supabaseClient: SupabaseClient;

if (missingEnv) {
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Supabase features are disabled until these values are provided.');

  const handler: ProxyHandler<Record<string, unknown>> = {
    get: (_target, property) => {
      throw new Error(`[Supabase] Attempted to access "${String(property)}" without configuring the required environment variables.`);
    }
  };

  supabaseClient = new Proxy({}, handler) as unknown as SupabaseClient;
} else {
  supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);
}

export const supabase = supabaseClient;
export const isSupabaseConfigured = !missingEnv;

// Event type for compatibility
export type Event = {
  id: number | string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  timezone?: string;
  location: string;
  city: string;
  venue?: string;
  country?: string;
  image_url: string;
  cover_image_url?: string;
  category: string;
  format?: 'in-person' | 'online' | 'hybrid';
  tags?: string[];
  organizer_name?: string;
  registration_url?: string;
  price_type?: 'free' | 'paid';
  price_amount?: number;
  currency?: string;
  created_by: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
        };
        Update: {
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};