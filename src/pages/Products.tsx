import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Product, Category } from '@/types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { user } = useAuth();

  // Filter states
  const [search, setSearch] = useState(searchParams.get('busca') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categoria')?.split(',').filter(Boolean) || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(searchParams.get('ordem') || 'recent');

  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data as Category[]);
  }

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('active', true);

    if (data) {
      const typedData = data as unknown as Product[];
      setProducts(typedData);
      const uniqueBrands = [...new Set(typedData.map(p => p.brand).filter(Boolean))] as string[];
      setBrands(uniqueBrands);
    }
    setLoading(false);
  }

  async function fetchFavorites() {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);
    if (data) {
      setFavorites(data.map(f => f.product_id));
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase()) &&
          !product.brand?.toLowerCase().includes(search.toLowerCase()) &&
          !product.flavor?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedCategories.length > 0) {
        const categoryMatch = selectedCategories.some(slug => 
          product.category?.slug === slug
        );
        if (!categoryMatch) return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand || '')) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('busca', search);
    } else {
      params.delete('busca');
    }
    setSearchParams(params);
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSortBy('recent');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategories.length > 0 || selectedBrands.length > 0;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label htmlFor={`cat-${category.slug}`} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Marcas</h3>
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Produtos</h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </form>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="price_asc">Menor Preço</SelectItem>
                  <SelectItem value="price_desc">Maior Preço</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filters */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <FilterContent />
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-square rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    Nenhum produto encontrado
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onFavoriteToggle={fetchFavorites}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
