'use client';
// Shared empty state for basket / checkout / wishlist: arch photograph + message + round category shortcuts.
import Link from 'next/link';
import categories from '@/data/categories.json';
import { IconArrow } from './Icons';
import { KolamBand } from './Ornaments';

const PICK = ['rice-grains', 'aval-flakes', 'siruthaniyam', 'natural-sweeteners', 'oil-vinegers', 'masala-podi'];

export default function EmptyState({ title, text, primary, secondary }) {
  const cats = PICK.map((s) => categories.find((c) => c.slug === s)).filter(Boolean);
  return (
    <div className="empty2">
      <figure className="empty2__img"><img src="/images/client/family-courtyard.webp" alt="A Tamil family of several generations gathered in a courtyard with baskets of grain" width="770" height="528" /></figure>
      <div className="empty2__text">
        <h1>{title}</h1>
        <KolamBand dots={7} />
        <p>{text}</p>
        <div className="btn-row">
          <Link href={primary.href} prefetch={false} className="btn btn--clay">{primary.label} <IconArrow /></Link>
          {secondary && <Link href={secondary.href} prefetch={false} className="btn btn--line-dark">{secondary.label}</Link>}
        </div>
        <ul className="empty2__cats" aria-label="Shop by category">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/product-category/${c.slug}`} prefetch={false}>
                <span>{c.image && <img src={c.image.src} alt="" width="72" height="72" loading="lazy" />}</span>
                {c.nameEn}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
