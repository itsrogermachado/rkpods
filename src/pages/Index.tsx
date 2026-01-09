import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroBanner } from '@/components/HeroBanner';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { AllProductsSection } from '@/components/AllProductsSection';
import { PromoBanner, CTABanner } from '@/components/PromoBanner';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AgeVerificationModal />
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <PromoBanner />
        <FeaturedCarousel />
        <AllProductsSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
