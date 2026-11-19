import Link from 'next/link';

// Compact, text-only heading used at the top of inner pages (same structure everywhere).
// A fragment of the seven-generation rings sits at the right edge — the site's signature mark.
const RINGS = [70, 104, 138, 172, 206, 240, 274];

export default function PageBand({ title, ta, intro, cta }) {
  return (
    <section className="band">
      <svg className="band__rings" viewBox="0 0 600 600" aria-hidden="true">
        {RINGS.map((r, i) => (<circle key={r} cx="300" cy="300" r={r} fill="none" stroke="#cfaa5e" strokeOpacity={0.55 - i * 0.06} strokeWidth={i === 0 ? 2 : 1.3} />))}
        {RINGS.map((r, i) => (<circle key={`d${r}`} cx={300 - r} cy="300" r={i === 0 ? 5 : 4} fill="#e6a73a" fillOpacity={0.9 - i * 0.08} />))}
      </svg>
      <div className="wrap band__inner">
        <div className="band__title" data-reveal>
          <h1>{title}</h1>
          {ta && <p className="band__ta" lang="ta">{ta}</p>}
        </div>
        {(intro || cta) && (
          <div className="band__side" data-reveal>
            {intro && <p>{intro}</p>}
            {cta && <Link href={cta.href} prefetch={false} className="btn btn--gold btn--sm">{cta.label}</Link>}
          </div>
        )}
      </div>
    </section>
  );
}
