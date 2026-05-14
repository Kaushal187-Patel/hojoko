'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductListing from '@/components/ProductListing';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    if (categorySlug) {
      router.replace(`/categories/${categorySlug}`);
    }
  }, [categorySlug, router]);

  if (categorySlug) {
    return <LoadingSpinner />;
  }

  return (
    <section id="shop-grid" className="container-page py-10">
      <ProductListing />
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
