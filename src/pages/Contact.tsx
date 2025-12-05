import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ClickSpark from "@/components/ClickSpark";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    content: "hello@eventhorizon.com",
    description: "We'll respond within 24 hours"
  },
  {
    icon: MapPin,
    title: "Office",
    content: "Bangalore, India",
    description: "Remote-first team"
  },
  {
    icon: MessageSquare,
    title: "Support",
    content: "Live Chat",
    description: "Available Mon-Fri, 9AM-6PM IST"
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ClickSpark 
      sparkColor="#6b7280" 
      sparkSize={12} 
      sparkRadius={20} 
      sparkCount={10} 
      duration={500}
    >
      <SEO 
        title="Contact Us"
        description="Get in touch with the EventHorizon team. Whether you have questions, want to submit an event, or need support, we'd love to hear from you."
        url={`${window.location.origin}/contact`}
      />
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-32 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Get in <span className="text-accent">Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Have questions? Want to submit an event? We'd love to hear from you.
              </p>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-3">
              {/* Contact Info Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent flex-shrink-0">
                        <info.icon className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold mb-1">{info.title}</h3>
                        <p className="text-foreground font-medium mb-1">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <a href="/" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                      Browse Events
                    </a>
                    <a href="/about" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                      About Us
                    </a>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                      Submit an Event
                    </a>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                      FAQs
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="glass rounded-3xl p-8 sm:p-12">
                  <h2 className="font-display text-3xl font-bold mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-muted/50 border-glass-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-muted/50 border-glass-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-muted/50 border-glass-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="bg-muted/50 border-glass-border resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ClickSpark>
  );
};

export default Contact;
