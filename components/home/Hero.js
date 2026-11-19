'use client';
// Home hero (client reference layout): dark green field on the left with leaf sprigs, the client's
// seven-generation family photograph on the right (uncropped, edges feathered), a blurred copy of the same
// photograph as the full-bleed backdrop, two-tone headline with a gold brush stroke and four feature marks.
import Link from 'next/link';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { IconArrow } from '../Icons';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
const FEATURES = [
  { label: ['Traditional', 'Foods'], icon: (<svg viewBox="0 0 40 40" {...stroke}><path d="M7 19h26c0 8-5.8 13-13 13S7 27 7 19Z" /><path d="M5 19h30" /><path d="M15 32l-1.5 3h13L25 32" /><path d="M24 15c2-4 5-6 9-7" /><path d="M16 15c0-2 1-3 2-4" /></svg>) },
  { label: ['Natural', 'Products'], icon: (<svg viewBox="0 0 40 40" {...stroke}><path d="M20 34V18" /><path d="M20 22c-1-6-6-9-12-9 0 6 5 10 12 9Z" /><path d="M20 18c1-6 6-9 12-9 0 6-5 10-12 9Z" /><path d="M13 34h14" /></svg>) },
  { label: ['Local', 'Sellers'], icon: (<svg viewBox="0 0 40 40" {...stroke}><circle cx="20" cy="11" r="4" /><circle cx="10" cy="15" r="3.2" /><circle cx="30" cy="15" r="3.2" /><path d="M12 32c0-5 3.6-9 8-9s8 4 8 9Z" /><path d="M4 30c0-4 2.6-7 6-7 1.4 0 2.6.4 3.6 1.2" /><path d="M36 30c0-4-2.6-7-6-7-1.4 0-2.6.4-3.6 1.2" /></svg>) },
  { label: ['Sustainable', 'Tomorrow'], icon: (<svg viewBox="0 0 40 40" {...stroke}><circle cx="19" cy="21" r="12" /><path d="M7 21h24M19 9c3.5 3.4 5 7.4 5 12s-1.5 8.6-5 12M19 9c-3.5 3.4-5 7.4-5 12s1.5 8.6 5 12" /><path d="M27 8c3-2.6 6.5-3.4 9-3-.3 3.6-2.3 6.4-5.6 7.4-1.4.4-2.5.3-3.4-.4Z" /></svg>) },
];

// Curved edges that blend the photograph into the green field. Coordinates are fractions of the photo box.
// The curve bulges inward only over trees and bodies and hugs the edge beside the grandfather's face, so no
// face is clipped (verified by tools/browser/hero-faces.mjs).
const CURVE_DESK = 'M0.15,0.075 C0.32,0.005 0.55,0.05 0.76,0.018 C0.87,0.002 0.95,0.02 1,0.008 L1,1 L0.06,1 C0.075,0.86 0.012,0.74 0.006,0.60 L0.004,0.30 C0.006,0.19 0.06,0.13 0.15,0.075 Z';
const EDGE_DESK = 'M1,0.008 C0.95,0.02 0.87,0.002 0.76,0.018 C0.55,0.05 0.32,0.005 0.15,0.075 C0.06,0.13 0.006,0.19 0.004,0.30 L0.006,0.60 C0.012,0.74 0.075,0.86 0.06,1';
const CURVE_MOB = 'M0,0 L1,0 L1,0.9 C0.78,0.98 0.6,0.86 0.4,0.92 C0.24,0.97 0.1,0.9 0,0.95 Z';
const EDGE_MOB = 'M1,0.9 C0.78,0.98 0.6,0.86 0.4,0.92 C0.24,0.97 0.1,0.9 0,0.95';
const WAVE = 'M0 46 C 220 14, 420 66, 720 40 S 1180 8, 1440 34';

// A sprig of leaves for the left edge (drawn, so it stays sharp at any size)
function Sprig({ className, flip = false }) {
  const leaves = [[60, 20, -28], [40, 70, -50], [78, 96, -8], [30, 130, -62], [70, 160, 10], [36, 196, -40], [64, 228, 18]];
  return (
    <svg className={className} viewBox="0 0 140 280" aria-hidden="true">
      <g transform={flip ? 'translate(0 280) scale(1 -1)' : undefined}>
        <path d="M8 0 C 40 60, 46 140, 34 280" fill="none" stroke="#2c5a34" strokeWidth="3" />
        {leaves.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <g className="sprig-leaf">
              <path d="M0 0 C 18 -14, 50 -12, 66 0 C 50 12, 18 14, 0 0 Z" fill={i % 2 ? '#3f7d3d' : '#2f6b33'} />
              <path d="M2 0 L 62 0" stroke="#7fb26a" strokeOpacity="0.55" strokeWidth="1.2" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Hero() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const brush = root.current.querySelector('.hero3__brush path');
      const len = brush.getTotalLength();
      gsap.set(brush, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      gsap.set('.hero3__edge path', { strokeDasharray: 1, strokeDashoffset: 1 });
      tl.from('.hero3__photo', { opacity: 0, duration: 1.2, ease: 'sine.out' }, 0)
        .to('.hero3__edge path', { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.35)
        .from('.hero3__h1 > span', { y: 34, opacity: 0, duration: 0.95, stagger: 0.12 }, 0.15)
        .to(brush, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.6)
        .from('.hero3__ta, .hero3__p, .hero3__ctas', { y: 22, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.55)
        .from('.hero3__feat li', { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.9)
        .from('.hero3__sprig', { opacity: 0, x: -30, duration: 1.2 }, 0.2);
      // the photograph stays still at native sharpness (no scaling, which would soften it)
      gsap.to('.sprig-leaf', { rotation: 4, transformOrigin: '0% 50%', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.25, from: 'random' } });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="hero3" aria-label="Seven generations">
      <svg className="hero3__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="heroCurveDesk" clipPathUnits="objectBoundingBox"><path d={CURVE_DESK} /></clipPath>
          <clipPath id="heroCurveMob" clipPathUnits="objectBoundingBox"><path d={CURVE_MOB} /></clipPath>
        </defs>
      </svg>
      <div className="hero3__media">
        <div className="hero3__photo">
          <div className="hero3__zoom">
            <img src="/images/client/family-hero.webp" width="1600" height="1408" fetchPriority="high"
              alt="Seven generations of a Tamil family — grandparents, parents and children — seated together in front of paddy fields" />
          </div>
        </div>
        <svg className="hero3__edge hero3__edge--desk" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
          <path d={EDGE_DESK} fill="none" stroke="#cfaa5e" strokeWidth="1.6" vectorEffect="non-scaling-stroke" pathLength="1" />
        </svg>
        <svg className="hero3__edge hero3__edge--mob" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
          <path d={EDGE_MOB} fill="none" stroke="#cfaa5e" strokeWidth="1.6" vectorEffect="non-scaling-stroke" pathLength="1" />
        </svg>
      </div>
      <Sprig className="hero3__sprig hero3__sprig--top" />
      <Sprig className="hero3__sprig hero3__sprig--bottom" flip />

      <svg className="hero3__wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
        <path d={`${WAVE} L 1440 70 L 0 70 Z`} fill="#f6efe0" />
        <path d={WAVE} fill="none" stroke="#cfaa5e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="wrap hero3__grid">
        <div className="hero3__copy">
          <h1 className="hero3__h1">
            <span>Seven</span>
            <span>Generations.</span>
            <span className="hero3__gold">One Living Tradition.</span>
          </h1>
          <svg className="hero3__brush" viewBox="0 0 260 16" aria-hidden="true">
            <path d="M4 11 C 60 4, 140 3, 256 7" fill="none" stroke="#d9a441" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
          <p className="hero3__ta" lang="ta">ஏழு தலைமுறை — பரம்பரை</p>
          <p className="hero3__p">Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home.</p>
          <div className="btn-row hero3__ctas">
            <Link href="/shop" prefetch={false} className="btn hero3__btn">Shop the Marketplace <IconArrow /></Link>
            <Link href="/about-us" prefetch={false} className="btn btn--line">Our Story</Link>
          </div>
          <ul className="hero3__feat">
            {FEATURES.map((f) => (
              <li key={f.label.join(' ')}>{f.icon}<span>{f.label[0]}<br />{f.label[1]}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
