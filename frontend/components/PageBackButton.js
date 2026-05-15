'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

export default function PageBackButton({ className, label = 'Back' }) {
  const router = useRouter();

  return (
    <button type="button" className={cn('page-back-btn', className)} onClick={() => router.back()} aria-label={label}>
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
}
