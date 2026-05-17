const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getFeaturedProducts(limit = 8) {
  try {
    const response = await fetch(`${API_URL}/products?limit=${limit}&sort=-createdAt`, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export async function getHeroSlides() {
  try {
    const response = await fetch(`${API_URL}/hero`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.slides || [];
  } catch {
    return [];
  }
}

export async function getProductBySlug(categorySlug, productSlug) {
  try {
    const response = await fetch(
      `${API_URL}/products/by-slug/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.product || null;
  } catch {
    return null;
  }
}

export async function getLimitedEditionProducts(limit = 4) {
  try {
    const response = await fetch(`${API_URL}/products?limitedEdition=true&limit=${limit}&sort=limited`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.categories || [];
  } catch {
    return [];
  }
}
