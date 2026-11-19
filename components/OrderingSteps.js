'use client';
// Four ordering steps placed on a kolam path that draws itself as the section scrolls into view.
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { IconBasket, IconLeaf, IconSearch, IconTruck } from './Icons';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  ['Explore', 'Browse traditional and natural products across our collection.', IconSearch],
  ['Choose', 'Select the products that suit your home and everyday needs.', IconLeaf],
  ['Order', 'Add your products to the cart and complete your order.', IconBasket],
  ['Receive', 'Get your order delivered and enjoy the goodness at home.', IconTruck],
];

export default function OrderingSteps() {
  const root = useRef(null);
  useGSAP(() => {
    const path = root.current.querySelector('.steps2__path');
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 50%', scrub: 0.8 } });
      gsap.from('.steps2__dot', { scale: 0, transformOrigin: '50% 50%', stagger: 0.15, duration: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => gsap.set(path, { strokeDashoffset: 0 }));
    return () => mm.revert();
  }, { scope: root });

  return (
    <div className="steps2" ref={root}>
      <svg className="steps2__svg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="steps2__path" d="M40 60 C 140 0, 240 120, 340 60 S 540 0, 640 60 S 840 120, 940 60 S 1100 0, 1160 60" fill="none" stroke="#a4512f" strokeWidth="2.5" strokeLinecap="round" />
        {[150, 450, 750, 1050].map((x) => (<circle key={x} className="steps2__dot" cx={x} cy="60" r="5" fill="#e6a73a" />))}
      </svg>
      <ol className="steps2__list">
        {STEPS.map(([t, d, I]) => (
          <li key={t} data-reveal>
            <span className="steps2__icon"><I /></span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
