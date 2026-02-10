import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Ticket, Percent, DollarSign, Package, Tag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coupon, Product, Category, Zone } from '@/types';

interface CouponFormData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  min_purchase: string;
  max_uses: string;
  valid_from: string;
  valid_until: string;
  active: boolean;
  product_ids: string[];
  category_ids: string[];
  zone_ids: string[];
}

const initialFormData: CouponFormData = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  min_purchase: '0',
  max_uses: '',
  valid_from: new Date().toISOString().slice(0, 16),
  valid_until: '',
  active: true,
  product_ids: [],
  category_ids: [],
  zone_ids: [],
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
    fetchCategories();
    fetchZones();
  }, []);

  async function fetchCoupons() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons((data as unknown as Coupon[]) || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({ title: 'Erro ao carregar cupons', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').eq('active', true).order('name');
    if (data) setProducts(data as unknown as Product[]);
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data as Category[]);
  }

  async function fetchZones() {
    const { data } = await supabase.from('zones').select('*').eq('active', true).order('name');
    if (data) setZones(data as unknown as Zone[]);
  }

  function openNewDialog() {
    setEditingCoupon(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  }

  function openEditDialog(coupon: Coupon) {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      min_purchase: String(coupon.min_purchase),
      max_uses: coupon.max_uses ? String(coupon.max_uses) : '',
      valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 16) : '',
      valid_until: coupon.valid_until ? coupon.valid_until.slice(0, 16) : '',
      active: coupon.active,
      product_ids: coupon.product_ids || [],
      category_ids: coupon.category_ids || [],
      zone_ids: coupon.zone_ids || [],
    });
    setDialogOpen(true);
  }

  function toggleArrayItem(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_purchase: parseFloat(formData.min_purchase) || 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        active: formData.active,
        product_ids: formData.product_ids,
        category_ids: formData.category_ids,
        zone_ids: formData.zone_ids,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);
        if (error) throw error;
        toast({ title: 'Cupom atualizado com sucesso!' });
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);
        if (error) throw error;
        toast({ title: 'Cupom criado com sucesso!' });
      }

      setDialogOpen(false);
      fetchCoupons();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast({
        title: 'Erro ao salvar cupom',
        description: error.message?.includes('unique') ? 'Código já existe' : error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Cupom excluído com sucesso!' });
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({ title: 'Erro ao excluir cupom', variant: 'destructive' });
    }
  }

  async function toggleActive(coupon: Coupon) {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ active: !coupon.active })
        .eq('id', coupon.id);
      if (error) throw error;
      fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast({ title: 'Erro ao atualizar cupom', variant: 'destructive' });
    }
  }

  function formatDiscount(coupon: Coupon) {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}%`;
    }
    return `R$ ${coupon.discount_value.toFixed(2).replace('.', ',')}`;
  }

  function isExpired(coupon: Coupon) {
    if (!coupon.valid_until) return false;
    return new Date(coupon.valid_until) < new Date();
  }

  function isExhausted(coupon: Coupon) {
    if (!coupon.max_uses) return false;
    return coupon.uses_count >= coupon.max_uses;
  }

  function getRestrictionLabels(coupon: Coupon) {
    const labels: string[] = [];
    if (coupon.product_ids?.length > 0) {
      labels.push(`${coupon.product_ids.length} produto(s)`);
    }
    if (coupon.category_ids?.length > 0) {
      labels.push(`${coupon.category_ids.length} categoria(s)`);
    }
    if (coupon.zone_ids?.length > 0) {
      labels.push(`${coupon.zone_ids.length} zona(s)`);
    }
    return labels;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cupons</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="DESCONTO10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Tipo de Desconto *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: 'percentage' | 'fixed') =>
                      setFormData(prev => ({ ...prev, discount_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do cupom"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Valor do Desconto *{' '}
                    {formData.discount_type === 'percentage' ? '(%)' : '(R$)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount_value}
                    onChange={e => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_purchase">Compra Mínima (R$)</Label>
                  <Input
                    id="min_purchase"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.min_purchase}
                    onChange={e => setFormData(prev => ({ ...prev, min_purchase: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Limite de Usos</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={e => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                    placeholder="Ilimitado"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={checked => setFormData(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Ativo</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valid_from">Válido a partir de</Label>
                  <Input
                    id="valid_from"
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={e => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valid_until">Válido até</Label>
                  <Input
                    id="valid_until"
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={e => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                  />
                </div>
              </div>

              {/* Restrictions */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Restrições (deixe vazio para aplicar a todos)
                </h3>

                {/* Categories */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Categorias específicas
                  </Label>
                  <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {categories.map(c => (
                      <label key={c.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer text-sm">
                        <Checkbox
                          checked={formData.category_ids.includes(c.id)}
                          onCheckedChange={() =>
                            setFormData(prev => ({ ...prev, category_ids: toggleArrayItem(prev.category_ids, c.id) }))
                          }
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                  {formData.category_ids.length > 0 && (
                    <p className="text-xs text-muted-foreground">{formData.category_ids.length} selecionada(s)</p>
                  )}
                </div>

                {/* Products (filtered by selected categories) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Produtos específicos
                    {formData.category_ids.length > 0 && (
                      <span className="text-xs text-muted-foreground">(filtrado por categorias)</span>
                    )}
                  </Label>
                  <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {products
                      .filter(p => formData.category_ids.length === 0 || (p.category_id && formData.category_ids.includes(p.category_id)))
                      .map(p => (
                        <label key={p.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer text-sm">
                          <Checkbox
                            checked={formData.product_ids.includes(p.id)}
                            onCheckedChange={() =>
                              setFormData(prev => ({ ...prev, product_ids: toggleArrayItem(prev.product_ids, p.id) }))
                            }
                          />
                          <span className="truncate">{p.name}</span>
                          {p.brand && <span className="text-muted-foreground text-xs">({p.brand})</span>}
                        </label>
                      ))}
                  </div>
                  {formData.product_ids.length > 0 && (
                    <p className="text-xs text-muted-foreground">{formData.product_ids.length} selecionado(s)</p>
                  )}
                </div>

                {/* Zones */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Zonas específicas
                  </Label>
                  <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {zones.map(z => (
                      <label key={z.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer text-sm">
                        <Checkbox
                          checked={formData.zone_ids.includes(z.id)}
                          onCheckedChange={() =>
                            setFormData(prev => ({ ...prev, zone_ids: toggleArrayItem(prev.zone_ids, z.id) }))
                          }
                        />
                        <span>{z.name}</span>
                      </label>
                    ))}
                  </div>
                  {formData.zone_ids.length > 0 && (
                    <p className="text-xs text-muted-foreground">{formData.zone_ids.length} selecionada(s)</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="gradient-primary" disabled={saving}>
                  {saving ? 'Salvando...' : editingCoupon ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <Card className="p-12 text-center">
          <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum cupom cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Crie seu primeiro cupom de desconto
          </p>
          <Button onClick={openNewDialog} className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cupom
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map(coupon => {
            const restrictions = getRestrictionLabels(coupon);
            return (
              <Card key={coupon.id} className={!coupon.active ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {coupon.discount_type === 'percentage' ? (
                        <Percent className="h-4 w-4 text-primary" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-primary" />
                      )}
                      {coupon.code}
                    </CardTitle>
                    <div className="flex gap-1">
                      {!coupon.active && <Badge variant="secondary">Inativo</Badge>}
                      {isExpired(coupon) && <Badge variant="destructive">Expirado</Badge>}
                      {isExhausted(coupon) && <Badge variant="outline">Esgotado</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-2xl font-bold text-primary">
                      {formatDiscount(coupon)}
                    </p>
                    {coupon.description && (
                      <p className="text-muted-foreground">{coupon.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                      <span>Mín: R$ {coupon.min_purchase.toFixed(2).replace('.', ',')}</span>
                      <span>
                        Usos: {coupon.uses_count}
                        {coupon.max_uses && `/${coupon.max_uses}`}
                      </span>
                    </div>
                    {coupon.valid_until && (
                      <p className="text-xs text-muted-foreground">
                        Válido até: {new Date(coupon.valid_until).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    {restrictions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {restrictions.map((label, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <Switch
                      checked={coupon.active}
                      onCheckedChange={() => toggleActive(coupon)}
                    />
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(coupon)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
