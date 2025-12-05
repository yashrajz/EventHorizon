import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Share2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/data/events";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

  const handleShare = (e: React.MouseEvent, platform?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const eventUrl = `${window.location.origin}/event/${event.id}`;
    const shareText = `Check out ${event.title} - ${formatDate(event.date)}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(eventUrl);
      toast({
        title: "Link copied!",
        description: "Event link has been copied to clipboard.",
      });
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + eventUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank');
    }
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(event.registrationUrl, '_blank');
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
      <div className="relative h-48 overflow-hidden bg-muted">
        <img 
          src={event.coverImage} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
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
            {event.price === "Paid" && event.priceAmount ? event.priceAmount : event.price}
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
        <div className="mt-6 flex items-center justify-between gap-2 border-t border-glass-border pt-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground flex-shrink-0">
              {event.organizer.charAt(0)}
            </div>
            <span className="text-sm text-muted-foreground truncate">{event.organizer}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={(e) => handleShare(e, 'copy')}>
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleShare(e, 'twitter')}>
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleShare(e, 'linkedin')}>
                  Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleShare(e, 'whatsapp')}>
                  Share on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleShare(e, 'facebook')}>
                  Share on Facebook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1 group/btn"
              onClick={handleRegister}
            >
              Register
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      </motion.article>
    </Link>
  );
};
