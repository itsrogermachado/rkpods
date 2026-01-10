import { Button } from '@/components/ui/button';
import { Truck, Shield, Clock, MessageCircle } from 'lucide-react';
export function PromoBanner() {
  return <section className="relative py-4 overflow-hidden">

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div className="flex flex-col items-center text-center gap-3 group">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm icon-bounce group-hover:bg-primary/40 transition-all duration-300">
              <Truck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-semibold text-primary text-glow">Entrega Rápida</p>
              <p className="text-sm text-muted-foreground">Rio de Janeiro</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3 group">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm icon-bounce group-hover:bg-primary/40 transition-all duration-300">
              <Shield className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-semibold text-primary text-glow">Produtos Originais</p>
              <p className="text-sm text-muted-foreground">100% Garantido</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3 group">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm icon-bounce group-hover:bg-primary/40 transition-all duration-300">
              <Clock className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-semibold text-primary text-glow">Atendimento</p>
              <p className="text-sm text-muted-foreground">Seg à Sex, 9h-18h</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-3 group">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm icon-bounce group-hover:bg-primary/40 transition-all duration-300">
              <MessageCircle className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-semibold text-primary text-glow">Suporte</p>
              <p className="text-sm text-muted-foreground">WhatsApp 24h</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
export function CTABanner() {
  return <section className="relative py-12 overflow-hidden">

      <div className="container relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Não encontrou o que procura?
          </h2>
          <p className="text-lg text-muted-foreground">
            Fale conosco pelo WhatsApp! Temos muito mais produtos disponíveis e podemos te ajudar a encontrar o pod perfeito.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 shadow-lg shadow-primary/30">
            <a href="https://wa.me/5521965206974" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>;
}