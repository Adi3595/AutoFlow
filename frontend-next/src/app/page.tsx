import { HeroSection } from "@/components/ui/HeroSection";
import { FeaturesSection } from "@/components/ui/FeaturesSection";
import { HowItWorksSection } from "@/components/ui/HowItWorksSection";
import { UseCasesSection } from "@/components/ui/UseCasesSection";
import { EcosystemSection } from "@/components/ui/EcosystemSection";
import { DashboardPreview } from "@/components/ui/DashboardPreview";
import { TestimonialsSection } from "@/components/ui/TestimonialsSection";
import { SecuritySection } from "@/components/ui/SecuritySection";
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
        <UseCasesSection />
        <EcosystemSection />
        <DashboardPreview />
        <TestimonialsSection />
        <SecuritySection />
        <PricingSection />
        <FAQSection />
        <FooterSection />
      </div>
    </main>
  );
}
