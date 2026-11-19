'use client';
import { useState } from 'react';
import { useShop } from './ShopProvider';
import { formatPrice } from '@/lib/format';
import { IconBasket, IconHeart } from './Icons';

export function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  return (
    <div className="pd2-gallery">
      <figure className="pd2-arch">
        <span className="pd2-arch__line" aria-hidden="true" />
        <div className="pd2-arch__clip">
          {images.map((m, k) => (
            <img key={m.src} src={m.src} alt={k === i ? (m.alt || name) : ''} width={m.w} height={m.h} data-on={k === i ? 'true' : 'false'}
              fetchPriority={k === 0 ? 'high' : 'auto'} loading={k === 0 ? 'eager' : 'lazy'} />
          ))}
        </div>
      </figure>
      {images.length > 1 && (
        <div className="pd2-thumbs" role="tablist" aria-label="Product images">
          {images.map((m, k) => (
            <button key={m.src} type="button" role="tab" aria-selected={k === i} aria-label={`Image ${k + 1}${m.kind === 'label' ? ' (pack label)' : ''}`} onClick={() => setI(k)}>
              <img src={m.src} alt="" width="72" height="72" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BuyBox({ product }) {
  const { add, wish, toggleWish, ready } = useShop();
  const [vid, setVid] = useState(product.variations[0]?.id || null);
  const [qty, setQty] = useState(1);
  const v = product.variations.find((x) => x.id === vid);
  const price = v ? v.price : product.price;
  const max = product.maxQty || 99;
  const saved = ready && wish.includes(product.slug);

  return (
    <div className="pd2-buy">
      <div className="pd2-price">
        <strong>{formatPrice(price)}</strong>
        <span>{v ? v.pack : product.packs.join(' / ')}</span>
        <em>{product.inStock ? 'In stock' : 'Out of stock'}</em>
      </div>
      {product.variations.length > 0 && (
        <fieldset className="pd2-packs">
          <legend>Choose a pack</legend>
          <div>
            {product.variations.map((x) => (
              <button key={x.id} type="button" className="chip" aria-pressed={x.id === vid} onClick={() => setVid(x.id)}>
                {x.pack} <small>{formatPrice(x.price)}</small>
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <div className="pd2-actions">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input type="number" min="1" max={max} value={qty} aria-label="Quantity"
            onChange={(e) => setQty(Math.max(1, Math.min(max, parseInt(e.target.value || '1', 10))))} />
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(max, q + 1))}>+</button>
        </div>
        <button type="button" className="btn btn--clay pd-add" onClick={() => add(product.slug, qty, vid)}>
          <IconBasket /> Add to basket — {formatPrice(price * qty)}
        </button>
        <button type="button" className="icon-btn pd-wish" aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => toggleWish(product.slug)}>
          <IconHeart />
        </button>
      </div>
    </div>
  );
}
