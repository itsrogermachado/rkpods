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
      <main className="flex-1 bg-gradient-to-b from-background via-background to-muted relative overflow-hidden">
        {/* Fumaça global cobrindo toda a página */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-[10%] left-0 w-[600px] h-[600px] rounded-full animate-smoke-drift"
            style={{ 
              background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.15), transparent 60%)',
              filter: 'blur(60px)',
            }} 
          />
          <div 
            className="absolute top-[40%] right-0 w-[500px] h-[500px] rounded-full animate-vapor-pulse"
            style={{ 
              background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.12), transparent 55%)',
              filter: 'blur(70px)',
              animationDelay: '2s'
            }} 
          />
          <div 
            className="absolute top-[70%] left-1/4 w-[700px] h-[700px] rounded-full animate-smoke-breathe"
            style={{ 
              background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.10), transparent 50%)',
              filter: 'blur(80px)',
              animationDelay: '4s'
            }} 
          />
        </div>
        
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
