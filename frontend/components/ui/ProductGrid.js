import { cn } from '@/utils/cn';

/** Standard responsive product grid used across catalog views. */
export default function ProductGrid({ className, children }) {
  return <div className={cn('product-grid', className)}>{children}</div>;
}
