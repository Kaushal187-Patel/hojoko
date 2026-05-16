'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageBackButton from '@/components/PageBackButton';
import ProductListing from '@/components/ProductListing';

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.trim() || '';

  return (
    <section id="shop-grid" className="container-page pb-10 pt-2">
      <div className="page-header-row">
        <PageBackButton />
        <div>
          <p className="eyebrow">{searchQuery ? 'Search' : 'Shop'}</p>
          <h1 className="section-title mt-2">
            {searchQuery ? `Results for “${searchQuery}”` : 'All products'}
          </h1>
        </div>
      </div>
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
