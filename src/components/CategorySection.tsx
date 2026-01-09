import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    slug: 'pods',
    name: 'Pods Descartáveis',
    description: 'Praticidade e sabor',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    slug: 'essencias',
    name: 'Essências',
    description: 'Sabores únicos',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    slug: 'dispositivos',
    name: 'Dispositivos',
    description: 'Vapes recarregáveis',
    image: 'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    slug: 'acessorios',
    name: 'Acessórios',
    description: 'Cases e carregadores',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    gradient: 'from-green-500 to-teal-500',
  },
];

export function CategorySection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore por <span className="text-gradient">Categoria</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Encontre exatamente o que você precisa
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/produtos?categoria=${category.slug}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-0 relative aspect-[4/5]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <h3 className="font-bold text-lg md:text-xl text-center mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/80 text-center">
                      {category.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
