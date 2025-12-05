import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import { mockEvents } from "@/data/events";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClickSpark from "@/components/ClickSpark";

const EventDetail = () => {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShare = (platform?: string) => {
    if (!event) return;
    
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

  const handleRegister = () => {
    if (event) {
      window.open(event.registrationUrl, '_blank');
    }
  };

  if (!event) {
    return (
      <ClickSpark sparkColor="#6b7280" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
        <div className="min-h-screen">
          <Header />
          <main className="py-32 text-center">
            <h1 className="font-display text-4xl font-bold text-foreground">Event Not Found</h1>
            <p className="mt-4 text-muted-foreground">The event you're looking for doesn't exist.</p>
            <Link to="/">
              <Button variant="hero" className="mt-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Button>
            </Link>
          </main>
          <Footer />
        </div>
      </ClickSpark>
    );
  }

  return (
    <ClickSpark sparkColor="#6b7280" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-64 sm:h-80 lg:h-96 bg-muted overflow-hidden">
                <img 
                  src={event.coverImage} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                {/* Tags */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
                  <span className="rounded-full bg-accent/90 px-4 py-1.5 text-sm font-medium text-accent-foreground backdrop-blur-sm">
                    {event.category}
                  </span>
                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm ${
                      event.price === "Free"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {event.price === "Paid" && event.priceAmount ? event.priceAmount : event.price}
                  </span>
                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm ${
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
              <div className="p-6 sm:p-8">
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                  {event.title}
                </h1>

                {/* Meta Info Grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-glass">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground/70">Date</p>
                      <p className="text-foreground">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-glass">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground/70">Time</p>
                      <p className="text-foreground">
                        {event.startTime} - {event.endTime} {event.timezone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-glass">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground/70">Location</p>
                      <p className="text-foreground">
                        {event.locationType === "Online"
                          ? "Virtual Event"
                          : `${event.venue}, ${event.city}, ${event.country}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-glass">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground/70">Views</p>
                      <p className="text-foreground">{event.views.toLocaleString()} interested</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold text-foreground">About this event</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{event.description}</p>
                </div>

                {/* Tags */}
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold text-foreground">Topics</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-glass-border bg-glass/30 px-4 py-1.5 text-sm text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Organizer */}
                <div className="mt-8 border-t border-glass-border pt-8">
                  <h2 className="font-display text-xl font-semibold text-foreground">Organizer</h2>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-accent flex items-center justify-center text-lg font-bold text-accent-foreground">
                      {event.organizer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{event.organizer}</p>
                      <p className="text-sm text-muted-foreground">Event Organizer</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="flex-1 gap-2"
                    onClick={handleRegister}
                  >
                    Register Now
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="glass" size="lg" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare('copy')}>
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        Share on Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                        Share on LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                        Share on WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('facebook')}>
                        Share on Facebook
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
};

export default EventDetail;
