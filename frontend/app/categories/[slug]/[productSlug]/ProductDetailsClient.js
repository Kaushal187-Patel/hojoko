'use client';

import { useState } from 'react';
import ProductDetails from '@/components/ProductDetails';

export default function ProductDetailsClient({ product: initialProduct }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <ProductDetails product={initialProduct} quantity={quantity} onQuantityChange={setQuantity} />
  );
}
