import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Droplets, Zap, Sparkles, Box, Flame } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'pods': <Zap className="h-8 w-8" />,
  'essencias': <Droplets className="h-8 w-8" />,
  'acessorios': <Box className="h-8 w-8" />,
  'descartaveis': <Flame className="h-8 w-8" />,
  'default': <Package className="h-8 w-8" />,
};

const categoryGradients = [
  'from-primary/80 via-primary/40 to-transparent',
  'from-accent/80 via-accent/40 to-transparent',
  'from-secondary/80 via-secondary/40 to-transparent',
  'from-warning/60 via-warning/30 to-transparent',
];

export function CategoryShowcase() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-showcase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(4);
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: productCounts } = useQuery({
    queryKey: ['category-product-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category_id')
        .eq('active', true);
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach(product => {
        if (product.category_id) {
          counts[product.category_id] = (counts[product.category_id] || 0) + 1;
        }
      });
      return counts;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.length) return null;

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full animate-vapor-pulse"
          style={{
            background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.08), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="inline-block h-4 w-4 mr-2" />
            Categorias
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Explore por Categoria
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Encontre exatamente o que você procura navegando pelas nossas categorias de produtos
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const icon = categoryIcons[category.slug] || categoryIcons['default'];
            const gradient = categoryGradients[index % categoryGradients.length];
            const productCount = productCounts?.[category.id] || 0;
            const imageUrl = category.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

            return (
              <Link 
                key={category.id} 
                to={`/produtos?categoria=${category.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden card-glow"
              >
                {/* Background Image */}
                <div className="absolute inset-0 image-zoom">
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
                <div className="absolute inset-0 category-overlay" />

                {/* Content */}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  {/* Icon */}
                  <div className="mb-3 p-3 w-fit rounded-xl bg-background/20 backdrop-blur-sm text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                    {icon}
                  </div>

                  {/* Text */}
                  <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {productCount} {productCount === 1 ? 'produto' : 'produtos'}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-3 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <span className="text-sm font-medium">Explorar</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div 
                    className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
