// Shared formatting helpers (safe for both server and client components).
export function formatPrice(n) {
  const v = Number(n || 0);
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

export function priceLabel(p) {
  if (p.priceRange) return `${formatPrice(p.priceRange.min)} – ${formatPrice(p.priceRange.max)}`;
  return formatPrice(p.price);
}

export function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
