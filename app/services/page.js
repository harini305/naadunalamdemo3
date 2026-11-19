import Link from 'next/link';
import PageBand from '@/components/PageBand';
import OrderingSteps from '@/components/OrderingSteps';
import { KolamBand } from '@/components/Ornaments';
import { IconArrow, IconCoins, IconTruck } from '@/components/Icons';
import { getCategory } from '@/lib/catalog';
import { site } from '@/lib/site';

export const metadata = { title: 'How Ordering Works', description: 'Explore, choose, order and receive — delivery, Cash on Delivery and returns at Naadu Nalam.' };

// Copy verbatim from the source "How Ordering Works" page and the Shipping / Refund policies.
const SERVE = [
  ['rice-grains', 'Traditional & Natural Products', 'Explore a carefully selected range of traditional rice, siruthaniyam, pulses, natural sweeteners, spices, oils and other everyday essentials.'],
  ['siruthaniyam', 'Traditional Food Choices', 'Discover traditional grains and ingredients that are closely connected to Tamil Nadu’s food heritage and everyday cooking.'],
  ['paruppu-pulses', 'Direct From Growers', 'We aim to create a stronger connection between the people who grow our food and the families who enjoy it. Fewer hands between farm and kitchen.'],
  ['masala-podi', 'Natural Choices', 'Discover products selected with a focus on traditional food practices and natural ingredients.'],
];
// Delivery zones drawn as rings, innermost first (shipping policy, section 2)
const ZONES = [
  { r: 92, label: 'Chennai and surrounding pin codes', time: '1–3 business days' },
  { r: 160, label: 'Other Tamil Nadu metros', time: '3–5 business days' },
  { r: 228, label: 'Rest of India', time: '5–8 business days, non-perishable items only' },
];

export default function Services() {
  return (
    <main id="main" className="page-main">
      <PageBand title="How Ordering Works" ta="எளிய முறை"
        intro="At Naadu Nalam, we make it easier to discover, choose and enjoy traditional and natural products from Tamil Nadu."
        cta={{ href: '/shop', label: 'Shop Our Products' }} />

      <section className="section section--paper">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <h2>Simple From Start to Finish</h2>
            <p>Shopping for traditional and natural products should be simple — from discovering products and placing an order to receiving it at your doorstep.</p>
          </div>
          <OrderingSteps />
        </div>
      </section>

      <section className="section section--forest">
        <div className="wrap zones">
          <figure className="zones__map" data-reveal>
            <svg viewBox="0 0 480 480" role="img" aria-label="Delivery times: Chennai 1 to 3 business days, other Tamil Nadu metros 3 to 5, rest of India 5 to 8 for non-perishable items">
              {[...ZONES].reverse().map((z, i) => (
                <circle key={z.r} cx="240" cy="240" r={z.r} fill={['rgba(207,170,94,0.08)', 'rgba(207,170,94,0.14)', 'rgba(230,167,58,0.24)'][i]} stroke="#cfaa5e" strokeWidth="1.5" />
              ))}
              <circle cx="240" cy="240" r="34" fill="#e6a73a" />
              <text x="240" y="236" textAnchor="middle" className="zones__c1">Chennai</text>
              <text x="240" y="252" textAnchor="middle" className="zones__c2">store base</text>
              {ZONES.map((z) => (
                <text key={z.r} x="240" y={240 - z.r + 22} textAnchor="middle" className="zones__t">{z.time.split(',')[0]}</text>
              ))}
            </svg>
          </figure>
          <div className="zones__text">
            <h2 data-reveal>Delivery times</h2>
            <p data-reveal>Orders are packed within 24–48 hours on business days (Monday–Saturday). Orders placed on Sunday are packed on the next business day.</p>
            <dl className="zones__list">
              {ZONES.map((z) => (<div key={z.r} data-reveal><dt>{z.label}</dt><dd>{z.time}</dd></div>))}
            </dl>
            <div className="zones__cards">
              <article data-reveal><IconTruck /><h3>Flat ₹50 per order</h3><p>On every order and to every serviceable location. No additional handling or packaging charges.</p></article>
              <article data-reveal><IconCoins /><h3>Cash on Delivery</h3><p>Pay when your order arrives. Orders on the marketplace are Cash on Delivery at present.</p></article>
            </div>
            <Link href="/shipping-policy" prefetch={false} className="link-arrow" data-reveal>Full shipping policy <IconArrow width="18" height="18" /></Link>
          </div>
        </div>
      </section>

      <section className="section section--rice">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <h2>How We Serve You</h2>
            <p>From carefully bringing traditional products together to getting them to your doorstep, we focus on making your shopping experience simple and reliable.</p>
          </div>
          <ul className="serve2">
            {SERVE.map(([slug, t, d]) => {
              const c = getCategory(slug);
              return (
                <li key={t} data-reveal>
                  <span className="frame serve2__img"><img src={c.image.src} alt={c.imageAlt || c.nameEn} width="360" height="360" loading="lazy" /></span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section--paper help fit-footer">
        <div className="wrap help__grid fit-grow">
          <figure className="frame frame--arch help__img" data-reveal><img src="/images/site/farmer-basket.webp" alt="A farmer holding a woven basket of newly harvested vegetables" width="683" height="1024" loading="lazy" /></figure>
          <div className="help__text" data-reveal>
            <h2>Need Help With Your Order?</h2>
            <KolamBand dots={7} />
            <p>Have a question about a product, order or delivery? We’re here to help. {site.replyTime}</p>
            <ul className="help__list">
              <li><strong>Damaged, spoiled or incorrect?</strong> Report it within 24 hours of delivery, with your order number and photographs where applicable.</li>
              <li><strong>Non-perishable products</strong> — unopened and in their original packaging — can be reported within 7 days.</li>
              <li><strong>Refunds</strong> are processed within 5–7 business days once approved. For Cash on Delivery orders we ask for a UPI ID or bank account.</li>
            </ul>
            <div className="btn-row">
              <Link href="/contact" prefetch={false} className="btn btn--clay">Contact Us</Link>
              <Link href="/refund-policy" prefetch={false} className="btn btn--line-dark">Returns &amp; Refund Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
