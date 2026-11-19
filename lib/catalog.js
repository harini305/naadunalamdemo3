// Server-side data access for the structured catalogue extracted from the source website.
import products from '@/data/products.json';
import categories from '@/data/categories.json';
import sellers from '@/data/sellers.json';
import posts from '@/data/posts.json';
import legal from '@/data/legal.json';

export const getProducts = () => products;
export const getProduct = (slug) => products.find((p) => p.slug === slug);
export const getCategories = () => categories;
export const getCategory = (slug) => categories.find((c) => c.slug === slug);
export const getSellers = () => sellers;
export const getSeller = (slug) => sellers.find((s) => s.slug === slug);
export const getPosts = () => posts;
export const getPost = (slug) => posts.find((p) => p.slug === slug);
export const getLegal = (slug) => legal[slug];
export const legalSlugs = Object.keys(legal);

export const productsInCategory = (slug) => products.filter((p) => p.categories.includes(slug));
export const productsBySeller = (slug) => products.filter((p) => p.seller === slug);

// Display order used across the site: the source header's "Shop by category" order, then the rest.
const CATEGORY_ORDER = [
  'rice-grains', 'aval-flakes', 'siruthaniyam', 'natural-sweeteners', 'oil-vinegers', 'health-mixes',
  'personal-care', 'paruppu-pulses', 'masala-podi', 'herbal-wellness', 'honey', 'other-rice',
];
export const orderedCategories = () =>
  [...categories].sort((a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug));

export function relatedProducts(product, n = 4) {
  const same = products.filter((p) => p.slug !== product.slug && p.categories.some((c) => product.categories.includes(c)));
  const rest = products.filter((p) => p.slug !== product.slug && p.seller === product.seller && !same.includes(p));
  return [...same, ...rest].slice(0, n);
}

export const sellerDisplay = {
  naadunalam: { name: 'Naadu Nalam', nameTa: 'நாடு நலம்' },
  thaayanbu: { name: 'Thaayanbu', nameTa: 'தாயன்பு' },
};
