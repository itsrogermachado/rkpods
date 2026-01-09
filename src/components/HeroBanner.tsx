import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden gradient-primary py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm">
              <Zap className="h-4 w-4" />
              Novidades toda semana
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Os melhores
              <br />
              <span className="text-white/90">Pods & Essências</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md mx-auto md:mx-0">
              Descubra nossa seleção premium de pods descartáveis, essências importadas e acessórios exclusivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8"
              >
                <Link to="/produtos">
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 text-lg px-8"
              >
                <a href="https://wa.me/5521979265042" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                </a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:flex justify-center animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-75" />
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500"
                alt="Vapes e Pods"
                className="relative w-80 h-80 object-cover rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
