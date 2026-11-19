'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { IconArrow } from '../Icons';

gsap.registerPlugin(ScrollTrigger);

// Iyarkai Panchabhootham — in the traditional order நிலம், நீர், நெருப்பு, காற்று, ஆகாயம்.
// Card artwork is client-supplied (public/images/client/). Each element is tied to a real stage of the
// food on this marketplace — grown, rinsed, cooked, winnowed, seasoned by the year. No health claims.
const ELEMENTS = [
  { key: 'earth', ta: 'நிலம்', en: 'Earth', img: '/images/client/element-earth-nilam.webp', alt: 'நிலம் — Earth: a seedling rising from dark soil',
    line: 'The soil that heirloom paddy and siruthaniyam grow from.', cat: 'rice-grains' },
  { key: 'water', ta: 'நீர்', en: 'Water', img: '/images/client/element-water-neer.webp', alt: 'நீர் — Water: a stream running over rocks',
    line: 'Rain, river and well — and the bowl of water aval is rinsed in before it is cooked.', cat: 'aval-flakes' },
  { key: 'fire', ta: 'நெருப்பு', en: 'Fire', img: '/images/client/element-fire-agni.webp', alt: 'நெருப்பு / அக்னி — Fire: flames in a traditional clay stove',
    line: 'The clay hearth where sambar, kuzhambu and rasam podi come alive.', cat: 'masala-podi' },
  { key: 'air', ta: 'காற்று', en: 'Air', img: '/images/client/element-air-kaatru.webp', alt: 'காற்று — Air: coconut palms bending in the wind over paddy fields',
    line: 'The breeze over the paddy that winnows the grain.', cat: 'siruthaniyam' },
  { key: 'space', ta: 'ஆகாயம்', en: 'Space', img: '/images/client/element-space-aagaayam.webp', alt: 'ஆகாயம் — Space: the sun rising over hills and an open sky',
    line: 'Sun, sky and seasons — from the Pongal harvest to the north-east monsoon.', cat: 'natural-sweeteners' },
];

export default function Panchabhootham({ categories }) {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const deck = root.current.querySelector('.pb__deck');
      const cards = gsap.utils.toArray('.pb__fig');
      // Cards begin fanned together at the centre like a dealt hand, then spread into place as you scroll.
      const offset = (el) => {
        const card = el.parentElement;
        return deck.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
      };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: deck, start: 'top 88%', end: 'top 30%', scrub: 0.9, invalidateOnRefresh: true },
      });
      tl.fromTo(cards,
        { x: (i, el) => offset(el), rotation: (i) => (i - 2) * 7, y: (i) => 26 + Math.abs(i - 2) * 14 },
        { x: 0, rotation: 0, y: 0, ease: 'power2.out', stagger: 0 }, 0)
        .fromTo('.pb__cap', { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out' }, 0.45);
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="section section--rice pb" id="panchabhootham" aria-labelledby="pb-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="pb-title">
            <span className="title-ta" lang="ta">இயற்கை பஞ்சபூதம்</span>
            <span className="title-en">Iyarkai Panchabhootham — the five elements of nature</span>
          </h2>
          <p>
            Earth, water, fire, air and space are drawn into the Naadu Nalam emblem itself — soil, a river, the sun, the leaves and
            the open sky. Here they frame the journey of the food on this marketplace: grown, rinsed, cooked, winnowed and
            seasoned by the year.
          </p>
        </div>
        <ul className="pb__deck">
          {ELEMENTS.map((e) => {
            const c = categories[e.cat];
            return (
              <li key={e.key} className={`pb__card pb__card--${e.key}`}>
                <figure className="pb__fig">
                  <img src={e.img} alt={e.alt} width="296" height="424" loading="lazy" />
                </figure>
                <div className="pb__cap">
                  <h3><span lang="ta">{e.ta}</span> <small>{e.en}</small></h3>
                  <p>{e.line}</p>
                  {c && (
                    <Link href={`/product-category/${c.slug}`} prefetch={false} className="pb__link">
                      {c.nameEn} <IconArrow width="16" height="16" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
