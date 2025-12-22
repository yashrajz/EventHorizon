import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  Sparkles,
  Globe,
  DollarSign,
  Tag,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  Target,
  Zap,
  Star,
  Heart,
  BookmarkPlus,
  ArrowUpRight,
  Eye,
  Bookmark,
  ImageOff,
  Radio,
  Play
} from "lucide-react";
import { type Event } from "@/data/events";
import { getCategoryGradient, getPatternOverlay, getCategoryImage } from "@/lib/imageUtils";
import { getEventTiming, formatEventTime, getCountdownText } from "@/lib/eventTiming";
import { getEventsAPI } from "@/services/api";
import { eventService } from "@/services/eventService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClickSpark from "@/components/ClickSpark";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import LightRays from "@/components/LightRays";


const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [imageError, setImageError] = useState(false);
  const [timing, setTiming] = useState<ReturnType<typeof getEventTiming> | null>(null);

  // Update timing every minute
  useEffect(() => {
    if (!event) return;
    
    setTiming(getEventTiming(event));
    const interval = setInterval(() => {
      setTiming(getEventTiming(event));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [event]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      console.log('🔍 Searching for event with ID:', id);
      
      // Try MongoDB first (user submitted events)
      let fetchedEvent = await eventService.getEvent(id);
      console.log('📋 MongoDB result:', fetchedEvent ? 'Found' : 'Not found');
      
      // If not found in MongoDB, try external APIs
      if (!fetchedEvent) {
        console.log('🌐 Trying external APIs...');
        const api = getEventsAPI();
        fetchedEvent = await api.fetchEventById(id);
        console.log('🌐 External API result:', fetchedEvent ? 'Found' : 'Not found');
      }
      
      if (fetchedEvent) {
        console.log('✅ Event found:', fetchedEvent.title);
        setEvent(fetchedEvent);
        setLikesCount(Math.floor(fetchedEvent.views * 0.15));
        
        // Fetch similar events from both sources
        const [mongoEvents, externalEvents] = await Promise.all([
          eventService.getEvents().catch(() => []),
          (async () => {
            try {
              const api = getEventsAPI();
              return await api.fetchEvents({ category: fetchedEvent.category, limit: 4 });
            } catch {
              return [];
            }
          })()
        ]);
        
        const allEvents = [...mongoEvents, ...externalEvents];
        setSimilarEvents(allEvents.filter(e => e.id !== id).slice(0, 3));
      } else {
        console.log('❌ Event not found in any source');
        setEvent(null);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
      toast({
        title: "Error loading event",
        description: "Failed to load event details. Please try again.",
        variant: "destructive",
      });
      setEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!event) return;
    if (!event.registrationUrl) return;
    window.open(event.registrationUrl, '_blank');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Event removed from your saved list" : "Event saved to your bookmarks",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Calculate days until event
  const getDaysUntilEvent = () => {
    if (!event) return 0;
    const today = new Date();
    const eventDate = new Date(event.date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get similar events (mock data)
  const getSimilarEvents = () => {
    return similarEvents;
  };

  if (isLoading) {
    return (
      <ClickSpark sparkColor="#6b7280" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
        <div className="min-h-screen">
          <Header />
          <main className="py-32 flex items-center justify-center">
            <LoadingSpinner />
          </main>
          <Footer />
        </div>
      </ClickSpark>
    );
  }

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
    <ClickSpark sparkColor="#C3073F" sparkSize={14} sparkRadius={25} sparkCount={12} duration={600}>
      <SEO 
        title={event.title}
        description={event.description}
        image={event.coverImage}
        url={`${window.location.origin}/event/${event.id}`}
        type="article"
        keywords={`${event.category}, ${event.city || ''}, ${event.country || ''}, startup event, ${event.locationType} event`}
      />
      <div className="min-h-screen">
        <Header />
        
        {/* Hero Section with Cover */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {/* Fast-loading gradient background */}
            <div 
              className="absolute inset-0"
              style={{ 
                background: getCategoryGradient(event.category),
              }}
            />
            {/* Pattern overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{ 
                backgroundImage: getPatternOverlay(),
                backgroundSize: '60px 60px',
              }}
            />
            {/* User-provided cover image or category-based fallback */}
            <img 
              src={event.coverImage || getCategoryImage(event.category, event.id)}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700"
              onLoad={(e) => {
                setImageError(false);
                e.currentTarget.style.opacity = '0.7';
              }}
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>

          {/* Light Rays */}
          <div className="absolute inset-0 opacity-30">
            <LightRays
              raysOrigin="center"
              raysColor="#C3073F"
              raysSpeed={0.3}
              lightSpread={1.2}
              rayLength={1.5}
              pulsating={true}
              fadeDistance={1}
              saturation={0.5}
              followMouse={false}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-end pb-12">
            <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group">
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">Back to Events</span>
                </Link>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Status Badge */}
                  {timing && timing.status === "live" && (
                    <Badge className="px-3 py-1.5 bg-red-500/95 hover:bg-red-500 text-white border-0 animate-pulse flex items-center gap-1.5 font-bold">
                      <Radio className="h-3.5 w-3.5" />
                      LIVE NOW • Ends in {timing.endsIn}
                    </Badge>
                  )}
                  {timing && timing.status === "upcoming" && timing.startsIn && (
                    <Badge className="px-3 py-1.5 bg-blue-500/95 hover:bg-blue-500 text-white border-0 flex items-center gap-1.5 font-semibold">
                      <Play className="h-3.5 w-3.5" />
                      Starts in {timing.startsIn}
                    </Badge>
                  )}
                  {timing && timing.status === "ended" && (
                    <Badge className="px-3 py-1.5 bg-gray-500/95 text-white border-0 font-semibold">
                      Event Ended
                    </Badge>
                  )}
                  
                  <Badge variant="default" className="px-3 py-1 bg-accent/90 hover:bg-accent text-accent-foreground border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {event.category}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`px-3 py-1 border-0 ${
                      event.price === "Free"
                        ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                    }`}
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    {event.price === "Paid" && event.priceAmount ? event.priceAmount : event.price}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={`px-3 py-1 border-0 ${
                      event.locationType === "Online"
                        ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                        : event.locationType === "Hybrid"
                        ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                        : "bg-glass/60 text-foreground hover:bg-glass"
                    }`}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {event.locationType}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl">
                  {event.title}
                </h1>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mt-6 text-sm">
                  <motion.div 
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-accent text-accent' : ''}`} />
                    <span>{likesCount.toLocaleString()} likes</span>
                  </motion.div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{event.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{event.organizer}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <main className="pb-20 -mt-8 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Event Timing Card */}
            {timing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`glass-card p-6 mb-6 border-2 ${
                  timing.status === "live" 
                    ? "border-red-500/50 bg-red-500/5" 
                    : timing.status === "upcoming"
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-gray-500/30"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${
                      timing.status === "live" 
                        ? "bg-red-500/20" 
                        : timing.status === "upcoming"
                        ? "bg-blue-500/20"
                        : "bg-gray-500/20"
                    }`}>
                      <Clock className={`h-6 w-6 ${
                        timing.status === "live" 
                          ? "text-red-400" 
                          : timing.status === "upcoming"
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {timing.status === "live" && "Event is Live Now!"}
                        {timing.status === "upcoming" && "Upcoming Event"}
                        {timing.status === "ended" && "Event Has Ended"}
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <span className="font-medium">Starts:</span> {formatEventTime(timing.startTime)}
                        </p>
                        <p>
                          <span className="font-medium">Ends:</span> {formatEventTime(timing.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {timing.status === "live" && timing.endsIn && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400 animate-pulse">
                        {timing.endsIn}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        until event ends
                      </div>
                    </div>
                  )}
                  
                  {timing.status === "upcoming" && timing.startsIn && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">
                        {timing.startsIn}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        until event starts
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Analytics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 mb-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-3">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{event.views > 10000 ? 'High' : event.views > 5000 ? 'Medium' : 'Growing'}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Interest Level</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 mb-3">
                    <Award className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {event.price === "Free" ? "Free Entry" : event.priceAmount}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Ticket Price</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-3">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{getDaysUntilEvent()}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Days Away</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 mb-3">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">4.8</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Rating</div>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Description Card */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    About This Event
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {event.description}
                  </p>
                </div>

                {/* Topics Card */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Tag className="h-6 w-6 text-accent" />
                    Topics & Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="rounded-xl border border-glass-border/50 bg-glass/40 px-4 py-2 text-sm text-foreground hover:bg-glass/60 hover:border-accent/30 transition-all cursor-default"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Star className="h-6 w-6 text-accent" />
                    Why Attend
                  </h2>
                  <div className="space-y-4">
                    {[
                      { icon: Users, title: "Network with Industry Leaders", desc: "Connect with founders, investors, and fellow innovators" },
                      { icon: TrendingUp, title: "Learn Growth Strategies", desc: "Gain insights from successful entrepreneurs" },
                      { icon: Zap, title: "Discover Opportunities", desc: "Find partners, investors, and team members" },
                      { icon: Award, title: "Exclusive Access", desc: "VIP networking sessions and mentorship opportunities" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex gap-4 p-4 rounded-xl bg-glass/30 hover:bg-glass/50 transition-all group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <item.icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Event Timeline */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-accent" />
                    Event Schedule
                  </h2>
                  <div className="space-y-4">
                    {[
                      { time: event.startTime, title: "Registration & Networking", type: "start" },
                      { time: "10:00", title: "Keynote Presentations", type: "mid" },
                      { time: "13:00", title: "Lunch & Networking Break", type: "mid" },
                      { time: "15:00", title: "Panel Discussions", type: "mid" },
                      { time: event.endTime, title: "Closing & After Party", type: "end" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="flex gap-4 relative"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${item.type === 'start' ? 'bg-green-500' : item.type === 'end' ? 'bg-accent' : 'bg-blue-500'} ring-4 ring-glass`} />
                          {index < 4 && <div className="w-0.5 h-full bg-glass-border/50 mt-2" />}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="text-sm text-accent font-semibold">{item.time} {event.timezone}</div>
                          <div className="text-foreground font-medium mt-1">{item.title}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Organizer Card */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                    Organized By
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-2xl font-bold text-accent-foreground shadow-glow flex-shrink-0">
                      {event.organizer.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-xl font-semibold text-foreground">{event.organizer}</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">Event Organizer</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span>4.8 Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>50+ Events</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Similar Events */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent" />
                    Similar Events
                  </h2>
                  <div className="space-y-4">
                    {getSimilarEvents().map((similarEvent: Event, index: number) => (
                      <motion.div
                        key={similarEvent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      >
                        <Link
                          to={`/event/${similarEvent.id}`}
                          className="block group"
                        >
                          <div className="flex gap-4 p-4 rounded-xl bg-glass/30 hover:bg-glass/60 transition-all border border-transparent hover:border-accent/30">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              {/* Fast-loading gradient background */}
                              <div 
                                className="absolute inset-0"
                                style={{ 
                                  background: getCategoryGradient(similarEvent.category),
                                }}
                              />
                              {/* User-provided cover image or category-based fallback */}
                              <img 
                                src={similarEvent.coverImage || getCategoryImage(similarEvent.category, similarEvent.id)}
                                alt={similarEvent.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
                                loading="lazy"
                                onLoad={(e) => {
                                  e.currentTarget.style.opacity = '0.8';
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                                {similarEvent.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {new Date(similarEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="line-clamp-1">{similarEvent.city || similarEvent.locationType}</span>
                              </div>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Event Details Card */}
                <div className="glass-card p-6 sticky top-24">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">Event Details</h3>
                  
                  <div className="space-y-5">
                    {/* Date */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                        <p className="text-sm text-foreground font-medium">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <Separator className="bg-glass-border/50" />

                    {/* Time */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time</p>
                        <p className="text-sm text-foreground font-medium">
                          {event.startTime} - {event.endTime}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{event.timezone}</p>
                      </div>
                    </div>

                    <Separator className="bg-glass-border/50" />

                    {/* Location */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                        {event.locationType === "Online" ? (
                          <p className="text-sm text-foreground font-medium">Virtual Event</p>
                        ) : (
                          <>
                            <p className="text-sm text-foreground font-medium">{event.venue}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {event.city}, {event.country}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-3">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full gap-2 shadow-glow"
                      onClick={handleRegister}
                    >
                      Register Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="glass" 
                        size="lg" 
                        className="gap-2"
                        onClick={handleBookmark}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-accent text-accent' : ''}`} />
                        Save
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="glass" size="lg" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
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

                  {/* Engagement Stats */}
                  <div className="mt-6 pt-6 border-t border-glass-border/50">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="text-foreground font-semibold">{event.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Registered</span>
                        <span className="text-foreground font-semibold">{Math.floor(event.views * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="text-accent font-semibold">High</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Capacity</span>
                        <span>70%</span>
                      </div>
                      <div className="h-2 bg-glass rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-accent to-accent/60"
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
      </div>
    </ClickSpark>
  );
};

export default EventDetail;
