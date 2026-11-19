'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { generations } from '@/lib/site';
import { IconArrow } from '../Icons';
import { KolamBand } from '../Ornaments';

gsap.registerPlugin(ScrollTrigger);

// A small glyph with n concentric rings — depth of the generation, shown without numerals.
function RingGlyph({ n }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="gen__glyph">
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} cx="32" cy="32" r={5 + i * 4} fill="none" stroke="currentColor" strokeWidth={i === n - 1 ? 2 : 1.2} strokeOpacity={1 - i * 0.08} />
      ))}
      <circle cx="32" cy="32" r="2.6" fill="currentColor" />
    </svg>
  );
}

export default function Generations({ image }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.gen__line-fill', { scaleY: 0 }, {
        scaleY: 1, ease: 'none', transformOrigin: 'top center',
        scrollTrigger: { trigger: '.gen__list', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="section section--paper gen" id="generations" aria-labelledby="gen-title">
      <div className="wrap gen__grid">
        <div className="gen__panel">
          <div className="gen__panel-inner" data-reveal>
            <h2 id="gen-title">
              <span className="title-ta" lang="ta">ஏழு தலைமுறை</span>
              <span className="title-en">Seven generations, one family line</span>
            </h2>
            <KolamBand dots={7} />
            <p>
              Tamil families keep a name for each of seven generations — from <span lang="ta" className="ta">தாய் தந்தை</span> all
              the way back to <span lang="ta" className="ta">பரன் பரை</span>. Each name stands for people who grew, cooked and
              handed on the food of this land: heirloom paddy, siruthaniyam, pulses and podis ground at home.
            </p>
            <div className="frame frame--arch gen__photo">
              <img src={image.src} alt={image.alt} width="640" height="640" loading="lazy" />
            </div>
            <Link href="/product-category/rice-grains" prefetch={false} className="btn btn--forest">Shop heirloom rice <IconArrow /></Link>
          </div>
        </div>

        <ol className="gen__list">
          <span className="gen__line" aria-hidden="true"><span className="gen__line-fill" /></span>
          {generations.map((g, i) => (
            <li key={g.ta} className="gen__row" data-reveal>
              <RingGlyph n={i + 1} />
              <span className="gen__ta" lang="ta">{g.ta}</span>
              <span className="gen__meta">
                <span className="gen__translit">{g.translit}</span>
                <span className="gen__en">{g.en}</span>
              </span>
            </li>
          ))}
          <li className="gen__coda" data-reveal>
            From <span lang="ta" className="ta">பரன் பரை</span> to <span lang="ta" className="ta">தாய் தந்தை</span> — and on to
            the children at your table.
          </li>
        </ol>
      </div>
    </section>
  );
}
