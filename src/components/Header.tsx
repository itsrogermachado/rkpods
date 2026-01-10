import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, Heart, Settings } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ZoneIndicator } from '@/components/ZoneIndicator';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Scroll to products section on homepage
      const productsSection = document.getElementById('todos-produtos');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 overflow-hidden">
      {/* Vapor glow sutil no header */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute -top-10 left-1/4 w-64 h-32 rounded-full animate-smoke-drift opacity-30"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(187 85% 48% / 0.15), transparent 70%)',
            filter: 'blur(25px)',
          }} 
        />
        <div 
          className="absolute -top-8 right-1/3 w-48 h-24 rounded-full animate-vapor-pulse opacity-25"
          style={{ 
            background: 'radial-gradient(ellipse, hsl(175 80% 45% / 0.12), transparent 70%)',
            filter: 'blur(20px)',
          }} 
        />
      </div>
      {/* Gradiente de vapor na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="RKPODS" className="h-10 w-auto drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:drop-shadow-[0_0_25px_hsl(var(--primary)/0.7)] transition-all duration-300" />
        </Link>


        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <ZoneIndicator />
          <ThemeToggle />
          
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link to="/admin">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {user && (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link to="/favoritos">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs gradient-primary border-0">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to={user ? '/minha-conta' : '/auth'}>
              <User className="h-5 w-5" />
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar produtos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </form>


                {/* Mobile Account Links */}
                <div className="flex flex-col gap-4">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      Painel Admin
                    </Link>
                  )}
                  <Link
                    to={user ? '/minha-conta' : '/auth'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <User className="h-5 w-5" />
                    {user ? 'Minha Conta' : 'Entrar'}
                  </Link>
                  {user && (
                    <Link
                      to="/favoritos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      Favoritos
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
