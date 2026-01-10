import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-slate-900 py-16 md:py-24">
      {/* Efeito de Fumaça Animada */}
      <SmokeEffect />

      {/* Gradiente de transição no fundo */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/30 to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Novidades toda semana
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Os melhores
              <br />
              <span className="text-primary">Pods & Essências</span>
            </h1>
            <p className="text-lg text-white/70 max-w-md mx-auto md:mx-0">
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
              <Button asChild size="lg" className="bg-white text-secondary text-lg px-8">
                <a href="https://wa.me/5521979265042" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                </a>
              </Button>
            </div>
          </div>

          {/* Nova Ilustração com efeito de vapor */}
          <div className="hidden md:flex justify-center animate-scale-in">
            <div className="relative">
              {/* Glow de vapor intenso atrás */}
              <div className="absolute inset-0 bg-primary/40 rounded-full blur-3xl scale-125 animate-vapor-pulse" />
              
              {/* Fumaça adicional envolvendo a imagem */}
              <div 
                className="absolute -top-16 -left-16 w-40 h-40 rounded-full animate-smoke-rise"
                style={{ 
                  background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.25), transparent 70%)',
                  filter: 'blur(30px)',
                  animationDelay: '0s' 
                }} 
              />
              <div 
                className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full animate-smoke-drift"
                style={{ 
                  background: 'radial-gradient(ellipse, hsl(187 70% 55% / 0.2), transparent 70%)',
                  filter: 'blur(35px)',
                  animationDelay: '2s' 
                }} 
              />
              <div 
                className="absolute top-1/2 -left-20 w-32 h-32 rounded-full animate-vapor-pulse"
                style={{ 
                  background: 'radial-gradient(ellipse, hsl(175 80% 45% / 0.2), transparent 70%)',
                  filter: 'blur(25px)',
                  animationDelay: '1s' 
                }} 
              />
              
              {/* Ilustração principal */}
              <img 
                src={heroIllustration} 
                alt="RK PODS" 
                className="relative w-[420px] h-auto drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
