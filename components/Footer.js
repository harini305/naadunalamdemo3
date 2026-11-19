import Link from 'next/link';
import { footerLinks, legalLinks, site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <Link href="/" prefetch={false} className="brand" aria-label="Naadu Nalam — home">
          <img src="/images/brand/naadu-nalam-emblem.webp" alt="" width="46" height="44" loading="lazy" />
          <span className="brand__text">
            <span className="brand__ta" lang="ta">{site.nameTa}</span>
            <span className="brand__en">{site.name}</span>
          </span>
        </Link>
        <nav className="footer-links" aria-label="Footer">
          {footerLinks.map((l) => (<Link key={l.href} href={l.href} prefetch={false}>{l.label}</Link>))}
        </nav>
        <div className="footer-contact">
          <a href={site.phoneHref}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
      <div className="wrap site-footer__base">
        <span>© 2026 Naadu Nalam. All rights reserved.</span>
        <nav aria-label="Policies">
          {legalLinks.map((l) => (<Link key={l.href} href={l.href} prefetch={false}>{l.label}</Link>))}
        </nav>
      </div>
    </footer>
  );
}
