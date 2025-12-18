import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Terms of Service"
        description="Read EventHorizon's terms and conditions for using our platform."
        url={`${window.location.origin}/terms`}
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
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight mb-4">
                Terms of Service
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
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using EventHorizon ("the Service"), you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to these terms, please do not use 
                  the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>Permission is granted to temporarily access the materials on EventHorizon for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
                  and under this license you may not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>Attempt to decompile or reverse engineer any software</li>
                    <li>Remove any copyright or proprietary notations</li>
                    <li>Transfer the materials to another person</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>When you create an account with us, you must provide accurate and complete information. 
                  You are responsible for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Maintaining the security of your account and password</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Event Submissions</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>When submitting events to EventHorizon:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You guarantee that you have the right to submit the event information</li>
                    <li>The information provided is accurate and not misleading</li>
                    <li>The event complies with all applicable laws and regulations</li>
                    <li>We reserve the right to reject or remove any event listing</li>
                    <li>We are not responsible for the accuracy of event details</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service and its original content, features, and functionality are owned by EventHorizon and 
                  are protected by international copyright, trademark, patent, trade secret, and other intellectual 
                  property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. User Content</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By posting content on EventHorizon, you grant us a non-exclusive, worldwide, royalty-free license 
                  to use, reproduce, modify, and display such content in connection with operating and promoting 
                  the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Prohibited Activities</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>You may not access or use the Service for any purpose other than that for which we make 
                  the Service available. Prohibited activities include:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violating any applicable laws or regulations</li>
                    <li>Infringing on intellectual property rights</li>
                    <li>Transmitting spam or unsolicited messages</li>
                    <li>Introducing viruses or malicious code</li>
                    <li>Attempting to bypass security features</li>
                    <li>Impersonating another user or entity</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials on EventHorizon are provided on an 'as is' basis. EventHorizon makes no warranties, 
                  expressed or implied, and hereby disclaims all warranties including, without limitation, implied 
                  warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Limitations of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall EventHorizon or its suppliers be liable for any damages arising out of the use 
                  or inability to use the materials on EventHorizon, even if EventHorizon has been notified of the 
                  possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior 
                  notice, for any reason, including breach of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any changes by 
                  posting the new Terms of Service on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                  <br />
                  <strong className="text-foreground">Email:</strong> legal@eventhorizon.com
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

export default Terms;
