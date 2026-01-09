import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';

export default function Favorites() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  async function fetchFavorites() {
    if (!user) return;
    setLoading(true);

    const { data: favorites } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (favorites && favorites.length > 0) {
      const productIds = favorites.map(f => f.product_id);
      const { data: products } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .in('id', productIds)
        .eq('active', true);

      if (products) {
        setProducts(products as unknown as Product[]);
      }
    } else {
      setProducts([]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h2>
              <p className="text-muted-foreground mb-6">
                Explore nossos produtos e adicione seus favoritos!
              </p>
              <Button asChild className="gradient-primary">
                <Link to="/produtos">Ver Produtos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={true}
                  onFavoriteToggle={fetchFavorites}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
