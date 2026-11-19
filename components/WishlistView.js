'use client';
// Wishlist as a shopping list (விருப்பப் பட்டியல்): grouped by storefront, pack choice per item,
// add-all / email-list / clear actions, and suggestions. Empty state offers starter picks to save in place.
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useShop } from './ShopProvider';
import ProductCard from './ProductCard';
import { WishButton } from './ShopButtons';
import { KolamBand, Thoranam } from './Ornaments';
import { IconArrow, IconBasket, IconClose, IconHeart, IconMail } from './Icons';
import { formatPrice, priceLabel } from '@/lib/format';

const SELLERS = [
  ['naadunalam', 'Naadu Nalam', 'நாடு நலம்'],
  ['thaayanbu', 'Thaayanbu', 'தாயன்பு'],
];

function EmptyWishlist({ starters }) {
  return (
    <section className="section section--forest wl-empty fit-footer fit-solo">
      <Thoranam />
      <div className="wrap wl-empty__grid fit-grow">
        <div className="wl-empty__text">
          <h1>Your wishlist<span lang="ta">விருப்பப் பட்டியல்</span></h1>
          <KolamBand dots={7} tone="gold" />
          <p>Nothing saved yet. Tap the heart on any product to keep it here — your list stays on this device, and you can send the whole list to your basket in one go.</p>
          <ul className="wl-how">
            <li><span><IconHeart /></span>Tap the heart on any product</li>
            <li><span><IconBasket /></span>Add the whole list to your basket at once</li>
            <li><span><IconMail /></span>Or email the list to yourself</li>
          </ul>
          <div className="btn-row">
            <Link href="/shop" prefetch={false} className="btn btn--gold">Browse products <IconArrow /></Link>
            <Link href="/product-category/rice-grains" prefetch={false} className="btn btn--line">Traditional rice</Link>
          </div>
        </div>
        <div className="wl-empty__picks">
          <h2>Start with these</h2>
          <ul>
            {starters.map((p) => (
              <li key={p.slug} className="wl-pick">
                <WishButton slug={p.slug} name={p.nameEn} />
                <Link href={`/product/${p.slug}`} prefetch={false} className="wl-pick__img"><img src={p.images[0].src} alt={p.images[0].alt || p.nameEn} width="240" height="240" loading="lazy" /></Link>
                <Link href={`/product/${p.slug}`} prefetch={false} className="wl-pick__name">{p.nameEn}<small lang="ta">{p.nameTa}</small></Link>
                <span className="wl-pick__price">{priceLabel(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function WishlistView({ products, starters }) {
  const { ready, wish, toggleWish, clearWish, add } = useShop();
  const [packs, setPacks] = useState({});
  const saved = useMemo(() => wish.map((s) => products.find((p) => p.slug === s)).filter(Boolean), [wish, products]);

  if (!ready) return <section className="section section--paper fit-footer fit-solo" aria-busy="true" />;
  if (!saved.length) return <EmptyWishlist starters={starters} />;

  const vidOf = (p) => packs[p.slug] ?? p.variations[0]?.id ?? null;
  const priceOf = (p) => { const v = p.variations.find((x) => x.id === vidOf(p)); return v ? v.price : p.price; };
  const packOf = (p) => { const v = p.variations.find((x) => x.id === vidOf(p)); return v ? v.pack : p.packs.join(' / '); };
  const total = saved.reduce((n, p) => n + priceOf(p), 0);
  const groups = SELLERS.map(([k, en, ta]) => ({ k, en, ta, list: saved.filter((p) => p.seller === k) })).filter((g) => g.list.length);
  const addAll = () => saved.forEach((p) => add(p.slug, 1, vidOf(p)));
  const body = saved.map((p) => `• ${p.nameEn} (${p.nameTa}) — ${packOf(p)} — ${formatPrice(priceOf(p))}`).join('\n');
  const mailto = `mailto:?subject=${encodeURIComponent('My Naadu Nalam wishlist')}&body=${encodeURIComponent(`${body}\n\nEstimated total: ${formatPrice(total)}`)}`;
  const cats = new Set(saved.flatMap((p) => p.categories));
  const suggestions = [
    ...products.filter((p) => !wish.includes(p.slug) && p.categories.some((c) => cats.has(c))),
    ...starters.filter((p) => !wish.includes(p.slug)),
  ].filter((p, i, a) => a.findIndex((x) => x.slug === p.slug) === i).slice(0, 4);

  return (
    <>
      <section className="section section--paper wl">
        <div className="wrap wl__grid">
          <aside className="wl__panel">
            <div className="wl__panel-inner">
              <Thoranam />
              <div className="wl__panel-body">
                <h1>Your wishlist<span lang="ta">விருப்பப் பட்டியல்</span></h1>
                <KolamBand dots={7} tone="gold" />
                <dl className="wl__stats">
                  <div><dt>Saved</dt><dd>{saved.length}</dd></div>
                  <div><dt>Estimated total</dt><dd>{formatPrice(total)}</dd></div>
                </dl>
                <p>One pack of each, at the listed price. Delivery is a flat ₹50 per order and payment is Cash on Delivery.</p>
                <button type="button" className="btn btn--gold btn--block" onClick={addAll}><IconBasket /> Add all to basket</button>
                <a className="btn btn--line btn--block" href={mailto}><IconMail /> Email my list</a>
                <button type="button" className="wl__clear" onClick={clearWish}>Clear the list</button>
              </div>
            </div>
          </aside>
          <div className="wl__list">
            {groups.map((g) => (
              <div key={g.k} className="wl-group">
                <div className="wl-group__head">
                  <h2>{g.en} <span lang="ta">{g.ta}</span></h2>
                  <span className="wl-group__n">{g.list.length} saved</span>
                  <Link href={`/store/${g.k}`} prefetch={false} className="link-arrow">Visit store <IconArrow width="16" height="16" /></Link>
                </div>
                <ul>
                  {g.list.map((p) => (
                    <li key={p.slug} className="wl-row">
                      <Link href={`/product/${p.slug}`} prefetch={false} className="wl-row__img"><img src={p.images[0].src} alt="" width="96" height="96" loading="lazy" /></Link>
                      <div className="wl-row__name">
                        <Link href={`/product/${p.slug}`} prefetch={false}><strong>{p.nameEn}</strong></Link>
                        <span lang="ta">{p.nameTa}</span>
                      </div>
                      <div className="wl-row__pack">
                        {p.variations.length ? (
                          <select aria-label={`Pack for ${p.nameEn}`} value={vidOf(p)} onChange={(e) => setPacks((x) => ({ ...x, [p.slug]: Number(e.target.value) }))}>
                            {p.variations.map((v) => (<option key={v.id} value={v.id}>{v.pack}</option>))}
                          </select>
                        ) : (<span>{p.packs.join(' / ')}</span>)}
                      </div>
                      <strong className="wl-row__price">{formatPrice(priceOf(p))}</strong>
                      <button type="button" className="add-btn" onClick={() => add(p.slug, 1, vidOf(p))}><IconBasket /> Add</button>
                      <button type="button" className="icon-btn wl-row__remove" aria-label={`Remove ${p.nameEn} from wishlist`} onClick={() => toggleWish(p.slug)}><IconClose /></button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--rice fit-footer">
        <div className="wrap fit-grow fit-col">
          <div className="pd2-related__head">
            <h2 className="pd-related__title">Worth saving next</h2>
            <Link href="/shop" prefetch={false} className="link-arrow">Browse all products <IconArrow width="18" height="18" /></Link>
          </div>
          <div className="product-grid wl__more">{suggestions.map((p) => (<ProductCard key={p.slug} p={p} variant="arch" />))}</div>
        </div>
      </section>
    </>
  );
}
