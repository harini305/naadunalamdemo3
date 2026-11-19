// Business information — every value below is taken verbatim from the source website
// (header, footer, contact page and policy pages of naadunalam.fastfilings.in).
export const site = {
  name: 'Naadu Nalam',
  nameTa: 'நாடு நலம்',
  logoTagline: 'Our Inclusive Well-Being', // lettering inside the original logo
  footerTagline: 'Good Food, Brighter Tomorrow',
  metaTitle: 'Naadu Nalam – Marketplace | Farm Products Direct from Farmers',
  metaDescription:
    'Naadu Nalam brings traditional Tamil Nadu foods together in one marketplace — heirloom rice, siruthaniyam, pulses, cold-pressed oils, natural sweeteners and everyday podis from independent sellers.',
  phoneDisplay: '+91 90921 14630',
  phoneHref: 'tel:+919092114630',
  email: 'hello@naadunalam.in',
  address: 'Chennai, Tamil Nadu 600001, India',
  hours: [
    ['Monday to Saturday', '9:00 AM – 6:00 PM'],
    ['Sunday', 'Closed'],
  ],
  replyTime: 'We typically reply within one business day.',
  delivery: 'Flat ₹50 delivery across Tamil Nadu',
  deliveryFee: 50,
  payment: 'Cash on Delivery — pay when your order arrives.',
  telegram: '+91 90921 14630',
};

// Header pages (client reference layout): Shop has a category dropdown. Tamil labels appear in the
// mobile menu only (designer translations — see issues-and-decisions.md).
export const nav = [
  { href: '/shop', label: 'Shop', ta: 'கடை', dropdown: true },
  { href: '/about-us', label: 'Our Story', ta: 'எங்கள் கதை' },
  { href: '/store-listing', label: 'Sellers', ta: 'விற்பனையாளர்கள்' },
  { href: '/blog', label: 'Journal', ta: 'குறிப்புகள்' },
  { href: '/contact', label: 'Contact', ta: 'தொடர்பு' },
];

// Secondary pages live in the footer and mobile menu
export const secondaryLinks = [
  { href: '/services', label: 'How Ordering Works' },
  { href: '/collaborators', label: 'Community' },
  { href: '/vendor-login', label: 'Sell With Us' },
  { href: '/wishlist', label: 'Wishlist' },
];

export const footerLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/about-us', label: 'Our Story' },
  { href: '/store-listing', label: 'Sellers' },
  { href: '/services', label: 'How Ordering Works' },
  { href: '/blog', label: 'Journal' },
  { href: '/collaborators', label: 'Community' },
  { href: '/vendor-login', label: 'Sell With Us' },
  { href: '/contact', label: 'Contact' },
];

export const legalLinks = [
  { href: '/shipping-policy', label: 'Shipping' },
  { href: '/refund-policy', label: 'Returns & Refund' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy-policy', label: 'Privacy' },
];

// The client's seven-generation terms — exact spelling as supplied. Glosses are literal kinship meanings.
export const generations = [
  { ta: 'தாய் தந்தை', translit: 'Thaai Thanthai', en: 'Parents' },
  { ta: 'தாத்தா பாட்டி', translit: 'Thaathaa Paatti', en: 'Grandparents' },
  { ta: 'பாட்டன் பாட்டி', translit: 'Paattan Paatti', en: 'Great-grandparents' },
  { ta: 'பூட்டன் பூட்டி', translit: 'Poottan Pootti', en: 'Great-great-grandparents' },
  { ta: 'ஓட்டன் ஓட்டி', translit: 'Ottan Otti', en: 'Fifth generation' },
  { ta: 'சேயோன் சேயோள்', translit: 'Seyon Seyol', en: 'Sixth generation' },
  { ta: 'பரன் பரை', translit: 'Paran Parai', en: 'Seventh generation' },
];

// Values — Tamil, transliteration and English exactly as on the About and How Ordering Works pages
export const values = [
  { ta: 'நம்பிக்கை', translit: 'Nambikkai', en: 'Trust' },
  { ta: 'நலம்', translit: 'Nalam', en: 'Well-being' },
  { ta: 'மரபு', translit: 'Marabu', en: 'Tradition' },
];

// Thai Pongal combos — transcribed from the two "Thaayanbu Naadu Nalam Thai Pongal Combo" flyers in the
// site's media library (uploaded 18 Nov 2026). Payment / bank details on the flyers are deliberately omitted.
export const pongalCombos = {
  titleTa: 'தைப்பொங்கல் காம்போ',
  titleEn: 'Thai Pongal Combo',
  lineTa: 'இயற்கை முறையில் விளைவிக்கப்பட்ட அரிசி, பருப்பு மற்றும் மளிகை பொருட்கள்',
  openDate: '5-11-2026',
  closeDate: '31-12-2026',
  deliveryDate: '5 to 10-1-2027',
  placeTa: 'கொரட்டூர் சென்னை 80',
  combos: [
    {
      id: 'combo-999',
      count: 10,
      price: '₹999',
      approx: true,
      items: [
        'மஞ்சள் தூள் (50 கிராம்)', 'பச்சை அரிசி (1 கிலோ)', 'பாசி பருப்பு (1/2 கிலோ)', 'உருண்டை வெல்லம் (1 கிலோ)',
        'நெய் (50 கிராம்)', 'முந்திரி (50 கிராம்)', 'திராட்சை (50 கிராம்)', 'ஏலகாய் (10 கிராம்)',
        'சத்து மாவு (250 கிராம்)', 'SS பானை – 1',
      ],
    },
    {
      id: 'combo-1999',
      count: 17,
      price: '₹1999',
      approx: true,
      items: [
        'மஞ்சள் தூள் – 50 கிராம்', 'பச்சை அரிசி – 1 கிலோ', 'பாசி பருப்பு – 1/2 கிலோ', 'உருண்டை வெல்லம் – 1 கிலோ',
        'நாட்டுச் சக்கரை – 1/2 கிலோ', 'நெய் – 50 கிராம்', 'தேன் – 100 கிராம்', 'முந்திரி – 50 கிராம்',
        'திராட்சை – 50 கிராம்', 'ஏலகாய் – 10 கிராம்', 'குழம்பு பொடி – 50 கிராம்', 'சாம்பார் பொடி – 50 கிராம்',
        'பருப்பு பொடி – 50 கிராம்', 'சத்து மாவு – 250 கிராம்', 'SS பானை – 1', 'பூனம் புடவை – 1', 'வெள்ளை வேஷ்டி – 1',
      ],
    },
  ],
};
