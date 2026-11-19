'use client';
// Traditional Tamil ornaments drawn in SVG and animated with GSAP + ScrollTrigger.
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// மாவிலை தோரணம் — a string of mango leaves with marigolds, hung over doorways for festivals and Pongal.
const LEAVES = 30;
const r2 = (n) => Math.round(n * 100) / 100;
export function Thoranam({ className = '' }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const leaves = gsap.utils.toArray('.th-leaf');
      gsap.from(leaves, {
        y: -26, opacity: 0, rotation: (i) => (i % 2 ? 14 : -14), transformOrigin: '50% 0%', duration: 0.9, ease: 'back.out(1.6)',
        stagger: { each: 0.035, from: 'center' },
        scrollTrigger: { trigger: root.current, start: 'top 92%', once: true },
      });
      gsap.from('.th-flower', { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)', stagger: { each: 0.05, from: 'center' },
        scrollTrigger: { trigger: root.current, start: 'top 92%', once: true } });
      // gentle sway on a separate wrapper (so it never fights the drop-in), only while on screen
      const sway = gsap.to('.th-sway', { rotation: (i) => (i % 2 ? 3 : -3), transformOrigin: '50% 0%', duration: 2.6, ease: 'sine.inOut', stagger: { each: 0.12, repeat: -1, yoyo: true }, paused: true });
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? sway.play() : sway.pause()) });
    });
    return () => mm.revert();
  }, { scope: root });

  const w = 1200;
  const step = w / LEAVES;
  return (
    <div ref={root} className={`thoranam ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${w} 74`}>
        <defs>
          <linearGradient id="thLeaf" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3f8f4f" />
            <stop offset="1" stopColor="#1d5a32" />
          </linearGradient>
        </defs>
        <path d={`M0 6 Q ${w / 2} 16 ${w} 6`} stroke="#c9a35a" strokeWidth="2" fill="none" />
        {Array.from({ length: LEAVES }).map((_, i) => {
          const x = step / 2 + i * step;
          const y = r2(6 + 10 * (1 - Math.pow((x - w / 2) / (w / 2), 2)));
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <g className="th-sway">
                <g className="th-leaf">
                  <path d="M0 0 C 9 12, 10 34, 0 56 C -10 34, -9 12, 0 0 Z" fill="url(#thLeaf)" />
                  <path d="M0 2 L0 52" stroke="#a9d39a" strokeOpacity="0.55" strokeWidth="1" />
                </g>
              </g>
            </g>
          );
        })}
        {Array.from({ length: LEAVES - 1 }).map((_, i) => {
          if (i % 2) return null;
          const x = step + i * step;
          const y = r2(6 + 10 * (1 - Math.pow((x - w / 2) / (w / 2), 2)));
          return (
            <g key={`f${i}`} transform={`translate(${x} ${y + 7})`}>
              <g className="th-flower">
                <circle r="7.5" fill="#f08a24" />
                <circle r="4.5" fill="#f6b73c" />
                <circle r="1.8" fill="#a4512f" />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// புள்ளி கோலம் — a band of dots with a looping line that draws itself as it scrolls into view.
export function KolamBand({ className = '', dots = 9, tone = 'clay' }) {
  const root = useRef(null);
  useGSAP(() => {
    const path = root.current.querySelector('.kolam-line');
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 55%', scrub: 0.8 } });
      gsap.from(root.current.querySelectorAll('.kolam-dot'), { scale: 0, transformOrigin: '50% 50%', stagger: 0.04, duration: 0.4, ease: 'back.out(2)',
        scrollTrigger: { trigger: root.current, start: 'top 95%', once: true } });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => gsap.set(path, { strokeDashoffset: 0 }));
    return () => mm.revert();
  }, { scope: root });

  const gap = 40;
  const w = gap * (dots + 1);
  // loops weave above and below a straight row of pulli
  let d = `M ${gap / 2} 30`;
  for (let i = 0; i < dots; i++) {
    const x = gap * (i + 1);
    const up = i % 2 === 0;
    d += ` C ${x - 14} ${up ? 2 : 58}, ${x + 14} ${up ? 2 : 58}, ${x + gap / 2} 30`;
  }
  return (
    <div ref={root} className={`kolam-band kolam-band--${tone} ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${w} 60`}>
        {Array.from({ length: dots }).map((_, i) => (<circle key={i} className="kolam-dot" cx={gap * (i + 1)} cy="30" r="3.2" />))}
        <path className="kolam-line" d={d} fill="none" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
