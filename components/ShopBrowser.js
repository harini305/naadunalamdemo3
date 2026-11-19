'use client';
// Marketplace browser (shop, category and seller pages): round category rail, one-line toolbar,
// arch-topped product cards and — on the unfiltered shop — one wide story tile woven into the grid.
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ProductCard from './ProductCard';
import { IconArrow, IconClose, IconSearch } from './Icons';

const SORTS = [
  ['default', 'Default sorting'],
  ['latest', 'Latest'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['name', 'Name A–Z'],
];

function StoryTile() {
  return (
    <Link href="/contact?topic=thai-pongal-combo" prefetch={false} className="mk-story hover-zoom" data-reveal>
      <span className="frame mk-story__img"><img src="/images/client/family-courtyard.webp" alt="" width="770" height="528" loading="lazy" /></span>
      <span className="mk-story__text">
        <span className="mk-story__ta" lang="ta">தைப்பொங்கல் காம்போ</span>
        <strong>Thaayanbu Naadu Nalam Thai Pongal Combo</strong>
        <span>10 items for about ₹999, or 17 items for about ₹1999. Orders close 31-12-2026, delivery 5 to 10-1-2027.</span>
        <span className="link-arrow">Enquire about the combo <IconArrow width="16" height="16" /></span>
      </span>
    </Link>
  );
}

export default function ShopBrowser({ products, categories, sellers, fixedCategory = null, fixedSeller = null }) {
  const params = useSearchParams();
  const root = useRef(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(fixedCategory || 'all');
  const [seller, setSeller] = useState(fixedSeller || 'all');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    const qp = params.get('q');
    if (qp) setQ(qp);
  }, [params]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.mk__cat', { y: 18, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04, delay: 0.1 });
    });
    return () => mm.revert();
  }, { scope: root });

  const pool = useMemo(() => products.filter((p) => seller === 'all' || p.seller === seller), [products, seller]);
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, pool.filter((p) => p.categories.includes(c.slug)).length])), [pool, categories]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let out = pool.filter((p) =>
      (cat === 'all' || p.categories.includes(cat)) &&
      (!t || p.nameEn.toLowerCase().includes(t) || p.nameTa.includes(q.trim()) || (p.shortDescription || '').toLowerCase().includes(t)));
    const price = (p) => (p.priceRange ? p.priceRange.min : p.price);
    if (sort === 'price-asc') out = [...out].sort((a, b) => price(a) - price(b));
    if (sort === 'price-desc') out = [...out].sort((a, b) => price(b) - price(a));
    if (sort === 'name') out = [...out].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    if (sort === 'latest') out = [...out].sort((a, b) => b.id - a.id);
    return out;
  }, [pool, q, cat, sort]);

  const showStory = !fixedCategory && !fixedSeller && cat === 'all' && seller === 'all' && !q && sort === 'default' && list.length > 6;
  const total = fixedSeller ? products.length : pool.length;

  const CatItem = ({ slug, en, ta, n, img }) => {
    const inner = (
      <>
        <span className="mk__cat-img">{img ? <img src={img} alt="" width="84" height="84" loading="lazy" /> : <img src="/images/brand/naadu-nalam-emblem.webp" alt="" width="84" height="84" />}</span>
        <span className="mk__cat-en">{en}</span>
        {ta && <span className="mk__cat-ta" lang="ta">{ta}</span>}
        <small>{n}</small>
      </>
    );
    if (fixedCategory) {
      const href = slug === 'all' ? '/shop' : `/product-category/${slug}`;
      return <Link href={href} prefetch={false} className="mk__cat" aria-current={slug === fixedCategory ? 'page' : undefined}>{inner}</Link>;
    }
    return <button type="button" className="mk__cat" aria-pressed={cat === slug} disabled={!n} onClick={() => setCat(slug)}>{inner}</button>;
  };

  return (
    <div className="mk" ref={root}>
      <nav className="mk__rail" aria-label="Categories">
        <CatItem slug="all" en="All products" n={total} />
        {categories.map((c) => (<CatItem key={c.slug} slug={c.slug} en={c.nameEn} ta={c.nameTa} n={fixedCategory ? c.count : counts[c.slug]} img={c.image} />))}
      </nav>

      <div className="mk__bar">
        <label className="mk__search">
          <IconSearch width="20" height="20" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search in English or Tamil" aria-label="Search products" />
          {q && <button type="button" aria-label="Clear search" onClick={() => setQ('')}><IconClose width="18" height="18" /></button>}
        </label>
        {!fixedSeller && sellers.length > 0 && (
          <div className="mk__seg" role="group" aria-label="Storefront">
            <button type="button" aria-pressed={seller === 'all'} onClick={() => setSeller('all')}>All stores</button>
            {sellers.map((s) => (<button key={s.slug} type="button" aria-pressed={seller === s.slug} onClick={() => setSeller(s.slug)}>{s.name}</button>))}
          </div>
        )}
        <p className="mk__count" aria-live="polite">{list.length} {list.length === 1 ? 'product' : 'products'}{q ? ` for “${q}”` : ''}</p>
        <label className="mk__sort">
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
          </select>
        </label>
      </div>

      {list.length ? (
        <div className="product-grid product-grid--shop">
          {list.map((p, i) => (
            <FragmentWithStory key={p.slug} story={showStory && i === 6}>
              <ProductCard p={p} variant="arch" priority={i < 4} />
            </FragmentWithStory>
          ))}
        </div>
      ) : (
        <div className="mk__empty">
          <p>No products match these filters.</p>
          <button type="button" className="btn btn--forest btn--sm" onClick={() => { setQ(''); setCat(fixedCategory || 'all'); setSeller(fixedSeller || 'all'); }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}

function FragmentWithStory({ story, children }) {
  return (<>{story && <StoryTile />}{children}</>);
}
