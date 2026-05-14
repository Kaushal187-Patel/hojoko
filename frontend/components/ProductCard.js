import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, getProductImage, getProductUrl } from '@/utils/helpers';

export default function ProductCard({ product, priority = false, isNew = false }) {
  return (
    <Link href={getProductUrl(product)} className="group block">
      <div className="image-portrait">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="image-cover-zoom"
        />
        {isNew && <span className="badge-new">New</span>}
      </div>
      <div className="mt-4 space-y-2">
        <p className="meta-label">{product.category?.name || 'Collection'}</p>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">{formatCurrency(product.price)}</p>
        <p className="text-xs text-stone-500">{product.stock} available</p>
      </div>
    </Link>
  );
}
