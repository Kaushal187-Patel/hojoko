import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function FeaturedProducts({ products = [] }) {
  return (
    <section className="container-page py-16 md:py-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">New arrivals</p>
          <h2 className="section-title mt-3">
            Spring <span className="italic">Dressing</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            Fresh silhouettes, soft palettes, and wardrobe essentials selected for warmer days and easy styling.
          </p>
        </div>
        <Link href="/products" className="nav-link">
          View all
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-stone-500">Featured products will appear here once the catalog is live.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} priority={index < 4} isNew={index < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
