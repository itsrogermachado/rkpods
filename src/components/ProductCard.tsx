import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, AlertCircle, Sparkles, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function ProductCard({ product, isFavorite, onFavoriteToggle }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Produto adicionado ao carrinho!');
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Faça login para adicionar favoritos');
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        toast.success('Removido dos favoritos');
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: product.id });
        toast.success('Adicionado aos favoritos');
      }
      onFavoriteToggle?.();
    } catch (error) {
      toast.error('Erro ao atualizar favoritos');
    }
  };

  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  return (
    <Link to={`/produto/${product.slug}`}>
      <Card className="group relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:bg-card transition-all duration-500 hover:-translate-y-2 card-glow">
        {/* Smoke effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20">
          <div 
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full animate-smoke-rise"
            style={{ 
              background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.2), transparent 70%)',
              filter: 'blur(30px)',
            }} 
          />
        </div>

        <div className="relative aspect-square overflow-hidden bg-muted image-zoom">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isNew && (
              <Badge className="badge-premium flex items-center gap-1 animate-glow-pulse">
                <Sparkles className="h-3 w-3" />
                Novo
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-warning text-warning-foreground border-0 font-bold">
                <Flame className="h-3 w-3 mr-1" />
                -{discountPercentage}%
              </Badge>
            )}
            {product.featured && !isNew && (
              <Badge className="bg-primary text-primary-foreground border-0">
                Destaque
              </Badge>
            )}
          </div>

          {/* Low Stock Warning */}
          {isLowStock && (
            <div className="absolute top-3 right-14 z-10">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/20 backdrop-blur-sm stock-warning text-xs font-medium">
                <AlertCircle className="h-3 w-3" />
                Últimas {product.stock}!
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm bg-background/80 hover:bg-primary hover:text-primary-foreground z-10 hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-all ${isFavorite ? 'fill-accent text-accent scale-110' : ''}`}
            />
          </Button>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm font-semibold btn-premium"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
            </Button>
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="text-lg font-display font-bold text-muted-foreground">
                Esgotado
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {product.brand && (
            <p className="text-xs text-primary/80 uppercase tracking-wider font-semibold mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.flavor && (
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <span className="text-primary">🍃</span> {product.flavor}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-gradient-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.original_price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </CardContent>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div 
            className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"
          />
        </div>
      </Card>
    </Link>
  );
}
