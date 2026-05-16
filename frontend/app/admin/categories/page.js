'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/ui/AdminLayout';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { categoryService } from '@/services';
import { getCategoryImage } from '@/utils/helpers';

const emptyCategory = {
  name: '',
  description: '',
  image: '',
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await categoryService.getAll();
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(emptyCategory);
    setEditingId(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await categoryService.uploadImage(file);
      setForm((current) => ({ ...current, image: data.image }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.image) {
      toast.error('Upload a category image');
      return;
    }

    try {
      if (editingId) {
        await categoryService.update(editingId, form);
        toast.success('Category updated');
      } else {
        await categoryService.create(form);
        toast.success('Category created');
      }

      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.message || 'Save failed');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorder = async (id, direction) => {
    try {
      const { data } = await categoryService.reorder(id, direction);
      setCategories(data.categories || []);
    } catch (error) {
      toast.error(error.message || 'Could not reorder category');
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await categoryService.remove(deleteTarget.id);
      toast.success('Category deleted');
      if (editingId === deleteTarget.id) {
        resetForm();
      }
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout title="Manage categories" description="Create categories with an uploaded image and show them on the home page.">

<form onSubmit={handleSubmit} className="card mt-8 grid gap-4 md:grid-cols-2">
            <input
              className="input-field md:col-span-2"
              placeholder="Category name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
            <textarea
              className="input-field md:col-span-2"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />

            <div className="space-y-3 md:col-span-2">
              <p className="text-sm font-medium text-slate-700">Category image</p>
              {form.image ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                  <Image src={form.image} alt="Category preview" fill className="object-cover" sizes="160px" />
                </div>
              ) : (
                <p className="text-sm text-stone-500">No image uploaded yet.</p>
              )}
              <div className="flex flex-wrap gap-3">
                <label className="btn-secondary cursor-pointer">
                  {uploading ? 'Uploading...' : form.image ? 'Replace image' : 'Upload image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {form.image && (
                  <button type="button" className="btn-secondary" onClick={() => setForm({ ...form, image: '' })}>
                    Remove image
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className="btn-primary" disabled={uploading}>
                {editingId ? 'Update category' : 'Add category'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-8 space-y-3">
              <p className="text-sm text-stone-500">Use the arrows to set category order in the header and home page.</p>
              {categories.map((category, index) => (
                <div key={category._id} className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        className="category-rank-btn"
                        onClick={() => handleReorder(category._id, 'up')}
                        disabled={index === 0}
                        aria-label={`Move ${category.name} up`}
                      >
                        ↑
                      </button>
                      <span className="category-rank-label">{index + 1}</span>
                      <button
                        type="button"
                        className="category-rank-btn"
                        onClick={() => handleReorder(category._id, 'down')}
                        disabled={index === categories.length - 1}
                        aria-label={`Move ${category.name} down`}
                      >
                        ↓
                      </button>
                    </div>
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-stone-100">
                      <Image src={getCategoryImage(category)} alt={category.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-sm text-slate-500">{category.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn-secondary" onClick={() => handleEdit(category)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-red-600"
                      onClick={() => setDeleteTarget({ id: category._id, name: category.name })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </AdminLayout>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” and its catalog association will be removed. This cannot be undone.`
            : ''
        }
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={confirmDeleteCategory}
        loading={deleteLoading}
      />
    </ProtectedRoute>
  );
}
