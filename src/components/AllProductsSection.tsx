import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/ProductCard';
import { Product, Category, Zone, ZoneStock } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function AllProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneStock, setZoneStock] = useState<ZoneStock[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchZones();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (selectedZoneId) {
      fetchZoneStock(selectedZoneId);
    } else {
      setZoneStock([]);
    }
  }, [selectedZoneId]);

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

  const fetchZones = async () => {
    const { data } = await supabase
      .from('zones')
      .select('*')
      .eq('active', true)
      .order('name');

    if (data) {
      setZones(data as Zone[]);
    }
  };

  const fetchZoneStock = async (zoneId: string) => {
    const { data } = await supabase
      .from('zone_stock')
      .select('*')
      .eq('zone_id', zoneId);

    if (data) {
      setZoneStock(data as ZoneStock[]);
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

  const getProductZoneStock = (productId: string): number | null => {
    if (!selectedZoneId) return null;
    const entry = zoneStock.find(zs => zs.product_id === productId);
    return entry?.stock ?? 0;
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

      // Zone stock filter - only show products with stock > 0 in selected zone
      if (selectedZoneId) {
        const stock = getProductZoneStock(product.id);
        if (stock === null || stock <= 0) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, search, selectedZoneId, zoneStock]);

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

          {/* Zone Filter */}
          <Select
            value={selectedZoneId || 'all'}
            onValueChange={(value) => setSelectedZoneId(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Todas as zonas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as zonas</SelectItem>
              {zones.map(zone => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedCategory(null);
                setSearch('');
                setSelectedZoneId(null);
              }}
            >
              Limpar filtros
            </Button>
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
