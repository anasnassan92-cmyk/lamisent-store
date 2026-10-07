import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  variantId: string;
  productSlug: string;
  productName: string;
  inspiredBy: string;
  sizeMl: number;
  unitPriceCents: number;
  quantity: number;
  image?: string | null;
};

type Ctx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  subtotalCents: number;
  totalItems: number;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "lamisent.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((cur) => {
      const existing = cur.find((c) => c.variantId === item.variantId);
      if (existing) {
        return cur.map((c) => c.variantId === item.variantId ? { ...c, quantity: c.quantity + qty } : c);
      }
      return [...cur, { ...item, quantity: qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setItems((cur) =>
      qty <= 0
        ? cur.filter((c) => c.variantId !== variantId)
        : cur.map((c) => c.variantId === variantId ? { ...c, quantity: qty } : c)
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((cur) => cur.filter((c) => c.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Ctx>(() => {
    const subtotalCents = items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    return { items, add, setQty, remove, clear, subtotalCents, totalItems, isOpen, setOpen };
  }, [items, add, setQty, remove, clear, isOpen]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}