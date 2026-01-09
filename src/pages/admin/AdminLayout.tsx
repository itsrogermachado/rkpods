import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, ArrowLeft, Menu, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: FolderTree },
  { href: '/admin/zonas', label: 'Zonas', icon: MapPinned },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
];

export default function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <nav className="space-y-2">
      {navItems.map(item => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium',
              isActive
                ? 'gradient-primary text-white shadow-lg shadow-primary/25'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6">
                <div className="mb-8 flex items-center gap-2">
                  <img src="/logo.png" alt="RKPODS" className="h-8 w-auto" />
                  <span className="text-lg font-semibold text-muted-foreground">Admin</span>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>
            <Link to="/admin" className="flex items-center gap-2">
              <img src="/logo.png" alt="RKPODS" className="h-8 w-auto" />
              <span className="text-lg font-semibold text-muted-foreground">Admin</span>
            </Link>
          </div>
          <Button variant="outline" size="sm" asChild className="border-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Loja
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 border-r bg-card p-6">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}