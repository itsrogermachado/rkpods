import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroBanner } from '@/components/HeroBanner';
import { AllProductsSection } from '@/components/AllProductsSection';
import { PromoBanner, CTABanner } from '@/components/PromoBanner';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';
import { TrustSection } from '@/components/TrustSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <AgeVerificationModal />
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <PromoBanner />
        <AllProductsSection />
        <TrustSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
