import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
export function HeroBanner() {
  return <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-slate-800 py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
              <Sparkles className="h-4 w-4" />
              Novidades toda semana
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Os melhores
              <br />
              <span className="text-primary">Pods & Essências</span>
            </h1>
            <p className="text-lg text-white/70 max-w-md mx-auto md:mx-0">
              Qualidade e variedade que você merece. Entrega rápida para todo o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 shadow-lg shadow-primary/30">
                <Link to="/produtos">
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-secondary text-lg px-8">
                <a href="https://wa.me/5521979265042" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                </a>
              </Button>
            </div>
          </div>

          {/* Logo/Image */}
          <div className="hidden md:flex justify-center animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-110" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                <img src="/logo.png" alt="RKPODS" className="w-64 h-auto drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}