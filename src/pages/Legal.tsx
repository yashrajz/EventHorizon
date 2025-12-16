import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Scale, FileText, Shield, Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { useEffect } from "react";

const Legal = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const legalPages = [
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Read our terms and conditions for using EventHorizon's platform and services.",
      path: "/terms",
      lastUpdated: "December 16, 2025",
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal information and data.",
      path: "/privacy",
      lastUpdated: "December 16, 2025",
    },
    {
      icon: Cookie,
      title: "Cookie Policy",
      description: "Understand how we use cookies and similar technologies on our website.",
      path: "/cookies",
      lastUpdated: "December 16, 2025",
    },
  ];

  return (
    <>
      <SEO 
        title="Legal Information"
        description="Access EventHorizon's legal documents including terms of service, privacy policy, and cookie policy."
        url={`${window.location.origin}/legal`}
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
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Legal Information
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about EventHorizon's legal policies and your rights
              </p>
            </motion.div>

            {/* Legal Documents */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {legalPages.map((page, index) => (
                <motion.div
                  key={page.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Link to={page.path}>
                    <div className="glass-card p-8 h-full hover:border-primary/50 transition-colors group">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                        <page.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {page.title}
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        {page.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {page.lastUpdated}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Important Information</h2>
              
              <div className="space-y-6 text-muted-foreground">
                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Compliance</h3>
                  <p className="leading-relaxed">
                    EventHorizon is committed to complying with all applicable laws and regulations, including 
                    GDPR, CCPA, and other data protection laws. We regularly review and update our policies to 
                    ensure continued compliance.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Your Rights</h3>
                  <p className="leading-relaxed">
                    You have the right to access, correct, delete, or export your personal data. You can also 
                    object to processing, request restriction of processing, and withdraw consent at any time. 
                    To exercise these rights, please contact us at legal@eventhorizon.com.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Updates to Legal Documents</h3>
                  <p className="leading-relaxed">
                    We may update our legal documents from time to time. When we make significant changes, we 
                    will notify you by email or through a prominent notice on our website. Your continued use 
                    of EventHorizon after such modifications constitutes your acceptance of the updated terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Questions?</h3>
                  <p className="leading-relaxed">
                    If you have any questions about our legal policies or your rights, please don't hesitate 
                    to contact our legal team at:
                    <br />
                    <strong className="text-foreground">Email:</strong> legal@eventhorizon.com
                    <br />
                    <strong className="text-foreground">Address:</strong> EventHorizon, Bangalore, India
                  </p>
                </section>
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

export default Legal;
