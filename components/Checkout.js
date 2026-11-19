'use client';
// Frontend-only checkout. There is no order backend in this build, so the order is composed as an email to
// Naadu Nalam (Cash on Delivery, as on the source site). Nothing is charged and no fake confirmation is shown.
import Link from 'next/link';
import { useState } from 'react';
import { useShop } from './ShopProvider';
import { Summary } from './CartView';
import { formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import EmptyState from './EmptyState';

export default function Checkout() {
  const { ready, lines, subtotal, delivery, total } = useShop();
  const [f, setF] = useState({ name: '', phone: '', email: '', address: '', city: '', pincode: '', notes: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  if (!ready) return null;
  if (!lines.length) {
    return (
      <EmptyState title="Checkout" text="Your basket is empty, so there is nothing to check out yet. Add a few things from the marketplace first."
        primary={{ href: '/shop', label: 'Go to the shop' }} secondary={{ href: '/cart', label: 'View basket' }} />
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const items = lines.map((l) => `• ${l.product.nameEn} (${l.product.nameTa}) — ${l.pack} × ${l.qty} = ${formatPrice(l.total)}`).join('\n');
    const body = `New order — Cash on Delivery\n\n${items}\n\nSubtotal: ${formatPrice(subtotal)}\nDelivery: ${formatPrice(delivery)}\nTotal: ${formatPrice(total)}\n\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\nAddress: ${f.address}, ${f.city} — ${f.pincode}\nNotes: ${f.notes || '-'}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Order request from ${f.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="cart">
      <form className="cart__lines checkout" onSubmit={submit}>
        <h1>Checkout</h1>
        <p className="form-note">Payment is Cash on Delivery. Your order is sent to Naadu Nalam by email, and the team confirms it with you before dispatch.</p>
        <div className="form-grid">
          <div className="field"><label htmlFor="o-name">Full name</label><input id="o-name" required value={f.name} onChange={set('name')} autoComplete="name" /></div>
          <div className="field"><label htmlFor="o-phone">Phone number</label><input id="o-phone" type="tel" required value={f.phone} onChange={set('phone')} autoComplete="tel" /></div>
          <div className="field span-2"><label htmlFor="o-email">Email address</label><input id="o-email" type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></div>
          <div className="field span-2"><label htmlFor="o-addr">Delivery address</label><textarea id="o-addr" required value={f.address} onChange={set('address')} autoComplete="street-address" /></div>
          <div className="field"><label htmlFor="o-city">City</label><input id="o-city" required value={f.city} onChange={set('city')} autoComplete="address-level2" /></div>
          <div className="field"><label htmlFor="o-pin">Pin code</label><input id="o-pin" required inputMode="numeric" pattern="[0-9]{6}" value={f.pincode} onChange={set('pincode')} autoComplete="postal-code" /></div>
          <div className="field span-2"><label htmlFor="o-notes">Order notes (optional)</label><textarea id="o-notes" value={f.notes} onChange={set('notes')} /></div>
        </div>
        <p className="form-note">Please check your delivery address, pin code and phone number carefully. Fruits, vegetables and frozen items are delivered only within Chennai and selected Tamil Nadu locations.</p>
        <div className="btn-row">
          <button type="submit" className="btn btn--clay">Send order by email — {formatPrice(total)}</button>
          <Link href="/cart" prefetch={false} className="btn btn--line-dark">Back to basket</Link>
        </div>
        {sent && <p className="form-note" role="status">Your email app should now be open with the order. Send it to place the request — if nothing opened, call {site.phoneDisplay}.</p>}
      </form>
      <aside className="cart__side"><Summary cta={false} /></aside>
    </div>
  );
}
