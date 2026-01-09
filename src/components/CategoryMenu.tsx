import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';

export function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data as Category[]);
    }
  }

  const scrollToProducts = (categorySlug?: string) => {
    const productsSection = document.getElementById('todos-produtos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
      // Trigger category filter if needed
      if (categorySlug) {
        const event = new CustomEvent('filterCategory', { detail: categorySlug });
        window.dispatchEvent(event);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hidden md:flex gap-2">
          <Grid3X3 className="h-4 w-4" />
          Categorias
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => scrollToProducts()}
        >
          <span className="font-medium">Todos os Produtos</span>
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem 
            key={category.id} 
            className="cursor-pointer"
            onClick={() => scrollToProducts(category.slug)}
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
