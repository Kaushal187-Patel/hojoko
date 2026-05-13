import { cn } from '@/utils/cn';

/** Reusable marketing/content section with optional vertical padding. */
export default function PageSection({ className, children, padded = true }) {
  return <section className={cn(padded ? 'page-section' : 'container-page', className)}>{children}</section>;
}
