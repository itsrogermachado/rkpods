import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category, Zone, ZoneStock } from '@/types';
import { toast } from 'sonner';

interface ProductWithStock extends Product {
  zoneStocks: ZoneStock[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithStock | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    brand: '',
    flavor: '',
    nicotine_level: '',
    images: '',
    featured: false,
    active: true,
  });
  const [zoneStockData, setZoneStockData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [productsRes, categoriesRes, zonesRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*'),
      supabase.from('zones').select('*').order('name'),
    ]);

    let productsWithStock: ProductWithStock[] = [];
    
    if (productsRes.data) {
      // Fetch zone stocks for all products
      const productIds = productsRes.data.map(p => p.id);
      const { data: stockData } = await supabase
        .from('zone_stock')
        .select('*')
        .in('product_id', productIds);

      productsWithStock = productsRes.data.map(product => ({
        ...product,
        images: product.images || [],
        featured: product.featured || false,
        active: product.active !== false,
        zoneStocks: (stockData?.filter(s => s.product_id === product.id) || []) as ZoneStock[],
      })) as unknown as ProductWithStock[];
    }

    setProducts(productsWithStock);
    if (categoriesRes.data) setCategories(categoriesRes.data as Category[]);
    if (zonesRes.data) setZones(zonesRes.data as Zone[]);
    setLoading(false);
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : generateSlug(name),
    }));
  };

  const openNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      original_price: '',
      category_id: '',
      brand: '',
      flavor: '',
      nicotine_level: '',
      images: '',
      featured: false,
      active: true,
    });
    // Initialize zone stocks to 0
    const initialStocks: Record<string, string> = {};
    zones.forEach(z => { initialStocks[z.id] = '0'; });
    setZoneStockData(initialStocks);
    setDialogOpen(true);
  };

  const openEdit = (product: ProductWithStock) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category_id: product.category_id || '',
      brand: product.brand || '',
      flavor: product.flavor || '',
      nicotine_level: product.nicotine_level || '',
      images: product.images?.join(', ') || '',
      featured: product.featured,
      active: product.active,
    });
    // Load existing zone stocks
    const stocks: Record<string, string> = {};
    zones.forEach(z => {
      const existing = product.zoneStocks.find(s => s.zone_id === z.id);
      stocks[z.id] = existing ? existing.stock.toString() : '0';
    });
    setZoneStockData(stocks);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate total stock from all zones
    const totalStock = Object.values(zoneStockData).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      category_id: formData.category_id || null,
      brand: formData.brand || null,
      flavor: formData.flavor || null,
      nicotine_level: formData.nicotine_level || null,
      stock: totalStock, // Keep for backward compatibility
      images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      featured: formData.featured,
      active: formData.active,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('Erro ao atualizar produto');
        return;
      }

      // Update zone stocks
      for (const zone of zones) {
        const stock = parseInt(zoneStockData[zone.id]) || 0;
        const existing = editingProduct.zoneStocks.find(s => s.zone_id === zone.id);
        
        if (existing) {
          await supabase
            .from('zone_stock')
            .update({ stock })
            .eq('id', existing.id);
        } else if (stock > 0) {
          await supabase.from('zone_stock').insert({
            zone_id: zone.id,
            product_id: editingProduct.id,
            stock,
          });
        }
      }

      toast.success('Produto atualizado');
      fetchData();
      setDialogOpen(false);
    } else {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error || !newProduct) {
        toast.error('Erro ao criar produto');
        return;
      }

      // Create zone stocks for the new product
      const stocksToInsert = zones
        .map(zone => ({
          zone_id: zone.id,
          product_id: newProduct.id,
          stock: parseInt(zoneStockData[zone.id]) || 0,
        }))
        .filter(s => s.stock > 0);

      if (stocksToInsert.length > 0) {
        await supabase.from('zone_stock').insert(stocksToInsert);
      }

      toast.success('Produto criado');
      fetchData();
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao excluir produto');
    } else {
      toast.success('Produto excluído');
      fetchData();
    }
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id);

    if (error) {
      toast.error('Erro ao atualizar produto');
    } else {
      fetchData();
    }
  };

  const getTotalStock = (product: ProductWithStock) => {
    return product.zoneStocks.reduce((sum, s) => sum + s.stock, 0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Preço Original</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={e => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                  />
                </div>
              </div>

              {/* Zone Stock Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Estoque por Zona
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {zones.map(zone => (
                    <div key={zone.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{zone.name}</p>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        className="w-24"
                        value={zoneStockData[zone.id] || '0'}
                        onChange={e => setZoneStockData(prev => ({
                          ...prev,
                          [zone.id]: e.target.value,
                        }))}
                      />
                    </div>
                  ))}
                </div>
                {zones.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma zona cadastrada. Adicione zonas primeiro.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={v => setFormData(prev => ({ ...prev, category_id: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flavor">Sabor</Label>
                  <Input
                    id="flavor"
                    value={formData.flavor}
                    onChange={e => setFormData(prev => ({ ...prev, flavor: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nicotine_level">Nível de Nicotina</Label>
                  <Input
                    id="nicotine_level"
                    value={formData.nicotine_level}
                    onChange={e => setFormData(prev => ({ ...prev, nicotine_level: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Imagens (URLs separadas por vírgula)</Label>
                <Textarea
                  id="images"
                  value={formData.images}
                  onChange={e => setFormData(prev => ({ ...prev, images: e.target.value }))}
                  placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={v => setFormData(prev => ({ ...prev, featured: v }))}
                  />
                  <Label htmlFor="featured">Destaque</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={v => setFormData(prev => ({ ...prev, active: v }))}
                  />
                  <Label htmlFor="active">Ativo</Label>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary">
                {editingProduct ? 'Salvar' : 'Criar Produto'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Nenhum produto cadastrado.
        </p>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    {!product.active && (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                    {product.featured && (
                      <Badge className="gradient-primary border-0">Destaque</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.category?.name || 'Sem categoria'} • {product.brand || 'Sem marca'}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm font-medium text-primary">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                      {product.original_price && (
                        <span className="text-muted-foreground line-through ml-2">
                          R$ {product.original_price.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="h-3 w-3" />
                      <span>Total: {getTotalStock(product)}</span>
                      {product.zoneStocks.length > 0 && (
                        <span className="text-muted-foreground/60">
                          ({product.zoneStocks.map(s => {
                            const zone = zones.find(z => z.id === s.zone_id);
                            return zone ? `${zone.name.slice(0, 2)}: ${s.stock}` : null;
                          }).filter(Boolean).join(', ')})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(product)}
                    title={product.active ? 'Desativar' : 'Ativar'}
                  >
                    {product.active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(product)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
