import { Shield, Truck, Clock, MessageCircle, Star, CreditCard, Lock, Award } from 'lucide-react';

const stats = [
  { 
    icon: <Star className="h-6 w-6" />,
    value: '500+', 
    label: 'Clientes Satisfeitos',
    color: 'text-warning'
  },
  { 
    icon: <Truck className="h-6 w-6" />,
    value: '1000+', 
    label: 'Pedidos Entregues',
    color: 'text-primary'
  },
  { 
    icon: <Clock className="h-6 w-6" />,
    value: '30min', 
    label: 'Tempo Médio Entrega',
    color: 'text-success'
  },
  { 
    icon: <MessageCircle className="h-6 w-6" />,
    value: '24h', 
    label: 'Suporte WhatsApp',
    color: 'text-accent'
  },
];

const trustBadges = [
  { icon: <Shield className="h-5 w-5" />, label: 'Produtos Originais' },
  { icon: <Lock className="h-5 w-5" />, label: 'Compra Segura' },
  { icon: <CreditCard className="h-5 w-5" />, label: 'Pix & Cartão' },
  { icon: <Award className="h-5 w-5" />, label: 'Garantia Total' },
];

export function TrustSection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full animate-smoke-drift"
          style={{
            background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.06), transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-xl bg-muted/50 ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`text-3xl md:text-4xl font-display font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {trustBadges.map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            >
              {badge.icon}
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
