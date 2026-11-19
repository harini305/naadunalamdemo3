'use client';
import Link from 'next/link';
import { useState } from 'react';
import { pongalCombos } from '@/lib/site';
import { IconArrow } from '../Icons';
import { Thoranam } from '../Ornaments';

export default function ThaayanbuStory({ picks, productCount, photo }) {
  const [tab, setTab] = useState(0);
  const combo = pongalCombos.combos[tab];
  return (
    <section className="section section--forest story" id="thaayanbu" aria-labelledby="story-title">
      <Thoranam />
      <div className="wrap story__grid">
        <div className="story__copy">
          <h2 id="story-title" data-reveal>
            <span className="title-ta" lang="ta">தாயன்பு + நாடு நலம்</span>
            <span className="title-en">Thaayanbu + Naadu Nalam</span>
          </h2>
          <p data-reveal>
            <strong>Thaayanbu</strong> — <span lang="ta">தாயன்பு</span>, a mother’s love — is one of the two storefronts on Naadu
            Nalam. Its shelf holds {productCount} products: honey, cold-pressed oils and ghee, natural sweeteners, health mixes,
            masala podis and herbal essentials, each named in Tamil and English.
          </p>
          <p data-reveal>
            Together, Thaayanbu and Naadu Nalam bring <span lang="ta" className="story__quote">“{pongalCombos.lineTa}”</span> —
            naturally grown rice, pulses and groceries — from Korattur, Chennai to family kitchens.
          </p>
          <div className={`story__media ${photo ? 'story__media--photo' : ''}`} data-reveal>
            {photo ? (
              <div className="frame"><img src={photo} alt="A Tamil mother and child preparing food together at a traditional hearth" loading="lazy" /></div>
            ) : (
              picks.map((p) => (
                <Link key={p.slug} href={`/product/${p.slug}`} prefetch={false} className="story__pick hover-zoom">
                  <span className="frame frame--arch"><img src={p.images[0].src} alt={p.images[0].alt} width="320" height="320" loading="lazy" /></span>
                  <span className="story__pick-name">{p.nameEn}<small lang="ta">{p.nameTa}</small></span>
                </Link>
              ))
            )}
          </div>
          <Link href="/store/thaayanbu" prefetch={false} className="link-arrow" data-reveal>Visit the Thaayanbu store <IconArrow width="18" height="18" /></Link>
        </div>

        <aside className="combo" aria-labelledby="combo-title" data-reveal>
          <h3 id="combo-title">
            <span className="title-ta" lang="ta">{pongalCombos.titleTa}</span>
            <span className="title-en">{pongalCombos.titleEn}</span>
          </h3>
          <div className="combo__tabs" role="tablist" aria-label="Combo size">
            {pongalCombos.combos.map((c, i) => (
              <button key={c.id} type="button" role="tab" aria-selected={tab === i} className="chip" aria-pressed={tab === i} onClick={() => setTab(i)}>
                {c.count} items <small>about {c.price}</small>
              </button>
            ))}
          </div>
          <ol className="combo__items" lang="ta">
            {combo.items.map((it) => (<li key={it}>{it}</li>))}
          </ol>
          <dl className="combo__dates">
            <div><dt><span lang="ta">ஆரம்ப நாள்</span> Open date</dt><dd>{pongalCombos.openDate}</dd></div>
            <div><dt><span lang="ta">ஆர்டர் முடியும் நாள்</span> Order closing</dt><dd>{pongalCombos.closeDate}</dd></div>
            <div><dt><span lang="ta">விநியோக நாள்</span> Delivery</dt><dd>{pongalCombos.deliveryDate}</dd></div>
          </dl>
          <p className="combo__note">
            Total about {combo.price} (<span lang="ta">தோராயமாக</span>), as listed on the Thaayanbu Naadu Nalam combo flyer —
            <span lang="ta"> {pongalCombos.placeTa}</span>.
          </p>
          <Link href="/contact?topic=thai-pongal-combo" prefetch={false} className="btn btn--clay btn--block">Enquire about the combo <IconArrow /></Link>
        </aside>
      </div>
    </section>
  );
}
