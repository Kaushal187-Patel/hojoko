'use client';

import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductListing from '@/components/ProductListing';

function ProductsContent() {
  return (
    <section id="shop-grid" className="container-page py-10">
      <div className="mb-8">
        <p className="eyebrow">Shop</p>
        <h1 className="section-title mt-2">All products</h1>
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
