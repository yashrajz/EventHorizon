import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { EventsSection } from "@/components/EventsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { BentoGrid } from "@/components/BentoGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import ClickSpark from "@/components/ClickSpark";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
const Index = () => {
  return (
<ClickSpark 
      sparkColor="#6b7280" 
      sparkSize={12} 
      sparkRadius={20} 
      sparkCount={10} 
      duration={500}
    >
      <SEO />
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <BentoGrid />
          <div id="events-section">
            <EventsSection />
          </div>
          <FeaturesSection />
          <NewsletterSection />
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </ClickSpark>
  );
};

export default Index;
