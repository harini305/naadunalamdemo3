// Trimmed product shapes passed to client components (keeps long Tamil descriptions out of the browser bundle
// for listing pages; product pages render descriptions on the server).
export const cardShape = (p) => ({
  id: p.id, slug: p.slug, nameEn: p.nameEn, nameTa: p.nameTa, price: p.price, priceRange: p.priceRange,
  packs: p.packs, variations: p.variations, categories: p.categories, seller: p.seller,
  shortDescription: p.shortDescription, images: p.images.slice(0, 1),
});

export const categoryShape = (c) => ({ slug: c.slug, nameEn: c.nameEn, nameTa: c.nameTa, count: c.count, image: c.image?.src || null });
