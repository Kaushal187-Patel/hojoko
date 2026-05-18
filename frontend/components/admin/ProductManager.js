'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/ui/AdminLayout';
import SellerLayout from '@/components/ui/SellerLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { categoryService, productService } from '@/services';
import { getProductImage } from '@/utils/helpers';
import { getLimitedEditionStats, toDatetimeLocalValue } from '@/utils/limitedEdition';

import ConfirmDialog from '@/components/ui/ConfirmDialog';

const emptyProduct = {
  name: '',
  shortDescription: '',
  description: '',
  price: '',
  comparePrice: '',
  stock: '',
  brand: '',
  category: '',
  images: [''],
  isLimitedEdition: false,
  limitedEditionRun: '',
  limitedEditionEndsAt: '',
  limitedEditionStory: '',
};

const toFormField = (value) => (value == null || value === '' ? '' : String(value));

const productToForm = (product) => ({
  name: product.name ?? '',
  shortDescription: product.shortDescription ?? '',
  description: product.description ?? '',
  price: toFormField(product.price),
  comparePrice: toFormField(product.comparePrice),
  stock: toFormField(product.stock),
  brand: product.brand ?? '',
  category: product.category?._id || product.category || '',
  images: product.images?.length ? [...product.images] : [''],
  isLimitedEdition: Boolean(product.isLimitedEdition),
  limitedEditionRun: toFormField(product.limitedEditionRun),
  limitedEditionEndsAt: toDatetimeLocalValue(product.limitedEditionEndsAt),
  limitedEditionStory: product.limitedEditionStory ?? '',
});

const createEmptyForm = () => ({ ...emptyProduct, images: [''] });

export default function ProductManager({ variant = 'main' }) {
  const showSellerColumn = variant === 'main';
  const Layout = variant === 'seller' ? SellerLayout : AdminLayout;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async (categorySlug = filterCategory) => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAdminList({ category: categorySlug || undefined }),
        categoryService.getAll(),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filterCategory);
  }, [filterCategory]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      isLimitedEdition: Boolean(form.isLimitedEdition),
      limitedEditionRun: form.isLimitedEdition ? Number(form.limitedEditionRun) : undefined,
      limitedEditionEndsAt:
        form.isLimitedEdition && form.limitedEditionEndsAt
          ? new Date(form.limitedEditionEndsAt).toISOString()
          : undefined,
      limitedEditionStory: form.isLimitedEdition ? form.limitedEditionStory : '',
    };

    try {
      if (editingId) {
        await productService.update(editingId, payload);
        toast.success('Product updated');
      } else {
        await productService.create(payload);
        toast.success('Product created');
      }

      setForm(createEmptyForm());
      setEditingId(null);
      loadData(filterCategory);
    } catch (error) {
      toast.error(error.message || 'Save failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm(productToForm(product));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const { data } = await productService.uploadImage(file);
      const nextImages = [...form.images];
      nextImages[index] = data.image;
      setForm({ ...form, images: nextImages });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploadingIndex(null);
      event.target.value = '';
    }
  };

  const handleReorder = async (id, direction) => {
    try {
      const { data } = await productService.reorder(id, direction);
      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.message || 'Could not reorder product');
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await productService.remove(deleteTarget.id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      loadData(filterCategory);
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Layout title="Manage products">

<form id="product-form" onSubmit={handleSubmit} className="card mt-8 grid gap-4 md:grid-cols-2">
            <input className="input-field md:col-span-2" placeholder="Name" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label className="field-label md:col-span-2">Short description (tag)</label>
            <textarea
              className="input-field min-h-24 md:col-span-2"
              placeholder="Short tag shown outside the product on cards and listings"
              value={form.shortDescription ?? ''}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            />
            <label className="field-label md:col-span-2">Full description</label>
            <textarea
              className="input-field min-h-36 md:col-span-2"
              placeholder="Full description shown on the product page"
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input className="input-field" type="number" placeholder="Selling price" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="input-field" type="number" placeholder="MRP (compare price)" value={form.comparePrice ?? ''} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
            <input className="input-field" type="number" placeholder="Stock" value={form.stock ?? ''} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <input className="input-field" placeholder="Brand" value={form.brand ?? ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <select className="input-field" value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="admin-limited-edition-panel md:col-span-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-ink"
                  checked={Boolean(form.isLimitedEdition)}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      isLimitedEdition: event.target.checked,
                      limitedEditionRun: event.target.checked && !form.limitedEditionRun ? form.stock || '50' : form.limitedEditionRun,
                    })
                  }
                />
                <span>
                  <span className="block font-medium text-ink">Limited Edition drop</span>
                  <span className="mt-1 block text-sm text-stone-500">
                    Shows a numbered run, live scarcity meter, and optional countdown — different from a normal sale badge.
                  </span>
                </span>
              </label>

              {form.isLimitedEdition ? (
                <div className="mt-4 grid gap-4 border-t border-stone-200 pt-4 md:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="limited-edition-run">
                      Total pieces in this run
                    </label>
                    <input
                      id="limited-edition-run"
                      className="input-field mt-2"
                      type="number"
                      min="1"
                      placeholder="e.g. 50"
                      value={form.limitedEditionRun ?? ''}
                      onChange={(event) => setForm({ ...form, limitedEditionRun: event.target.value })}
                      required
                    />
                    <p className="mt-1 text-xs text-stone-500">Stock left = pieces still available from this run.</p>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="limited-edition-ends">
                      Drop ends (optional)
                    </label>
                    <input
                      id="limited-edition-ends"
                      className="input-field mt-2"
                      type="datetime-local"
                      value={form.limitedEditionEndsAt ?? ''}
                      onChange={(event) => setForm({ ...form, limitedEditionEndsAt: event.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="field-label" htmlFor="limited-edition-story">
                      Curator note (optional)
                    </label>
                    <textarea
                      id="limited-edition-story"
                      className="input-field mt-2 min-h-20"
                      maxLength={220}
                      placeholder="e.g. Woven in a single batch — each piece is finished by hand in our Ahmedabad studio."
                      value={form.limitedEditionStory ?? ''}
                      onChange={(event) => setForm({ ...form, limitedEditionStory: event.target.value })}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <p className="md:col-span-2 text-sm text-slate-500">
              Product rating and review count are calculated automatically from live customer feedback.
            </p>
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm font-medium text-slate-700">Product images</p>
              <p className="text-sm text-slate-500">Paste an image URL or upload a file for each slot.</p>
              {form.images.map((image, index) => (
                <div key={`image-${index}`} className="space-y-2 rounded-xl border border-stone-200 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    {image ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                        <Image src={image} alt={`Product image ${index + 1}`} fill className="object-cover" sizes="80px" />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 text-xs text-stone-400">
                        No image
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <input
                        className="input-field"
                        placeholder={`Image URL ${index + 1}`}
                        value={image ?? ''}
                        onChange={(event) => {
                          const nextImages = [...form.images];
                          nextImages[index] = event.target.value;
                          setForm({ ...form, images: nextImages });
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <label className="btn-secondary cursor-pointer">
                          {uploadingIndex === index ? 'Uploading...' : image ? 'Replace file' : 'Upload file'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => handleImageUpload(event, index)}
                            disabled={uploadingIndex !== null}
                          />
                        </label>
                        {image && (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              const nextImages = [...form.images];
                              nextImages[index] = '';
                              setForm({ ...form, images: nextImages });
                            }}
                          >
                            Clear
                          </button>
                        )}
                        {form.images.length > 1 && (
                          <button
                            type="button"
                            className="btn-secondary text-red-600"
                            onClick={() => setForm({ ...form, images: form.images.filter((_, itemIndex) => itemIndex !== index) })}
                          >
                            Remove slot
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setForm({ ...form, images: [...form.images, ''] })}
              >
                Add image slot
              </button>
            </div>
            <button type="submit" className="btn-primary md:col-span-2">
              {editingId ? 'Update product' : 'Add product'}
            </button>
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-8 space-y-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-sm">
                  <label className="field-label" htmlFor="admin-product-category-filter">
                    Filter by category
                  </label>
                  <select
                    id="admin-product-category-filter"
                    className="input-field mt-2"
                    value={filterCategory}
                    onChange={(event) => setFilterCategory(event.target.value)}
                  >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-stone-500">
                  {filterCategory
                    ? `${products.length} products — use arrows to set order in this category`
                    : `${products.length} products — select a category to reorder`}
                </p>
              </div>

              {products.map((product, index) => (
                <div key={product._id} className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        className="category-rank-btn"
                        onClick={() => handleReorder(product._id, 'up')}
                        disabled={!filterCategory || index === 0}
                        aria-label={`Move ${product.name} up`}
                      >
                        ↑
                      </button>
                      <span className="category-rank-label">{index + 1}</span>
                      <button
                        type="button"
                        className="category-rank-btn"
                        onClick={() => handleReorder(product._id, 'down')}
                        disabled={!filterCategory || index === products.length - 1}
                        aria-label={`Move ${product.name} down`}
                      >
                        ↓
                      </button>
                    </div>
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-stone-100">
                      <Image src={getProductImage(product)} alt={product.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {product.name}
                        {product.isLimitedEdition ? (
                          <span className="ml-2 inline-block rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                            Limited
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm text-slate-500">{product.category?.name || 'No category'}</p>
                      {showSellerColumn && product.seller ? (
                        <p className="text-xs text-stone-500">
                          Seller: {product.seller.name || product.seller.email}
                        </p>
                      ) : null}
                      <p className="text-sm text-slate-500">{product.shortDescription || product.description || 'No description'}</p>
                      {(() => {
                        const edition = getLimitedEditionStats(product);
                        return edition ? (
                          <p className="mt-1 text-xs font-medium text-stone-600">
                            Edition · {edition.remaining}/{edition.total} left
                          </p>
                        ) : null;
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn-secondary" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-red-600"
                      onClick={() => setDeleteTarget({ id: product._id, name: product.name })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </Layout>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        description={
          deleteTarget ? `This will permanently remove “${deleteTarget.name}”. This cannot be undone.` : ''
        }
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={confirmDeleteProduct}
        loading={deleteLoading}
      />
    </>
  );
}
