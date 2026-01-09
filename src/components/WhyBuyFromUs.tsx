import { Truck, Shield, Clock, Headphones, CreditCard, Award } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Entregamos em todo o Rio de Janeiro com agilidade e cuidado.',
  },
  {
    icon: Shield,
    title: 'Produtos Originais',
    description: '100% autênticos. Garantimos a procedência de todos os produtos.',
  },
  {
    icon: Clock,
    title: 'Atendimento Ágil',
    description: 'Suporte via WhatsApp com respostas rápidas e eficientes.',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Fácil',
    description: 'Pix, cartão de crédito e débito. Parcelamos em até 3x.',
  },
  {
    icon: Award,
    title: 'Qualidade Garantida',
    description: 'Produtos selecionados das melhores marcas do mercado.',
  },
  {
    icon: Headphones,
    title: 'Suporte Dedicado',
    description: 'Estamos sempre prontos para ajudar com suas dúvidas.',
  },
];

export function WhyBuyFromUs() {
  return (
    <section className="py-16 bg-secondary text-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Por que comprar na <span className="text-primary">RKPODS</span>?
          </h2>
          <p className="text-white/70">
            Sua satisfação é nossa prioridade
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{benefit.title}</h3>
              <p className="text-sm text-white/60">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
