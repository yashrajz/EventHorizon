import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

import { useEffect } from "react";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Cookie Policy"
        description="Learn about how EventHorizon uses cookies and similar technologies."
        url={`${window.location.origin}/cookies`}
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
                <Cookie className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight mb-4">
                Cookie Policy
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
                <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a 
                  website. They are widely used to make websites work more efficiently and provide information to 
                  website owners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  EventHorizon uses cookies to improve your experience on our website. We use cookies for the 
                  following purposes:
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies are necessary for the website to function and cannot be switched off. They are 
                      usually only set in response to actions made by you such as setting your privacy preferences, 
                      logging in, or filling in forms.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Performance Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies allow us to count visits and traffic sources so we can measure and improve the 
                      performance of our site. They help us know which pages are most and least popular and see how 
                      visitors move around the site.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Functionality Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies enable the website to provide enhanced functionality and personalization. They may 
                      be set by us or by third-party providers whose services we have added to our pages.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Targeting/Advertising Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies may be set through our site by our advertising partners. They may be used to build 
                      a profile of your interests and show you relevant ads on other sites.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">Cookie Name</th>
                          <th className="text-left py-3 px-4">Purpose</th>
                          <th className="text-left py-3 px-4">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">_session</td>
                          <td className="py-3 px-4">Maintains user session</td>
                          <td className="py-3 px-4">Session</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">_auth_token</td>
                          <td className="py-3 px-4">Authentication</td>
                          <td className="py-3 px-4">30 days</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">_analytics</td>
                          <td className="py-3 px-4">Track page views</td>
                          <td className="py-3 px-4">2 years</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">_preferences</td>
                          <td className="py-3 px-4">Store user preferences</td>
                          <td className="py-3 px-4">1 year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In addition to our own cookies, we may also use various third-party cookies to report usage 
                  statistics, deliver advertisements, and so on. These include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                  <li><strong>Google Analytics:</strong> For website analytics</li>
                  <li><strong>Social Media Plugins:</strong> For social sharing functionality</li>
                  <li><strong>Advertising Networks:</strong> For targeted advertising</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Managing Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can control and manage cookies in various ways. Please note that removing or blocking cookies 
                  can impact your user experience and parts of our website may no longer be fully accessible.
                </p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Browser Settings</h3>
                    <p>
                      Most browsers allow you to refuse or accept cookies. You can usually find these settings in 
                      the "Options" or "Preferences" menu of your browser.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Cookie Preference Center</h3>
                    <p>
                      You can manage your cookie preferences through our Cookie Preference Center, accessible via 
                      the banner that appears when you first visit our website.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Do Not Track</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you visit that 
                  you do not want to have your online activity tracked. We currently do not respond to DNT signals.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update our Cookie Policy from time to time. We will notify you of any changes by posting 
                  the new Cookie Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies, please contact us at:
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
      </div>
    </>
  );
};

export default Cookies;
