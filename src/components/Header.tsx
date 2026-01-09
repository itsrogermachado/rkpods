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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="RKPODS" className="h-10 w-auto" />
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
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
