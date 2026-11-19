'use client';
import Link from 'next/link';
import { useState } from 'react';
import ProductCard from '../ProductCard';
import { IconArrow } from '../Icons';

export default function Basket({ sellers }) {
  const [tab, setTab] = useState(0);
  const s = sellers[tab];
  return (
    <section className="section section--paper basket" aria-labelledby="basket-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="basket-title">
            <span className="title-ta" lang="ta">பல விற்பனையாளர்கள், ஒரே கூடை</span>
            <span className="title-en">Many sellers. One basket.</span>
          </h2>
          <div className="section-head__side">
            <p>
              Naadu Nalam is a marketplace, not a single shop. Independent growers, home producers and small brands each run their
              own storefront here — you browse them side by side and check out once.
            </p>
            <div className="basket__tabs" role="tablist" aria-label="Storefront">
              {sellers.map((x, i) => (
                <button key={x.slug} type="button" role="tab" className="chip" aria-selected={tab === i} aria-pressed={tab === i} onClick={() => setTab(i)}>
                  {x.name} <small>{x.count}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="product-grid" key={s.slug}>
          {s.products.map((p) => (<ProductCard key={p.slug} p={p} />))}
        </div>
        <div className="basket__foot">
          <Link href={`/store/${s.slug}`} prefetch={false} className="btn btn--line-dark">Visit the {s.name} store</Link>
          <Link href="/shop" prefetch={false} className="btn btn--forest">Browse all products <IconArrow /></Link>
        </div>
      </div>
    </section>
  );
}
