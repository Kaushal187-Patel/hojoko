'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { getProductAbsoluteUrl } from '@/utils/productUrl';
import { cn } from '@/utils/cn';

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'absolute';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

export default function ShareProductButton({ product, className, compact = false }) {
  const [sharing, setSharing] = useState(false);

  const shareUrl = getProductAbsoluteUrl(product);
  const shareTitle = product?.name || 'HOZOKO product';
  const shareText = product?.shortDescription || shareTitle;

  const handleShare = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (!shareUrl || shareUrl.endsWith('/products')) {
      toast.error('Share link not available for this product');
      return;
    }

    setSharing(true);
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      await copyText(shareUrl);
      toast.success('Product link copied');
    } catch (error) {
      if (error?.name === 'AbortError') return;

      try {
        await copyText(shareUrl);
        toast.success('Product link copied');
      } catch {
        toast.error('Could not share this product');
      }
    } finally {
      setSharing(false);
    }
  };

  const handleCopyOnly = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    try {
      await copyText(shareUrl);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy link');
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        className={cn('product-card-btn product-card-btn-share', className)}
        onClick={handleShare}
        disabled={sharing}
        aria-label={`Share ${shareTitle}`}
      >
        <ShareIcon />
      </button>
    );
  }

  return (
    <div className={cn('product-share-actions', className)}>
      <button type="button" className="btn-secondary inline-flex items-center gap-2" onClick={handleShare} disabled={sharing}>
        <ShareIcon />
        <span>{sharing ? 'Sharing…' : 'Share'}</span>
      </button>
      <button type="button" className="btn-secondary product-share-copy" onClick={handleCopyOnly} aria-label="Copy link">
        Copy link
      </button>
    </div>
  );
}
