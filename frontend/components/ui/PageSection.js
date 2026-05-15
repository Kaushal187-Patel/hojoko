'use client';

import ScrollReveal from '@/components/motion/ScrollReveal';
import { cn } from '@/utils/cn';

/** Reusable marketing/content section with optional scroll reveal. */
export default function PageSection({ className, children, padded = true, reveal = true, delay = 0 }) {
  const sectionClass = cn(padded ? 'page-section' : 'container-page', className);

  if (!reveal) {
    return <section className={sectionClass}>{children}</section>;
  }

  return (
    <ScrollReveal as="section" className={sectionClass} delay={delay}>
      {children}
    </ScrollReveal>
  );
}
