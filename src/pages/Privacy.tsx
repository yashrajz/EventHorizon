import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Privacy Policy"
        description="Learn how EventHorizon collects, uses, and protects your personal information."
        url={`${window.location.origin}/privacy`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: December 16, 2025
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 space-y-8"
            >
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to EventHorizon. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit our 
                  website and tell you about your privacy rights and how the law protects you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Identity Data:</strong> first name, last name, username</li>
                    <li><strong>Contact Data:</strong> email address, telephone number</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, time zone, location</li>
                    <li><strong>Profile Data:</strong> your interests, preferences, feedback</li>
                    <li><strong>Usage Data:</strong> how you use our website and services</li>
                    <li><strong>Marketing Data:</strong> your preferences in receiving marketing from us</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We use your personal data for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To register you as a new user</li>
                    <li>To manage event submissions and registrations</li>
                    <li>To provide customer support</li>
                    <li>To send you relevant updates and marketing communications (with consent)</li>
                    <li>To improve our website and services</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We have implemented appropriate security measures to prevent your personal data from being 
                  accidentally lost, used, accessed, altered, or disclosed in an unauthorized way. We limit access 
                  to your personal data to those employees, agents, contractors who have a business need to know.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We will only retain your personal data for as long as necessary to fulfill the purposes we 
                  collected it for, including for satisfying any legal, accounting, or reporting requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Your Legal Rights</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>Under data protection laws, you have rights including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Request access to your personal data</li>
                    <li>Request correction of your personal data</li>
                    <li>Request erasure of your personal data</li>
                    <li>Object to processing of your personal data</li>
                    <li>Request restriction of processing your personal data</li>
                    <li>Request transfer of your personal data</li>
                    <li>Right to withdraw consent</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website uses cookies to distinguish you from other users. This helps us provide you with a 
                  good experience and allows us to improve our site. For detailed information about the cookies we 
                  use, please see our Cookie Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Third-Party Links</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This website may include links to third-party websites, plug-ins and applications. Clicking on 
                  those links may allow third parties to collect or share data about you. We do not control these 
                  third-party websites and are not responsible for their privacy statements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                  <br />
                  <strong className="text-foreground">Email:</strong> privacy@eventhorizon.com
                  <br />
                  <strong className="text-foreground">Address:</strong> EventHorizon, Bangalore, India
                </p>
              </section>
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

export default Privacy;
