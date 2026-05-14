'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductDetails from '@/components/ProductDetails';
import { productService } from '@/services';

export default function CategoryProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getBySlug(params.slug, params.productSlug)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [params.slug, params.productSlug]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <p className="page-shell body-muted">Product not found.</p>;

  return <ProductDetails product={product} quantity={quantity} onQuantityChange={setQuantity} />;
}
