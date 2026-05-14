'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductListing from '@/components/ProductListing';
import { categoryService } from '@/services';

function CategoryProductsContent() {
  const params = useParams();
  const slug = params.slug;
  const [category, setCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  useEffect(() => {
    let active = true;

    categoryService
      .getAll()
      .then(({ data }) => {
        if (active) {
          setCategory(data.categories.find((item) => item.slug === slug) || null);
        }
      })
      .catch(() => {
        if (active) {
          setCategory(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingCategory(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <section className="container-page py-10">
      <div className="mb-8">
        <Link href="/products" className="nav-link text-sm">
          All products
        </Link>
        {loadingCategory ? (
          <div className="mt-4 h-8 w-48 animate-pulse rounded bg-stone-200" />
        ) : (
          <>
            <p className="eyebrow mt-4">Category</p>
            <h1 className="section-title mt-2">{category?.name || 'Collection'}</h1>
            {category?.description && <p className="body-muted mt-3 max-w-2xl">{category.description}</p>}
          </>
        )}
      </div>

      <ProductListing categorySlug={slug} showCategoryFilter={false} />
    </section>
  );
}

export default function CategoryProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoryProductsContent />
    </Suspense>
  );
}
