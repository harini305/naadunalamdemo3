import Checkout from '@/components/Checkout';
export const metadata = { title: 'Checkout' };
export default function CheckoutPage() {
  return (
    <main id="main" className="page-main">
      <section className="section section--paper fit-footer fit-solo"><div className="wrap fit-grow fit-col"><Checkout /></div></section>
    </main>
  );
}
