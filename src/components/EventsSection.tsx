import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { categories, matchesQuery, isInDateRange, type Event } from "@/data/events";
import { EventCard } from "./EventCard";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useSearch } from "@/contexts/SearchContext";
import { DateCombobox } from "./ui/date-combobox";
import { LocationCombobox } from "./ui/location-combobox";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { AdminEvent } from "@/types/admin";

// Convert AdminEvent to Event format for display
const mapAdminEventToEvent = (adminEvent: AdminEvent): Event => {
  const hasFreeTicket = adminEvent.ticketTypes.some(t => t.type === "free");
  const paidTicket = adminEvent.ticketTypes.find(t => t.type === "paid" || t.type === "vip");
  
  // Map location type
  let locationType: "IRL" | "Online" | "Hybrid";
  if (adminEvent.locationType === "offline") {
    locationType = "IRL";
  } else if (adminEvent.locationType === "online") {
    locationType = "Online";
  } else {
    locationType = "Hybrid";
  }
  
  return {
    id: adminEvent.id,
    title: adminEvent.title,
    description: adminEvent.description,
    date: adminEvent.date,
    startTime: adminEvent.startTime,
    endTime: adminEvent.endTime,
    timezone: adminEvent.timezone,
    locationType,
    venue: adminEvent.venue,
    city: adminEvent.city,
    country: adminEvent.country,
    tags: adminEvent.tags,
    organizer: adminEvent.organizer,
    eventUrl: adminEvent.registrationUrl || "#",
    registrationUrl: adminEvent.registrationUrl || "#",
    coverImage: adminEvent.bannerImage,
    views: adminEvent.views || 0,
    price: hasFreeTicket ? "Free" : "Paid",
    priceAmount: paidTicket ? `₹${paidTicket.price}` : undefined,
    category: adminEvent.category,
  };
};

export const EventsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const { filters, updateFilter, resetFilters } = useSearch();
  const { events: adminEvents } = useAdminData();

  const filteredEvents = useMemo(() => {
    // Only show published events on the homepage
    const publishedEvents = adminEvents
      .filter(event => event.status === "published")
      .map(mapAdminEventToEvent);
    
    return publishedEvents.filter((event) => {
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
  }, [activeCategory, filters, adminEvents]);

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
              Hand-picked events for founders, investors, and builders
            </p>
          </div>

          <Button
            variant="glass"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 self-start md:self-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.slice(0, visibleCount).map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredEvents.length && (
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
