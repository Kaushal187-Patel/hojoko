import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import PageSection from '@/components/ui/PageSection';
import ProductGrid from '@/components/ui/ProductGrid';
import SectionHeader from '@/components/ui/SectionHeader';

export default function FeaturedProducts({ products = [] }) {
  return (
    <PageSection>
      <SectionHeader
        eyebrow="New arrivals"
        title="Featured products"
        description="Fresh silhouettes, soft palettes, and wardrobe essentials selected for warmer days and easy styling."
        action={
          <Link href="/products" className="nav-link">
            View all
          </Link>
        }
      />

      {products.length === 0 ? (
        <p className="body-muted">Featured products will appear here once the catalog is live.</p>
      ) : (
        <ProductGrid>
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} priority={index < 4} isNew={index < 4} />
          ))}
        </ProductGrid>
      )}
    </PageSection>
  );
}
