'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import PageSection from '@/components/ui/PageSection';
import ProductGrid from '@/components/ui/ProductGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { getRecentlyViewed, RECENTLY_VIEWED_EVENT } from '@/utils/recentlyViewed';

export default function HomeRecentlyViewed() {
  const [products, setProducts] = useState([]);

  const refresh = useCallback(() => {
    setProducts(getRecentlyViewed());
  }, []);

  useEffect(() => {
    refresh();

    const onUpdate = () => refresh();
    window.addEventListener(RECENTLY_VIEWED_EVENT, onUpdate);
    window.addEventListener('storage', onUpdate);

    return () => {
      window.removeEventListener(RECENTLY_VIEWED_EVENT, onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [refresh]);

  if (products.length === 0) {
    return null;
  }

  return (
    <PageSection>
      <SectionHeader
        eyebrow="Continue browsing"
        title="Recently viewed"
        description="Products you opened recently — picked up right where you left off."
        action={
          <Link href="/products" className="nav-link">
            Shop all
          </Link>
        }
      />

      <ProductGrid className="mt-10">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </ProductGrid>
    </PageSection>
  );
}
