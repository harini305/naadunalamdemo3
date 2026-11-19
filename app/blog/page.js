import { getPosts } from '@/lib/catalog';
import BlogBrowser from '@/components/BlogBrowser';
import ClosingBand from '@/components/ClosingBand';

export const metadata = { title: 'Journal', description: 'Kitchen notes, seasonal picks and how buying direct works — the Naadu Nalam journal.' };

// No heading band on the journal: it starts straight with the content.
export default function Blog() {
  return (
    <main id="main" className="page-main">
      <section className="section section--paper jr">
        <div className="wrap"><BlogBrowser posts={getPosts()} /></div>
      </section>
      <ClosingBand />
    </main>
  );
}
