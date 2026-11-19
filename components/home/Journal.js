import Link from 'next/link';
import { formatDate } from '@/lib/format';
import { IconArrow } from '../Icons';

export default function Journal({ posts }) {
  const [lead, ...rest] = posts;
  return (
    <section className="section section--rice journal" aria-labelledby="journal-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="journal-title">
            <span className="title-ta" lang="ta">சமையல் குறிப்புகள்</span>
            <span className="title-en">Kitchen notes from the journal</span>
          </h2>
          <div className="section-head__side">
            <p>Practical guides about the food itself — which rice suits which meal, how cold-pressed oil differs, how to pick a honey.</p>
            <Link href="/blog" prefetch={false} className="link-arrow">Read all {posts.length + 0} articles <IconArrow width="18" height="18" /></Link>
          </div>
        </div>
        <div className="journal__grid">
          <Link href={`/${lead.slug}`} prefetch={false} className="journal__lead hover-zoom" data-reveal>
            <span className="frame"><img src={lead.image?.src} alt={lead.imageAlt || ''} width="900" height="600" loading="lazy" /></span>
            <span className="journal__meta">{formatDate(lead.date)}</span>
            <h3>{lead.title}</h3>
            <p>{lead.excerpt}</p>
          </Link>
          <div className="journal__side">
            {rest.slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} prefetch={false} className="journal__item hover-zoom" data-reveal>
                <span className="frame"><img src={p.image?.src} alt={p.imageAlt || ''} width="300" height="300" loading="lazy" /></span>
                <span>
                  <span className="journal__meta">{formatDate(p.date)}</span>
                  <h3>{p.title}</h3>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
