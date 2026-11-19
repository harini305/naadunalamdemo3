import Link from 'next/link';
import PageBand from '@/components/PageBand';
import { KolamBand } from '@/components/Ornaments';
import { IconArrow, IconLeaf, IconStore, IconCheck, IconBasket } from '@/components/Icons';
import { getCategory } from '@/lib/catalog';
import { generations, values } from '@/lib/site';

export const metadata = { title: 'Our Story', description: 'Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home.' };

// All copy on this page is verbatim from the source About Us and Customer Reviews pages.
const WHY = [
  { icon: IconLeaf, t: 'Naturally Sourced', d: 'We focus on products that stay close to their natural form and traditional roots.' },
  { icon: IconCheck, t: 'Traditional Varieties', d: 'Discover traditional rice varieties, siruthaniyam, pulses and other ingredients deeply connected to Tamil food culture.' },
  { icon: IconStore, t: 'Supporting Farmers', d: 'We believe in creating a stronger connection between the people who grow our food and the people who consume it.' },
  { icon: IconBasket, t: 'From Farm to Family', d: 'Our goal is to make traditional products accessible for everyday households.' },
];
const PHILOSOPHY = [
  ['rice-grains', 'Traditional Rice', 'Seeraga Samba • Kichili Samba • Karudan Samba • Kudavaazhai • Moongil Arisi'],
  ['siruthaniyam', 'Siruthaniyam', 'Samai • Thinai • Kuthiraivali • Varagu • Kambu • Cholam • Kezhvaragu'],
  ['paruppu-pulses', 'Paruppu & Pulses', 'Kadalai Paruppu • Thuvaram Paruppu • Pachai Payaru • Ulundhu • Kondakadalai'],
  ['natural-sweeteners', 'Natural Sweeteners', 'Naattu Sarkkarai • Karuppatti • Vellam • Panangkarkandu • Then'],
  ['masala-podi', 'Masala & Powders', 'Sambar Podi • Kuzhambu Podi • Rasam Podi • Milagai Podi'],
  ['oil-vinegers', 'Traditional Oils & Ghee', 'Nallennai • Kadalai Ennai • Thengai Ennai • Mallamaattu Nei'],
];
const REVIEW_RULES = [
  ['No paid reviews', 'We do not write, buy or incentivise reviews.'],
  ['Nothing hidden', 'We do not delete a review because it is negative.'],
  ['Removed only for abuse', 'We remove reviews only if they contain abuse, personal information, or spam.'],
  ['Your chosen name', 'Reviews are attributed to the name the reviewer chooses to display.'],
];

export default function About() {
  return (
    <main id="main" className="page-main about">
      <PageBand title="Our Story" ta="நம்ம மண்ணின் சுவை. நம்ம மக்களின் நலம்."
        intro="Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home."
        cta={{ href: '/shop', label: 'Explore Our Products' }} />

      {/* From our soil — layered arch collage */}
      <section className="section section--paper">
        <div className="wrap soil">
          <div className="soil__collage" data-reveal>
            <figure className="soil__arch"><img src="/images/client/family-courtyard.webp" alt="A Tamil family of several generations gathered in a traditional courtyard with baskets of grain" width="770" height="528" loading="lazy" /></figure>
            <figure className="soil__circle"><img src="/images/site/paddy-in-hand.webp" alt="A hand holding newly picked paddy stalks" width="1100" height="2444" loading="lazy" /></figure>
          </div>
          <div className="soil__text">
            <h2 data-reveal>From Our Soil to Your Home</h2>
            <KolamBand dots={7} />
            <p className="lead" data-reveal>Good food begins with good soil.</p>
            <p data-reveal>Tamil Nadu has a rich agricultural heritage filled with traditional grains, rice varieties, native ingredients and time-tested food practices.</p>
            <p data-reveal>At Naadu Nalam, we bring these products together in one place so you can discover and enjoy the foods that have been part of our culture for generations.</p>
            <p className="soil__triad" data-reveal><span>Traditional.</span> <span>Natural.</span> <span>Authentic.</span></p>
          </div>
        </div>
      </section>

      {/* Why — four cards laid over the produce photograph */}
      <section className="why2">
        <img className="why2__bg" src="/images/site/produce-before-paddy.webp" alt="" width="1536" height="1024" loading="lazy" />
        <div className="wrap why2__inner">
          <h2 data-reveal>Why Naadu Nalam?</h2>
          <ul className="why2__grid">
            {WHY.map(({ icon: I, t, d }) => (
              <li key={t} data-reveal><span className="why2__icon"><I /></span><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* Philosophy — six arch cards */}
      <section className="section section--rice">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <h2>Our Product Philosophy</h2>
            <p>Every traditional grain has a story. Every native rice variety carries generations of knowledge. Every farmer plays a part in keeping that heritage alive.</p>
          </div>
          <ul className="philo">
            {PHILOSOPHY.map(([slug, t, list]) => {
              const c = getCategory(slug);
              return (
                <li key={slug} data-reveal>
                  <Link href={`/product-category/${slug}`} prefetch={false} className="philo__card hover-zoom">
                    <span className="frame philo__img"><img src={c.image.src} alt={c.imageAlt || t} width="360" height="360" loading="lazy" /></span>
                    <span className="philo__body">
                      <h3>{t}</h3>
                      <span className="philo__ta" lang="ta">{c.nameTa}</span>
                      <span className="philo__list">{list}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* More than a store — with the seven generations */}
      <section className="section section--paper2">
        <div className="wrap more2">
          <div className="more2__text">
            <h2 data-reveal>More Than a Store</h2>
            <p className="lead" data-reveal>We are preserving a way of life.</p>
            <p data-reveal>In a world where food is becoming increasingly processed and disconnected from its origins, Naadu Nalam wants to bring people closer to the foods and traditions that shaped Tamil households.</p>
            <p data-reveal>Naadu Nalam is our small step towards keeping that connection alive.</p>
            <ol className="more2__line" aria-label="Seven generations" data-reveal>
              {generations.map((g) => (<li key={g.ta} lang="ta">{g.ta}</li>))}
            </ol>
            <Link href="/#generations" prefetch={false} className="link-arrow" data-reveal>ஏழு தலைமுறை — the seven generations <IconArrow width="18" height="18" /></Link>
          </div>
          <figure className="more2__img" data-reveal><img src="/images/client/family-paddy-fields.webp" alt="Grandparents, parents and children of a Tamil family seated beside paddy fields" width="757" height="528" loading="lazy" /></figure>
        </div>
      </section>

      {/* Reviews promise */}
      <section className="section section--forest" id="reviews">
        <div className="wrap reviews2">
          <blockquote className="reviews2__quote" data-reveal>
            <p>We would rather show you nothing than show you reviews we wrote ourselves.</p>
            <footer>Our Promise on Reviews</footer>
          </blockquote>
          <div className="reviews2__side">
            <p data-reveal>Naadu Nalam is a new marketplace, and no customer reviews have been published yet. Reviews sit on the product pages themselves, next to the item they describe. Once you have received an order, you can review any item in it from its product page.</p>
            <ul className="reviews2__rules">
              {REVIEW_RULES.map(([t, d]) => (<li key={t} data-reveal><h3>{t}</h3><p>{d}</p></li>))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--soil promise fit-footer">
        <div className="wrap promise__grid">
          <div className="promise__inner">
            <h2 data-reveal>Our Promise</h2>
            <KolamBand dots={9} tone="gold" />
            <ul className="promise__values">
              {values.map((v) => (
                <li key={v.en} data-reveal><span className="ta" lang="ta">{v.ta}</span><strong>{v.translit.toUpperCase()}</strong><small>{v.en}</small></li>
              ))}
            </ul>
            <p data-reveal>Because when we choose better food, we don’t just nourish ourselves — we support our farmers, our soil and our heritage.</p>
            <div className="btn-row" data-reveal>
              <Link href="/shop" prefetch={false} className="btn btn--gold">Explore Our Products <IconArrow /></Link>
              <Link href="/store-listing" prefetch={false} className="btn btn--line">Meet the sellers</Link>
            </div>
          </div>
          <figure className="frame frame--arch promise__img" data-reveal><img src={getCategory('rice-grains').image.src} alt="Parambariya arisi vagaigal — traditional rice varieties" width="1024" height="1024" loading="lazy" /></figure>
        </div>
      </section>
    </main>
  );
}
