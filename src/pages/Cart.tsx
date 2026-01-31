import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Ticket, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    clearCart,
    appliedCoupon,
    couponDiscount,
    finalPrice,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { toast } = useToast();

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    const result = await applyCoupon(couponCode);
    setApplyingCoupon(false);

    toast({
      title: result.success ? 'Sucesso!' : 'Erro',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      setCouponCode('');
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground">
              Explore nossos produtos e adicione itens ao carrinho
            </p>
            <Button asChild className="gradient-primary">
              <Link to="/produtos">Ver Produtos</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Carrinho</h1>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar carrinho
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <Card key={item.product.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          {item.product.brand && (
                            <p className="text-xs text-muted-foreground uppercase">
                              {item.product.brand}
                            </p>
                          )}
                          <Link
                            to={`/produto/${item.product.slug}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.flavor && (
                            <p className="text-sm text-muted-foreground">
                              {item.product.flavor}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              R$ {item.product.price.toFixed(2).replace('.', ',')} cada
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

                {/* Coupon Input */}
                <div className="mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">{appliedCoupon.code}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={removeCoupon}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Código do cupom"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                      >
                        {applyingCoupon ? '...' : 'Aplicar'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({appliedCoupon?.code})</span>
                      <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frete</span>
                    <span className="text-green-600">A calcular</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full gradient-primary" size="lg">
                  <Link to="/checkout">
                    Finalizar Pedido
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full mt-3">
                  <Link to="/produtos">Continuar Comprando</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
