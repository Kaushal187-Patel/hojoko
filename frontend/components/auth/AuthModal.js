'use client';

import { useCallback, useEffect } from 'react';
import { cn } from '@/utils/cn';

export default function AuthModal({ children, onClose }) {
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleClose]);

  return (
    <div
      className={cn(
        'auth-modal-backdrop',
        'fixed inset-0 z-[100] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm'
      )}
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className={cn(
          'auth-modal-panel',
          'relative max-h-[90vh] w-full max-w-md overflow-y-auto border border-stone-200 bg-white p-6 shadow-soft'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close absolute right-4 top-4 text-lg leading-none text-stone-500 transition hover:text-ink"
          onClick={handleClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
}
