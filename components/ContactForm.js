'use client';
// Frontend-only form: composes an email to Naadu Nalam in the visitor's mail app (no backend, no fake "sent").
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { site } from '@/lib/site';

const TOPICS = [
  ['order', 'An order or delivery'],
  ['product', 'A product question'],
  ['thai-pongal-combo', 'Thai Pongal Combo (தைப்பொங்கல் காம்போ)'],
  ['selling', 'Selling on Naadu Nalam'],
  ['partnership', 'Partnerships and collaborations'],
  ['other', 'Something else'],
];

export default function ContactForm() {
  const params = useSearchParams();
  const [f, setF] = useState({ name: '', email: '', phone: '', topic: 'order', message: '', agree: false });
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const t = params.get('topic');
    if (t && TOPICS.some(([v]) => v === t)) setF((x) => ({ ...x, topic: t }));
  }, [params]);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const topic = TOPICS.find(([v]) => v === f.topic)?.[1] || '';
    const body = `${f.message}\n\n— ${f.name}\n${f.email}${f.phone ? `\n${f.phone}` : ''}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Enquiry: ${topic}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form className="form-grid" onSubmit={submit}>
      <div className="field"><label htmlFor="c-name">Your name</label><input id="c-name" required value={f.name} onChange={set('name')} autoComplete="name" /></div>
      <div className="field"><label htmlFor="c-email">Email address</label><input id="c-email" type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></div>
      <div className="field"><label htmlFor="c-phone">Phone (optional)</label><input id="c-phone" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /></div>
      <div className="field"><label htmlFor="c-topic">How can we help?</label>
        <select id="c-topic" value={f.topic} onChange={set('topic')}>{TOPICS.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}</select>
      </div>
      <div className="field span-2"><label htmlFor="c-msg">Message</label><textarea id="c-msg" required value={f.message} onChange={set('message')} /></div>
      <label className="span-2 check">
        <input type="checkbox" required checked={f.agree} onChange={set('agree')} />
        <span>I agree that Naadu Nalam may use these details to respond to my enquiry, as set out in the <Link href="/privacy-policy" prefetch={false}>Privacy Policy</Link>.</span>
      </label>
      <div className="span-2 btn-row">
        <button className="btn btn--clay" type="submit">Write the email</button>
        <a className="btn btn--line-dark" href={site.phoneHref}>Call {site.phoneDisplay}</a>
      </div>
      {opened && <p className="span-2 form-note" role="status">Your email app should now be open with this message. If nothing opened, write to {site.email} directly.</p>}
    </form>
  );
}
