import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Calendar, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const navLinks = [
  { name: "Events", path: "/" },
  { name: "About", path: "/about" },
  { name: "Submit Event", path: "/submit-event" },
  { name: "Contact", path: "/contact" }
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl border border-glass-border/50 bg-glass/40 backdrop-blur-2xl px-6 py-4 shadow-glass">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent">
                  <Calendar className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="font-display text-xl font-bold text-foreground">
                  Event<span className="text-accent">Horizon</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <motion.span
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user.name || user.email}
                    </span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/signin" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Button variant="accent" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
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
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-sm font-medium ${
                    isActive(link.path)
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                {user ? (
                  <div className="w-full">
                    <Link to="/dashboard" className="flex items-center gap-2 mb-3 hover:bg-white/10 rounded-lg px-2 py-2 transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center">
                        <User className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {user.name || user.email}
                      </span>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/signin" className="flex-1" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" className="flex-1" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      <Button variant="accent" size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
