import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Package } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (product && user) {
      checkFavorite();
    }
  }, [product, user]);

  async function fetchProduct() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();

    if (data) {
      const typedProduct = data as unknown as Product;
      setProduct(typedProduct);
      fetchRelatedProducts(typedProduct.category_id, typedProduct.id);
    }
    setLoading(false);
  }

  async function fetchRelatedProducts(categoryId: string | null, excludeId: string) {
    if (!categoryId) return;
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .eq('active', true)
      .neq('id', excludeId)
      .limit(4);

    if (data) {
      setRelatedProducts(data as unknown as Product[]);
    }
  }

  async function checkFavorite() {
    if (!user || !product) return;
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();
    setIsFavorite(!!data);
  }

  async function toggleFavorite() {
    if (!user) {
      toast.error('Faça login para adicionar favoritos');
      return;
    }
    if (!product) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        setIsFavorite(false);
        toast.success('Removido dos favoritos');
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: product.id });
        setIsFavorite(true);
        toast.success('Adicionado aos favoritos');
      }
    } catch {
      toast.error('Erro ao atualizar favoritos');
    }
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    navigate('/carrinho');
  };

  const images = product?.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600'
  ];

  const discountPercentage = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link to="/produtos">Ver todos os produtos</Link>
          </Button>
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
          {/* Breadcrumb */}
          <Link to="/produtos" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para produtos
          </Link>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            {/* Images */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === selectedImage ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                {product.brand && (
                  <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-1 sm:mb-2">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.category && (
                    <Badge variant="secondary" className="text-xs">{product.category.name}</Badge>
                  )}
                  {product.flavor && (
                    <Badge variant="outline" className="text-xs">🍃 {product.flavor}</Badge>
                  )}
                  {product.nicotine_level && (
                    <Badge variant="outline" className="text-xs">💨 {product.nicotine_level}</Badge>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-lg sm:text-xl text-muted-foreground line-through">
                      R$ {product.original_price.toFixed(2).replace('.', ',')}
                    </span>
                    <Badge className="gradient-warm border-0 text-xs">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4" />
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    {product.stock} unidades em estoque
                  </span>
                ) : (
                  <span className="text-destructive">Produto esgotado</span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 border rounded-lg p-1.5 sm:p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className="h-9 w-9 sm:h-11 sm:w-11 ml-auto"
                  >
                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-accent text-accent' : ''}`} />
                  </Button>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={handleBuyNow}
                    className="flex-1 gradient-primary text-sm sm:text-base"
                    size="lg"
                    disabled={product.stock === 0}
                  >
                    Comprar Agora
                  </Button>

                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="flex-1 text-sm sm:text-base"
                    size="lg"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    Carrinho
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
