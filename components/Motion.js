'use client';
// Site-wide GSAP setup: [data-reveal] fade-ups via ScrollTrigger.batch, with failsafes so content is
// never hidden (visible after 2s, on reduced motion, and for anything already in view on load).
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    // Keep --footer-h equal to the real footer height so "last section + footer = one screen" holds at every width.
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const set = () => {
      document.documentElement.style.setProperty('--footer-h', `${Math.round(footer.getBoundingClientRect().height)}px`);
      ScrollTrigger.refresh();
    };
    const ro = new ResizeObserver(set);
    ro.observe(footer);
    set();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js');
    root.classList.remove('reveal-done');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) root.classList.add('reveal-done');
    const seen = new WeakSet();
    const tracked = [];
    let triggers = [];

    // Register [data-reveal] elements once each — including ones React mounts later
    // (wishlist suggestions, shop cards after a filter is cleared, client-only states).
    const register = (els) => {
      const fresh = els.filter((el) => !seen.has(el) && el.isConnected);
      if (!fresh.length) return;
      fresh.forEach((el) => { seen.add(el); tracked.push(el); });
      if (reduce) { gsap.set(fresh, { opacity: 1, y: 0 }); return; }
      triggers = triggers.concat(ScrollTrigger.batch(fresh, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      }));
    };
    register(gsap.utils.toArray('[data-reveal]'));

    let pending = null;
    const mo = new MutationObserver((muts) => {
      const added = [];
      muts.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.matches('[data-reveal]')) added.push(n);
        added.push(...n.querySelectorAll('[data-reveal]'));
      }));
      if (!added.length) return;
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => { register(added); ScrollTrigger.refresh(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Failsafe: anything in view that is still hidden is shown (checked after load and on each scroll pause).
    const showInView = () => {
      tracked.forEach((el) => {
        if (!el.isConnected) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0 && getComputedStyle(el).opacity === '0') gsap.set(el, { opacity: 1, y: 0 });
      });
    };
    const failsafe = setTimeout(showInView, 2000);
    let idle = null;
    const onScroll = () => { clearTimeout(idle); idle = setTimeout(showInView, 900); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      mo.disconnect();
      cancelAnimationFrame(pending);
      clearTimeout(failsafe);
      clearTimeout(idle);
      clearTimeout(refresh);
      window.removeEventListener('scroll', onScroll);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  return null;
}
