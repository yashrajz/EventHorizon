import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Eye,
  MessageSquare,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { apiClient, type MongoEvent } from "@/lib/mongodb";
import { Navigate } from "react-router-dom";

const AdminEventReview = () => {
  const { user, hasRole } = useAuth();
  const [events, setEvents] = useState<MongoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<MongoEvent | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Redirect if not admin
  if (!hasRole(['admin', 'superadmin'])) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const loadPendingEvents = async () => {
    try {
      const response = await apiClient.getPendingEvents();
      if (response.success) {
        setEvents(response.data || []);
      } else {
        toast.error("Failed to load pending events");
      }
    } catch (error: any) {
      console.error('Error loading pending events:', error);
      toast.error("Failed to load pending events");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      const response = await apiClient.approveEvent(eventId, reviewNotes);
      if (response.success) {
        toast.success("Event approved successfully!");
        setEvents(prev => prev.filter(e => e._id !== eventId));
        setSelectedEvent(null);
        setReviewNotes("");
      } else {
        toast.error(response.message || "Failed to approve event");
      }
    } catch (error: any) {
      console.error('Error approving event:', error);
      toast.error("Failed to approve event");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (eventId: string) => {
    if (!reviewNotes.trim()) {
      toast.error("Please provide rejection reason");
      return;
    }

    setActionLoading(eventId);
    try {
      const response = await apiClient.rejectEvent(eventId, reviewNotes);
      if (response.success) {
        toast.success("Event rejected");
        setEvents(prev => prev.filter(e => e._id !== eventId));
        setSelectedEvent(null);
        setReviewNotes("");
      } else {
        toast.error(response.message || "Failed to reject event");
      }
    } catch (error: any) {
      console.error('Error rejecting event:', error);
      toast.error("Failed to reject event");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admin - Event Review | EventHorizon"
        description="Review and manage submitted events."
      />
      <Header />
      
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Event Review</h1>
              <p className="text-muted-foreground">
                Review and approve submitted events for publication
              </p>
            </div>

            {/* Search and Filters */}
            <div className="glass-card p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events by title, category, or city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {filteredEvents.length} pending events
                  </Badge>
                </div>
              </div>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No pending events
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "No events match your search criteria" : "All events have been reviewed"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="glass-card p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Event Image */}
                      <div className="lg:w-48 h-32 lg:h-auto">
                        <img 
                          src={event.coverImage} 
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              {event.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(event.startDate)} - {formatDate(event.endDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(event.startDate)} - {formatTime(event.endDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.city}{event.country && `, ${event.country}`}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">{event.category}</Badge>
                              <Badge variant="outline">{event.locationType}</Badge>
                              <Badge variant={event.price === 'Free' ? 'default' : 'secondary'}>
                                {event.price}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setReviewNotes("");
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Review Event: {event.title}</DialogTitle>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                  {/* Event Details */}
                                  <div>
                                    <h4 className="font-medium text-foreground mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Organizer</h4>
                                      <p className="text-sm text-muted-foreground">{event.organizer}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Location Type</h4>
                                      <p className="text-sm text-muted-foreground">{event.locationType}</p>
                                    </div>
                                    {event.venue && (
                                      <div>
                                        <h4 className="font-medium text-foreground mb-1">Venue</h4>
                                        <p className="text-sm text-muted-foreground">{event.venue}</p>
                                      </div>
                                    )}
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Submitted</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {formatDate(event.submittedAt)}
                                      </p>
                                    </div>
                                  </div>

                                  {event.tags && event.tags.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-foreground mb-2">Tags</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.eventUrl && (
                                      <div>
                                        <h4 className="font-medium text-foreground mb-1">Event Website</h4>
                                        <a 
                                          href={event.eventUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm text-accent hover:text-accent/80 break-all"
                                        >
                                          {event.eventUrl}
                                        </a>
                                      </div>
                                    )}
                                    {event.registrationUrl && (
                                      <div>
                                        <h4 className="font-medium text-foreground mb-1">Registration</h4>
                                        <a 
                                          href={event.registrationUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm text-accent hover:text-accent/80 break-all"
                                        >
                                          {event.registrationUrl}
                                        </a>
                                      </div>
                                    )}
                                  </div>

                                  {/* Admin Notes */}
                                  <div>
                                    <Label htmlFor="reviewNotes">Admin Notes</Label>
                                    <Textarea
                                      id="reviewNotes"
                                      placeholder="Add notes about this event (required for rejection)"
                                      rows={3}
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                    />
                                  </div>

                                  {/* Actions */}
                                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleReject(event._id!)}
                                      disabled={actionLoading === event._id}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      {actionLoading === event._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                      ) : (
                                        <XCircle className="w-4 h-4 mr-2" />
                                      )}
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => handleApprove(event._id!)}
                                      disabled={actionLoading === event._id}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      {actionLoading === event._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      ) : (
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                      )}
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default AdminEventReview;