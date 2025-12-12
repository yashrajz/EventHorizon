import { motion } from "framer-motion";
import { Sparkles, Users, TrendingUp, Shield } from "lucide-react";

export const BentoGrid = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Curated Events",
      description: "Hand-picked startup events from trusted organizers worldwide",
      className: "md:col-span-2 md:row-span-2",
      gradient: "from-cerulean/20 to-steel-blue/20",
    },
    {
      icon: Users,
      title: "25K+ Founders",
      description: "Join a thriving community",
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-air-force-blue/20 to-sky-blue/20",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Connect with investors and mentors",
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-yale-blue/20 to-rich-cerulean/20",
    },
    {
      icon: Shield,
      title: "Verified Organizers",
      description: "All events from trusted sources with quality guarantees",
      className: "md:col-span-2 md:row-span-1",
      gradient: "from-deep-space-blue/20 to-yale-blue-light/20",
    },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Why Choose EventHorizon
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            The platform built for founders, by founders
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`group relative glass-card p-8 overflow-hidden ${feature.className}`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <feature.icon className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
