import { useEffect, useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { Product, Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useZone } from '@/contexts/ZoneContext';

export function AllProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { selectedZone, selectedZoneId, isProductAvailable, openZoneModal } = useZone();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts((data || []).map(p => ({
        ...p,
        price: Number(p.price),
        original_price: p.original_price ? Number(p.original_price) : null,
        images: p.images || [],
        featured: p.featured ?? false,
        active: p.active ?? true,
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data as Category[]);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (data) {
      setFavorites(data.map(f => f.product_id));
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory && product.category?.slug !== selectedCategory) {
        return false;
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const brandMatch = product.brand?.toLowerCase().includes(searchLower);
        const flavorMatch = product.flavor?.toLowerCase().includes(searchLower);
        if (!nameMatch && !brandMatch && !flavorMatch) {
          return false;
        }
      }

      // Zone stock filter - only show products available in selected zone
      if (selectedZoneId) {
        if (!isProductAvailable(product.id)) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, search, selectedZoneId, isProductAvailable]);

  if (loading) {
    return (
      <section id="todos-produtos" className="relative py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              Nossos <span className="text-primary">Produtos</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="todos-produtos" className="relative py-16 overflow-hidden">
      {/* Fumaça decorativa de fundo */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full animate-smoke-drift"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.08), transparent 70%)',
            filter: 'blur(50px)',
          }} 
        />
        <div 
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full animate-vapor-pulse"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(187 70% 55% / 0.06), transparent 70%)',
            filter: 'blur(40px)',
            animationDelay: '3s'
          }} 
        />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Nossos <span className="text-primary">Produtos</span>
          </h2>
          <p className="text-muted-foreground">
            Explore nossa variedade completa
          </p>
          
          {/* Zone indicator */}
          {selectedZone && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge 
                variant="secondary" 
                className="gap-2 py-1.5 px-4 bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={openZoneModal}
              >
                <MapPin className="w-3.5 h-3.5" />
                Mostrando produtos para: {selectedZone.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Change Zone Button */}
          <Button
            variant="outline"
            onClick={openZoneModal}
            className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
          >
            <MapPin className="w-4 h-4 text-primary" />
            {selectedZone ? 'Trocar zona' : 'Selecionar zona'}
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="flex-shrink-0"
          >
            Todos
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.slug)}
              className="flex-shrink-0"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {selectedZoneId
                ? 'Nenhum produto disponível nesta zona com os filtros selecionados.'
                : 'Nenhum produto encontrado com os filtros selecionados.'}
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearch('');
                }}
              >
                Limpar filtros
              </Button>
              {selectedZoneId && (
                <Button
                  variant="default"
                  onClick={openZoneModal}
                  className="gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Trocar zona
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onFavoriteToggle={fetchFavorites}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
