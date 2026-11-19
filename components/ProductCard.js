import Link from 'next/link';
import { priceLabel } from '@/lib/format';
import { AddButton, WishButton } from './ShopButtons';

export default function ProductCard({ p, priority = false, variant = '' }) {
  const img = p.images?.[0] || (p.image ? { src: p.image, alt: p.nameEn } : null);
  return (
    <article className={`product-card${variant ? ` product-card--${variant}` : ''}`} data-reveal>
      <WishButton slug={p.slug} name={p.nameEn} />
      <Link href={`/product/${p.slug}`} prefetch={false} className="product-card__media" aria-label={p.nameEn}>
        {img && <img src={img.src} alt={img.alt || p.nameEn} width="480" height="480" loading={priority ? 'eager' : 'lazy'} />}
      </Link>
      <div className="product-card__body">
        <Link href={`/product/${p.slug}`} prefetch={false}>
          <h3 className="product-card__name">{p.nameEn}</h3>
        </Link>
        {p.nameTa && <p className="product-card__ta" lang="ta">{p.nameTa}</p>}
        <div className="product-card__foot">
          <span>
            <span className="price">{priceLabel(p)}</span>{' '}
            <span className="pack">{p.packs?.join(' / ')}</span>
          </span>
          <AddButton slug={p.slug} hasOptions={p.variations?.length > 0} />
        </div>
      </div>
    </article>
  );
}
