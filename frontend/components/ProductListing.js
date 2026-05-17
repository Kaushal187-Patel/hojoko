'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ui/ProductGrid';
import { categoryService, productService } from '@/services';

export default function ProductListing({ categorySlug = '', showCategoryFilter = true }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.trim() || '';
  const limitedEditionOnly = searchParams.get('limitedEdition') === 'true';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

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
          search: searchQuery || undefined,
          limitedEdition: limitedEditionOnly ? 'true' : undefined,
          limit: 100,
          sort: limitedEditionOnly ? 'limited' : searchQuery ? 'name' : 'rank',
        });
        if (active) {
          setProducts(data.products || []);
          setTotal(data.total ?? data.products?.length ?? 0);
        }
      } catch {
        if (active) {
          setProducts([]);
          setTotal(0);
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
  }, [selectedCategory, searchQuery, limitedEditionOnly]);

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    const query = params.toString();
    router.push(query ? `/products?${query}` : '/products');
  };

  return (
    <div className="space-y-6">
      {limitedEditionOnly ? (
        <div className="rounded-xl border border-ink/15 bg-stone-900 px-4 py-3 text-sm text-stone-200">
          <span className="font-medium text-white">Limited Edition drop</span> — numbered runs with live scarcity meters.
        </div>
      ) : null}

      {searchQuery ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
          <p className="text-sm text-stone-700">
            Showing results for <span className="font-semibold text-ink">&quot;{searchQuery}&quot;</span>
            {!loading && <span className="text-stone-500"> ({total} found)</span>}
          </p>
          <button type="button" className="btn-secondary text-sm" onClick={clearSearch}>
            Clear search
          </button>
        </div>
      ) : null}

      {showCategoryFilter && categories.length > 0 ? (
        <div className="max-w-sm">
          <label className="field-label" htmlFor="product-category-filter">
            Category
          </label>
          <select
            id="product-category-filter"
            className="input-field mt-2"
            value={selectedCategory}
            onChange={(event) => {
              const slug = event.target.value;
              setSelectedCategory(slug);
              const params = new URLSearchParams();
              if (searchQuery) params.set('search', searchQuery);
              if (slug) params.set('category', slug);
              const query = params.toString();
              router.push(query ? `/products?${query}` : '/products');
            }}
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
        <div className="card space-y-3">
          <p className="body-muted">
            {searchQuery
              ? `No products match "${searchQuery}". Try another keyword or browse all products.`
              : 'No products found.'}
          </p>
          {searchQuery ? (
            <button type="button" className="btn-primary inline-flex" onClick={clearSearch}>
              View all products
            </button>
          ) : (
            <Link href="/products" className="btn-primary inline-flex">
              Browse shop
            </Link>
          )}
        </div>
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
