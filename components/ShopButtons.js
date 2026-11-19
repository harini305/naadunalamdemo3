'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useShop } from './ShopProvider';
import { IconCheck, IconHeart, IconPlus } from './Icons';

export function AddButton({ slug, hasOptions }) {
  const { add } = useShop();
  const [added, setAdded] = useState(false);
  if (hasOptions) {
    return <Link className="add-btn" href={`/product/${slug}`} prefetch={false}>Choose pack</Link>;
  }
  return (
    <button
      type="button"
      className="add-btn"
      data-added={added ? 'true' : 'false'}
      onClick={() => { add(slug, 1); setAdded(true); setTimeout(() => setAdded(false), 1600); }}
    >
      {added ? <IconCheck /> : <IconPlus />} {added ? 'Added' : 'Add'}
    </button>
  );
}

export function WishButton({ slug, name }) {
  const { wish, toggleWish, ready } = useShop();
  const on = ready && wish.includes(slug);
  return (
    <button type="button" className="wish-btn" aria-pressed={on} aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`} onClick={() => toggleWish(slug)}>
      <IconHeart />
    </button>
  );
}
