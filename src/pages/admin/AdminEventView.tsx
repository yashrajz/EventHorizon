import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Tag,
  Users,
  Ticket,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { AdminEvent } from "@/types/admin";
import { toast } from "sonner";

const AdminEventView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent } = useAdminData();
  const [event, setEvent] = useState<AdminEvent | null>(null);

  useEffect(() => {
    if (id) {
      const foundEvent = getEvent(id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        toast.error("Event not found");
        navigate("/admin/events");
      }
    }
  }, [id, navigate, getEvent]);

  if (!event) {
    return null;
  }

  const getStatusBadge = (status: AdminEvent["status"]) => {
    const variants = {
      published: "bg-green-500/10 text-green-500 border-green-500/20",
      draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalRevenue = event.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.price * (ticket.total - ticket.available),
    0
  );

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/events")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground">{event.category}</p>
          </div>
        </div>
        <Button asChild className="gap-2">
          <Link to={`/admin/events/${event.id}`}>
            <Edit className="h-4 w-4" />
            Edit Event
          </Link>
        </Button>
      </motion.div>

      {/* Banner Image */}
      {event.bannerImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50 backdrop-blur-sm bg-card/50 overflow-hidden">
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Event Information */}
          <Card className="border-border/50 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">{event.description}</p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="text-sm">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time</p>
                    <p className="text-sm">
                      {event.startTime} - {event.endTime} {event.timezone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-sm">
                      {event.locationType === "online"
                        ? "Online"
                        : `${event.venue}, ${event.city}, ${event.country}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Organizer</p>
                    <p className="text-sm">{event.organizer}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">Tags</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Types */}
          <Card className="border-border/50 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Ticket Types
              </CardTitle>
              <CardDescription>Available tickets for this event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{ticket.name}</p>
                        <Badge
                          variant="outline"
                          className={
                            ticket.type === "free"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : ticket.type === "paid"
                              ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          }
                        >
                          {ticket.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ticket.total - ticket.available} / {ticket.total} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {ticket.price === 0 ? "Free" : `₹${ticket.price.toLocaleString()}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{(ticket.price * (ticket.total - ticket.available)).toLocaleString()} earned
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar - Stats & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Status Card */}
          <Card className="border-border/50 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Status</span>
                  {getStatusBadge(event.status)}
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>
                      {new Date(event.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>
                      {new Date(event.updatedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="border-border/50 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{event.registrations}</p>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <IndianRupee className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{event.ticketTypes.length}</p>
                    <p className="text-sm text-muted-foreground">Ticket Types</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEventView;
