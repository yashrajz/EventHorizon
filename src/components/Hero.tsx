import { motion } from "framer-motion";
import { Search, MapPin, Calendar, ArrowRight, Plus, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LocationCombobox } from "./ui/location-combobox";
import { DateCombobox } from "./ui/date-combobox";
import LightRays from "./LightRays";
import { Ripple } from "./ui/ripple";
import { AnimatedText } from "./AnimatedText";
import { InfiniteScroll } from "./InfiniteScroll";
import { useSearch } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";

export const Hero = () => {
  const { filters, updateFilter } = useSearch();
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const scrollToEvents = () => {
    document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Handle CTA clicks - check authentication before navigation
   * If not authenticated, redirect to login with return path
   */
  const handleCreateEvent = () => {
    if (isAuthenticated) {
      navigate("/submit-event");
    } else {
      navigate("/login", { state: { from: "/submit-event" } });
    }
  };

  const handleManageConference = () => {
    if (isAuthenticated && hasRole(["attendant"])) {
      navigate("/attendant");
    } else {
      navigate("/login", { state: { from: "/attendant" } });
    }
  };

  const handleAdminDashboard = () => {
    if (isAuthenticated && hasRole(["admin", "superadmin"])) {
      navigate("/admin");
    } else {
      navigate("/login", { state: { from: "/admin" } });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      {/* Light Rays Background */}
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={1.5}
          rayLength={2}
          pulsating={true}
          fadeDistance={1.2}
          saturation={0.3}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Ripple mainCircleSize={250} mainCircleOpacity={0.6} numCircles={8} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass/40 px-4 py-2 backdrop-blur-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">
              Discover 500+ startup events worldwide
            </span>
          </motion.div>

          {/* Headline */}
          <AnimatedText
            text="Where Founders Find Their Next Big Opportunity"
            className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            delay={0.1}
          />

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            The curated directory of accelerators, demo days, hackathons, and
            startup meetups. Never miss an event that could change your
            trajectory.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              variant="default"
              className="gap-2"
              onClick={handleCreateEvent}
            >
              <Plus className="h-5 w-5" />
              Create Event
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2"
              onClick={handleManageConference}
            >
              <Users className="h-5 w-5" />
              Manage Conference
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              className="gap-2"
              onClick={handleAdminDashboard}
            >
              <Settings className="h-5 w-5" />
              Admin Dashboard
            </Button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="glass-card p-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                {/* Search Input */}
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-background/50 px-4 py-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search events, organizers, or topics..."
                    value={filters.query}
                    onChange={(e) => updateFilter("query", e.target.value)}
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3 md:w-64">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <LocationCombobox 
                    value={filters.location}
                    onChange={(value) => updateFilter("location", value)}
                  />
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3 md:w-64">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <DateCombobox 
                    value={filters.dateRange}
                    onChange={(value) => updateFilter("dateRange", value)}
                  />
                </div>

                {/* Search Button */}
                <Button variant="hero" size="lg" className="gap-2" onClick={scrollToEvents}>
                  Search
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Tags - Replaced with Infinite Scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <InfiniteScroll
              items={["Demo Day", "Hackathon", "AI Events", "Web3 Summit", "Free Events", "Accelerators", "Pitch Competition", "Networking", "Startup Meetups", "Product Launch"]}
              direction="left"
              speed={30}
            />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { value: "500+", label: "Events Listed" },
            { value: "50+", label: "Cities" },
            { value: "200+", label: "Organizers" },
            { value: "25K+", label: "Founders" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card p-6 text-center"
            >
              <div className="font-display text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
