'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ui/ProductGrid';
import { productService } from '@/services';

export default function ProductListing({ categorySlug = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getAll({
          category: categorySlug || undefined,
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
  }, [categorySlug]);

  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return <p className="body-muted">No products found.</p>;
  }

  return (
    <ProductGrid>
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} priority={index < 4} />
      ))}
    </ProductGrid>
  );
}
