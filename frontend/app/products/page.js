'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ui/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productService } from '@/services';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getAll({
          category: category || undefined,
          limit: 100,
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
  }, [category]);

  return (
    <section id="shop-grid" className="container-page py-10">
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
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsContent />
    </Suspense>
  );
}
