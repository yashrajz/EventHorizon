import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Eye, 
  Calendar, 
  MapPin, 
  Users,
  Clock,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

interface PendingEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  city: string;
  country: string;
  format: string;
  price_type: string;
  price_amount: number;
  category: string;
  organizer_name: string;
  organizer_email: string;
  image_url: string;
  registration_url: string;
  status: string;
  created_at: string;
  created_by: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [filter, user]);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events with filter:', filter);
      console.log('User info:', { email: user?.email, id: user?.id });
      
      let query = supabase
        .from('events')
        .select('*');

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      console.log('Query result:', { data, error });
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Successfully fetched events:', data?.length || 0);
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      
      if (error.message?.includes('permission denied') || error.message?.includes('row-level security')) {
        toast.error('Admin permission required to view events');
      } else {
        toast.error(`Failed to load events: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEventAction = async (eventId: number, action: 'approved' | 'rejected') => {
    try {
      console.log('Admin action:', { eventId, action, userEmail: user?.email, userId: user?.id });
      
      // Check session and JWT token
      const { data: session } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('JWT payload:', session.session?.access_token);
      
      const { data, error } = await supabase
        .from('events')
        .update({ 
          status: action,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful:', data);
      toast.success(`Event ${action} successfully!`);
      fetchEvents();
    } catch (error: any) {
      console.error('Error updating event:', error);
      
      if (error.message?.includes('permission denied') || error.message?.includes('row-level security')) {
        toast.error(`Permission denied. Admin access required to ${action} events.`);
      } else {
        toast.error(`Failed to ${action} event: ${error.message}`);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
        <Footer />
      </>
    );
  }

  // Admin check - replace with your email
  const isAdmin = user?.email === 'yashrajz.me@gmail.com';

  if (!isAdmin) {
    return (
      <>
        <SEO title="Access Denied - EventHorizon" />
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
          <div className="text-center glass-card p-8 max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin panel.
            </p>
            <Link to="/">
              <Button className="gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const stats = {
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    rejected: events.filter(e => e.status === 'rejected').length,
    total: events.length
  };

  return (
    <>
      <SEO 
        title="Admin Panel - EventHorizon"
        description="Manage events and user submissions."
      />
      <Header />
      
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Admin Panel 🛠️
            </h1>
            <p className="text-muted-foreground">
              Manage event submissions and platform content
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="glass-card p-4 text-center">
              <X className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'bg-accent text-black'
                    : 'bg-glass text-muted-foreground hover:text-foreground'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No {filter === 'all' ? '' : filter} events found
                </h3>
                <p className="text-muted-foreground">
                  {filter === 'pending' 
                    ? 'All event submissions have been reviewed!'
                    : 'No events match the current filter.'
                  }
                </p>
              </div>
            ) : (
              events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Image */}
                    <div className="lg:w-48 h-32 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.city}, {event.country}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.format}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                          event.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          event.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {event.status.toUpperCase()}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Organizer:</span>
                          <div className="font-medium text-foreground">{event.organizer_name}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <div className="font-medium text-foreground">{event.category}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <div className="font-medium text-foreground">
                            {event.price_type === 'free' ? 'Free' : `₹${event.price_amount}`}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <div className="font-medium text-foreground">
                            {new Date(event.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      {event.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleEventAction(event.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 gap-2 flex-1 lg:flex-none"
                            size="sm"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleEventAction(event.id, 'rejected')}
                            variant="destructive"
                            className="gap-2 flex-1 lg:flex-none"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 flex-1 lg:flex-none"
                        onClick={() => window.open(event.registration_url, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Admin;