import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Coupon } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  finalPrice: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rkpods_cart';
const COUPON_STORAGE_KEY = 'rkpods_coupon';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(current => {
      const existingItem = current.find(item => item.product.id === product.id);
      if (existingItem) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { success: false, message: 'Cupom não encontrado ou inválido' };
      }

      const coupon = data as unknown as Coupon;

      // Check validity period
      if (coupon.valid_from && new Date(coupon.valid_from) > new Date()) {
        return { success: false, message: 'Este cupom ainda não está válido' };
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        return { success: false, message: 'Este cupom expirou' };
      }

      // Check max uses
      if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        return { success: false, message: 'Este cupom atingiu o limite de usos' };
      }

      // Check min purchase
      if (totalPrice < coupon.min_purchase) {
        return {
          success: false,
          message: `Compra mínima de R$ ${coupon.min_purchase.toFixed(2).replace('.', ',')} necessária`,
        };
      }

      setAppliedCoupon(coupon);
      return { success: true, message: 'Cupom aplicado com sucesso!' };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: 'Erro ao aplicar cupom' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculate discount
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? (totalPrice * appliedCoupon.discount_value) / 100
      : Math.min(appliedCoupon.discount_value, totalPrice)
    : 0;

  const finalPrice = totalPrice - couponDiscount;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        appliedCoupon,
        couponDiscount,
        finalPrice,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
