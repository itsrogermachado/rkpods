import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, Heart, Settings } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { MiniCart } from '@/components/MiniCart';
import { CategoryMenu } from '@/components/CategoryMenu';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="RKPODS" className="h-10 w-auto" />
        </Link>

        {/* Category Menu - Desktop */}
        <CategoryMenu />

        {/* Search Bar with Autocomplete */}
        <SearchAutocomplete className="hidden md:flex flex-1 max-w-sm" />

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

          {/* Mini Cart on Hover */}
          <div className="hidden md:block">
            <MiniCart />
          </div>

          {/* Mobile Cart - Direct Link */}
          <Link to="/carrinho" className="md:hidden">
            <MiniCart />
          </Link>

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
                <SearchAutocomplete onClose={() => setMobileMenuOpen(false)} />

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
