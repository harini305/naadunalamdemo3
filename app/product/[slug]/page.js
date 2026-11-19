import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { BuyBox, Gallery } from '@/components/ProductBuy';
import { KolamBand } from '@/components/Ornaments';
import { IconArrow, IconClock, IconCoins, IconPhone, IconTruck } from '@/components/Icons';
import { getCategory, getProduct, getProducts, relatedProducts, sellerDisplay } from '@/lib/catalog';
import { site } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  return p ? { title: `${p.nameEn} (${p.nameTa})`, description: p.shortDescription } : {};
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.categories[0]);
  const seller = sellerDisplay[p.seller];
  const related = relatedProducts(p, 4);
  const buy = { slug: p.slug, price: p.price, packs: p.packs, variations: p.variations, maxQty: p.maxQty, inStock: p.inStock };

  return (
    <main id="main" className="page-main">
      <section className="section section--paper pd2">
        <div className="wrap pd2__grid">
          <Gallery images={p.images} name={p.nameEn} />
          <div className="pd2__info">
            <div className="pd2__chips">
              {cat && <Link href={`/product-category/${cat.slug}`} prefetch={false} className="chip">{cat.nameEn}</Link>}
              {seller && <Link href={`/store/${p.seller}`} prefetch={false} className="chip">Sold by {seller.name}</Link>}
            </div>
            <h1>{p.nameEn}<span className="pd2__ta" lang="ta">{p.nameTa}</span></h1>
            {p.shortDescription && <p className="pd2__lede">{p.shortDescription}</p>}
            <BuyBox product={buy} />
            <ul className="pd2__facts">
              <li><IconTruck /><span><strong>Flat ₹50</strong> delivery across Chennai &amp; Tamil Nadu</span></li>
              <li><IconCoins /><span><strong>Cash on delivery</strong> — pay when your order arrives</span></li>
              <li><IconClock /><span><strong>Packed in 24–48 hours</strong> on business days</span></li>
            </ul>
            <p className="pd2__call"><IconPhone /> Questions? Call <a href={site.phoneHref}>{site.phoneDisplay}</a></p>
          </div>
        </div>
      </section>

      <section className="section section--soil pd2-desc">
        <div className="wrap pd2-desc__grid">
          <article className="olai" lang="ta">
            <span className="olai__hole olai__hole--l" aria-hidden="true" />
            <span className="olai__hole olai__hole--r" aria-hidden="true" />
            <h2>விளக்கம் <small lang="en">Description</small></h2>
            <div className="olai__text" dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} />
          </article>
          <aside className="pd2-spec" data-reveal>
            <h2>Product details</h2>
            <KolamBand dots={7} tone="gold" />
            <dl>
              {p.sku && (<div><dt>SKU</dt><dd>{p.sku}</dd></div>)}
              {p.packs.length > 0 && (<div><dt>Pack</dt><dd>{p.packs.join(', ')}</dd></div>)}
              {p.weight && (<div><dt>Weight</dt><dd>{p.weight}</dd></div>)}
              {p.dimensions && (<div><dt>Dimensions</dt><dd>{p.dimensions}</dd></div>)}
              {cat && (<div><dt>Category</dt><dd><Link href={`/product-category/${cat.slug}`} prefetch={false}>{cat.nameEn}</Link></dd></div>)}
              {seller && (<div><dt>Seller</dt><dd><Link href={`/store/${p.seller}`} prefetch={false}>{seller.name}</Link></dd></div>)}
              <div><dt>Reviews</dt><dd>No reviews yet</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--paper pd-related fit-footer">
          <div className="wrap fit-grow fit-col">
            <div className="pd2-related__head">
              <h2 className="pd-related__title">You may also like</h2>
              {cat && <Link href={`/product-category/${cat.slug}`} prefetch={false} className="link-arrow">More {cat.nameEn} <IconArrow width="18" height="18" /></Link>}
            </div>
            <div className="product-grid">
              {related.map((r) => (<ProductCard key={r.slug} p={r} variant="arch" />))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
