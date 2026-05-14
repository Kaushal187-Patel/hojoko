import Link from 'next/link';
import { cn } from '@/utils/cn';

export default function Logo({ className = '', linked = true, variant = 'dark' }) {
  const content = (
    <span className={cn('logo-text', variant === 'light' && 'logo-text-light', className)}>HOZOKO</span>
  );

  if (!linked) {
    return content;
  }

  return (
    <Link href="/" className="inline-flex items-center" aria-label="HOZOKO home">
      {content}
    </Link>
  );
}
