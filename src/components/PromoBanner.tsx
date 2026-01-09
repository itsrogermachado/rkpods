import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gift, Truck, Shield, Clock } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-12 gradient-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Entrega Rápida</p>
              <p className="text-sm text-white/80">Rio de Janeiro</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Produtos Originais</p>
              <p className="text-sm text-white/80">100% Garantido</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Brindes Exclusivos</p>
              <p className="text-sm text-white/80">Em compras selecionadas</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Atendimento</p>
              <p className="text-sm text-white/80">Seg à Sex, 9h-18h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTABanner() {
  return (
    <section className="py-16 gradient-warm">
      <div className="container text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Não encontrou o que procura?
          </h2>
          <p className="text-lg text-white/90">
            Fale conosco pelo WhatsApp! Temos muito mais produtos disponíveis e podemos te ajudar a encontrar o pod perfeito.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-orange-600 hover:bg-white/90 text-lg px-8"
          >
            <a href="https://wa.me/5521979265042" target="_blank" rel="noopener noreferrer">
              Chamar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
