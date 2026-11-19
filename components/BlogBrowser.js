'use client';
// Journal: heading row with category chips (real blog categories) + magazine grid.
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatDate } from '@/lib/format';
import { IconArrow } from './Icons';

export default function BlogBrowser({ posts }) {
  const cats = useMemo(() => {
    const m = new Map();
    posts.forEach((p) => p.categories.forEach((c) => m.set(c, (m.get(c) || 0) + 1)));
    return [...m.entries()];
  }, [posts]);
  const [cat, setCat] = useState('all');
  const list = cat === 'all' ? posts : posts.filter((p) => p.categories.includes(cat));
  // the wide lead card only in the full view, where it makes the 3-column grid fill exactly
  const [lead, ...rest] = cat === 'all' ? list : [null, ...list];

  return (
    <>
      <div className="jr__head">
        <h1>
          <span className="title-ta" lang="ta">சமையல் குறிப்புகள்</span>
          <span className="title-en">The Naadu Nalam journal — kitchen notes, seasonal picks and how buying direct works</span>
        </h1>
        <div className="jr__chips" role="group" aria-label="Filter by category">
          <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All <small>{posts.length}</small></button>
          {cats.map(([c, n]) => (<button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c} <small>{n}</small></button>))}
        </div>
      </div>
      <div className="jr__grid">
        {lead && (
          <Link href={`/${lead.slug}`} prefetch={false} className="jr__lead hover-zoom">
            <span className="frame jr__lead-img"><img src={lead.image.src} alt={lead.imageAlt} width="1024" height="1024" fetchPriority="high" /></span>
            <span className="jr__lead-text">
              <span className="journal__meta">{lead.categories.join(', ')} — {formatDate(lead.date)}</span>
              <h2>{lead.title}</h2>
              <p>{lead.excerpt}</p>
              <span className="link-arrow">Read the article <IconArrow width="18" height="18" /></span>
            </span>
          </Link>
        )}
        {rest.map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} prefetch={false} className="jr__card hover-zoom">
            <span className="frame jr__card-img"><img src={p.image.src} alt={p.imageAlt} width="480" height="480" loading="lazy" /></span>
            <span className="journal__meta">{formatDate(p.date)}</span>
            <h3>{p.title}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
