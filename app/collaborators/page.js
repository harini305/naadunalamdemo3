import Link from 'next/link';
import PageBand from '@/components/PageBand';
import { Thoranam } from '@/components/Ornaments';
import { IconArrow } from '@/components/Icons';

export const metadata = { title: 'Community', description: 'Collaborators, events, the year ahead and research — the Naadu Nalam community.' };

// Merges the source's Collaborators, Events, Calendar and Research Articles pages (all "coming soon" placeholders
// on the source) into one page. Copy is verbatim; nothing is invented about the collaborators.
const COLLABORATORS = ['TST Music & Dance Academy', 'TST Event Mgt', 'Ignite Our Tharas Kids Kondaatam', 'Queen Bee’s Math Tutoring', 'Bharathanaatiyam'];
const EVENT_KINDS = [
  ['Markets and stalls', 'Days where you can meet the sellers behind the listings and buy from them face to face.'],
  ['Farm and producer visits', 'Trips to the fields, mills and oil presses our products actually come from.'],
  ['Tastings and kitchen sessions', 'Short, practical sessions around traditional rice, millets, cold-pressed oils and whole spices.'],
];
const MONTHS = [
  ['January', 'Pongal season', 'pongal'], ['February', 'Cool season', 'cool'], ['March', 'Cool season', 'cool'],
  ['April', 'Summer', 'summer'], ['May', 'Summer', 'summer'], ['June', 'Summer', 'summer'],
  ['July', 'South-west monsoon', 'sw'], ['August', 'South-west monsoon', 'sw'], ['September', 'South-west monsoon', 'sw'],
  ['October', 'North-east monsoon', 'ne'], ['November', 'North-east monsoon', 'ne'], ['December', 'North-east monsoon', 'ne'],
];

export default function Community() {
  return (
    <main id="main" className="page-main">
      <PageBand title="Community" ta="சமூகம்"
        intro="Naadu Nalam is a marketplace, not a warehouse. Everything on the site comes from a seller who grows, presses, mills or gathers it themselves — and community organisations work alongside them." />

      <section className="section section--paper">
        <div className="wrap collab">
          <div className="collab__text" data-reveal>
            <h2>Our collaborators</h2>
            <p>We are gathering profiles, logos and links for the sellers and partners we work with. As each one is confirmed it will appear here, with a short description and a link to their store.</p>
            <Link href="/store-listing" prefetch={false} className="link-arrow">Browse our sellers <IconArrow width="18" height="18" /></Link>
          </div>
          <ul className="collab__list">
            {COLLABORATORS.map((c) => (<li key={c} data-reveal><span className="collab__seal" aria-hidden="true">{c.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('')}</span><span className="collab__txt"><strong>{c}</strong><span>Community organisation — full introduction coming soon</span></span></li>))}
          </ul>
        </div>
      </section>

      <section className="section section--forest" id="events">
        <Thoranam />
        <div className="wrap events">
          <div data-reveal>
            <h2>Events</h2>
            <p>Markets, farm visits and gatherings that bring the people who grow our food and the people who cook it into the same room. Nothing is scheduled at the moment — once a date is confirmed, it will be listed here with where it is, what time it starts and how to join.</p>
          </div>
          <ul className="events__kinds">
            {EVENT_KINDS.map(([t, d]) => (<li key={t} data-reveal><h3>{t}</h3><p>{d}</p></li>))}
          </ul>
        </div>
      </section>

      <section className="section section--rice" id="calendar">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <h2>The year ahead</h2>
            <p>Markets and stalls, farm and producer visits, tastings, and notices about when dispatch pauses will each be listed against their month. Nothing is on the calendar yet.</p>
          </div>
          <ol className="year">
            {MONTHS.map(([m, s, k]) => (<li key={m} className={`year__m year__m--${k}`} data-reveal><strong>{m}</strong><span>{s}</span><small>No entries yet</small></li>))}
          </ol>
        </div>
      </section>

      <section className="section section--paper2 fit-footer" id="research">
        <div className="wrap research fit-grow">
          <div data-reveal>
            <h2>Research articles</h2>
            <p>Longer, sourced writing about traditional Tamil Nadu grains, oils, spices and the farming they come from — and what is actually known about them. We have not published any research yet. If you research Tamil Nadu food systems, traditional crops or nutrition and would like your work published here, we would like to hear from you.</p>
            <div className="btn-row">
              <Link href="/contact?topic=partnership" prefetch={false} className="btn btn--clay">Contact us</Link>
              <Link href="/blog" prefetch={false} className="btn btn--line-dark">Read the journal</Link>
              <Link href="/vendor-login" prefetch={false} className="btn btn--line-dark">Apply to sell</Link>
            </div>
          </div>
          <figure className="frame frame--arch research__img" data-reveal><img src="/images/client/family-courtyard.webp" alt="A Tamil family of several generations in a traditional courtyard" width="770" height="528" loading="lazy" /></figure>
        </div>
      </section>
    </main>
  );
}
