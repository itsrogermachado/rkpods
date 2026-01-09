import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
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
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge className="bg-warning text-warning-foreground border-0">
                -{discountPercentage}%
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground border-0">
                Destaque
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-accent text-accent' : ''}`}
            />
          </Button>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {product.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.flavor && (
            <p className="text-sm text-muted-foreground mb-2">
              🍃 {product.flavor}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.original_price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
