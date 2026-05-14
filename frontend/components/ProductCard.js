'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import StarRating from '@/components/StarRating';
import { addToCart, openCartDrawer } from '@/redux/slices/cartSlice';
import { selectIsWishlisted, toggleWishlistItem } from '@/redux/slices/wishlistSlice';
import { formatCurrency, formatReviewCount, getProductImage, getProductUrl } from '@/utils/helpers';

export default function ProductCard({
  product,
  priority = false,
  isNew = false,
  admin = false,
  index = 0,
  onEdit,
  onDelete,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlisted = useSelector(selectIsWishlisted(product._id));
  const [heartPop, setHeartPop] = useState(false);
  const [adding, setAdding] = useState(false);

  const brand = product.brand || product.category?.name || 'Brand';
  const rating = product.rating || 0;
  const reviewLabel = formatReviewCount(product.numReviews);
  const showMrp = product.comparePrice && product.comparePrice > product.price;

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(toggleWishlistItem(product));
    setHeartPop(true);
    window.setTimeout(() => setHeartPop(false), 400);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      router.push(`${pathname}?auth=login`);
      return;
    }

    if (product.stock < 1) {
      toast.error('Out of stock');
      return;
    }

    setAdding(true);
    try {
      const result = await dispatch(addToCart({ productId: product._id, quantity: 1 }));
      if (addToCart.fulfilled.match(result)) {
        dispatch(openCartDrawer());
      } else {
        toast.error(result.payload || 'Could not add to cart');
      }
    } finally {
      setAdding(false);
    }
  };

  const cardBody = (
    <article className="product-card">
      <div className="product-card-image">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
        />
        {isNew && <span className="badge-new">New</span>}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">
          <span className="uppercase">{brand}</span> {product.name}
        </h3>

        {product.shortDescription ? (
          <p className="product-card-description">{product.shortDescription}</p>
        ) : null}

        {rating > 0 || reviewLabel ? (
          <StarRating rating={rating} reviewCount={reviewLabel} />
        ) : null}

        <div className="product-card-pricing">
          <p className="product-card-price">{formatCurrency(product.price)}</p>
          {showMrp ? (
            <p className="product-card-mrp">
              MRP <span className="line-through">{formatCurrency(product.comparePrice)}</span>
            </p>
          ) : null}
        </div>

        {admin ? (
          <div className="product-card-actions">
            <button type="button" className="product-card-btn product-card-btn-cart" onClick={onEdit}>
              Edit
            </button>
            <button
              type="button"
              className="product-card-btn product-card-btn-wishlist text-red-600"
              onClick={onDelete}
              aria-label="Delete product"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m1 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="product-card-actions">
            <button
              type="button"
              className={`product-card-btn product-card-btn-wishlist${wishlisted ? ' is-active' : ''}${heartPop ? ' is-popping' : ''}`}
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wishlisted}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[14px] w-[14px] md:h-4 md:w-4"
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={wishlisted ? '0' : '1.75'}
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <button
              type="button"
              className="product-card-btn product-card-btn-cart"
              onClick={handleAddToCart}
              disabled={adding || product.stock < 1}
            >
              {product.stock < 1 ? 'Out of stock' : adding ? 'Adding…' : 'Quick buy'}
            </button>
          </div>
        )}
      </div>
    </article>
  );

  const wrapStyle = { animationDelay: `${index * 70}ms` };

  if (admin) {
    return (
      <div className="product-card-wrap group" style={wrapStyle}>
        {cardBody}
      </div>
    );
  }

  return (
    <Link href={getProductUrl(product)} className="product-card-wrap group" style={wrapStyle}>
      {cardBody}
    </Link>
  );
}
