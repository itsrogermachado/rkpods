import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, MapPin, MessageCircle, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Address } from '@/types';
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

export default function Checkout() {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
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
    if (user) {
      fetchAddresses();
    }
  }, [user]);

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

  const handleSubmit = async (formData: AddressForm) => {
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

      // Create order in database
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
      });

      // Generate WhatsApp message and redirect
      const message = generateWhatsAppMessage(items, address, totalPrice);
      const whatsappLink = getWhatsAppLink(message);

      clearCart();
      toast.success('Pedido enviado! Redirecionando ao WhatsApp...');

      // Detecta se é mobile para usar método adequado
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Em mobile, usar location.href para ativar deep link corretamente
        window.location.href = whatsappLink;
      } else {
        // Em desktop, abrir nova aba
        window.open(whatsappLink, '_blank');
        navigate('/');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {/* Address Form */}
            <div className="lg:col-span-2">
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
                        disabled={isSubmitting}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        {isSubmitting ? 'Processando...' : 'Finalizar pelo WhatsApp'}
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
                      disabled={isSubmitting}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Processando...' : 'Finalizar pelo WhatsApp'}
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
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x R$ {item.product.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  ))}

                  <hr className="border-border" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Pagamento via WhatsApp</span>
                    </div>
                    <p className="text-muted-foreground">
                      Após finalizar, você será redirecionado ao WhatsApp para confirmar
                      o pedido e combinar o pagamento.
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
