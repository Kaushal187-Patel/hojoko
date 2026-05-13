import Link from 'next/link';
import { cn } from '@/utils/cn';

export default function Logo({ className = '', linked = true }) {
  const content = <span className={cn('logo-text', className)}>HOZOKO</span>;

  if (!linked) {
    return content;
  }

  return (
    <Link href="/" className="inline-flex items-center" aria-label="HOZOKO home">
      {content}
    </Link>
  );
}
