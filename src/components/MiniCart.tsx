import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useCart } from '@/contexts/CartContext';

export function MiniCart() {
  const { items, totalItems, totalPrice } = useCart();

  // Show last 3 items
  const displayItems = items.slice(-3).reverse();

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" asChild className="relative">
          <Link to="/carrinho">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground border-0">
                {totalItems}
              </Badge>
            )}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="end">
        {items.length === 0 ? (
          <div className="text-center py-4">
            <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm font-medium">
              {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
            </div>
            
            <div className="space-y-3">
              {displayItems.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
              
              {items.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  + {items.length - 3} outros itens
                </p>
              )}
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold text-primary">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              <Button asChild className="w-full" size="sm">
                <Link to="/carrinho">
                  Ver Carrinho
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
