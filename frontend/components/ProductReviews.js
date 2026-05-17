'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useClientAuth from '@/hooks/useClientAuth';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import StarRating from '@/components/StarRating';
import { reviewService } from '@/services';

function InteractiveStars({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            className={`text-2xl transition ${starValue <= value ? 'text-orange-500' : 'text-stone-300'} hover:scale-110`}
            onClick={() => onChange(starValue)}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function ProductReviews({ productId, onRatingUpdate }) {
  const router = useRouter();
  const pathname = usePathname();
  const { storeUser: user, isAuthenticated, ready } = useClientAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteReviewOpen, setDeleteReviewOpen] = useState(false);
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await reviewService.getByProduct(productId, { limit: 20 });
      setReviews(data.reviews);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const loadEligibility = useCallback(async () => {
    if (!user) {
      setEligibility(null);
      return;
    }

    try {
      const { data } = await reviewService.getEligibility(productId);
      setEligibility(data);
      if (data.existingReview) {
        setEditingId(data.existingReview._id);
        setRating(data.existingReview.rating);
        setComment(data.existingReview.comment);
      }
    } catch {
      setEligibility(null);
    }
  }, [productId, user]);

  useEffect(() => {
    loadReviews();
    loadEligibility();
  }, [loadReviews, loadEligibility]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      router.push(`${pathname}?auth=login`);
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write your feedback');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId && eligibility?.hasReviewed) {
        const { data } = await reviewService.update(editingId, { rating, comment });
        toast.success('Review updated');
        onRatingUpdate?.(data.productRating);
      } else {
        const { data } = await reviewService.create({ productId, rating, comment });
        toast.success('Thank you for your feedback');
        onRatingUpdate?.(data.productRating);
      }

      if (!eligibility?.hasReviewed) {
        setComment('');
        setRating(5);
      }

      await Promise.all([loadReviews(), loadEligibility()]);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteReview = async () => {
    if (!editingId) return;
    setDeleteReviewLoading(true);
    try {
      const { data } = await reviewService.remove(editingId);
      toast.success('Review removed');
      onRatingUpdate?.(data.productRating);
      setEditingId(null);
      setComment('');
      setRating(5);
      setDeleteReviewOpen(false);
      await Promise.all([loadReviews(), loadEligibility()]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete review');
    } finally {
      setDeleteReviewLoading(false);
    }
  };

  const showForm = isAuthenticated && eligibility && (eligibility.canReview || eligibility.hasReviewed);

  return (
    <section id="reviews" className="container-page border-t border-stone-200 py-12">
      <h2 className="section-heading">Customer reviews</h2>

      {showForm ? (
        <form onSubmit={handleSubmit} className="card mt-6 max-w-2xl space-y-4">
          <p className="text-sm text-stone-600">
            {eligibility.hasReviewed
              ? 'Update your review for this product.'
              : 'Share your experience — ratings update live from customer feedback.'}
          </p>
          <InteractiveStars value={rating} onChange={setRating} />
          <textarea
            className="input-field min-h-28"
            placeholder="Write your feedback..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
          />
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : eligibility.hasReviewed ? 'Update review' : 'Submit review'}
            </button>
            {eligibility.hasReviewed && editingId ? (
              <button type="button" className="btn-secondary text-red-600" onClick={() => setDeleteReviewOpen(true)}>
                Delete review
              </button>
            ) : null}
          </div>
        </form>
      ) : ready && isAuthenticated && eligibility && !eligibility.hasPurchased ? (
        <p className="body-muted mt-4">Purchase this product to leave a review.</p>
      ) : ready && !isAuthenticated ? (
        <p className="body-muted mt-4">Sign in after purchase to share your feedback.</p>
      ) : null}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="body-muted">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="body-muted">No customer reviews yet. Be the first to share feedback.</p>
        ) : (
          reviews.map((review) => (
            <article key={review._id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-ink">{review.user?.name || 'Customer'}</p>
                <p className="text-xs text-stone-500">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-2">
                <StarRating rating={review.rating} />
              </div>
              <p className="body-copy mt-3">{review.comment}</p>
            </article>
          ))
        )}
      </div>

      <ConfirmDialog
        open={deleteReviewOpen}
        title="Delete your review?"
        description="Your feedback will be removed and the product rating will be recalculated. This cannot be undone."
        onCancel={() => !deleteReviewLoading && setDeleteReviewOpen(false)}
        onConfirm={confirmDeleteReview}
        loading={deleteReviewLoading}
      />
    </section>
  );
}
