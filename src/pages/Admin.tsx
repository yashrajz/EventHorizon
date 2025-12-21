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
  Home,
  AlertCircle,
  Trash2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/mongodb";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";

interface PendingEvent {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  locationType: string;
  venue?: string;
  city: string;
  country?: string;
  price: string;
  priceAmount?: string;
  category: string;
  organizer: string;
  eventUrl: string;
  registrationUrl: string;
  coverImage: string;
  status: string;
  submittedAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (!loading && user && user.role !== 'superadmin') {
      toast.error('Only SuperUser can access the admin panel');
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchStats();
    }
  }, [filter, user]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.request('/admin/stats');
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      console.log('Fetching events with filter:', filter);
      console.log('User role:', user?.role);
      
      const response = await apiClient.request(`/admin/events?status=${filter}`);
      
      if (response.success && response.data) {
        console.log('Successfully fetched events:', response.data.length);
        setEvents(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      
      if (error.message?.includes('permission') || error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Admin permission required. Please sign out and sign in again.');
      } else {
        toast.error(`Failed to load events: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEventAction = async (eventId: string, action: 'approved' | 'rejected') => {
    try {
      console.log('Admin action:', { eventId, action, userRole: user?.role });
      
      const response = action === 'approved' 
        ? await apiClient.approveEvent(eventId)
        : await apiClient.rejectEvent(eventId, 'Event rejected by admin');

      if (response.success) {
        console.log('Update successful');
        toast.success(`Event ${action} successfully!`);
        fetchEvents();
      } else {
        throw new Error(response.message || `Failed to ${action} event`);
      }
    } catch (error: any) {
      console.error('Error updating event:', error);
      
      if (error.message?.includes('permission') || error.message?.includes('401') || error.message?.includes('403')) {
        toast.error(`Admin access required. Please sign out and sign in again.`);
      } else {
        toast.error(`Failed to ${action} event: ${error.message}`);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiClient.deleteEvent(eventId);
      
      if (response.success) {
        toast.success('Event deleted successfully');
        fetchEvents();
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(`Failed to delete event: ${error.message}`);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Preparing export...');
      await apiClient.exportEventsCSV();
      toast.success('Events exported successfully!');
    } catch (error: any) {
      console.error('Error exporting events:', error);
      toast.error(`Failed to export events: ${error.message}`);
    }
  };

  if (loading) {
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

  // Check if user has admin role
  const isAdmin = user?.role === 'superadmin' && user?.email === 'superuser@eventhorizon.com';

  if (!isAdmin) {
    return (
      <>
        <SEO title="Access Denied - EventHorizon" />
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
          <div className="text-center glass-card p-8 max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              Only the SuperUser can access the admin panel.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              This area is restricted to the website owner only.
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
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="flex gap-2 overflow-x-auto flex-1">
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
            <Button 
              onClick={handleExportCSV}
              className="gap-2 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </Button>
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
                  key={event._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Image */}
                    <div className="lg:w-48 h-32 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img 
                        src={event.coverImage} 
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
                              {new Date(event.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.city}{event.country ? `, ${event.country}` : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.locationType}
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
                          <div className="font-medium text-foreground">{event.organizer}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <div className="font-medium text-foreground">{event.category}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <div className="font-medium text-foreground">
                            {event.price === 'Free' ? 'Free' : event.priceAmount ? `₹${event.priceAmount}` : 'Paid'}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <div className="font-medium text-foreground">
                            {new Date(event.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      {event.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleEventAction(event._id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 gap-2 flex-1 lg:flex-none"
                            size="sm"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleEventAction(event._id, 'rejected')}
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
                        onClick={() => window.open(event.eventUrl || event.registrationUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      {(event.status === 'approved' || event.status === 'rejected') && (
                        <Button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          variant="destructive"
                          className="gap-2 flex-1 lg:flex-none"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      )}
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