import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { 
  Users, MessageCircle, Rocket, Megaphone, Award, BookOpen, 
  Send, MapPin, FileText, Star, Mail, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { useEffect, useState } from "react";

const Community = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const discussionCategories = [
    { icon: Rocket, name: "Events", description: "Discover and discuss upcoming events", count: "1.2k" },
    { icon: MessageCircle, name: "Pitching", description: "Share pitch feedback and tips", count: "856" },
    { icon: Award, name: "Hackathons", description: "Find teammates and projects", count: "623" },
    { icon: Megaphone, name: "Announcements", description: "Latest updates and news", count: "234" },
  ];

  const cityGroups = [
    { city: "Bangalore", members: "3.4k", link: "#" },
    { city: "San Francisco", members: "2.8k", link: "#" },
    { city: "New York", members: "2.1k", link: "#" },
    { city: "London", members: "1.9k", link: "#" },
    { city: "Berlin", members: "1.5k", link: "#" },
    { city: "Singapore", members: "1.3k", link: "#" },
    { city: "Mumbai", members: "1.1k", link: "#" },
    { city: "Dubai", members: "980", link: "#" },
  ];

  const communityRules = [
    "Be respectful and professional in all interactions",
    "No spam, self-promotion, or unsolicited advertising",
    "Share valuable insights and help others grow",
    "Keep discussions relevant to the startup ecosystem",
    "Respect privacy and confidential information",
  ];

  const resources = [
    { title: "Event Promotion Guide", description: "Best practices for marketing your events" },
    { title: "Founder's Toolkit", description: "Essential tools and resources for founders" },
    { title: "Networking Templates", description: "Email templates for effective outreach" },
    { title: "Pitch Deck Examples", description: "Learn from successful pitch decks" },
  ];

  const highlights = [
    {
      type: "Organizer",
      name: "TechCrunch Disrupt",
      description: "Successfully hosted 5,000+ attendees",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    },
    {
      type: "Event",
      name: "YC Demo Day Watch Party",
      description: "Connected 500+ founders globally",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    },
  ];

  return (
    <>
      <SEO 
        title="Community"
        description="Join EventHorizon's global community of founders, investors, and builders."
        url={`${window.location.origin}/community`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Join Our Community
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with thousands of founders, investors, and builders from around the world. 
                Share experiences, get feedback, and grow together.
              </p>
            </motion.div>

            {/* Join Community Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <Button size="lg" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Join Discord
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Send className="w-5 h-5" />
                Join Slack
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Join WhatsApp
              </Button>
            </motion.div>

            {/* Discussion Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-8">Discussion Categories</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {discussionCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="glass-card p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <category.icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{category.count} posts</Badge>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* City Groups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-8">City-Based Communities</h2>
              <div className="glass-card p-8">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {cityGroups.map((group, index) => (
                    <motion.a
                      key={group.city}
                      href={group.link}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 + index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-glass-border hover:bg-glass/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">{group.city}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{group.members}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Event Organizers Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-8">For Event Organizers</h2>
              <div className="glass-card p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Submit Your Event</h3>
                    <p className="text-muted-foreground mb-4">
                      Share your event with our community of founders and investors. Get more attendees 
                      and connect with the right audience.
                    </p>
                    <Button className="gap-2">
                      <Send className="w-4 h-4" />
                      Submit Event
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Organizer Guidelines</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>Provide accurate and complete event details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>Include clear registration and pricing information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>Update event status promptly if changes occur</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Community Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-8">Community Guidelines</h2>
              <div className="glass-card p-8">
                <ul className="space-y-4">
                  {communityRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-8">Useful Resources</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                    className="glass-card p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Community Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.1 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-8">Community Highlights</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.2 + index * 0.1 }}
                    className="glass-card overflow-hidden group cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={highlight.image}
                        alt={highlight.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-primary" />
                        <Badge variant="secondary">{highlight.type}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{highlight.name}</h3>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
              className="mb-16"
            >
              <div className="glass-card p-8 text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get the latest community updates, featured events, and exclusive insights 
                  delivered to your inbox every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="gap-2">
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.6 }}
              className="text-center glass-card p-8"
            >
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of founders and discover events that can change your startup journey.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Rocket className="w-5 h-5" />
                  Explore Events
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="w-5 h-5" />
                  Join Community
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
        <ScrollToBottomButton />
      </div>
    </>
  );
};

export default Community;
