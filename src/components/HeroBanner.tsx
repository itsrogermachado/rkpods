import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { SmokeEffect } from './SmokeEffect';
import heroIllustration from '@/assets/hero-illustration.png';

export function HeroBanner() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('todos-produtos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-4">
      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Novidades toda semana
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Os melhores
              <br />
              <span className="text-gradient-primary">Pods & Essências</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
              Qualidade e variedade que você merece. Entrega rápida para todo o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                onClick={scrollToProducts}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 shadow-lg shadow-primary/30"
              >
                Ver Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <a href="https://chat.whatsapp.com/GpsU6CI5RWjLUkjmkEk5my" target="_blank" rel="noopener noreferrer">
                  <Users className="mr-2 h-5 w-5" />
                  Comunidade VIP
                </a>
              </Button>
            </div>
          </div>

          {/* Ilustração */}
          <div className="hidden md:flex justify-center animate-scale-in">
            <img 
              src={heroIllustration} 
              alt="RK PODS" 
              className="w-[420px] h-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
