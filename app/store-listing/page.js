import Link from 'next/link';
import PageBand from '@/components/PageBand';
import { Thoranam } from '@/components/Ornaments';
import { getCategory, getProduct, getSellers } from '@/lib/catalog';
import { IconArrow } from '@/components/Icons';

export const metadata = { title: 'Sellers', description: 'The storefronts on Naadu Nalam — Naadu Nalam and Thaayanbu.' };

const PANELS = {
  naadunalam: {
    ta: 'நாடு நலம்',
    line: 'Heirloom rice, aval, siruthaniyam and pulses — the grain store of the marketplace.',
    picks: ['karuppu-kavuni-aval', 'foxtail-millet-thinai', 'kadalai-paruppu'],
    seal: '/images/brand/naadu-nalam-emblem.webp',
  },
  thaayanbu: {
    ta: 'தாயன்பு',
    line: 'தாயன்பு — a mother’s love: honey, cold-pressed oils and ghee, sweeteners, health mixes, podis and herbal essentials.',
    picks: ['tulsi-infused-honey', 'nallamaattu-nei', 'kuzhambu-podi'],
    seal: null,
  },
};

export default function StoreListing() {
  const sellers = getSellers();
  return (
    <main id="main" className="page-main">
      <PageBand title="Sellers" ta="விற்பனையாளர்கள்"
        intro="Naadu Nalam is a marketplace, not a single shop. Every seller manages their own listings, pricing and stock — you browse them side by side and check out once." />
      <section className="section section--paper fit-footer">
        <div className="wrap fit-grow shops">
          {sellers.map((s) => {
            const panel = PANELS[s.slug];
            const picks = panel.picks.map(getProduct).filter(Boolean);
            return (
              <article key={s.slug} className="shopfront" data-reveal>
                <div className="shopfront__arch">
                  {picks.map((p) => (<img key={p.slug} src={p.images[0].src} alt={p.images[0].alt} width="320" height="320" loading="lazy" />))}
                </div>
                <span className="shopfront__seal" aria-hidden="true">
                  {panel.seal ? <img src={panel.seal} alt="" width="64" height="62" /> : <span lang="ta">தா</span>}
                </span>
                <div className="shopfront__body">
                  <h2><span lang="ta">{panel.ta}</span><small>{s.name}</small></h2>
                  <p>{panel.line}</p>
                  <ul className="shopfront__cats">
                    {s.categories.map((c) => getCategory(c)).map((c) => (
                      <li key={c.slug}><Link href={`/product-category/${c.slug}`} prefetch={false} className="chip">{c.nameEn}</Link></li>
                    ))}
                  </ul>
                  <Link href={`/store/${s.slug}`} prefetch={false} className="btn btn--forest">Visit the store — {s.productCount} products <IconArrow /></Link>
                </div>
              </article>
            );
          })}
          <aside className="shops__join" data-reveal>
            <Thoranam />
            <div className="shops__join-inner">
              <h2>Open to new sellers</h2>
              <p>Growers and small producers can register and open a store on Naadu Nalam.</p>
              <Link href="/vendor-login" prefetch={false} className="btn btn--gold">Sell on Naadu Nalam <IconArrow /></Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
