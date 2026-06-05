import CustomerLayout from "../layouts/CustomerLayout.jsx";

import HeroSection from "../components/landing/HeroSection.jsx";
import TrustBar from "../components/landing/TrustBar.jsx";
import StudioFeatures from "../components/landing/StudioFeatures.jsx";
import RoomShowcase from "../components/landing/RoomShowcase.jsx";
import PricingSection from "../components/landing/PricingSection.jsx";
import GallerySection from "../components/landing/GallerySection.jsx";
import Testimonials from "../components/landing/Testimonials.jsx";
import BookingCTA from "../components/landing/BookingCTA.jsx";
import FAQSection from "../components/landing/FAQSection.jsx";
import LandingFooter from "../components/landing/LandingFooter.jsx";
import MobileBookingBar from "../components/landing/MobileBookingBar.jsx";

export default function LandingPage() {
  return (
    <CustomerLayout>
      <HeroSection />
      <TrustBar />
      <StudioFeatures />
      <RoomShowcase />
      <PricingSection />
      <GallerySection />
      <Testimonials />
      <BookingCTA />
      <FAQSection />
      <LandingFooter />
      <MobileBookingBar />
    </CustomerLayout>
  );
}
