import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, MapPin, MessageCircle, Check, Store, X, AlertTriangle, Package } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Address, Zone, ZoneStock } from '@/types';
import { generateWhatsAppMessage, getWhatsAppLink } from '@/lib/whatsapp';
import { toast } from 'sonner';

const addressSchema = z.object({
  label: z.string().min(1, 'Apelido é obrigatório'),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  reference: z.string().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

interface ItemAvailability {
  productId: string;
  productName: string;
  requested: number;
  available: number;
  isAvailable: boolean;
}

export default function Checkout() {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [zoneStock, setZoneStock] = useState<ZoneStock[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Casa',
      complement: '',
      reference: '',
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrinho');
    }
  }, [items, navigate]);

  useEffect(() => {
    fetchZones();
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Fetch zone stock when zone changes
  useEffect(() => {
    if (selectedZoneId) {
      fetchZoneStock(selectedZoneId);
    } else {
      setZoneStock([]);
    }
  }, [selectedZoneId]);

  async function fetchZones() {
    const { data } = await supabase
      .from('zones')
      .select('*')
      .eq('active', true)
      .order('name');

    if (data) {
      setZones(data as Zone[]);
      // Auto-select first zone if only one
      if (data.length === 1) {
        setSelectedZoneId(data[0].id);
      }
    }
  }

  async function fetchAddresses() {
    if (!user) return;
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (data) {
      setSavedAddresses(data as Address[]);
      const defaultAddress = data.find((a: any) => a.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }

  async function fetchZoneStock(zoneId: string) {
    setStockLoading(true);
    const { data } = await supabase
      .from('zone_stock')
      .select('*')
      .eq('zone_id', zoneId);

    if (data) {
      setZoneStock(data as ZoneStock[]);
    }
    setStockLoading(false);
  }

  // Calculate availability for each item
  const itemsAvailability = useMemo<ItemAvailability[]>(() => {
    if (!selectedZoneId || zoneStock.length === 0) {
      // If no zone selected or no stock data, assume all available
      return items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        requested: item.quantity,
        available: item.product.stock, // Use global stock as fallback
        isAvailable: true,
      }));
    }

    return items.map(item => {
      const stockEntry = zoneStock.find(zs => zs.product_id === item.product.id);
      const availableStock = stockEntry?.stock ?? 0;
      
      return {
        productId: item.product.id,
        productName: item.product.name,
        requested: item.quantity,
        available: availableStock,
        isAvailable: availableStock >= item.quantity,
      };
    });
  }, [items, zoneStock, selectedZoneId]);

  const allItemsAvailable = itemsAvailability.every(item => item.isAvailable);
  const unavailableItems = itemsAvailability.filter(item => !item.isAvailable);

  const handleCepBlur = async () => {
    const cep = form.getValues('cep').replace(/\D/g, '');
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        form.setValue('street', data.logradouro || '');
        form.setValue('neighborhood', data.bairro || '');
        form.setValue('city', data.localidade || '');
        form.setValue('state', data.uf || '');
      }
    } catch {
      // ViaCEP error - user will fill manually
    } finally {
      setCepLoading(false);
    }
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  const handleSubmit = async (formData: AddressForm) => {
    if (!selectedZoneId) {
      toast.error('Por favor, selecione uma zona de entrega.');
      return;
    }

    if (!allItemsAvailable) {
      toast.error('Alguns produtos não estão disponíveis nesta zona.');
      return;
    }

    setIsSubmitting(true);

    try {
      let address: Address;

      if (selectedAddressId === 'new') {
        address = {
          label: formData.label,
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement || '',
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          reference: formData.reference || '',
        };

        // Save address if user is logged in
        if (user) {
          await supabase.from('addresses').insert({
            user_id: user.id,
            ...address,
          });
        }
      } else {
        const saved = savedAddresses.find(a => a.id === selectedAddressId);
        if (!saved) throw new Error('Endereço não encontrado');
        address = saved;
      }

      // Create order in database with zone info
      await supabase.from('orders').insert({
        user_id: user?.id || null,
        items: items.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })) as any,
        address: address as any,
        total: totalPrice,
        status: 'pending',
        zone_id: selectedZoneId,
        zone_name: selectedZone?.name || null,
      });

      // Generate WhatsApp message and redirect to zone's vendor
      const message = generateWhatsAppMessage(items, address, totalPrice, selectedZone?.name);
      const whatsappLink = getWhatsAppLink(message, selectedZone!.whatsapp_number);

      clearCart();
      toast.success('Pedido enviado! Redirecionando ao WhatsApp...');

      // Detecta se é mobile para usar método adequado
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Em mobile, usar location.href para ativar deep link corretamente
        window.location.href = whatsappLink;
      } else {
        // Em desktop, abrir nova aba com fallback
        const newWindow = window.open(whatsappLink, '_blank');
        
        // Se popup foi bloqueado, mostrar link manual
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          toast.info(
            <div className="flex flex-col gap-2">
              <p>O navegador bloqueou a abertura automática.</p>
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-primary font-medium"
              >
                Clique aqui para abrir o WhatsApp
              </a>
            </div>,
            { duration: 15000 }
          );
        }
        navigate('/');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = selectedZoneId && allItemsAvailable && !stockLoading;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <Link
            to="/carrinho"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao carrinho
          </Link>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Zone Selection + Address Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Zone Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Zona de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {zones.length === 0 ? (
                    <p className="text-muted-foreground">Carregando zonas...</p>
                  ) : (
                    <RadioGroup
                      value={selectedZoneId}
                      onValueChange={setSelectedZoneId}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {zones.map(zone => (
                        <div
                          key={zone.id}
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedZoneId === zone.id 
                              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedZoneId(zone.id)}
                        >
                          <RadioGroupItem value={zone.id} id={zone.id} />
                          <div className="flex-1">
                            <Label htmlFor={zone.id} className="font-medium cursor-pointer">
                              {zone.name}
                            </Label>
                          </div>
                          {selectedZoneId === zone.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {!selectedZoneId && zones.length > 0 && (
                    <p className="text-sm text-destructive mt-2">
                      Selecione uma zona para continuar
                    </p>
                  )}

                  {/* Stock Availability Feedback */}
                  {selectedZoneId && (
                    <div className="mt-4">
                      {stockLoading ? (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      ) : allItemsAvailable ? (
                        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600">
                          <Check className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium">Todos os produtos disponíveis nesta zona!</span>
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-3">
                          <div className="flex items-center gap-2 text-amber-600">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium">Alguns produtos não estão disponíveis:</span>
                          </div>
                          <ul className="space-y-2">
                            {itemsAvailability.map(item => (
                              <li key={item.productId} className="flex items-center gap-2 text-sm">
                                {item.isAvailable ? (
                                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                                )}
                                <span className={!item.isAvailable ? 'text-red-600' : ''}>
                                  {item.productName}
                                  {!item.isAvailable && (
                                    <span className="text-muted-foreground ml-1">
                                      (apenas {item.available} em estoque)
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => navigate(`/produtos?zona=${selectedZoneId}`)}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Ver produtos disponíveis nesta zona
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <Label className="mb-3 block">Endereços salvos</Label>
                      <RadioGroup
                        value={selectedAddressId}
                        onValueChange={setSelectedAddressId}
                        className="space-y-3"
                      >
                        {savedAddresses.map(addr => (
                          <div
                            key={addr.id}
                            className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedAddressId === addr.id ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setSelectedAddressId(addr.id!)}
                          >
                            <RadioGroupItem value={addr.id!} id={addr.id} className="mt-1" />
                            <div className="flex-1">
                              <p className="font-medium flex items-center gap-2">
                                {addr.label}
                                {addr.is_default && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                    Padrão
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {addr.street}, {addr.number}
                                {addr.complement && ` - ${addr.complement}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {addr.neighborhood}, {addr.city} - {addr.state}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === 'new' ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedAddressId('new')}
                        >
                          <RadioGroupItem value="new" id="new-address" />
                          <Label htmlFor="new-address" className="cursor-pointer">
                            Usar novo endereço
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* New Address Form */}
                  {selectedAddressId === 'new' && (
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="label">Apelido</Label>
                          <Input
                            id="label"
                            placeholder="Casa, Trabalho..."
                            {...form.register('label')}
                          />
                          {form.formState.errors.label && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.label.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            placeholder="00000-000"
                            {...form.register('cep')}
                            onBlur={handleCepBlur}
                          />
                          {cepLoading && (
                            <p className="text-sm text-muted-foreground">Buscando CEP...</p>
                          )}
                          {form.formState.errors.cep && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.cep.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="street">Rua</Label>
                          <Input id="street" {...form.register('street')} />
                          {form.formState.errors.street && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.street.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="number">Número</Label>
                          <Input id="number" {...form.register('number')} />
                          {form.formState.errors.number && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.number.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento (opcional)</Label>
                        <Input
                          id="complement"
                          placeholder="Apto, bloco..."
                          {...form.register('complement')}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="neighborhood">Bairro</Label>
                          <Input id="neighborhood" {...form.register('neighborhood')} />
                          {form.formState.errors.neighborhood && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.neighborhood.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input id="city" {...form.register('city')} />
                          {form.formState.errors.city && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.city.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            placeholder="UF"
                            maxLength={2}
                            {...form.register('state')}
                          />
                          {form.formState.errors.state && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reference">Referência (opcional)</Label>
                        <Input
                          id="reference"
                          placeholder="Próximo ao..."
                          {...form.register('reference')}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full gradient-primary"
                        size="lg"
                        disabled={!canSubmit || isSubmitting}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        {isSubmitting 
                          ? 'Processando...' 
                          : !allItemsAvailable 
                            ? 'Produtos indisponíveis' 
                            : 'Finalizar pelo WhatsApp'}
                      </Button>
                    </form>
                  )}

                  {/* Submit for saved address */}
                  {selectedAddressId !== 'new' && (
                    <Button
                      onClick={() => {
                        const saved = savedAddresses.find(a => a.id === selectedAddressId);
                        if (saved) {
                          handleSubmit(saved as AddressForm);
                        }
                      }}
                      className="w-full gradient-primary"
                      size="lg"
                      disabled={!canSubmit || isSubmitting}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {isSubmitting 
                        ? 'Processando...' 
                        : !allItemsAvailable 
                          ? 'Produtos indisponíveis' 
                          : 'Finalizar pelo WhatsApp'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => {
                    const availability = itemsAvailability.find(a => a.productId === item.product.id);
                    const isUnavailable = availability && !availability.isAvailable;
                    
                    return (
                      <div 
                        key={item.product.id} 
                        className={`flex gap-3 ${isUnavailable ? 'opacity-60' : ''}`}
                      >
                        <div className="relative">
                          <img
                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          {isUnavailable && (
                            <div className="absolute inset-0 bg-background/80 rounded flex items-center justify-center">
                              <X className="h-6 w-6 text-destructive" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity}x R$ {item.product.price.toFixed(2).replace('.', ',')}
                          </p>
                          {isUnavailable && (
                            <p className="text-xs text-destructive">
                              Indisponível nesta zona
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-sm">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    );
                  })}

                  <hr className="border-border" />

                  {selectedZone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Zona</span>
                      <span className="font-medium">{selectedZone.name}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Pagamento na entrega</span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Finalize pelo WhatsApp e combine o pagamento diretamente com o vendedor.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
