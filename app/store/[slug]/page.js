import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import PageBand from '@/components/PageBand';
import ClosingBand from '@/components/ClosingBand';
import ShopBrowser from '@/components/ShopBrowser';
import { getProducts, getSeller, getSellers, orderedCategories, productsBySeller } from '@/lib/catalog';
import { cardShape, categoryShape } from '@/lib/shapes';

const INTRO = {
  naadunalam: 'The Naadu Nalam storefront: heirloom rice, aval, siruthaniyam and pulses from Tamil Nadu.',
  thaayanbu: 'தாயன்பு — a mother’s love. Honey, cold-pressed oils and ghee, natural sweeteners, health mixes, podis and herbal essentials.',
};
const TA = { naadunalam: 'நாடு நலம்', thaayanbu: 'தாயன்பு' };

export const dynamicParams = false;
export function generateStaticParams() {
  return getSellers().map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getSeller(slug);
  return s ? { title: `${s.name} store`, description: INTRO[slug] } : {};
}

export default async function SellerPage({ params }) {
  const { slug } = await params;
  const s = getSeller(slug);
  if (!s) notFound();
  const mine = productsBySeller(slug);
  const cats = orderedCategories().filter((c) => s.categories.includes(c.slug))
    .map((c) => ({ ...categoryShape(c), count: mine.filter((p) => p.categories.includes(c.slug)).length }));
  return (
    <main id="main" className="page-main">
      <PageBand title={`${s.name} store`} ta={TA[slug]} intro={`${INTRO[slug] || ''} ${s.productCount} products.`} cta={{ href: '/store-listing', label: 'All storefronts' }} />
      <section className="section section--paper">
        <div className="wrap">
          <Suspense fallback={null}>
            <ShopBrowser products={mine.map(cardShape)} categories={cats} sellers={[]} fixedSeller={slug} />
          </Suspense>
        </div>
      </section>
      <ClosingBand />
    </main>
  );
}
