import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import PageSection from '@/components/ui/PageSection';
import ProductGrid from '@/components/ui/ProductGrid';

export default function HomeLimitedEdition({ products = [] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="home-limited-edition">
      <PageSection className="!py-0">
        <div className="home-limited-edition-inner">
          <div className="home-limited-edition-copy">
            <p className="eyebrow text-stone-400">The Atelier Drop</p>
            <h2 className="section-title mt-3 text-white">Limited Edition</h2>
            <p className="body-copy mt-4 max-w-md text-stone-300">
              Small-batch pieces with a numbered run and live scarcity meter — not a generic sale tag, a
              collector&apos;s release that ends when the last piece is claimed.
            </p>
            <Link href="/products?limitedEdition=true" className="btn-secondary mt-6 border-white/30 text-white hover:border-white hover:bg-white/10">
              View the drop
            </Link>
          </div>

          <ProductGrid className="home-limited-edition-grid">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} priority={index < 2} index={index} />
            ))}
          </ProductGrid>
        </div>
      </PageSection>
    </section>
  );
}
