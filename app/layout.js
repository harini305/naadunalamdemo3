import './globals.css';
import '@/styles/home.css';
import '@/styles/pages.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import { ShopProvider } from '@/components/ShopProvider';
import { orderedCategories } from '@/lib/catalog';
import { site } from '@/lib/site';

export const metadata = {
  metadataBase: new URL('https://naadunalam.fastfilings.in'),
  title: { default: site.metaTitle, template: '%s – Naadu Nalam' },
  description: site.metaDescription,
  openGraph: { title: site.metaTitle, description: site.metaDescription, siteName: site.name, locale: 'en_IN', type: 'website' },
};

export const viewport = { themeColor: '#123d2a' };

export default function RootLayout({ children }) {
  const cats = orderedCategories().map((c) => ({ slug: c.slug, nameEn: c.nameEn, nameTa: c.nameTa, count: c.count }));
  return (
    <html lang="en-IN">
      <head>
        <link rel="preload" href="/fonts/noto-serif-tamil-latin-standard-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/noto-serif-tamil-tamil-standard-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/catamaran-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <ShopProvider>
          <Header categories={cats} />
          {children}
          <Footer />
          <Motion />
        </ShopProvider>
      </body>
    </html>
  );
}
