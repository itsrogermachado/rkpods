import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, Shield, Clock, MessageCircle } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Entrega Rápida</p>
              <p className="text-sm text-white/70">Rio de Janeiro</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Produtos Originais</p>
              <p className="text-sm text-white/70">100% Garantido</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Atendimento</p>
              <p className="text-sm text-white/70">Seg à Sex, 9h-18h</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/30 border border-primary/50">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Suporte</p>
              <p className="text-sm text-white/70">WhatsApp 24h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTABanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-secondary via-slate-700 to-secondary">
      <div className="container text-center">
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
    </section>
  );
}