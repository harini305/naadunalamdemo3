import { Suspense } from 'react';
import ContactForm from '@/components/ContactForm';
import { KolamBand, Thoranam } from '@/components/Ornaments';
import { IconClock, IconMail, IconPhone, IconPin } from '@/components/Icons';
import { site } from '@/lib/site';

export const metadata = { title: 'Contact Us', description: 'Questions about orders, products, or partnerships? Reach the Naadu Nalam team.' };

export default function Contact() {
  return (
    <main id="main" className="page-main">
      <section className="section section--paper contact2 fit-footer fit-solo">
        <div className="wrap contact2__grid fit-grow">
          <aside className="contact2__card">
            <Thoranam />
            <div className="contact2__inner">
              <h1>Contact Us</h1>
              <KolamBand dots={7} tone="gold" />
              <p>Questions about orders, products, or partnerships? Reach the Naadu Nalam team and we will get back to you soon.</p>
              <ul className="contact2__list">
                <li><span className="contact2__ic"><IconPin /></span><span><strong>Visit our store base</strong>{site.address}</span></li>
                <li><span className="contact2__ic"><IconPhone /></span><span><strong>Call</strong><a href={site.phoneHref}>{site.phoneDisplay}</a></span></li>
                <li><span className="contact2__ic"><IconMail /></span><span><strong>Write</strong><a href={`mailto:${site.email}`}>{site.email}</a></span></li>
                <li><span className="contact2__ic"><IconClock /></span><span><strong>Business hours</strong>{site.hours.map(([d, h]) => (<span key={d}>{d}: {h}</span>))}</span></li>
              </ul>
              <p className="contact2__note">Also on Telegram: {site.telegram}. {site.replyTime}</p>
            </div>
          </aside>
          <div className="contact2__form">
            <h2>Send a message</h2>
            <p className="form-note">Tell us how we can help. Your message opens in your email app, addressed to {site.email}.</p>
            <Suspense fallback={null}><ContactForm /></Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
