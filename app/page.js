import Hero from '@/components/home/Hero';
import Generations from '@/components/home/Generations';
import Panchabhootham from '@/components/home/Panchabhootham';
import ThaayanbuStory from '@/components/home/ThaayanbuStory';
import CategoryShelf from '@/components/home/CategoryShelf';
import RiceIndex from '@/components/home/RiceIndex';
import Basket from '@/components/home/Basket';
import Journal from '@/components/home/Journal';
import Closing from '@/components/home/Closing';
import { getPosts, getProduct, orderedCategories, productsBySeller, productsInCategory } from '@/lib/catalog';
import { generatedImage } from '@/lib/generated';

const lite = (p) => ({ slug: p.slug, nameEn: p.nameEn, nameTa: p.nameTa, price: p.price, priceRange: p.priceRange, packs: p.packs, variations: p.variations, images: p.images.slice(0, 1) });

export default function Home() {
  const cats = orderedCategories();
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, { slug: c.slug, nameEn: c.nameEn, nameTa: c.nameTa, image: c.image }]));
  const rice = productsInCategory('rice-grains').map(lite);
  const thaayanbu = productsBySeller('thaayanbu');
  const naadunalam = productsBySeller('naadunalam');

  // Hand-picked from each storefront so every category on the shelf is represented once
  const pick = (slugs) => slugs.map(getProduct).filter(Boolean).map(lite);
  const sellers = [
    { slug: 'naadunalam', name: 'Naadu Nalam', count: naadunalam.length,
      products: pick(['mappillai-samba', 'black-kavuni-rice', 'kambu', 'foxtail-millet-thinai', 'karuppu-kavuni-aval', 'toor-dal', 'ponni-arisi', 'karuppu-ulundhu']) },
    { slug: 'thaayanbu', name: 'Thaayanbu', count: thaayanbu.length,
      products: pick(['cold-pressed-sesame-oil', 'nallamaattu-nei', 'tulsi-infused-honey', 'palm-jaggery-karupatti', 'sambar-podi', 'kali-kanji-maavu', 'panchakara-kudineer', 'seekkai-podi']) },
  ];
  const storyPicks = pick(['tulsi-infused-honey', 'cold-pressed-sesame-oil', 'sambar-podi']);
  const genImage = { src: '/images/site/paddy-in-hand.webp', alt: 'A hand holding newly picked paddy stalks in a rice field' };

  return (
    <main id="main" className="page-main page-main--overlay home">
      <Hero />
      <Generations image={genImage} />
      <Panchabhootham categories={catMap} />
      <ThaayanbuStory picks={storyPicks} productCount={thaayanbu.length} photo={generatedImage('thaayanbu')} />
      <CategoryShelf categories={cats} />
      <RiceIndex rice={rice} aval={catMap['aval-flakes'] && { ...catMap['aval-flakes'], count: cats.find((c) => c.slug === 'aval-flakes').count }} />
      <Basket sellers={sellers} />
      <Journal posts={getPosts()} />
      <Closing />
    </main>
  );
}
