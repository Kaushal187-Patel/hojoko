'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/ui/AdminLayout';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import { heroService } from '@/services';
import { getHeroSlideImage } from '@/utils/helpers';

const emptyDraft = () => ({
  image: '',
  alt: 'HOZOKO special offer',
});

export default function AdminHeroPage() {
  const [slides, setSlides] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [edits, setEdits] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [showDraft, setShowDraft] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await heroService.getAdmin();
      const list = data.slides || [];
      setSlides(list);
      setEdits(
        list.reduce((accumulator, slide) => {
          accumulator[slide._id] = {
            image: slide.image || '',
            alt: slide.alt || 'HOZOKO special offer',
          };
          return accumulator;
        }, {})
      );
    } catch (error) {
      toast.error(error.message || 'Could not load hero slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (file, onSuccess) => {
    const { data } = await heroService.uploadImage(file);
    onSuccess(data.image);
  };

  const handleDraftUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId('draft');
    try {
      await handleUpload(file, (image) => {
        setDraft((current) => ({ ...current, image }));
        setShowDraft(true);
      });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploadingId(null);
      event.target.value = '';
    }
  };

  const handleEditUpload = async (id, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    try {
      await handleUpload(file, (image) => {
        setEdits((current) => ({
          ...current,
          [id]: { ...current[id], image },
        }));
      });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploadingId(null);
      event.target.value = '';
    }
  };

  const handleCreate = async () => {
    if (!draft.image) {
      toast.error('Upload an image first');
      return;
    }

    setSavingId('draft');
    try {
      await heroService.create(draft);
      toast.success('Slide added to homepage');
      setDraft(emptyDraft());
      setShowDraft(false);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Could not add slide');
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdate = async (id) => {
    const edit = edits[id];

    if (!edit?.image) {
      toast.error('Upload an image first');
      return;
    }

    setSavingId(id);
    try {
      await heroService.update(id, edit);
      toast.success('Slide updated');
      loadData();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSavingId(null);
    }
  };

  const confirmDeleteSlide = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const { data } = await heroService.remove(deleteTarget.id);
      setSlides(data.slides || []);
      toast.success('Slide removed');
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Remove failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReorder = async (id, direction) => {
    try {
      const { data } = await heroService.reorder(id, direction);
      setSlides(data.slides || []);
    } catch (error) {
      toast.error(error.message || 'Could not reorder slide');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout
        title="Homepage hero"
        description="Add as many full-width carousel images as you need. Upload an image, then save each slide."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setShowDraft(true);
              setDraft(emptyDraft());
            }}
          >
            Add new slide
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-8 space-y-6">
            {showDraft && (
              <article className="card space-y-4 border-dashed border-stone-300">
                <p className="font-semibold text-ink">New slide</p>

                <div className="admin-hero-preview">
                  {draft.image ? (
                    <Image src={draft.image} alt={draft.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  ) : (
                    <p className="text-sm text-stone-500">Upload an image for this slide</p>
                  )}
                </div>

                <input
                  className="input-field"
                  placeholder="Alt text (optional)"
                  value={draft.alt}
                  onChange={(event) => setDraft((current) => ({ ...current, alt: event.target.value }))}
                />

                <div className="flex flex-wrap gap-2">
                  <label className="btn-secondary cursor-pointer">
                    {uploadingId === 'draft' ? 'Uploading...' : draft.image ? 'Replace image' : 'Upload image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleDraftUpload} disabled={uploadingId === 'draft'} />
                  </label>
                  <button type="button" className="btn-primary" onClick={handleCreate} disabled={savingId === 'draft' || !draft.image}>
                    {savingId === 'draft' ? 'Saving...' : 'Save slide'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowDraft(false);
                      setDraft(emptyDraft());
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </article>
            )}

            {slides.length === 0 && !showDraft ? (
              <p className="text-sm text-stone-500">No hero slides yet. Click &quot;Add new slide&quot; to upload your first image.</p>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {slides.map((slide, index) => {
                const edit = edits[slide._id] || { image: slide.image, alt: slide.alt };

                return (
                  <article key={slide._id} className="card space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            className="category-rank-btn"
                            onClick={() => handleReorder(slide._id, 'up')}
                            disabled={index === 0}
                            aria-label="Move slide up"
                          >
                            ↑
                          </button>
                          <span className="category-rank-label">{index + 1}</span>
                          <button
                            type="button"
                            className="category-rank-btn"
                            onClick={() => handleReorder(slide._id, 'down')}
                            disabled={index === slides.length - 1}
                            aria-label="Move slide down"
                          >
                            ↓
                          </button>
                        </div>
                        <p className="font-semibold text-ink">Slide {index + 1}</p>
                      </div>
                      <span className="text-xs text-stone-500">Live</span>
                    </div>

                    <div className="admin-hero-preview">
                      <Image src={getHeroSlideImage({ image: edit.image })} alt={edit.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>

                    <input
                      className="input-field"
                      placeholder="Alt text (optional)"
                      value={edit.alt}
                      onChange={(event) =>
                        setEdits((current) => ({
                          ...current,
                          [slide._id]: { ...current[slide._id], alt: event.target.value },
                        }))
                      }
                    />

                    <div className="flex flex-wrap gap-2">
                      <label className="btn-secondary cursor-pointer">
                        {uploadingId === slide._id ? 'Uploading...' : 'Replace image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleEditUpload(slide._id, event)}
                          disabled={uploadingId === slide._id}
                        />
                      </label>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleUpdate(slide._id)}
                        disabled={savingId === slide._id || !edit.image}
                      >
                        {savingId === slide._id ? 'Saving...' : 'Update slide'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-red-600"
                        onClick={() => setDeleteTarget({ id: slide._id })}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </AdminLayout>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this slide?"
        description="This image will disappear from the homepage carousel. You can add a new slide later."
        confirmLabel="Remove"
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={confirmDeleteSlide}
        loading={deleteLoading}
      />
    </ProtectedRoute>
  );
}
