'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categoryService } from '@/services';
import { getCategoryImage } from '@/utils/helpers';
import PageBackButton from '@/components/PageBackButton';
import { cn } from '@/utils/cn';

function CategoryTile({ category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="group categories-browse-tile">
      <div className="categories-browse-tile-image">
        <Image src={getCategoryImage(category)} alt={category.name} fill sizes="120px" className="object-cover" />
      </div>
      <span className="footer-link">{category.name}</span>
    </Link>
  );
}

export default function CategoriesBrowse() {
  const [categories, setCategories] = useState([]);
  const [activeId, setActiveId] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const activeCategory = categories.find((category) => category._id === activeId);

  return (
    <div className="categories-browse">
      <div className="categories-browse-header">
        <PageBackButton />
        <h1 className="categories-browse-title">Categories</h1>
      </div>

      <div className="categories-browse-body">
        <aside className="categories-browse-sidebar">
          <button
            type="button"
            className={cn('categories-browse-tab', activeId === 'all' && 'is-active')}
            onClick={() => setActiveId('all')}
          >
            <span className="categories-browse-tab-icon categories-browse-tab-icon-all">All</span>
            <span className="categories-browse-tab-label">All categories</span>
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              className={cn('categories-browse-tab', activeId === category._id && 'is-active')}
              onClick={() => setActiveId(category._id)}
            >
              <span className="categories-browse-tab-icon">
                <Image src={getCategoryImage(category)} alt={category.name} width={40} height={40} className="h-full w-full object-cover" />
              </span>
              <span className="categories-browse-tab-label">{category.name}</span>
            </button>
          ))}
        </aside>

        <div className="categories-browse-panel">
          {loading ? (
            <p className="body-muted">Loading categories...</p>
          ) : activeId === 'all' ? (
            <>
              <h2 className="categories-browse-panel-title">All categories</h2>
              <div className="categories-browse-featured">
                <Link href="/products" className="categories-browse-feature-card">
                  Product of the month
                </Link>
                <Link href="/products" className="categories-browse-feature-card">
                  Sport of the month
                </Link>
              </div>
              <h3 className="categories-browse-section-title">Shop by category</h3>
              <div className="categories-browse-grid">
                {categories.map((category) => (
                  <CategoryTile key={category._id} category={category} />
                ))}
              </div>
            </>
          ) : activeCategory ? (
            <>
              <h2 className="categories-browse-panel-title">{activeCategory.name}</h2>
              {activeCategory.description ? <p className="body-copy mt-2">{activeCategory.description}</p> : null}
              <Link href={`/categories/${activeCategory.slug}`} className="btn-primary mt-6 inline-flex">
                Shop {activeCategory.name}
              </Link>
              <h3 className="categories-browse-section-title mt-8">More categories</h3>
              <div className="categories-browse-grid">
                {categories
                  .filter((category) => category._id !== activeCategory._id)
                  .map((category) => (
                    <CategoryTile key={category._id} category={category} />
                  ))}
              </div>
            </>
          ) : (
            <p className="body-muted">No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
