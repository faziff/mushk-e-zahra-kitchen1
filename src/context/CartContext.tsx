import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  totalCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedItemForDetail: MenuItem | null;
  setSelectedItemForDetail: (item: MenuItem | null) => void;
  activeOrderSuccess: Order | null;
  setActiveOrderSuccess: (order: Order | null) => void;
  isMenuCardModalOpen: boolean;
  setIsMenuCardModalOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mzk_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [activeOrderSuccess, setActiveOrderSuccess] = useState<Order | null>(null);
  const [isMenuCardModalOpen, setIsMenuCardModalOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const addToCart = (item: MenuItem, qty: number = 1) => {
    if (!item.is_available) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        const newQty = Math.min(50, existing.quantity + qty);
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: newQty } : i));
      }
      return [...prev, { item, quantity: Math.min(50, Math.max(1, qty)) }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const safeQty = Math.min(50, quantity);
    setItems((prev) =>
      prev.map((i) => (i.item.id === itemId ? { ...i, quantity: safeQty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (itemId: string): number => {
    const found = items.find((i) => i.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalCount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedItemForDetail,
        setSelectedItemForDetail,
        activeOrderSuccess,
        setActiveOrderSuccess,
        isMenuCardModalOpen,
        setIsMenuCardModalOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
