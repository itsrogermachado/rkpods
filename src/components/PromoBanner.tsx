import { Button } from '@/components/ui/button';
import { Truck, Shield, Clock, MessageCircle } from 'lucide-react';
export function PromoBanner() {
  return <section className="relative py-12 overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Camadas de fumaça adaptativas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Camada 1 - Grande à esquerda */}
        <div 
          className="absolute -top-10 left-0 w-72 h-72 rounded-full animate-smoke-drift"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.35), transparent 60%)',
            filter: 'blur(25px)',
            animationDelay: '0s' 
          }} 
        />
        
        {/* Camada 2 - Direita */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full animate-vapor-pulse"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.30), transparent 55%)',
            filter: 'blur(30px)',
            animationDelay: '1s' 
          }} 
        />
        
        {/* Camada 3 - Centro */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full animate-smoke-breathe"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(var(--smoke-accent) / 0.30), transparent 50%)',
            filter: 'blur(35px)',
            animationDelay: '2s' 
          }} 
        />
        
        {/* Camada 4 - Partícula menor */}
        <div 
          className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full animate-smoke-swirl"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(var(--smoke-primary) / 0.40), transparent 65%)',
            filter: 'blur(20px)',
            animationDelay: '3s' 
          }} 
        />
        
        {/* Camada 5 - Partícula à direita */}
        <div 
          className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full animate-smoke-rise"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(var(--smoke-secondary) / 0.35), transparent 60%)',
            filter: 'blur(25px)',
            animationDelay: '4s' 
          }} 
        />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-primary">Entrega Rápida</p>
              <p className="text-sm text-primary">Rio de Janeiro</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-primary">Produtos Originais</p>
              <p className="text-sm text-primary">100% Garantido</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-primary">Atendimento</p>
              <p className="text-sm text-primary">Seg à Sex, 9h-18h</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-primary">Suporte</p>
              <p className="text-sm text-primary">WhatsApp 24h</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
export function CTABanner() {
  return <section className="relative py-16 bg-gradient-to-r from-secondary via-slate-800 to-secondary overflow-hidden">
      {/* Vapor subindo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full animate-smoke-rise" style={{
        background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.15), transparent 70%)',
        filter: 'blur(40px)'
      }} />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full animate-smoke-rise" style={{
        background: 'radial-gradient(ellipse, hsl(175 80% 45% / 0.12), transparent 70%)',
        filter: 'blur(35px)',
        animationDelay: '3s'
      }} />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 rounded-full animate-vapor-pulse" style={{
        background: 'radial-gradient(ellipse, hsl(187 70% 50% / 0.1), transparent 70%)',
        filter: 'blur(50px)',
        animationDelay: '1.5s'
      }} />
      </div>

      <div className="container relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Não encontrou o que procura?
          </h2>
          <p className="text-lg text-white/80">
            Fale conosco pelo WhatsApp! Temos muito mais produtos disponíveis e podemos te ajudar a encontrar o pod perfeito.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 shadow-lg shadow-primary/30">
            <a href="https://wa.me/5521979265042" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>;
}