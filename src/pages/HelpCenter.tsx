import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { HelpCircle, Search, MessageCircle, Mail, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

import { useState, useEffect } from "react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using EventHorizon",
      articles: [
        "How to create an account",
        "Finding events in your city",
        "Submitting your first event",
        "Understanding event categories",
      ],
    },
    {
      icon: MessageCircle,
      title: "Event Organizers",
      description: "Resources for event hosts",
      articles: [
        "How to submit an event",
        "Event approval process",
        "Editing your event listing",
        "Promoting your event",
      ],
    },
    {
      icon: HelpCircle,
      title: "Account & Billing",
      description: "Manage your account settings",
      articles: [
        "Updating your profile",
        "Changing your password",
        "Email preferences",
        "Deleting your account",
      ],
    },
    {
      icon: Mail,
      title: "Contact Support",
      description: "Get in touch with our team",
      articles: [
        "Email support",
        "Report a problem",
        "Feature requests",
        "Partnership inquiries",
      ],
    },
  ];

  const faqs = [
    {
      question: "Is EventHorizon free to use?",
      answer: "Yes! EventHorizon is completely free for attendees. Event organizers can submit events for review at no cost.",
    },
    {
      question: "How long does event approval take?",
      answer: "Most events are reviewed within 24-48 hours. We'll send you an email once your event is approved and published.",
    },
    {
      question: "Can I edit my event after submission?",
      answer: "Yes, you can edit your event anytime from your dashboard. Changes to published events are reviewed before going live.",
    },
    {
      question: "How do I cancel an event?",
      answer: "Log into your account, go to your events, and select 'Cancel Event'. We recommend updating the listing with cancellation details.",
    },
    {
      question: "Can I promote my event on EventHorizon?",
      answer: "We offer various promotion options including featured listings and newsletter placements. Contact us for more details.",
    },
  ];

  return (
    <>
      <SEO 
        title="Help Center"
        description="Get help with EventHorizon. Find answers to common questions and contact our support team."
        url={`${window.location.origin}/help`}
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
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                How can we help?
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Search our help center or browse categories below
              </p>

              {/* Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="glass-card p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <category.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {category.description}
                        </p>
                        <ul className="space-y-2">
                          {category.articles.map((article) => (
                            <li key={article}>
                              <a
                                href="#"
                                className="text-sm text-primary hover:underline"
                              >
                                {article}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center glass-card p-8"
            >
              <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button size="lg" className="gap-2">
                <Mail className="w-4 h-4" />
                Contact Support
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

export default HelpCenter;
