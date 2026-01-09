import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Zone } from '@/types';
import { toast } from 'sonner';

export default function AdminZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    whatsapp_number: '',
    active: true,
  });

  useEffect(() => {
    fetchZones();
  }, []);

  async function fetchZones() {
    setLoading(true);
    const { data } = await supabase
      .from('zones')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) setZones(data as Zone[]);
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
      slug: editingZone ? prev.slug : generateSlug(name),
    }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    return value.replace(/\D/g, '');
  };

  const openNew = () => {
    setEditingZone(null);
    setFormData({
      name: '',
      slug: '',
      whatsapp_number: '',
      active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      slug: zone.slug,
      whatsapp_number: zone.whatsapp_number,
      active: zone.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const zoneData = {
      name: formData.name,
      slug: formData.slug,
      whatsapp_number: formatPhoneNumber(formData.whatsapp_number),
      active: formData.active,
    };

    if (editingZone) {
      const { error } = await supabase
        .from('zones')
        .update(zoneData)
        .eq('id', editingZone.id);

      if (error) {
        toast.error('Erro ao atualizar zona');
      } else {
        toast.success('Zona atualizada');
        fetchZones();
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase.from('zones').insert(zoneData);

      if (error) {
        toast.error('Erro ao criar zona');
      } else {
        toast.success('Zona criada');
        fetchZones();
        setDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta zona? Isso também removerá todo o estoque associado.')) return;

    const { error } = await supabase.from('zones').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao excluir zona');
    } else {
      toast.success('Zona excluída');
      fetchZones();
    }
  };

  const toggleActive = async (zone: Zone) => {
    const { error } = await supabase
      .from('zones')
      .update({ active: !zone.active })
      .eq('id', zone.id);

    if (error) {
      toast.error('Erro ao atualizar zona');
    } else {
      fetchZones();
    }
  };

  const formatPhoneDisplay = (phone: string) => {
    if (phone.length === 13) {
      return `+${phone.slice(0, 2)} (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}`;
    }
    return phone;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Zonas de Venda</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Zona
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingZone ? 'Editar Zona' : 'Nova Zona'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Zona *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Baixada Fluminense"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="baixada-fluminense"
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">Número WhatsApp do Vendedor *</Label>
                <Input
                  id="whatsapp_number"
                  placeholder="5521999999999"
                  value={formData.whatsapp_number}
                  onChange={e => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Digite apenas números com código do país (ex: 5521999999999)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={v => setFormData(prev => ({ ...prev, active: v }))}
                />
                <Label htmlFor="active">Zona ativa</Label>
              </div>

              <Button type="submit" className="w-full gradient-primary">
                {editingZone ? 'Salvar' : 'Criar Zona'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : zones.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Nenhuma zona cadastrada.
        </p>
      ) : (
        <div className="space-y-4">
          {zones.map(zone => (
            <Card key={zone.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{zone.name}</h3>
                    {!zone.active && (
                      <Badge variant="secondary">Inativa</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatPhoneDisplay(zone.whatsapp_number)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(zone)}
                    title={zone.active ? 'Desativar' : 'Ativar'}
                  >
                    {zone.active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(zone)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(zone.id)}
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
