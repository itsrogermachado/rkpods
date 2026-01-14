export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  brand: string | null;
  flavor: string | null;
  nicotine_level: string | null;
  stock: number;
  images: string[];
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id?: string;
  user_id?: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  reference: string;
  is_default?: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: CartItem[];
  total: number;
  address: Address;
  status: string;
  zone_id?: string | null;
  zone_name?: string | null;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  slug: string;
  whatsapp_number: string;
  active: boolean;
  created_at: string;
}

export interface ZoneStock {
  id: string;
  zone_id: string;
  product_id: string;
  stock: number;
  created_at: string;
}
