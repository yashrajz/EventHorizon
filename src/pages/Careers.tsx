import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { useEffect, useState, useRef } from "react";

const Careers = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyClick = (jobTitle: string) => {
    setSelectedPosition(jobTitle);
    setShowApplicationForm(true);
    // Scroll to form after a brief delay to ensure it's rendered
    setTimeout(() => {
      if (formRef.current) {
        const offsetTop = formRef.current.offsetTop - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 300);
  };

  const openings = [
    {
      id: 1,
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Build and scale our event discovery platform used by thousands of founders worldwide.",
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design delightful experiences that connect founders with opportunities.",
    },
    {
      id: 3,
      title: "Community Manager",
      department: "Community",
      location: "Hybrid",
      type: "Full-time",
      description: "Build and engage our community of founders, investors, and event organizers.",
    },
    {
      id: 4,
      title: "Marketing Lead",
      department: "Marketing",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Drive growth and brand awareness across multiple channels.",
    },
  ];

  const values = [
    {
      title: "Mission-Driven",
      description: "We're building a platform that helps founders discover opportunities that can change their trajectory.",
    },
    {
      title: "User-First",
      description: "Every decision we make puts our users—founders, organizers, and investors—at the center.",
    },
    {
      title: "Move Fast",
      description: "We ship quickly, iterate often, and learn from our mistakes.",
    },
    {
      title: "Own It",
      description: "We take ownership of our work and empower everyone to make impactful decisions.",
    },
  ];

  return (
    <>
      <SEO 
        title="Careers"
        description="Join EventHorizon and help connect founders with life-changing opportunities."
        url={`${window.location.origin}/careers`}
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
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Join Our Mission
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help us build the go-to platform for startup events. We're looking for talented, 
                passionate people to join our growing team.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Open Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-center mb-8">Open Positions</h2>
              <div className="space-y-4">
                {openings.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="glass-card p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <Badge variant="secondary">{job.department}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="gap-2 self-start md:self-auto"
                        onClick={() => handleApplyClick(job.title)}
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            {!showApplicationForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-16 text-center glass-card p-8"
              >
                <h2 className="text-2xl font-bold mb-4">Don't See a Perfect Fit?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We're always looking for talented people. Send us your resume and tell us why you'd 
                  be a great addition to the EventHorizon team.
                </p>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    setSelectedPosition("");
                    setShowApplicationForm(true);
                    setTimeout(() => {
                      if (formRef.current) {
                        const offsetTop = formRef.current.offsetTop - 100;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                      }
                    }, 300);
                  }}
                >
                  Send Us Your Resume
                </Button>
              </motion.div>
            ) : (
              <div className="mt-16" ref={formRef}>
                <JobApplicationForm selectedPosition={selectedPosition} />
              </div>
            )}
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
        <ScrollToBottomButton />
      </div>
    </>
  );
};

export default Careers;
