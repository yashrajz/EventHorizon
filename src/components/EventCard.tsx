import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/data/events";
import { Button } from "./ui/button";

interface EventCardProps {
  event: Event;
  index: number;
}

export const EventCard = ({ event, index }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link to={`/event/${event.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group glass-card overflow-hidden cursor-pointer"
      >
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-display font-bold text-foreground/10">
            {event.title.charAt(0)}
          </div>
        </div>
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent/90 px-3 py-1 text-xs font-medium text-accent-foreground backdrop-blur-sm">
            {event.category}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
              event.price === "Free"
                ? "bg-green-500/20 text-green-300"
                : "bg-amber-500/20 text-amber-300"
            }`}
          >
            {event.price}
          </span>
        </div>

        {/* Location Type Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
              event.locationType === "Online"
                ? "bg-blue-500/20 text-blue-300"
                : event.locationType === "Hybrid"
                ? "bg-purple-500/20 text-purple-300"
                : "bg-glass text-foreground"
            }`}
          >
            {event.locationType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
          {event.title}
        </h3>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
            <span className="text-glass-border">•</span>
            <span>{event.startTime} {event.timezone}</span>
          </div>
          
          {(event.city || event.locationType === "Online") && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {event.locationType === "Online"
                  ? "Virtual Event"
                  : `${event.city}, ${event.country}`}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-glass-border pt-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
              {event.organizer.charAt(0)}
            </div>
            <span className="text-sm text-muted-foreground">{event.organizer}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="gap-1 group/btn">
            View
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Button>
        </div>
      </div>
      </motion.article>
    </Link>
  );
};
