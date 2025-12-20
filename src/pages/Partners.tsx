import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Handshake, Mail, Linkedin, Twitter, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

import { useEffect } from "react";

const Partners = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const partners = [
    {
      name: "John Doe",
      role: "Strategic Partner & Advisor",
      company: "TechVentures Inc.",
      bio: "Serial entrepreneur and investor with over 15 years of experience in the startup ecosystem. John has founded three successful companies and now helps emerging startups scale globally.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      email: "john.doe@techventures.com",
    },
    {
      name: "John Wick",
      role: "Growth Partner & Mentor",
      company: "Continental Ventures",
      bio: "Expert in business development and strategic partnerships. John specializes in connecting startups with the right opportunities and has facilitated over $50M in funding deals.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      linkedin: "https://linkedin.com/in/johnwick",
      twitter: "https://twitter.com/johnwick",
      email: "john.wick@continental.com",
    },
  ];

  const partnerBenefits = [
    {
      title: "Exclusive Access",
      description: "Get early access to premium events and networking opportunities.",
    },
    {
      title: "Brand Visibility",
      description: "Showcase your brand to thousands of founders and investors.",
    },
    {
      title: "Community Impact",
      description: "Help shape the future of the startup ecosystem.",
    },
    {
      title: "Strategic Connections",
      description: "Connect with other partners and industry leaders.",
    },
  ];

  return (
    <>
      <SEO 
        title="Our Partners"
        description="Meet EventHorizon's strategic partners who help us build the best platform for startup events."
        url={`${window.location.origin}/partners`}
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
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Our Partners
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Working together to create meaningful opportunities for the startup community
              </p>
            </motion.div>

            {/* Partners */}
            <div className="space-y-8 mb-16">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="glass-card p-8"
                >
                  <div className="grid md:grid-cols-[200px_1fr] gap-8">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-4">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={partner.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-glass-border hover:bg-glass/50 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href={partner.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-glass-border hover:bg-glass/50 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${partner.email}`}
                          className="p-2 rounded-lg border border-glass-border hover:bg-glass/50 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{partner.name}</h2>
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <Building2 className="w-4 h-4" />
                        <span className="font-semibold">{partner.role}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{partner.company}</p>
                      <p className="text-muted-foreground leading-relaxed">{partner.bio}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Partner Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center mb-8">Partnership Benefits</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {partnerBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-center glass-card p-8"
            >
              <h2 className="text-2xl font-bold mb-4">Become a Partner</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Interested in partnering with EventHorizon? We're always looking for strategic partners 
                who share our vision of connecting the startup community.
              </p>
              <Button size="lg" className="gap-2">
                <Mail className="w-4 h-4" />
                Get in Touch
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

export default Partners;
