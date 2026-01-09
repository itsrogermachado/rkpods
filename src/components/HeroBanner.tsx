import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background py-20 md:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Novidades toda semana
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-foreground">Os melhores</span>
              <br />
              <span className="text-gradient">Produtos</span>
              <br />
              <span className="text-foreground">para você</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Descubra nossa seleção premium de produtos com qualidade garantida e entrega rápida para todo o Rio de Janeiro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="gradient-primary text-white hover:opacity-90 text-lg px-8 shadow-lg shadow-primary/25"
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
                className="text-lg px-8 border-2"
              >
                <a href="https://wa.me/5521979265042" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                </a>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:flex justify-center animate-scale-in">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20 scale-110" />
              
              {/* Main card */}
              <div className="relative bg-card rounded-3xl p-8 shadow-2xl border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl">🛒</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl">⭐</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl">🚀</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-warning/20 to-warning/5 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl">💎</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">Produtos de qualidade</p>
                  <p className="text-2xl font-bold text-gradient">+1000 vendas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}