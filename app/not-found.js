import Link from 'next/link';
import { IconArrow } from '@/components/Icons';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main id="main" className="page-main">
      <section className="section section--forest notfound fit-footer fit-solo">
        <div className="wrap fit-grow fit-col notfound__inner">
          <p className="notfound__ta" lang="ta">வழி தவறிவிட்டீர்களா?</p>
          <h1>This page has wandered off the path.</h1>
          <p>The page you were looking for isn’t here. The marketplace, the journal and our story are all one step away.</p>
          <div className="btn-row">
            <Link href="/" prefetch={false} className="btn btn--gold">Back to home <IconArrow /></Link>
            <Link href="/shop" prefetch={false} className="btn btn--line">Shop the Marketplace</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
