'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductImageGallery from '@/components/ProductImageGallery';
import { addToCart } from '@/redux/slices/cartSlice';
import { productService } from '@/services';
import { formatCurrency } from '@/utils/helpers';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getById(params.id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`${pathname}?auth=login`);
      return;
    }

    const result = await dispatch(addToCart({ productId: product._id, quantity }));

    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart');
      return;
    }

    toast.error(result.payload || 'Could not add to cart');
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <p className="page-shell body-muted">Product not found.</p>;

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
      <ProductImageGallery product={product} name={product.name} />

      <div className="space-y-6">
        <div>
          <p className="eyebrow">{product.category?.name || 'Collection'}</p>
          <h1 className="product-detail-title mt-3">{product.name}</h1>
          <p className="mt-4 text-2xl text-stone-700">{formatCurrency(product.price)}</p>
        </div>

        <p className="body-copy">{product.description}</p>

        <div className="flex items-center gap-4">
          <label className="field-label" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="input-field max-w-24"
          />
          <span className="body-muted">{product.stock} available</span>
        </div>

        <button type="button" className="btn-primary" onClick={handleAddToCart} disabled={product.stock < 1}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
