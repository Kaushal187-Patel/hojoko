'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ui/ProductGrid';
import { selectWishlistItems } from '@/redux/slices/wishlistSlice';

export default function WishlistPage() {
  const items = useSelector(selectWishlistItems);

  return (
    <section className="page-shell">
      <h1 className="page-title">Wishlist</h1>
      <p className="body-copy mt-2">Products you saved for later.</p>

      {items.length === 0 ? (
        <div className="mt-10 space-y-4">
          <p className="body-muted">Your wishlist is empty.</p>
          <Link href="/products" className="footer-link inline-block">
            Browse products
          </Link>
        </div>
      ) : (
        <ProductGrid className="mt-10">
          {items.map((product, index) => (
            <ProductCard key={product._id} product={product} priority={index < 4} index={index} />
          ))}
        </ProductGrid>
      )}
    </section>
  );
}
