export const formatUserAddress = (address) => {
  if (!address) return '';

  const parts = [address.street, address.city, address.zipCode, address.state, address.country].filter(Boolean);
  return parts.join(', ');
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const formatReviewCount = (count) => {
  if (!count || count < 1) return '';
  if (count >= 1000) {
    const value = count / 1000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
  }
  return String(count);
};

export const getProductImage = (product) => {
  if (product?.images?.length) return product.images[0];
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
};

export const getProductImages = (product) => {
  const fallback = getProductImage(product);
  const images = (product?.images || []).map((image) => image?.trim()).filter(Boolean);
  return images.length ? images : [fallback];
};

export const getCategoryImage = (category) => {
  if (category?.image) return category.image;
  return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
};

export const getHeroSlideImage = (slide) => {
  if (slide?.image) return slide.image;
  return 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=2000&q=80';
};

export const getProductUrl = (product) => {
  const categorySlug = product?.category?.slug;
  const productSlug = product?.slug;

  if (categorySlug && productSlug) {
    return `/categories/${categorySlug}/${productSlug}`;
  }

  if (product?._id) {
    return `/products/${product._id}`;
  }

  return '/products';
};

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
