"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type CartItem = {
  carId: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (carId: string) => void;
  setQty: (carId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "carstore_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "quantity">, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.carId === item.carId);
      if (existing) {
        return prev.map((i) =>
          i.carId === item.carId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const remove = useCallback((carId: string) => {
    setItems((prev) => prev.filter((i) => i.carId !== carId));
  }, []);

  const setQty = useCallback((carId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.carId === carId ? { ...i, quantity: Math.max(1, qty) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <CartContext.Provider value={{ items, count, total, add, remove, setQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
