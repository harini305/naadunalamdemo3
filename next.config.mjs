/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimisation OFF: every image is a pre-optimised WebP served as a static file (no /_next/image usage).
  images: { unoptimized: true },
  // Long cache for static images and fonts (new filenames are used when an image changes)
  async headers() {
    return [
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
  // Every URL of the source WordPress site keeps working: real pages keep their path,
  // thin or placeholder pages redirect to where their content now lives.
  async redirects() {
    return [
      { source: '/testimonials', destination: '/about-us#reviews', permanent: true },
      { source: '/events', destination: '/collaborators#events', permanent: true },
      { source: '/calendar', destination: '/collaborators#calendar', permanent: true },
      { source: '/research-articles', destination: '/collaborators#research', permanent: true },
      { source: '/collaborators/:slug', destination: '/collaborators', permanent: true },
      { source: '/my-account', destination: '/cart', permanent: false },
      { source: '/my-account/:path*', destination: '/cart', permanent: false },
      { source: '/my-orders', destination: '/cart', permanent: false },
      { source: '/dashboard', destination: '/vendor-login', permanent: false },
      { source: '/newsletter', destination: '/contact', permanent: true },
      { source: '/compare', destination: '/shop', permanent: true },
      { source: '/angietesting', destination: '/', permanent: true },
      { source: '/brand/:slug', destination: '/shop', permanent: true },
      { source: '/shop/page/:n', destination: '/shop', permanent: true },
      { source: '/blog/:n(\\d+)', destination: '/blog', permanent: true },
      { source: '/blog/page/:n', destination: '/blog', permanent: true },
      { source: '/category/:slug', destination: '/blog', permanent: true },
      { source: '/tag/:slug', destination: '/blog', permanent: true },
      { source: '/product-category/spices', destination: '/product-category/masala-podi', permanent: false },
    ];
  },
};

export default nextConfig;
