// Root-level slugs: blog posts and policy pages both lived at /<slug>/ on the source site, so both keep their URLs.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLegal, getPost, getPosts, legalSlugs } from '@/lib/catalog';
import { formatDate } from '@/lib/format';
import { legalLinks } from '@/lib/site';
import { IconArrow } from '@/components/Icons';
import ClosingBand from '@/components/ClosingBand';
import PageBand from '@/components/PageBand';
import { KolamBand } from '@/components/Ornaments';

export const dynamicParams = false;
export function generateStaticParams() {
  return [...getPosts().map((p) => ({ slug: p.slug })), ...legalSlugs.map((slug) => ({ slug }))];
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (post) return { title: post.title, description: post.excerpt };
  const l = getLegal(slug);
  return l ? { title: l.title } : {};
}

const Blocks = ({ blocks }) => blocks.map((b, i) => (b.type === 'p' ? <p key={i}>{b.text}</p> : <ul key={i}>{b.items.map((t) => (<li key={t}>{t}</li>))}</ul>));

function Legal({ doc }) {
  return (
    <main id="main" className="page-main">
      <PageBand title={doc.title} intro={`Last updated: ${doc.updated}. ${doc.intro[0]?.text || ''}`} />
      <section className="section section--paper">
        <div className="wrap legal2">
          <aside className="legal2__side">
            <nav className="legal2__toc" aria-label="On this page">
              <h2>On this page</h2>
              {doc.sections.map((s) => (<a key={s.id} href={`#${s.id}`}>{s.heading}</a>))}
            </nav>
            <nav className="legal2__others" aria-label="Other policies">
              {legalLinks.filter((l) => l.href !== `/${doc.slug}`).map((l) => (<Link key={l.href} href={l.href} prefetch={false} className="chip">{l.label}</Link>))}
            </nav>
          </aside>
          <article className="legal2__body prose">
            <Blocks blocks={doc.intro.slice(1)} />
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="legal2__sec">
                <h2>{s.heading}</h2>
                <Blocks blocks={s.blocks} />
              </section>
            ))}
          </article>
        </div>
      </section>
      <ClosingBand variant="help" />
    </main>
  );
}

export default async function SlugPage({ params }) {
  const { slug } = await params;
  const doc = getLegal(slug);
  if (doc) return <Legal doc={doc} />;
  const post = getPost(slug);
  if (!post) notFound();
  const others = getPosts().filter((p) => p.slug !== slug).slice(0, 3);
  return (
    <main id="main" className="page-main">
      <article className="section section--paper post2">
        <header className="wrap post2__head">
          <span className="journal__meta">{post.categories.join(', ')} — {formatDate(post.date)}</span>
          <h1>{post.title}</h1>
          <p className="post2__excerpt">{post.excerpt}</p>
          <KolamBand dots={9} />
        </header>
        {post.image && (
          <div className="wrap"><figure className="post2__hero"><img src={post.image.src} alt={post.imageAlt} width={post.image.w} height={post.image.h} fetchPriority="high" /></figure></div>
        )}
        <div className="wrap post2__body">
          <aside className="post2__rail">
            <div className="post2__rail-inner">
              <span><strong>Published</strong>{formatDate(post.date)}</span>
              <span><strong>Filed under</strong>{post.categories.join(', ')}</span>
              {post.tags.length > 0 && (<span className="post2__tags"><strong>Tags</strong>{post.tags.map((t) => (<em key={t} className="chip">{t}</em>))}</span>)}
              <Link href="/blog" prefetch={false} className="link-arrow">All articles <IconArrow width="16" height="16" /></Link>
            </div>
          </aside>
          <div className="prose post2__prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </div>
      </article>
      <section className="section section--rice fit-footer">
        <div className="wrap fit-grow fit-col">
          <div className="pd2-related__head">
            <h2 className="pd-related__title">More from the journal</h2>
            <Link href="/blog" prefetch={false} className="link-arrow">All articles <IconArrow width="18" height="18" /></Link>
          </div>
          <ul className="blog__grid blog__grid--3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} prefetch={false} className="jr__card hover-zoom">
                  <span className="frame jr__card-img jr__card-img--wide"><img src={p.image.src} alt={p.imageAlt} width="480" height="320" loading="lazy" /></span>
                  <span className="journal__meta">{formatDate(p.date)}</span>
                  <h3>{p.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
