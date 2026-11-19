import PageBand from '@/components/PageBand';
import SellerApply from '@/components/SellerApply';
import { KolamBand } from '@/components/Ornaments';
import { getProduct } from '@/lib/catalog';

const pick = (slug) => getProduct(slug).images[0].src;

export const metadata = { title: 'Sell on Naadu Nalam', description: 'Open a storefront on the Naadu Nalam multi-vendor marketplace.' };

// Copy verbatim from the source "Vendor Login" / "Sell on Naadu Nalam" page and the Collaborators page.
export default function SellWithUs() {
  return (
    <main id="main" className="page-main">
      <PageBand title="Sell on Naadu Nalam" ta="விற்பனையாளராக இணையுங்கள்"
        intro="Naadu Nalam is a multi-vendor marketplace. If you grow, make or gather something that belongs on Naadu Nalam — or you represent a group that does — we would like to hear from you." />
      <section className="section section--paper fit-footer">
        <div className="wrap sell2 fit-grow">
          <div className="sell2__info">
            <ul className="sell2__points">
              <li data-reveal><img src={pick('kichadi-samba-rice')} alt="" width="96" height="96" /><span><strong>Your own storefront</strong>Every seller has a store page of their own, at naadunalam.fastfilings.in/store/your-shop.</span></li>
              <li data-reveal><img src={pick('cold-pressed-sesame-oil')} alt="" width="96" height="96" /><span><strong>Manage your shelf</strong>Add products, manage stock and track orders from the vendor dashboard.</span></li>
              <li data-reveal><img src={pick('urundai-vellam')} alt="" width="96" height="96" /><span><strong>Cash on Delivery</strong>Orders on the marketplace are Cash on Delivery at present.</span></li>
            </ul>
            <p className="sell2__note" data-reveal><span lang="ta">தமிழ் · English</span>Product names and descriptions carry both English and Tamil — so the produce is named the way the people who grow it name it.</p>
          </div>
          <div className="sell2__form">
            <h2>Apply to sell</h2>
            <KolamBand dots={7} />
            <p className="form-note">Your application opens in your email app, addressed to the Naadu Nalam team.</p>
            <SellerApply />
          </div>
        </div>
      </section>
    </main>
  );
}
