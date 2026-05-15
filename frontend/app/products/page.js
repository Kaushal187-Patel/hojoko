'use client';

import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageBackButton from '@/components/PageBackButton';
import ProductListing from '@/components/ProductListing';

function ProductsContent() {
  return (
    <section id="shop-grid" className="container-page pb-10 pt-2">
      <div className="page-header-row">
        <PageBackButton />
        <div>
          <p className="eyebrow">Shop</p>
          <h1 className="section-title mt-2">All products</h1>
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
