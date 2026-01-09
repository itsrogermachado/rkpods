import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gift, Truck, Shield, Clock } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-card border card-hover">
            <div className="p-4 rounded-full gradient-primary text-white">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Entrega Rápida</p>
              <p className="text-sm text-muted-foreground">Rio de Janeiro</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-card border card-hover">
            <div className="p-4 rounded-full bg-secondary text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Produtos Originais</p>
              <p className="text-sm text-muted-foreground">100% Garantido</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-card border card-hover">
            <div className="p-4 rounded-full bg-accent text-white">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Brindes Exclusivos</p>
              <p className="text-sm text-muted-foreground">Em compras selecionadas</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-card border card-hover">
            <div className="p-4 rounded-full bg-warning text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Atendimento</p>
              <p className="text-sm text-muted-foreground">Seg à Sex, 9h-18h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary to-secondary">
      <div className="container text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Não encontrou o que procura?
          </h2>
          <p className="text-lg text-white/90">
            Fale conosco pelo WhatsApp! Temos muito mais produtos disponíveis e podemos te ajudar.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 shadow-lg"
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