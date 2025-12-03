import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass mt-4 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Event<span className="text-accent">Horizon</span>
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-8 md:flex">
              {["Events", "Categories", "Submit Event", "About"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden items-center gap-3 md:flex">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button variant="accent" size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-col gap-4 border-t border-glass-border pt-4 md:hidden"
            >
              {["Events", "Categories", "Submit Event", "About"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-muted-foreground"
                >
                  {item}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  Sign In
                </Button>
                <Button variant="accent" size="sm" className="flex-1">
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
