"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string | null;
  slug: string;
  quantity: number;
  category_title?: string; // Добавил поле для категории
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  totalItems: number;
  totalPrice: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("md_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Cart parse error", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("md_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  // +1
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      setCartOpen(true); 
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // -1
  const decreaseCartQuantity = (id: number) => {
    setItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      }).filter(item => item.quantity > 0) // Удаляем, если 0
    );
  };

  // Удалить полностью
  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
        items, addToCart, decreaseCartQuantity, removeFromCart, 
        totalItems, totalPrice, cartOpen, setCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ЭТОТ ЭКСПОРТ ОБЯЗАТЕЛЕН
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};