import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Percent, Truck, Gift } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const banners = [
  {
    id: 1,
    badge: { icon: Sparkles, text: 'Novidades toda semana' },
    title: 'Os melhores',
    highlight: 'Pods & Essências',
    description: 'Qualidade e variedade que você merece. Entrega rápida para todo o Rio de Janeiro.',
    primaryCta: { text: 'Ver Produtos', link: '/produtos' },
    secondaryCta: { text: 'Fale Conosco', link: 'https://wa.me/5521979265042' },
    gradient: 'from-secondary via-secondary to-slate-800',
    image: '/logo.png',
  },
  {
    id: 2,
    badge: { icon: Percent, text: 'Promoção limitada' },
    title: 'Até 30% OFF',
    highlight: 'Em Pods Selecionados',
    description: 'Aproveite descontos especiais em produtos das melhores marcas. Estoque limitado!',
    primaryCta: { text: 'Ver Ofertas', link: '/produtos' },
    gradient: 'from-orange-900 via-red-900 to-orange-800',
  },
  {
    id: 3,
    badge: { icon: Truck, text: 'Entrega expressa' },
    title: 'Frete Grátis',
    highlight: 'Acima de R$ 150',
    description: 'Compre agora e receba sem custo adicional de entrega na região do Rio de Janeiro.',
    primaryCta: { text: 'Comprar Agora', link: '/produtos' },
    gradient: 'from-emerald-900 via-teal-900 to-emerald-800',
  },
  {
    id: 4,
    badge: { icon: Gift, text: 'Novos clientes' },
    title: 'Primeira Compra',
    highlight: '15% de Desconto',
    description: 'Use o cupom PRIMEIRACOMPRA e ganhe 15% de desconto na sua primeira compra!',
    primaryCta: { text: 'Aproveitar', link: '/produtos' },
    gradient: 'from-purple-900 via-violet-900 to-purple-800',
  },
];

export function HeroBannerCarousel() {
  return (
    <section className="relative overflow-hidden">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className={`relative overflow-hidden bg-gradient-to-br ${banner.gradient} py-16 md:py-24`}>
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
                        <banner.badge.icon className="h-4 w-4" />
                        {banner.badge.text}
                      </div>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        {banner.title}
                        <br />
                        <span className="text-primary">{banner.highlight}</span>
                      </h1>
                      <p className="text-lg text-white/70 max-w-md mx-auto md:mx-0">
                        {banner.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 shadow-lg shadow-primary/30">
                          <Link to={banner.primaryCta.link}>
                            {banner.primaryCta.text}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                        {banner.secondaryCta && (
                          <Button asChild size="lg" className="bg-white text-secondary text-lg px-8">
                            <a href={banner.secondaryCta.link} target="_blank" rel="noopener noreferrer">
                              {banner.secondaryCta.text}
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Logo/Image */}
                    {banner.image && (
                      <div className="hidden md:flex justify-center animate-scale-in">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-110" />
                          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                            <img src={banner.image} alt="RKPODS" className="w-64 h-auto drop-shadow-2xl" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Buttons */}
        <CarouselPrevious className="left-4 hidden md:flex" />
        <CarouselNext className="right-4 hidden md:flex" />
      </Carousel>
    </section>
  );
}
