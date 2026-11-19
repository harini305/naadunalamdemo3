import WishlistView from '@/components/WishlistView';
import { getProduct, getProducts } from '@/lib/catalog';
import { cardShape } from '@/lib/shapes';

export const metadata = { title: 'Wishlist' };

// Starter picks shown when the list is empty (one from each storefront's strengths)
const STARTERS = ['black-kavuni-rice', 'kambu', 'karuppu-kavuni-aval', 'tulsi-infused-honey', 'cold-pressed-sesame-oil', 'sambar-podi'];

export default function Wishlist() {
  return (
    <main id="main" className="page-main">
      <WishlistView products={getProducts().map(cardShape)} starters={STARTERS.map(getProduct).filter(Boolean).map(cardShape)} />
    </main>
  );
}
