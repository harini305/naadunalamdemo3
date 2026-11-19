import { Suspense } from 'react';
import PageBand from '@/components/PageBand';
import ClosingBand from '@/components/ClosingBand';
import ShopBrowser from '@/components/ShopBrowser';
import { getProducts, getSellers, orderedCategories } from '@/lib/catalog';
import { cardShape, categoryShape } from '@/lib/shapes';

export const metadata = {
  title: 'Shop',
  description: 'Traditional rice, aval, siruthaniyam, pulses, cold-pressed oils, natural sweeteners, health mixes and podis from Naadu Nalam sellers.',
};

export default function ShopPage() {
  const products = getProducts().map(cardShape);
  return (
    <main id="main" className="page-main">
      <PageBand
        title="The Marketplace"
        ta="சந்தை"
        intro={`Naturally grown food, straight from local sellers — ${products.length} products from ${getSellers().length} storefronts, every one named in Tamil and English.`}
      />
      <section className="section section--paper">
        <div className="wrap">
          <Suspense fallback={null}>
            <ShopBrowser products={products} categories={orderedCategories().map(categoryShape)} sellers={getSellers().map((s) => ({ slug: s.slug, name: s.name }))} />
          </Suspense>
        </div>
      </section>
      <ClosingBand />
    </main>
  );
}
