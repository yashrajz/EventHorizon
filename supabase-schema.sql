-- EventHorizon Database Schema
-- Run this SQL in your Supabase SQL Editor

-- 1. Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  location TEXT,
  venue TEXT,
  city TEXT,
  country TEXT,
  format TEXT CHECK (format IN ('in-person', 'online', 'hybrid')),
  price_type TEXT CHECK (price_type IN ('free', 'paid')),
  price_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  category TEXT,
  organizer_name TEXT,
  organizer_email TEXT,
  organizer_website TEXT,
  image_url TEXT,
  registration_url TEXT,
  max_attendees INTEGER,
  tags TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'cancelled', 'completed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Create favorites table (save events)
CREATE TABLE IF NOT EXISTS public.favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, event_id)
);

-- 4. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view approved events" ON public.events;
DROP POLICY IF EXISTS "Public can view approved events" ON public.events;
DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Users can edit own events" ON public.events;
DROP POLICY IF EXISTS "Admins can update any event" ON public.events;
DROP POLICY IF EXISTS "Admins have full access" ON public.events;
DROP POLICY IF EXISTS "Admin full access" ON public.events;
DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;

-- 6. Create RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 7. Create RLS Policies for events
-- Public can view approved and active events
CREATE POLICY "Public can view approved events" 
ON public.events FOR SELECT USING (status IN ('approved', 'active'));

-- Authenticated users can view their own events (any status)
CREATE POLICY "Users can view own events"
ON public.events FOR SELECT USING (auth.uid() = created_by);

-- Authenticated users can create events
CREATE POLICY "Users can create events" 
ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Admin gets full access (check first)
CREATE POLICY "Admin full access"
ON public.events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'yashrajz.me@gmail.com'
  )
);

-- Users can update their own events (only if not admin)
CREATE POLICY "Users can edit own events" 
ON public.events FOR UPDATE USING (
  auth.uid() = created_by AND 
  NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'yashrajz.me@gmail.com'
  )
);

-- 8. Create RLS Policies for favorites
CREATE POLICY "Users manage own favorites" 
ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_city ON public.events(city);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_tags ON public.events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_event ON public.favorites(event_id);

-- 10. Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, created_at, updated_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    new.email,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 12. Insert sample events (to replace hardcoded data)
INSERT INTO public.events (
  title, 
  description, 
  date, 
  start_time, 
  location, 
  city, 
  country, 
  format, 
  price_type, 
  price_amount, 
  category, 
  organizer_name, 
  image_url, 
  registration_url, 
  tags
) VALUES
('TechSparks Bangalore 2025', 'India''s premier startup conference featuring top entrepreneurs and investors from across the ecosystem. Join us for keynote sessions, panel discussions, and networking opportunities.', '2025-01-25', '09:00:00', 'Hotel Leela Palace', 'Bangalore', 'India', 'in-person', 'paid', 12500.00, 'Conference', 'YourStory', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'https://yourstory.com/techsparks', ARRAY['startup', 'conference', 'networking']),
('Mumbai Web3 Summit', 'Exploring the future of blockchain, cryptocurrency, and decentralized technologies. Learn from industry experts and connect with the Web3 community.', '2025-01-28', '10:00:00', 'Taj Mahal Palace', 'Mumbai', 'India', 'hybrid', 'paid', 8500.00, 'Conference', 'Web3 Foundation India', 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800', 'https://web3summit.mumbai', ARRAY['blockchain', 'web3', 'crypto']),
('Delhi Startup Pitch Day', 'Early-stage startups pitch to top VCs and angel investors. Witness the next generation of Indian startups present their innovative solutions.', '2025-02-01', '14:00:00', 'India Habitat Centre', 'New Delhi', 'India', 'in-person', 'free', 0.00, 'Demo Day', 'Delhi Angels Network', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800', 'https://delhiangels.com/pitch-day', ARRAY['pitching', 'funding', 'demo-day']),
('Pune AI/ML Hackathon', '48-hour intensive hackathon focused on artificial intelligence and machine learning solutions. Build innovative AI products and compete for exciting prizes.', '2025-02-05', '18:00:00', 'Persistent Systems Office', 'Pune', 'India', 'in-person', 'free', 0.00, 'Hackathon', 'Persistent Systems', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', 'https://persistent.com/hackathon', ARRAY['ai', 'ml', 'hackathon']),
('Hyderabad FinTech Meetup', 'Monthly meetup for fintech professionals, entrepreneurs, and enthusiasts. Discuss the latest trends in financial technology and digital payments.', '2025-02-10', '19:00:00', 'T-Hub', 'Hyderabad', 'India', 'in-person', 'free', 0.00, 'Meetup', 'Hyderabad FinTech Association', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', 'https://thub.in/fintech-meetup', ARRAY['fintech', 'networking', 'meetup']),
('Chennai SaaS Conference', 'Southern India''s largest SaaS conference featuring successful SaaS entrepreneurs, investors, and industry leaders sharing insights and strategies.', '2025-02-15', '09:30:00', 'ITC Grand Chola', 'Chennai', 'India', 'in-person', 'paid', 6500.00, 'Conference', 'SaaS Boomi', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', 'https://saasboomi.com/conference', ARRAY['saas', 'conference', 'b2b']),
('Kolkata Startup Weekend', 'A 54-hour event where developers, designers, and business people come together to build startups from scratch. Form teams, validate ideas, and pitch to judges.', '2025-02-20', '18:00:00', 'Techno City', 'Kolkata', 'India', 'in-person', 'paid', 1500.00, 'Workshop', 'Startup Weekend Kolkata', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800', 'https://startupweekend.org/kolkata', ARRAY['startup-weekend', 'entrepreneurship', 'teamwork']),
('Goa Tech Beach Festival', 'A unique tech conference by the beach combining technology talks with relaxation. Network with tech professionals in a laid-back coastal setting.', '2025-03-01', '11:00:00', 'Goa Marriott Resort', 'Goa', 'India', 'in-person', 'paid', 9500.00, 'Conference', 'Goa Tech Community', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 'https://goatech.beach', ARRAY['tech', 'networking', 'beach'])
ON CONFLICT DO NOTHING;

-- 13. Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();