'use client';

import { useState } from 'react';
import ProductDetails from '@/components/ProductDetails';
import RecentlyViewedTracker from '@/components/product/RecentlyViewedTracker';

export default function ProductDetailsClient({ product: initialProduct }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <RecentlyViewedTracker product={initialProduct} />
      <ProductDetails product={initialProduct} quantity={quantity} onQuantityChange={setQuantity} />
    </>
  );
}
