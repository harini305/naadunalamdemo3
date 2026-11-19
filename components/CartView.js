'use client';
import Link from 'next/link';
import { useShop } from './ShopProvider';
import { formatPrice } from '@/lib/format';
import { IconArrow, IconClose } from './Icons';
import { site } from '@/lib/site';
import EmptyState from './EmptyState';
import { KolamBand } from './Ornaments';

export function Summary({ cta = true }) {
  const { subtotal, delivery, total, count } = useShop();
  return (
    <div className="summary">
      <h2>Order summary</h2>
      <KolamBand dots={7} tone="gold" />
      <dl>
        <div><dt>Items</dt><dd>{count}</dd></div>
        <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div><dt>Delivery (flat, per order)</dt><dd>{formatPrice(delivery)}</dd></div>
        <div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
      </dl>
      <p className="summary__pay">Accepted payment method: {site.payment}</p>
      {cta && <Link href="/checkout" prefetch={false} className="btn btn--clay btn--block">Proceed to checkout <IconArrow /></Link>}
    </div>
  );
}

export default function CartView() {
  const { ready, lines, setQty, remove } = useShop();
  if (!ready) return <div className="cart-empty" aria-busy="true" />;
  if (!lines.length) {
    return (
      <EmptyState title="Your basket is empty"
        text="Good food, brighter days. Start with a small mixed order — a pantry staple, a podi, and one thing you have not cooked with before."
        primary={{ href: '/shop', label: 'Start shopping' }} secondary={{ href: '/product-category/rice-grains', label: 'Traditional rice' }} />
    );
  }
  return (
    <div className="cart">
      <div className="cart__lines">
        <h1>Your Basket</h1>
        <ul>
          {lines.map((l) => (
            <li key={l.key} className="cart-line">
              <Link href={`/product/${l.slug}`} prefetch={false} className="frame cart-line__img">{l.product.image && <img src={l.product.image} alt="" width="96" height="96" />}</Link>
              <div className="cart-line__name">
                <Link href={`/product/${l.slug}`} prefetch={false}><strong>{l.product.nameEn}</strong></Link>
                <span lang="ta">{l.product.nameTa}</span>
                <small>{l.pack} · {formatPrice(l.unit)} each</small>
              </div>
              <div className="qty" role="group" aria-label={`Quantity of ${l.product.nameEn}`}>
                <button type="button" aria-label="Decrease" onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                <input type="number" value={l.qty} min="0" aria-label="Quantity" onChange={(e) => setQty(l.key, parseInt(e.target.value || '0', 10))} />
                <button type="button" aria-label="Increase" onClick={() => setQty(l.key, l.qty + 1)}>+</button>
              </div>
              <strong className="cart-line__total">{formatPrice(l.total)}</strong>
              <button type="button" className="icon-btn" aria-label={`Remove ${l.product.nameEn}`} onClick={() => remove(l.key)}><IconClose /></button>
            </li>
          ))}
        </ul>
        <Link href="/shop" prefetch={false} className="link-arrow">Continue shopping <IconArrow width="18" height="18" /></Link>
      </div>
      <aside className="cart__side"><Summary /></aside>
    </div>
  );
}
