'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { categoryService, productService } from '@/services';
import { formatCurrency } from '@/utils/helpers';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  stock: '',
  brand: '',
  category: '',
  images: [''],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

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

      setForm(emptyProduct);
      setEditingId(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Save failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      brand: product.brand || '',
      category: product.category?._id || product.category,
      images: product.images?.length ? product.images : [''],
    });
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
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div>
          <h1 className="text-3xl font-bold">Manage products</h1>

          <form onSubmit={handleSubmit} className="card mt-8 grid gap-4 md:grid-cols-2">
            <input className="input-field md:col-span-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="input-field md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input className="input-field" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="input-field" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <input className="input-field" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input className="input-field md:col-span-2" placeholder="Image URL" value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
            <button type="submit" className="btn-primary md:col-span-2">
              {editingId ? 'Update product' : 'Add product'}
            </button>
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-8 space-y-3">
              {products.map((product) => (
                <div key={product._id} className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatCurrency(product.price)} • {product.stock} in stock
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn-secondary" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button type="button" className="btn-secondary text-red-600" onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
