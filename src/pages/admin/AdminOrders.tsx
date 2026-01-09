import { useState, useEffect } from 'react';
import { Eye, MessageCircle, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Order, Address, CartItem, Zone } from '@/types';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
];

interface OrderWithZone extends Order {
  zone_id?: string | null;
  zone_name?: string | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithZone[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithZone | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [ordersRes, zonesRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('zones').select('*').order('name'),
    ]);

    if (ordersRes.data) {
      setOrders(ordersRes.data.map(order => ({
        ...order,
        items: order.items as unknown as CartItem[],
        address: order.address as unknown as Address,
      })) as OrderWithZone[]);
    }
    if (zonesRes.data) setZones(zonesRes.data as Zone[]);
    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      toast.success('Status atualizado');
      fetchData();
    }
  }

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

  const filteredOrders = orders
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .filter(o => filterZone === 'all' || o.zone_id === filterZone);

  const sendWhatsApp = (order: OrderWithZone) => {
    // Find the zone to get the WhatsApp number
    const zone = zones.find(z => z.id === order.zone_id);
    const whatsappNumber = zone?.whatsapp_number || '55';
    
    const address = order.address;
    const message = `Olá! Sobre seu pedido #${order.id.slice(0, 8)}:

Total: R$ ${order.total.toFixed(2).replace('.', ',')}

Endereço de entrega:
${address.street}, ${address.number}
${address.neighborhood}, ${address.city} - ${address.state}
CEP: ${address.cep}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <div className="flex items-center gap-2">
          <Select value={filterZone} onValueChange={setFilterZone}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Zona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Zonas</SelectItem>
              {zones.map(z => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              {statusOptions.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Nenhum pedido encontrado.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id}>
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold">#{order.id.slice(0, 8)}</span>
                      {getStatusBadge(order.status)}
                      {order.zone_name && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPinned className="h-3 w-3" />
                          {order.zone_name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm mt-1">
                      {(order.items as any[]).length} item(s) • 
                      <span className="font-semibold text-primary ml-1">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={v => updateStatus(order.id, v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => sendWhatsApp(order)}
                      title="Enviar WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Pedido #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                {selectedOrder.zone_name && (
                  <div>
                    <h3 className="font-semibold mb-2">Zona</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPinned className="h-3 w-3" />
                      {selectedOrder.zone_name}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Itens</h3>
                <div className="space-y-2">
                  {(selectedOrder.items as any[]).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {selectedOrder.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.address.label && `${selectedOrder.address.label}: `}
                  {selectedOrder.address.street}, {selectedOrder.address.number}
                  {selectedOrder.address.complement && ` - ${selectedOrder.address.complement}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.address.neighborhood}, {selectedOrder.address.city} - {selectedOrder.address.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  CEP: {selectedOrder.address.cep}
                </p>
                {selectedOrder.address.reference && (
                  <p className="text-sm text-muted-foreground">
                    Ref: {selectedOrder.address.reference}
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data do Pedido</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
