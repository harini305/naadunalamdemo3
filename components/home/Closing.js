import Link from 'next/link';
import { values } from '@/lib/site';
import { IconArrow } from '../Icons';
import { KolamBand } from '../Ornaments';

// Copy is verbatim from the source About page ("நம் மண்ணிலிருந்து, உங்கள் வீட்டிற்கு" band and "Our Promise").
export default function Closing() {
  return (
    <section className="closing fit-footer" aria-labelledby="closing-title">
      <img className="closing__bg" src="/images/site/produce-before-paddy.webp" alt="" width="1536" height="1024" loading="lazy" />
      <div className="wrap closing__inner fit-grow fit-col">
        <h2 id="closing-title" data-reveal>
          <span className="title-ta" lang="ta">நம் மண்ணிலிருந்து, உங்கள் வீட்டிற்கு</span>
          <span className="title-en">Goodness from our land. Goodness for your home.</span>
        </h2>
        <p data-reveal>
          Because when we choose better food, we don’t just nourish ourselves — we support our farmers, our soil and our heritage.
        </p>
        <KolamBand dots={9} tone="gold" />
        <ul className="closing__values" data-reveal>
          {values.map((v) => (
            <li key={v.en}>
              <span className="ta" lang="ta">{v.ta}</span>
              <small>{v.translit} — {v.en}</small>
            </li>
          ))}
        </ul>
        <div className="btn-row" data-reveal>
          <Link href="/shop" prefetch={false} className="btn btn--gold">Explore Our Products <IconArrow /></Link>
          <Link href="/vendor-login" prefetch={false} className="btn btn--line">Sell on Naadu Nalam</Link>
        </div>
      </div>
    </section>
  );
}
