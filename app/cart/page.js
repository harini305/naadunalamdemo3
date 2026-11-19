import CartView from '@/components/CartView';
export const metadata = { title: 'Your Basket' };
export default function Cart() {
  return (
    <main id="main" className="page-main">
      <section className="section section--paper fit-footer fit-solo"><div className="wrap fit-grow fit-col"><CartView /></div></section>
    </main>
  );
}
