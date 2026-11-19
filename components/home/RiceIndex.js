'use client';
// Heirloom rice "granary" mosaic: intro block + every rice variety as a photo tile + aval and shop-all tiles.
// The grid is always completely filled (6 × 4 on desktop, 4 columns on tablet, 2 on phones).
import Link from 'next/link';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { formatPrice } from '@/lib/format';
import { IconArrow } from '../Icons';
import { KolamBand } from '../Ornaments';

gsap.registerPlugin(ScrollTrigger);

export default function RiceIndex({ rice, aval }) {
  const root = useRef(null);
  const from = Math.min(...rice.map((p) => p.price));

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // tiles ripple in diagonally across the grid, like grain spreading on a winnowing tray
      gsap.from('.rice__cell', {
        opacity: 0, y: 26, scale: 0.95, duration: 0.7, ease: 'power3.out',
        stagger: { grid: 'auto', from: 'start', axis: null, amount: 0.8 },
        scrollTrigger: { trigger: '.rice__mosaic', start: 'top 82%', once: true },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="section section--soil rice" aria-labelledby="rice-title">
      <div className="wrap">
        <ul className="rice__mosaic">
          <li className="rice__cell rice__intro">
            <h2 id="rice-title">
              <span className="title-ta" lang="ta">பாரம்பரிய அரிசி வகைகள்</span>
              <span className="title-en">Traditional rice — {rice.length} heirloom varieties</span>
            </h2>
            <KolamBand dots={7} tone="gold" />
            <p>Every native rice variety carries generations of knowledge.</p>
            <p className="rice__from">From {formatPrice(from)} <small>a pack</small></p>
          </li>

          {rice.map((p, i) => (
            <li key={p.slug} className="rice__cell">
              <Link href={`/product/${p.slug}`} prefetch={false} className="rice__tile">
                <img src={p.images[0].src} alt={p.images[0].alt || p.nameEn} width="320" height="320" loading={i < 6 ? 'eager' : 'lazy'} />
                <span className="rice__price">{formatPrice(p.price)}<small>{p.packs.join(' / ')}</small></span>
                <span className="rice__name"><span className="rice__en">{p.nameEn}</span><small lang="ta">{p.nameTa}</small></span>
              </Link>
            </li>
          ))}

          <li className="rice__cell rice__aval">
            <Link href={`/product-category/${aval.slug}`} prefetch={false} className="rice__tile">
              {aval.image && <img src={aval.image.src} alt="" width="640" height="320" loading="lazy" />}
              <span className="rice__name rice__name--lg">Heirloom aval<small lang="ta">{aval.nameTa} — {aval.count} varieties</small></span>
            </Link>
          </li>
          <li className="rice__cell rice__all">
            <Link href="/product-category/rice-grains" prefetch={false} className="rice__all-link">
              <strong>{rice.length}</strong>
              <span>All traditional rice</span>
              <IconArrow width="22" height="22" />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
