'use client';
import { useState } from 'react';
import { site } from '@/lib/site';

export default function SellerApply() {
  const [f, setF] = useState({ first: '', last: '', email: '', phone: '', shop: '', about: '' });
  const [opened, setOpened] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const slug = f.shop.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const submit = (e) => {
    e.preventDefault();
    const body = `Seller application\n\nName: ${f.first} ${f.last}\nEmail: ${f.email}\nPhone: ${f.phone}\nShop name: ${f.shop}\nShop URL: naadunalam.fastfilings.in/store/${slug}\n\nWhat I grow, make or gather:\n${f.about}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Seller application: ${f.shop}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };
  return (
    <form className="form-grid" onSubmit={submit}>
      <div className="field"><label htmlFor="s-first">First name</label><input id="s-first" required value={f.first} onChange={set('first')} autoComplete="given-name" /></div>
      <div className="field"><label htmlFor="s-last">Last name</label><input id="s-last" required value={f.last} onChange={set('last')} autoComplete="family-name" /></div>
      <div className="field"><label htmlFor="s-email">Email address</label><input id="s-email" type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></div>
      <div className="field"><label htmlFor="s-phone">Phone number</label><input id="s-phone" type="tel" required value={f.phone} onChange={set('phone')} autoComplete="tel" /></div>
      <div className="field span-2"><label htmlFor="s-shop">Shop name</label><input id="s-shop" required value={f.shop} onChange={set('shop')} />
        {slug && <small className="form-note">Shop URL: naadunalam.fastfilings.in/store/{slug}</small>}</div>
      <div className="field span-2"><label htmlFor="s-about">What do you grow, make or gather?</label><textarea id="s-about" value={f.about} onChange={set('about')} /></div>
      <div className="span-2"><button type="submit" className="btn btn--clay">Write my application</button></div>
      {opened && <p className="span-2 form-note" role="status">Your email app should now be open with your application. If nothing opened, write to {site.email}.</p>}
    </form>
  );
}
