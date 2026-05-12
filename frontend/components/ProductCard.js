import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, getProductImage } from '@/utils/helpers';

export default function ProductCard({ product, priority = false, isNew = false }) {
  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {isNew && (
          <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
            New
          </span>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
          {product.category?.name || 'Collection'}
        </p>
        <h3 className="font-serif text-xl leading-tight text-ink">{product.name}</h3>
        <p className="text-sm text-stone-700">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  );
}
