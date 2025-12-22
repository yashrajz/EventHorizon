import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { categories, matchesQuery, isInDateRange, type Event } from "@/data/events";
import { EventCard } from "./EventCard";
import { Button } from "./ui/button";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useSearch } from "@/contexts/SearchContext";
import { DateCombobox } from "./ui/date-combobox";
import { LocationCombobox } from "./ui/location-combobox";
import { LoadingSpinner } from "./LoadingSpinner";
import { getEventsAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { filterActiveEvents } from "@/lib/eventTiming";
import { eventService } from "@/services/eventService";

export const EventsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters, updateFilter, resetFilters } = useSearch();

  // Fetch events from both MongoDB API and external APIs
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Fetching events from both MongoDB and external APIs...');
      
      // Fetch from both sources simultaneously
      const [mongoEvents, externalEvents] = await Promise.all([
        // MongoDB events (user submitted, admin approved)
        eventService.getEvents().catch(error => {
          console.warn('MongoDB API failed:', error);
          return [];
        }),
        // External API events
        (async () => {
          try {
            const api = getEventsAPI();
            return await api.fetchEvents({
              query: filters.query,
              location: filters.location !== "All Locations" ? filters.location : undefined,
              category: activeCategory !== "All" ? activeCategory : undefined,
              limit: 50,
            });
          } catch (error) {
            console.warn('External API failed:', error);
            return [];
          }
        })()
      ]);

      // Combine events from both sources
      const allEvents = [...mongoEvents, ...externalEvents];
      console.log('✅ Combined events:', mongoEvents.length, 'from MongoDB +', externalEvents.length, 'from external APIs =', allEvents.length, 'total');
      
      setEvents(allEvents);
    } catch (error) {
      console.error('❌ Failed to fetch events:', error);
      toast({
        title: "Error loading events",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      });
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch on filter changes
  useEffect(() => {
    fetchEvents();
  }, [activeCategory, filters.query, filters.location]);

  const filteredEvents = useMemo(() => {
    // First filter out auto-removed events (ended more than 3 hours ago)
    const activeEvents = filterActiveEvents(events);
    
    return activeEvents.filter((event) => {
      // Category filter
      if (activeCategory !== "All" && event.category !== activeCategory) {
        return false;
      }

      // Search query filter - using helper function
      if (filters.query && !matchesQuery(event, filters.query)) {
        return false;
      }

      // Location filter
      if (filters.location !== "All Locations") {
        if (filters.location === "Online") {
          if (event.locationType !== "Online" && event.locationType !== "Hybrid") return false;
        } else {
          if (event.city !== filters.location) return false;
        }
      }

      // Date range filter - using helper function
      if (!isInDateRange(event.date, filters.dateRange)) {
        return false;
      }

      // Price filter
      if (filters.price !== "All Prices") {
        if (filters.price === "Free Only" && event.price !== "Free") return false;
        if (filters.price === "Paid Only" && event.price !== "Paid") return false;
      }

      // Format filter
      if (filters.format !== "All Formats") {
        if (filters.format === "In-Person" && event.locationType !== "IRL") return false;
        if (filters.format === "Online" && event.locationType !== "Online") return false;
        if (filters.format === "Hybrid" && event.locationType !== "Hybrid") return false;
      }

      return true;
    });
  }, [events, filters, activeCategory]);

  return (
    <section id="events-section" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <ScrollReveal
              enableBlur={true}
              baseOpacity={0.15}
              baseRotation={2}
              blurStrength={3}
              containerClassName="!my-0"
              textClassName="!text-3xl sm:!text-4xl font-display font-bold text-foreground"
            >
              Upcoming Events
            </ScrollReveal>
            <p className="mt-2 text-muted-foreground">
              {isLoading ? 'Loading events...' : `${filteredEvents.length} events found`}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="glass"
              onClick={fetchEvents}
              className="gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="glass"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-accent text-accent-foreground shadow-glow"
                  : "glass-button text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 glass-card p-6"
          >
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Date Range
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-glass-border bg-glass/50 px-4 py-2.5">
                  <DateCombobox
                    value={filters.dateRange}
                    onChange={(value) => updateFilter("dateRange", value)}
                  />
                </div>
               </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Location
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-glass-border bg-glass/50 px-4 py-2.5">
                  <LocationCombobox
                    value={filters.location}
                    onChange={(value) => updateFilter("location", value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Price
                </label>
                <select 
                  className="w-full rounded-xl border border-glass-border bg-glass/50 px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  value={filters.price}
                  onChange={(e) => updateFilter("price", e.target.value)}
                >
                  <option>All Prices</option>
                  <option>Free Only</option>
                  <option>Paid Only</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Format
                </label>
                <select 
                  className="w-full rounded-xl border border-glass-border bg-glass/50 px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  value={filters.format}
                  onChange={(e) => updateFilter("format", e.target.value)}
                >
                  <option>All Formats</option>
                  <option>In-Person</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { resetFilters(); setShowFilters(false); }}>
                Clear All
              </Button>
              <Button variant="accent" onClick={() => setShowFilters(false)}>Apply Filters</Button>
            </div>
          </motion.div>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <div className="mt-10 flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center py-20"
          >
            <p className="text-2xl font-display font-semibold text-foreground mb-2">
              No events found
            </p>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query
            </p>
            <Button variant="accent" onClick={() => { resetFilters(); setActiveCategory("All"); }}>
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.slice(0, visibleCount).map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && visibleCount < filteredEvents.length && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button 
              variant="glass" 
              size="lg"
              onClick={() => setVisibleCount(prev => prev + 6)}
            >
              Load More Events ({filteredEvents.length - visibleCount} remaining)
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
