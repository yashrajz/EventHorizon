import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { mockEvents, categories } from "@/data/events";
import { EventCard } from "./EventCard";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useSearch } from "@/contexts/SearchContext";
import { DateCombobox } from "./ui/date-combobox";

export const EventsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter } = useSearch();

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      // Category filter
      if (activeCategory !== "All" && event.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDescription = event.description.toLowerCase().includes(query);
        const matchesOrganizer = event.organizer.toLowerCase().includes(query);
        const matchesTags = event.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesOrganizer && !matchesTags) {
          return false;
        }
      }

      // Location filter
      if (filters.location !== "All Locations") {
        if (filters.location === "Online") {
          if (event.locationType !== "Online") return false;
        } else {
          if (event.city !== filters.location) return false;
        }
      }

      return true;
    });
  }, [activeCategory, filters]);

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
                <div className="w-full rounded-xl border border-glass-border bg-glass/50 px-4 py-2">
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
                <select className="w-full rounded-xl border border-glass-border bg-glass/50 px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>All Locations</option>
                  <option>San Francisco</option>
                  <option>New York</option>
                  <option>London</option>
                  <option>Online Only</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Price
                </label>
                <select className="w-full rounded-xl border border-glass-border bg-glass/50 px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>All Prices</option>
                  <option>Free Only</option>
                  <option>Paid Only</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Format
                </label>
                <select className="w-full rounded-xl border border-glass-border bg-glass/50 px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>All Formats</option>
                  <option>In-Person</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowFilters(false)}>
                Clear All
              </Button>
              <Button variant="accent">Apply Filters</Button>
            </div>
          </motion.div>
        )}

        {/* Events Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button variant="glass" size="lg">
            Load More Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
