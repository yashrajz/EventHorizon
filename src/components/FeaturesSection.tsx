import { motion } from "framer-motion";
import { Zap, Globe, Bell, CalendarCheck, Users, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Discover events from 50+ cities worldwide, from Silicon Valley to Singapore.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Get notified instantly when new events match your interests.",
  },
  {
    icon: CalendarCheck,
    title: "Calendar Sync",
    description: "Seamlessly add events to Google, Apple, or Outlook calendar.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss an event with personalized email and push notifications.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Events curated and verified by founders and organizers.",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Personalized event suggestions based on your startup journey.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <ScrollReveal
            enableBlur={true}
            baseOpacity={0.15}
            baseRotation={2}
            blurStrength={3}
            containerClassName="!my-0"
            textClassName="!text-3xl sm:!text-4xl font-display font-bold text-foreground"
          >
            Built for the Startup Ecosystem
          </ScrollReveal>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything you need to stay connected with the startup world
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 group"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
