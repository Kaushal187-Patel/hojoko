'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProductCard from '@/components/ProductCard';
import AdminLayout from '@/components/ui/AdminLayout';
import ProductGrid from '@/components/ui/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { categoryService, productService } from '@/services';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  stock: '',
  brand: '',
  category: '',
  images: [''],
};

const toFormField = (value) => (value == null || value === '' ? '' : String(value));

const productToForm = (product) => ({
  name: product.name ?? '',
  description: product.description ?? '',
  price: toFormField(product.price),
  comparePrice: toFormField(product.comparePrice),
  stock: toFormField(product.stock),
  brand: product.brand ?? '',
  category: product.category?._id || product.category || '',
  images: product.images?.length ? [...product.images] : [''],
});

const createEmptyForm = () => ({ ...emptyProduct, images: [''] });

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll({ limit: 100 }),
        categoryService.getAll(),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
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
      loadData();
    } catch (error) {
      toast.error(error.message || 'Save failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm(productToForm(product));
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

  const handleDelete = async (id) => {
    try {
      await productService.remove(id);
      toast.success('Product deleted');
      loadData();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout title="Manage products">

<form onSubmit={handleSubmit} className="card mt-8 grid gap-4 md:grid-cols-2">
            <input className="input-field md:col-span-2" placeholder="Name" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="input-field md:col-span-2" placeholder="Description" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
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
            <div className="mt-8">
              <p className="mb-4 text-sm text-slate-500">{products.length} products — preview matches storefront layout</p>
              <ProductGrid>
                {products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    admin
                    index={index}
                    onEdit={() => handleEdit(product)}
                    onDelete={() => handleDelete(product._id)}
                  />
                ))}
              </ProductGrid>
            </div>
          )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
