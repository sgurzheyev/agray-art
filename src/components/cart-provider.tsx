"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "agray-cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, size: string | undefined, qty: number) => void;
  remove: (slug: string, size?: string) => void;
  clear: () => void;
  notice: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, slug: string, size?: string) {
  return a.slug === slug && (a.size ?? "") === (size ?? "");
}

let memory: CartItem[] = [];
let notice: string | null = null;
let noticeTimer: number | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(next: CartItem[]) {
  memory = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private */
  }
  emit();
}

if (typeof window !== "undefined") {
  memory = readStorage();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return memory;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

const EMPTY: CartItem[] = [];

function setNotice(text: string | null) {
  notice = text;
  emit();
  if (noticeTimer) window.clearTimeout(noticeTimer);
  if (text) {
    noticeTimer = window.setTimeout(() => {
      notice = null;
      emit();
    }, 2800);
  }
}

function getNoticeSnapshot() {
  return notice;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const currentNotice = useSyncExternalStore(subscribe, getNoticeSnapshot, () => null);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const prev = getSnapshot();
    const i = prev.findIndex((p) => sameLine(p, item.slug, item.size));
    write(
      i === -1
        ? [...prev, { ...item, qty }]
        : prev.map((p, idx) => (idx === i ? { ...p, qty: p.qty + qty } : p)),
    );
    setNotice("Добавлено в корзину");
  }, []);

  const setQty = useCallback((slug: string, size: string | undefined, qty: number) => {
    const prev = getSnapshot();
    write(
      qty <= 0
        ? prev.filter((p) => !sameLine(p, slug, size))
        : prev.map((p) => (sameLine(p, slug, size) ? { ...p, qty } : p)),
    );
  }, []);

  const remove = useCallback((slug: string, size?: string) => {
    write(getSnapshot().filter((p) => !sameLine(p, slug, size)));
  }, []);

  const clear = useCallback(() => write([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    return { items, count, total, add, setQty, remove, clear, notice: currentNotice };
  }, [items, add, setQty, remove, clear, currentNotice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
