import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

import { useEffect } from "react";

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "How to Find the Best Startup Events for Your Stage",
      excerpt: "Navigate the world of startup events with our comprehensive guide. Learn which events are worth your time and money.",
      author: "Sarah Johnson",
      date: "December 10, 2025",
      readTime: "5 min read",
      category: "Guides",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Top 10 Networking Tips for Startup Founders",
      excerpt: "Master the art of networking at events. Build meaningful connections that can transform your startup journey.",
      author: "Michael Chen",
      date: "December 8, 2025",
      readTime: "7 min read",
      category: "Networking",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      title: "The Rise of Virtual Startup Events in 2025",
      excerpt: "Explore how virtual events are reshaping the startup ecosystem and creating global opportunities.",
      author: "Emily Davis",
      date: "December 5, 2025",
      readTime: "6 min read",
      category: "Trends",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Pitching at Demo Days: A Complete Guide",
      excerpt: "Everything you need to know about preparing and delivering a winning pitch at startup demo days.",
      author: "David Park",
      date: "December 3, 2025",
      readTime: "10 min read",
      category: "Pitching",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop",
    },
    {
      id: 5,
      title: "Building Community: Event Organizer Best Practices",
      excerpt: "Learn from successful event organizers on how to create engaging, valuable experiences for attendees.",
      author: "Lisa Anderson",
      date: "December 1, 2025",
      readTime: "8 min read",
      category: "Events",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop",
    },
    {
      id: 6,
      title: "Funding Your Startup: Events That Connect You with Investors",
      excerpt: "Discover the best investor events and learn how to make the most of these opportunities.",
      author: "Robert Taylor",
      date: "November 28, 2025",
      readTime: "9 min read",
      category: "Funding",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop",
    },
  ];

  const categories = ["All", "Guides", "Networking", "Trends", "Pitching", "Events", "Funding"];

  return (
    <>
      <SEO 
        title="Blog"
        description="Stay updated with the latest insights, tips, and trends in the startup event ecosystem."
        url={`${window.location.origin}/blog`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                EventHorizon Blog
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Insights, tips, and stories from the startup event ecosystem
              </p>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </motion.div>

            {/* Featured Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <div className="glass-card overflow-hidden group cursor-pointer">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <img
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{blogPosts[0].category}</Badge>
                    <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {blogPosts[0].date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                    <Button className="w-fit gap-2">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="glass-card overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center mt-12"
            >
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Blog;
