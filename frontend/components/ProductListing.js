'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ui/ProductGrid';
import { categoryService, productService } from '@/services';

export default function ProductListing({ categorySlug = '', showCategoryFilter = true }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getAll({
          category: selectedCategory || undefined,
          limit: 100,
          sort: 'rank',
        });
        if (active) {
          setProducts(data.products);
        }
      } catch {
        if (active) {
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {showCategoryFilter && categories.length > 0 ? (
        <div className="max-w-sm">
          <label className="field-label" htmlFor="product-category-filter">
            Category
          </label>
          <select
            id="product-category-filter"
            className="input-field mt-2"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <p className="body-muted">No products found.</p>
      ) : (
        <ProductGrid>
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} priority={index < 4} index={index} />
          ))}
        </ProductGrid>
      )}
    </div>
  );
}
