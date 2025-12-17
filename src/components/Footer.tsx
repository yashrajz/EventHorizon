import { motion } from "framer-motion";
import { Calendar, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { name: "Events", path: "/" },
    { name: "Categories", path: "/" },
    { name: "Submit Event", path: "/submit-event" },
    { name: "Pricing", path: "/" }
  ],
  Company: [
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" }
  ],
  Resources: [
    { name: "Help Center", path: "/help" },
    { name: "API", path: "/" },
    { name: "Partners", path: "/partners" },
    { name: "Community", path: "/community" }
  ],
  Legal: [
    { name: "Privacy", path: "/privacy" },
    { name: "Terms", path: "/terms" },
    { name: "Cookies", path: "/cookies" }
  ]
};

const socialLinks = [
  { Icon: Twitter, url: "https://twitter.com/eventhorizon", label: "Twitter" },
  { Icon: Linkedin, url: "https://linkedin.com/company/eventhorizon", label: "LinkedIn" },
  { Icon: Github, url: "https://github.com/yashrajz/EventHorizon", label: "GitHub" }
];

export const Footer = () => {
  return (
    <footer className="border-t border-glass-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/">
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
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The curated directory for startup events. Connecting founders,
              investors, and builders with opportunities worldwide.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-glass/30 text-muted-foreground transition-colors hover:bg-glass/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-foreground">
                {category}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-glass-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EventHorizon. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care for the startup community
          </p>
        </div>
      </div>
    </footer>
  );
};
