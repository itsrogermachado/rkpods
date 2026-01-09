import { useState, useEffect } from 'react';
import { Package, FolderTree, ShoppingCart, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  products: number;
  categories: number;
  orders: number;
  pendingOrders: number;
  revenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);

    const [productsRes, categoriesRes, ordersRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('*'),
    ]);

    const orders = ordersRes.data || [];
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    setStats({
      products: productsRes.count || 0,
      categories: categoriesRes.count || 0,
      orders: orders.length,
      pendingOrders,
      revenue,
    });

    setLoading(false);
  }

  const statCards = [
    {
      title: 'Produtos',
      value: stats.products,
      icon: Package,
      gradient: 'gradient-primary',
    },
    {
      title: 'Categorias',
      value: stats.categories,
      icon: FolderTree,
      gradient: 'bg-secondary',
    },
    {
      title: 'Pedidos',
      value: stats.orders,
      icon: ShoppingCart,
      gradient: 'bg-accent',
    },
    {
      title: 'Pendentes',
      value: stats.pendingOrders,
      icon: Clock,
      gradient: 'bg-warning',
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.revenue.toFixed(2).replace('.', ',')}`,
      icon: TrendingUp,
      gradient: 'bg-success',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral da sua loja</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map(stat => (
          <Card key={stat.title} className="overflow-hidden border-0 shadow-lg">
            <div className={`${stat.gradient} p-4`}>
              <stat.icon className="h-8 w-8 text-white" />
            </div>
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? '...' : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}