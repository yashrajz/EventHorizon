import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Heart, Settings, MapPin, Globe, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ProfileEditModal from "@/components/ProfileEditModal";
import { toast } from "sonner";
import { apiClient } from "@/lib/mongodb";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  city: string;
  image_url: string;
  category: string;
}

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stats, setStats] = useState({
    savedEvents: 0,
    registeredEvents: 0,
    createdEvents: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user profile from MongoDB
        const profileResponse = await apiClient.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setProfile({
            id: user.id,
            full_name: profileResponse.data.full_name,
            email: user.email,
            bio: profileResponse.data.bio,
            location: profileResponse.data.location,
            website: profileResponse.data.website,
            avatar_url: profileResponse.data.avatar_url,
            created_at: profileResponse.data.createdAt?.toString() || new Date().toISOString(),
          });
        } else {
          // Create default profile from user data
          const defaultProfile = {
            id: user.id,
            full_name: user.name,
            email: user.email,
            bio: null,
            location: null,
            website: null,
            avatar_url: user.avatar || null,
            created_at: new Date().toISOString(),
          };
          setProfile(defaultProfile);
        }

        // For now, use empty arrays for favorite events since the API integration needs to be maintained
        setFavoriteEvents([]);
        
        // Fetch user's submitted events
        const userEventsResponse = await apiClient.getUserEvents();
        if (userEventsResponse.success && userEventsResponse.data) {
          const mongoEvents = userEventsResponse.data.map(event => ({
            id: event._id as unknown as number,
            title: event.title,
            date: event.startDate.toString(),
            location: event.city,
            city: event.city,
            image_url: event.coverImage || `https://picsum.photos/seed/${event._id}/800/600`,
            category: event.category
          }));
          setCreatedEvents(mongoEvents);
        }

        // Update stats
        setStats({
          savedEvents: 0, // Will be implemented with favorites system
          registeredEvents: 0, // Will be implemented with registration system
          createdEvents: userEventsResponse.success ? (userEventsResponse.data?.length || 0) : 0
        });

      } catch (err: any) {
        console.error('Error fetching user data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileUpdate = (newProfile: any) => {
    setProfile(prev => prev ? { ...prev, ...newProfile } : null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Dashboard - EventHorizon"
        description="Manage your EventHorizon profile and saved events."
      />
      <Header />
      
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name || user.name || user.email?.split('@')[0] || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Manage your profile and discover your saved events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {profile?.full_name || 'Anonymous User'}
                    </h2>
                    <p className="text-muted-foreground text-sm">{profile?.email}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>
                )}

                <div className="space-y-3 mb-6">
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-accent transition-colors"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(profile?.created_at || new Date()).toLocaleDateString()}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div className="glass-card p-4 text-center">
                  <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats.savedEvents}</div>
                  <div className="text-sm text-muted-foreground">Saved Events</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats.registeredEvents}</div>
                  <div className="text-sm text-muted-foreground">Registered</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <Settings className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats.createdEvents}</div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/">
                    <Button variant="outline" className="h-16 text-left justify-start gap-3 w-full">
                      <Calendar className="w-6 h-6 text-accent" />
                      <div>
                        <div className="font-medium">Browse Events</div>
                        <div className="text-sm text-muted-foreground">Discover new opportunities</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/submit-event">
                    <Button variant="outline" className="h-16 text-left justify-start gap-3 w-full">
                      <Plus className="w-6 h-6 text-accent" />
                      <div>
                        <div className="font-medium">Submit Event</div>
                        <div className="text-sm text-muted-foreground">Share your event</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Saved Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Saved Events</h2>
                  <Link to="/">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>

                {favoriteEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteEvents.map((event) => (
                      <Link key={event.id} to={`/event/${event.id}`}>
                        <div className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300">
                          <div className="relative h-32">
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {event.city}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No saved events yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring events and save the ones you're interested in!
                    </p>
                    <Link to="/">
                      <Button>Discover Events</Button>
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Created Events */}
              {stats.createdEvents > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Your Events</h2>
                    <Link to="/submit-event">
                      <Button variant="outline" size="sm">Create New</Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {createdEvents.map((event) => (
                      <Link key={event.id} to={`/event/${event.id}`}>
                        <div className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300">
                          <div className="relative h-32">
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-xs px-2 py-1 rounded-full">
                              Your Event
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {event.city}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={{
          full_name: profile?.full_name || '',
          bio: profile?.bio || '',
          location: profile?.location || '',
          website: profile?.website || '',
        }}
        onProfileUpdate={handleProfileUpdate}
      />
      
      <Footer />
    </>
  );
};

export default Dashboard;