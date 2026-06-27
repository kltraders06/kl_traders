import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TrustSection from "@/components/sections/TrustSection";
import AboutSection from "@/components/sections/AboutSection";
import ProductsSection from "@/components/sections/ProductsSection";
import ExportProcessSection from "@/components/sections/ExportProcessSection";
import FarmerNetworkSection from "@/components/sections/FarmerNetworkSection";
import GallerySection from "@/components/sections/GallerySection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ExportCountriesSection from "@/components/sections/ExportCountriesSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <TrustSection />
      <AboutSection />
      <ProductsSection />
      <ExportProcessSection />
      <FarmerNetworkSection />
      <GallerySection />
      <WhyUsSection />
      <TestimonialsSection />
      <ExportCountriesSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
