import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import PageBand from '@/components/PageBand';
import ClosingBand from '@/components/ClosingBand';
import ShopBrowser from '@/components/ShopBrowser';
import { getCategories, getCategory, getProducts, getSellers, orderedCategories } from '@/lib/catalog';
import { cardShape, categoryShape } from '@/lib/shapes';

export const dynamicParams = false;
export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCategory(slug);
  return c ? { title: c.nameEn, description: c.description || `${c.nameEn} — ${c.nameTa} on Naadu Nalam.` } : {};
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  return (
    <main id="main" className="page-main">
      <PageBand title={c.nameEn} ta={c.nameTa} intro={`${c.description ? c.description + ' ' : ''}${c.count} ${c.count === 1 ? 'product' : 'products'}.`} />
      <section className="section section--paper">
        <div className="wrap">
          <Suspense fallback={null}>
            <ShopBrowser products={getProducts().map(cardShape)} categories={orderedCategories().map(categoryShape)}
              sellers={getSellers().map((s) => ({ slug: s.slug, name: s.name }))} fixedCategory={slug} />
          </Suspense>
        </div>
      </section>
      <ClosingBand />
    </main>
  );
}
