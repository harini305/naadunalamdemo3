'use client';
// Client-side basket + wishlist (frontend only — persisted to localStorage, no backend).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import catalog from '@/data/catalog-lite.json';
import { site } from '@/lib/site';

const ShopContext = createContext(null);
const CART_KEY = 'nn-basket-v1';
const WISH_KEY = 'nn-wishlist-v1';
const bySlug = Object.fromEntries(catalog.map((p) => [p.slug, p]));

function read(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function lineFor(item) {
  const p = bySlug[item.slug];
  if (!p) return null;
  const v = item.variationId ? p.variations.find((x) => x.id === item.variationId) : null;
  const unit = v ? v.price : p.price;
  const pack = v ? v.pack : p.packs[0] || '';
  return { ...item, product: p, unit, pack, total: unit * item.qty };
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    setCart(read(CART_KEY, []).filter((i) => bySlug[i.slug]));
    setWish(read(WISH_KEY, []).filter((s) => bySlug[s]));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} }, [cart, ready]);
  useEffect(() => { if (ready) try { localStorage.setItem(WISH_KEY, JSON.stringify(wish)); } catch {} }, [wish, ready]);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback((slug, qty = 1, variationId = null) => {
    const p = bySlug[slug];
    if (!p) return;
    const vid = variationId || (p.variations[0] ? p.variations[0].id : null);
    setCart((c) => {
      const key = `${slug}:${vid || ''}`;
      const found = c.find((i) => i.key === key);
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, p.maxQty || 99) } : i));
      return [...c, { key, slug, variationId: vid, qty: Math.min(qty, p.maxQty || 99) }];
    });
    notify(`${p.nameEn} added to your basket`);
  }, [notify]);

  const setQty = useCallback((key, qty) => {
    setCart((c) => c.flatMap((i) => {
      if (i.key !== key) return [i];
      const max = bySlug[i.slug]?.maxQty || 99;
      const q = Math.max(0, Math.min(qty, max));
      return q === 0 ? [] : [{ ...i, qty: q }];
    }));
  }, []);
  const remove = useCallback((key) => setCart((c) => c.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setCart([]), []);
  const toggleWish = useCallback((slug) => {
    setWish((w) => {
      const on = w.includes(slug);
      notify(on ? 'Removed from your wishlist' : `${bySlug[slug]?.nameEn || 'Item'} saved to your wishlist`);
      return on ? w.filter((s) => s !== slug) : [...w, slug];
    });
  }, [notify]);

  const clearWish = useCallback(() => { setWish([]); notify('Your wishlist is cleared'); }, [notify]);
  const lines = useMemo(() => cart.map(lineFor).filter(Boolean), [cart]);
  const count = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);
  const subtotal = useMemo(() => lines.reduce((n, l) => n + l.total, 0), [lines]);
  const delivery = lines.length ? site.deliveryFee : 0;

  const value = { ready, cart, lines, count, subtotal, delivery, total: subtotal + delivery, add, setQty, remove, clear, wish, toggleWish, clearWish, toast, catalog };
  return (
    <ShopContext.Provider value={value}>
      {children}
      <div className="toast" role="status" aria-live="polite" data-show={toast ? 'true' : 'false'}>
        <span>{toast}</span>
        {toast && toast.includes('basket') && <a href="/cart">View basket</a>}
      </div>
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
