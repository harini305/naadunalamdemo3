'use client';
// Header: centred seal (the original emblem) hanging below the bar like a temple pendant, with the four
// essential pages split around it. The seal tucks into the bar once the page scrolls.
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { nav, secondaryLinks, site } from '@/lib/site';
import { useShop } from './ShopProvider';
import { IconArrow, IconBasket, IconClose, IconHeart, IconMenu, IconSearch } from './Icons';

const IconChevron = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>);
import { Thoranam } from './Ornaments';
import { priceLabel } from '@/lib/format';

export default function Header({ categories }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, catalog, wish, ready } = useShop();
  const wishCount = ready ? wish.length : 0;
  const overlayPage = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  // Solid/tucked after 40px; hidden only when the footer is on screen AND the visitor has scrolled down a
  // long page — short pages (contact, basket, wishlist) never lose their header.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const footer = document.querySelector('.site-footer');
      setHidden(!!footer && y > 160 && footer.getBoundingClientRect().top < window.innerHeight - 2);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [pathname]);

  useEffect(() => { setMenu(false); setSearch(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu || search ? 'hidden' : '';
    if (search) setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(false); setSearch(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, search]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return catalog.filter((p) => p.nameEn.toLowerCase().includes(t) || p.nameTa.includes(q.trim()) || p.slug.includes(t.replace(/\s+/g, '-'))).slice(0, 8);
  }, [q, catalog]);

  const solid = !overlayPage || scrolled || menu;
  const cls = ['site-header', solid ? 'site-header--solid' : 'site-header--overlay', scrolled ? 'site-header--tucked' : '', hidden && !menu ? 'site-header--hidden' : ''].join(' ');
  const isOn = (href) => pathname === href || pathname.startsWith(href + '/') || (href === '/shop' && (pathname.startsWith('/product') || pathname.startsWith('/store/')));
  const NavLink = ({ n }) => (
    <Link href={n.href} prefetch={false} aria-current={isOn(n.href) ? 'page' : undefined}>{n.label}</Link>
  );

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={cls}>
        <div className="wrap hdr">
          <button className="icon-btn hdr__burger" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><IconMenu /></button>
          <Link href="/" prefetch={false} className="hdr__brand" aria-label="Naadu Nalam — home">
            <span className="hdr__seal"><img src="/images/brand/naadu-nalam-emblem.webp" alt="" width="58" height="56" /></span>
            <span className="hdr__word">
              <span className="hdr__en">{site.name}</span>
              <span className="hdr__ta" lang="ta">{site.nameTa}</span>
            </span>
          </Link>
          <nav className="hdr__nav" aria-label="Main">
            {nav.map((n) => (n.dropdown ? (
              <div key={n.href} className="hdr__drop">
                <Link href={n.href} prefetch={false} aria-current={isOn(n.href) ? 'page' : undefined} aria-haspopup="true">
                  {n.label} <IconChevron />
                </Link>
                <div className="hdr__panel">
                  <Link href="/shop" prefetch={false} className="hdr__panel-all">All products <IconArrow width="16" height="16" /></Link>
                  <ul>
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/product-category/${c.slug}`} prefetch={false}>
                          <span>{c.nameEn}<small lang="ta">{c.nameTa}</small></span><em>{c.count}</em>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (<NavLink key={n.href} n={n} />)))}
          </nav>
          <div className="hdr__icons">
            <button className="icon-btn" aria-label="Search products" onClick={() => setSearch(true)}><IconSearch /></button>
            <Link className="icon-btn hdr__wish" href="/wishlist" prefetch={false} aria-label={`Wishlist, ${wishCount} saved`}>
              <IconHeart />{wishCount > 0 && <span className="count">{wishCount}</span>}
            </Link>
            <Link className="cart-pill" href="/cart" prefetch={false} aria-label={`Basket, ${count} items`}>
              <IconBasket /><span className="cart-pill__label">Basket</span><span className="cart-pill__count">{count}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mobile-menu" data-open={menu ? 'true' : 'false'} aria-hidden={!menu}>
        <Thoranam className="mobile-menu__thoranam" />
        <div className="mobile-menu__top">
          <span className="hdr__word">
            <span className="hdr__ta" lang="ta">{site.nameTa}</span>
            <span className="hdr__en">{site.name}</span>
          </span>
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}><IconClose /></button>
        </div>
        <nav className="mobile-menu__main" aria-label="Mobile">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} prefetch={false} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
              {n.label}<small lang="ta">{n.ta}</small>
            </Link>
          ))}
        </nav>
        <nav className="mobile-menu__more" aria-label="More pages">
          {secondaryLinks.map((n) => (<Link key={n.href} href={n.href} prefetch={false} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>{n.label}</Link>))}
        </nav>
        <div className="mobile-menu__cats">
          {categories.map((c) => (
            <Link key={c.slug} href={`/product-category/${c.slug}`} prefetch={false} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>{c.nameEn}</Link>
          ))}
        </div>
        <div className="mobile-menu__contact">
          <a href={site.phoneHref} tabIndex={menu ? 0 : -1}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`} tabIndex={menu ? 0 : -1}>{site.email}</a>
        </div>
      </div>

      <div className="search-overlay" data-open={search ? 'true' : 'false'} onClick={(e) => e.target === e.currentTarget && setSearch(false)}>
        <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
          <form onSubmit={(e) => { e.preventDefault(); setSearch(false); router.push(`/shop?q=${encodeURIComponent(q.trim())}`); }}>
            <IconSearch width="22" height="22" />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rice, millets, oils… or type in Tamil" aria-label="Search products" />
            <button type="button" className="icon-btn" aria-label="Close search" onClick={() => setSearch(false)}><IconClose /></button>
          </form>
          <div className="search-results">
            {results.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} prefetch={false} onClick={() => setSearch(false)}>
                {p.image ? <img src={p.image} alt="" width="52" height="52" loading="lazy" /> : <span />}
                <span><strong>{p.nameEn}</strong><small lang="ta">{p.nameTa}</small></span>
                <span className="price">{priceLabel(p)}</span>
              </Link>
            ))}
            {q.trim().length >= 2 && !results.length && <p className="search-empty">No products match “{q}”. Try another name, or browse the shop.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
