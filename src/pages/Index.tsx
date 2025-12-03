import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { EventsSection } from "@/components/EventsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import ClickSpark from "@/components/ClickSpark";

const Index = () => {
  return (
<ClickSpark 
      sparkColor="#6b7280" 
      sparkSize={12} 
      sparkRadius={20} 
      sparkCount={10} 
      duration={500}
    >
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <EventsSection />
          <FeaturesSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
};

export default Index;
