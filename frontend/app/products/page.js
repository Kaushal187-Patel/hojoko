'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ui/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { categoryService, productService } from '@/services';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getAll({
          search: search || undefined,
          category: category || undefined,
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

    const timeout = setTimeout(loadProducts, 250);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [search, category]);

  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <div>
      <section className="surface-band">
        <div className="surface-band-inner">
          <p className="eyebrow">Shop</p>
          <h1 className="section-title mt-3">
            {activeCategory ? (
              <>
                <span className="italic">{activeCategory.name}</span>
              </>
            ) : (
              <>
                All <span className="italic">Products</span>
              </>
            )}
          </h1>
          <p className="body-copy mt-4 max-w-2xl">
            {activeCategory
              ? `Browse products in ${activeCategory.name}.`
              : 'Browse the full catalog with search and category filters.'}
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="filter-bar">
          <input
            className="input-field"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select className="input-field" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item._id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <p className="body-muted">No products found.</p>
        ) : (
          <ProductGrid>
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} priority={index < 4} />
            ))}
          </ProductGrid>
        )}
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsContent />
    </Suspense>
  );
}
