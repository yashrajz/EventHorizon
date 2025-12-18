import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Target, Users, Zap, Globe } from "lucide-react";
import ClickSpark from "@/components/ClickSpark";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

import { useEffect } from "react";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're committed to connecting the global startup community through carefully curated events that matter."
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building a platform where founders, investors, and innovators can discover opportunities to grow together."
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Constantly evolving to bring you the most relevant and impactful startup events across the globe."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "From Bangalore to San Francisco, we showcase the best startup events from every corner of the world."
  }
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ClickSpark 
      sparkColor="#6b7280" 
      sparkSize={12} 
      sparkRadius={20} 
      sparkCount={10} 
      duration={500}
    >
      <SEO 
        title="About Us"
        description="Learn about EventHorizon's mission to connect the global startup community through carefully curated events. Discover our story, values, and commitment to innovation."
        url={`${window.location.origin}/about`}
      />
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-32 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                About <span className="text-accent">EventHorizon</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your gateway to the most impactful startup events worldwide. We curate, you discover.
              </p>
            </motion.div>

            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl p-8 sm:p-12 mb-20"
            >
              <h2 className="font-display text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  EventHorizon was born from a simple frustration: finding quality startup events 
                  shouldn't be scattered across dozens of websites and social media channels.
                </p>
                <p>
                  We built EventHorizon to be the single source of truth for startup events—from 
                  intimate founder meetups in Bangalore to massive tech conferences in San Francisco. 
                  Every event is handpicked and verified to ensure you're spending your time on 
                  opportunities that truly matter.
                </p>
                <p>
                  Whether you're a first-time founder looking for mentorship, an investor seeking the 
                  next big thing, or a developer wanting to connect with like-minded builders, 
                  EventHorizon is your compass in the startup ecosystem.
                </p>
              </div>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="font-display text-3xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass rounded-2xl p-6 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-accent mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-20 text-center"
            >
              <div className="glass rounded-3xl p-12">
                <h2 className="font-display text-3xl font-bold mb-4">Join the Community</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Ready to discover your next opportunity? Explore our curated events and connect with 
                  thousands of founders, investors, and innovators.
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:scale-105"
                >
                  Explore Events
                </a>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
      </div>
    </ClickSpark>
  );
};

export default About;
