'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductReviews from '@/components/ProductReviews';
import StarRating from '@/components/StarRating';
import { addToCart } from '@/redux/slices/cartSlice';
import { formatCurrency, formatReviewCount } from '@/utils/helpers';

export default function ProductDetails({ product: initialProduct, quantity, onQuantityChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(initialProduct);

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

  const handleRatingUpdate = ({ rating, numReviews }) => {
    setProduct((current) => ({ ...current, rating, numReviews }));
  };

  const reviewLabel = formatReviewCount(product.numReviews);
  const showMrp = product.comparePrice && product.comparePrice > product.price;

  return (
    <>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
        <ProductImageGallery product={product} name={product.name} />

        <div className="space-y-6">
          <div>
            <p className="product-card-brand">{product.brand || product.category?.name || 'Brand'}</p>
            <h1 className="product-detail-title mt-2">{product.name}</h1>

            {product.rating > 0 || reviewLabel ? (
              <div className="mt-3">
                <StarRating rating={product.rating || 0} reviewCount={reviewLabel} />
              </div>
            ) : (
              <p className="body-muted mt-3">No reviews yet</p>
            )}

            <div className="mt-4">
              <p className="text-2xl font-bold text-ink">{formatCurrency(product.price)}</p>
              {showMrp ? (
                <p className="mt-1 text-sm text-stone-500">
                  MRP <span className="line-through">{formatCurrency(product.comparePrice)}</span>
                </p>
              ) : null}
            </div>
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
              onChange={(event) => onQuantityChange(Number(event.target.value))}
              className="input-field max-w-24"
            />
            <span className="body-muted">{product.stock} available</span>
          </div>

          <button type="button" className="btn-primary" onClick={handleAddToCart} disabled={product.stock < 1}>
            Add to cart
          </button>
        </div>
      </div>

      <ProductReviews productId={product._id} onRatingUpdate={handleRatingUpdate} />
    </>
  );
}
