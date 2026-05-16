/** Product URL helpers (no other utils imports — safe for client components). */

export const getSiteOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

/** Unique path per product: /categories/{category}/{product-slug} */
export function getProductUrl(product) {
  const categorySlug = product?.category?.slug;
  const productSlug = product?.slug;

  if (categorySlug && productSlug) {
    return `/categories/${categorySlug}/${productSlug}`;
  }

  if (product?._id) {
    return `/products/${product._id}`;
  }

  return '/products';
}

/** Full shareable URL (for copy / WhatsApp / native share) */
export function getProductAbsoluteUrl(product) {
  const path = getProductUrl(product);
  return `${getSiteOrigin().replace(/\/$/, '')}${path}`;
}
