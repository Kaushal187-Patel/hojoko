const STORAGE_KEY = 'hozoko_recently_viewed';
const MAX_ITEMS = 8;
export const RECENTLY_VIEWED_EVENT = 'hozoko:recently-viewed';

function readRaw() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(items) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_EVENT));
}

export function toRecentlyViewedEntry(product) {
  if (!product?._id) {
    return null;
  }

  const category =
    product.category && typeof product.category === 'object'
      ? {
          _id: product.category._id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : product.category;

  return {
    _id: String(product._id),
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    price: product.price,
    comparePrice: product.comparePrice,
    stock: product.stock,
    brand: product.brand,
    images: Array.isArray(product.images) ? product.images : [],
    category,
    rating: product.rating,
    numReviews: product.numReviews,
    isLimitedEdition: Boolean(product.isLimitedEdition),
    limitedEditionRun: product.limitedEditionRun,
    limitedEditionEndsAt: product.limitedEditionEndsAt,
    limitedEditionStory: product.limitedEditionStory,
    viewedAt: Date.now(),
  };
}

export function getRecentlyViewed() {
  return readRaw().sort((a, b) => (b.viewedAt || 0) - (a.viewedAt || 0));
}

export function addRecentlyViewed(product) {
  const entry = toRecentlyViewedEntry(product);
  if (!entry) {
    return;
  }

  const next = [entry, ...readRaw().filter((item) => item._id !== entry._id)];
  writeRaw(next);
}

export function clearRecentlyViewed() {
  writeRaw([]);
}
