'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { categoryService, productService } from '@/services';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data.categories));
  }, []);

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

  return (
    <div>
      <section className="border-b border-stone-200 bg-white">
        <div className="container-page py-12 md:py-16">
          <p className="eyebrow">Shop</p>
          <h1 className="section-title mt-3">
            All <span className="italic">Products</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            Browse the full catalog with search and category filters.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_220px]">
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
          <p className="text-sm text-stone-500">No products found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
