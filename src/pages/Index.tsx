import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroBannerCarousel } from '@/components/HeroBannerCarousel';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { AllProductsSection } from '@/components/AllProductsSection';
import { PromoBanner, CTABanner } from '@/components/PromoBanner';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { WhyBuyFromUs } from '@/components/WhyBuyFromUs';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AgeVerificationModal />
      <Header />
      <main className="flex-1">
        <HeroBannerCarousel />
        <PromoBanner />
        <FeaturedCarousel />
        <AllProductsSection />
        <TestimonialsSection />
        <WhyBuyFromUs />
        <CTABanner />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
