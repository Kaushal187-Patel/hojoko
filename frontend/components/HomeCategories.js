import Image from 'next/image';
import Link from 'next/link';
import PageSection from '@/components/ui/PageSection';
import { getCategoryImage } from '@/utils/helpers';

export default function HomeCategories({ categories = [] }) {
  if (categories.length === 0) {
    return (
      <PageSection>
        <p className="eyebrow">Shop by category</p>
        <h2 className="section-title mt-3">Browse collections</h2>
        <p className="body-muted mt-4">Categories will appear here once they are added in the admin panel.</p>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <p className="eyebrow">Shop by category</p>
      <h2 className="section-title mt-3">Browse collections</h2>

      <div className="category-grid">
        {categories.map((category) => (
          <Link key={category._id} href={`/categories/${category.slug}`} className="group surface-tile">
            <div className="image-square">
              <Image
                src={getCategoryImage(category)}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 25vw, 25vw"
                className="image-cover-zoom"
              />
            </div>
            <div className="px-4 py-4 text-center">
              <span className="font-serif text-lg text-ink transition group-hover:text-stone-700">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </PageSection>
  );
}
