import Link from 'next/link';
import { KolamBand } from './Ornaments';
import { IconArrow, IconCoins, IconPhone, IconMail, IconTruck, IconClock } from './Icons';
import { site } from '@/lib/site';

// Final section on long pages, sized so it fills the last screen together with the footer.
// Copy is verbatim from the source product pages ("Goodness in Every Meal") and the policy pages.
export default function ClosingBand({ variant = 'delivery' }) {
  if (variant === 'help') {
    return (
      <section className="section section--forest closing-band fit-footer">
        <div className="wrap closing-band__grid">
          <div className="closing-band__text">
            <h2 data-reveal>Questions about a policy or an order?</h2>
            <KolamBand dots={9} tone="gold" />
            <p data-reveal>{site.replyTime} Email us with your order number, photos of any issue and a brief description.</p>
            <ul className="closing-band__facts" data-reveal>
              <li><IconMail /><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><IconPhone /><a href={site.phoneHref}>{site.phoneDisplay}</a></li>
              <li><IconClock />Monday to Saturday, 9:00 AM – 6:00 PM. Sunday closed.</li>
            </ul>
            <div className="btn-row" data-reveal>
              <Link href="/contact" prefetch={false} className="btn btn--gold">Contact Us <IconArrow /></Link>
              <Link href="/services" prefetch={false} className="btn btn--line">How Ordering Works</Link>
            </div>
          </div>
          <figure className="frame frame--arch closing-band__img" data-reveal>
            <img src="/images/site/paddy-in-hand.webp" alt="A hand holding newly picked paddy stalks in a rice field" width="1100" height="2444" loading="lazy" />
          </figure>
        </div>
      </section>
    );
  }
  return (
    <section className="section section--forest closing-band fit-footer">
      <div className="wrap closing-band__grid">
        <div className="closing-band__text">
          <h2 data-reveal>Goodness in Every Meal</h2>
          <KolamBand dots={9} tone="gold" />
          <p data-reveal>Everyday South Indian staples, sourced from Tamil Nadu growers and delivered to your door — so you can cook the way your family always has.</p>
          <ul className="closing-band__facts" data-reveal>
            <li><IconTruck />Flat ₹50 delivery across Chennai &amp; Tamil Nadu</li>
            <li><IconCoins />Cash on delivery — pay when your order arrives</li>
            <li><IconClock />Packed within 24–48 hours on business days</li>
          </ul>
          <div className="btn-row" data-reveal>
            <Link href="/services" prefetch={false} className="btn btn--gold">How Ordering Works <IconArrow /></Link>
            <Link href="/contact" prefetch={false} className="btn btn--line">Contact Us</Link>
          </div>
        </div>
        <figure className="frame frame--arch closing-band__img closing-band__img--wide" data-reveal>
          <img src="/images/client/family-paddy-fields.webp" alt="Grandparents, parents and children of a Tamil family seated together beside paddy fields" width="757" height="528" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
