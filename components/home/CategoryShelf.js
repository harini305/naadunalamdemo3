import Link from 'next/link';
import { IconArrow } from '../Icons';

export default function CategoryShelf({ categories }) {
  return (
    <section className="section section--paper shelf" aria-labelledby="shelf-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="shelf-title">
            <span className="title-ta" lang="ta">வகைகள்</span>
            <span className="title-en">Shop by category</span>
          </h2>
          <div className="section-head__side">
            <p>Everything on Naadu Nalam, grouped the way an Indian kitchen actually shops.</p>
            <Link href="/shop" prefetch={false} className="link-arrow">View all 82 products <IconArrow width="18" height="18" /></Link>
          </div>
        </div>
        <ul className="shelf__grid">
          {categories.map((c) => (
            <li key={c.slug} data-reveal>
              <Link href={`/product-category/${c.slug}`} prefetch={false} className="shelf__tile hover-zoom">
                <span className="frame shelf__img">{c.image && <img src={c.image.src} alt={c.imageAlt || c.nameEn} width="360" height="360" loading="lazy" />}</span>
                <span className="shelf__name">{c.nameEn}</span>
                <span className="shelf__ta" lang="ta">{c.nameTa}</span>
                <span className="shelf__count">{c.count} {c.count === 1 ? 'product' : 'products'}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
