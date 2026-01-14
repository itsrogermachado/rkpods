import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, MapPin, Package, LogOut, Plus, Trash2, Star, Edit2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Address, Order, Profile, CartItem } from '@/types';
import { toast } from 'sonner';

const profileSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().optional(),
});

const addressSchema = z.object({
  label: z.string().min(1, 'Apelido é obrigatório'),
  cep: z.string().optional(),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  reference: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

export default function MyAccount() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Casa',
      complement: '',
      reference: '',
    },
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchProfile(), fetchAddresses(), fetchOrders()]);
    setLoading(false);
  }

  async function fetchProfile() {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data as Profile);
      profileForm.reset({
        full_name: data.full_name || '',
        phone: data.phone || '',
      });
    }
  }

  async function fetchAddresses() {
    if (!user) return;
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (data) setAddresses(data as Address[]);
  }

  async function fetchOrders() {
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      // Type the items properly
      setOrders(data.map(order => ({
        ...order,
        items: order.items as unknown as CartItem[],
        address: order.address as unknown as Address,
      })) as Order[]);
    }
  }

  async function handleProfileUpdate(data: ProfileForm) {
    if (!user || !profile) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        phone: data.phone || null,
      })
      .eq('user_id', user.id);

    if (error) {
      toast.error('Erro ao atualizar perfil');
    } else {
      toast.success('Perfil atualizado com sucesso');
      fetchProfile();
    }
  }

  async function handleAddressSubmit(data: AddressFormData) {
    if (!user) return;

    if (editingAddress) {
      const { error } = await supabase
        .from('addresses')
        .update({
          label: data.label,
          cep: data.cep || null,
          street: data.street,
          number: data.number,
          complement: data.complement || null,
          neighborhood: data.neighborhood,
          city: data.city,
          reference: data.reference || null,
        })
        .eq('id', editingAddress.id);

      if (error) {
        toast.error('Erro ao atualizar endereço');
      } else {
        toast.success('Endereço atualizado');
        fetchAddresses();
      }
    } else {
      const { error } = await supabase.from('addresses').insert({
        user_id: user.id,
        label: data.label,
        cep: data.cep || '',
        street: data.street,
        number: data.number,
        complement: data.complement || null,
        neighborhood: data.neighborhood,
        city: data.city,
        state: '',
        reference: data.reference || null,
        is_default: addresses.length === 0,
      });

      if (error) {
        toast.error('Erro ao adicionar endereço');
      } else {
        toast.success('Endereço adicionado');
        fetchAddresses();
      }
    }

    setAddressDialogOpen(false);
    setEditingAddress(null);
    addressForm.reset();
  }

  async function handleDeleteAddress(id: string) {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao remover endereço');
    } else {
      toast.success('Endereço removido');
      fetchAddresses();
    }
  }

  async function handleSetDefaultAddress(id: string) {
    if (!user) return;
    
    // First, unset all defaults
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);
    
    // Then set the new default
    await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id);

    toast.success('Endereço padrão atualizado');
    fetchAddresses();
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast.success('Logout realizado com sucesso');
  };

  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    addressForm.reset({
      label: address.label,
      cep: address.cep,
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      reference: address.reference || '',
    });
    setAddressDialogOpen(true);
  };

  const openNewAddress = () => {
    setEditingAddress(null);
    addressForm.reset({
      label: 'Casa',
      complement: '',
      reference: '',
    });
    setAddressDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pendente', variant: 'secondary' },
      confirmed: { label: 'Confirmado', variant: 'default' },
      shipped: { label: 'Enviado', variant: 'default' },
      delivered: { label: 'Entregue', variant: 'outline' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
    };
    const s = statusMap[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
            <h1 className="text-3xl font-bold">Minha Conta</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Endereços</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Gerencie suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user?.email || ''} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input id="full_name" {...profileForm.register('full_name')} />
                      {profileForm.formState.errors.full_name && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(00) 00000-0000" {...profileForm.register('phone')} />
                    </div>
                    <Button type="submit" className="gradient-primary">
                      Salvar Alterações
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Meus Endereços</CardTitle>
                    <CardDescription>Gerencie seus endereços de entrega</CardDescription>
                  </div>
                  <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openNewAddress} className="gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Endereço
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>
                          {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="label">Apelido</Label>
                            <Input id="label" placeholder="Casa, Trabalho..." {...addressForm.register('label')} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input id="cep" placeholder="00000-000" {...addressForm.register('cep')} />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2 space-y-2">
                            <Label htmlFor="street">Rua</Label>
                            <Input id="street" {...addressForm.register('street')} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="number">Número</Label>
                            <Input id="number" {...addressForm.register('number')} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complement">Complemento</Label>
                          <Input id="complement" placeholder="Apto, bloco..." {...addressForm.register('complement')} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="neighborhood">Bairro</Label>
                            <Input id="neighborhood" {...addressForm.register('neighborhood')} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input id="city" {...addressForm.register('city')} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reference">Referência</Label>
                          <Input id="reference" placeholder="Próximo ao..." {...addressForm.register('reference')} />
                        </div>
                        <Button type="submit" className="w-full gradient-primary">
                          {editingAddress ? 'Salvar' : 'Adicionar'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Você ainda não tem endereços cadastrados.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {addresses.map(addr => (
                        <Card key={addr.id} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{addr.label}</h3>
                                {addr.is_default && (
                                  <Badge variant="secondary" className="gap-1">
                                    <Star className="h-3 w-3" />
                                    Padrão
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openEditAddress(addr)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteAddress(addr.id!)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {addr.street}, {addr.number}
                              {addr.complement && ` - ${addr.complement}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {addr.neighborhood}, {addr.city}
                            </p>
                            <p className="text-sm text-muted-foreground">CEP: {addr.cep}</p>
                            {addr.reference && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Ref: {addr.reference}
                              </p>
                            )}
                            {!addr.is_default && (
                              <Button
                                variant="link"
                                size="sm"
                                className="mt-2 p-0 h-auto"
                                onClick={() => handleSetDefaultAddress(addr.id!)}
                              >
                                Definir como padrão
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                  <CardDescription>Histórico de pedidos realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Você ainda não fez nenhum pedido.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <Card key={order.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Pedido #{order.id.slice(0, 8)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="space-y-2 mb-4">
                              {(order.items as any[]).map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Total</span>
                              <span className="text-primary">
                                R$ {order.total.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
