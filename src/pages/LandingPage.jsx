import CustomerLayout from "../layouts/CustomerLayout.jsx";
import HeroSection from "../components/landing/HeroSection.jsx";
import {
  FAQSection,
  FeatureSection,
  FinalCTA,
  Footer,
  MobileBookingBar,
  PricingSection,
  RoomSection,
  TrustBar,
} from "../components/landing/LandingSections.jsx";

export default function LandingPage() {
  return (
    <CustomerLayout>
      <main>
        <HeroSection />
        <TrustBar />
        <FeatureSection />
        <RoomSection />
        <PricingSection />
        <FinalCTA />
        <FAQSection />
      </main>

      <Footer />
      <MobileBookingBar />
    </CustomerLayout>
  );
}
