import { HeroSection } from "@/components/ui/HeroSection";
import { FeaturesSection } from "@/components/ui/FeaturesSection";
import { HowItWorksSection } from "@/components/ui/HowItWorksSection";
import { EcosystemSection } from "@/components/ui/EcosystemSection";
import { DashboardPreview } from "@/components/ui/DashboardPreview";
import { PricingSection } from "@/components/ui/PricingSection";
import { FAQSection } from "@/components/ui/FAQSection";
import { FooterSection } from "@/components/ui/FooterSection";

// Metadata inherited from layout.tsx

export default function Home() {
  return (
    <main>
      <div className="ui-layer">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <EcosystemSection />
        <DashboardPreview />
        <PricingSection />
        <FAQSection />
        <FooterSection />
      </div>
    </main>
  );
}
