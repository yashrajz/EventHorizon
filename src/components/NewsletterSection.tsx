import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Mail, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export const NewsletterSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card relative overflow-hidden p-8 sm:p-12 lg:p-16"
        >
          {/* Background Decoration */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.15}
                baseRotation={2}
                blurStrength={3}
                containerClassName="!my-0"
                textClassName="!text-3xl sm:!text-4xl font-display font-bold text-foreground"
              >
                Weekly Startup Events Digest
              </ScrollReveal>
              <p className="mt-4 text-muted-foreground">
                Get the best upcoming events delivered to your inbox every
                Monday. Curated for founders, by founders.
              </p>
              
              <ul className="mt-6 space-y-3">
                {[
                  "Top events matched to your interests",
                  "Exclusive early access to registrations",
                  "No spam, unsubscribe anytime",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pl-8">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <Button variant="hero" size="lg" className="mt-4 w-full gap-2">
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Join 12,000+ founders already subscribed
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
