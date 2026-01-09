import { useState, useEffect } from 'react';
import { Package, FolderTree, ShoppingCart, Users, TrendingUp } from 'lucide-react';
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
      color: 'text-blue-500',
    },
    {
      title: 'Categorias',
      value: stats.categories,
      icon: FolderTree,
      color: 'text-green-500',
    },
    {
      title: 'Pedidos',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'text-purple-500',
    },
    {
      title: 'Pendentes',
      value: stats.pendingOrders,
      icon: Users,
      color: 'text-orange-500',
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.revenue.toFixed(2).replace('.', ',')}`,
      icon: TrendingUp,
      color: 'text-primary',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
