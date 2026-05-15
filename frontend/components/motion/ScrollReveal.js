'use client';

import { useScrollReveal } from '@/hooks/useInView';
import { cn } from '@/utils/cn';

export default function ScrollReveal({
  children,
  className,
  as: Component = 'div',
  delay = 0,
  variant = 'scroll',
  once = false,
}) {
  const { ref, visible, enterFrom } = useScrollReveal({ once });
  const Tag = Component;

  const motionClass =
    variant === 'fade'
      ? 'motion-reveal-fade'
      : variant === 'up'
        ? 'motion-reveal motion-from-below'
        : variant === 'down'
          ? 'motion-reveal motion-from-above'
          : cn('motion-reveal', enterFrom === 'below' ? 'motion-from-below' : 'motion-from-above');

  return (
    <Tag
      ref={ref}
      className={cn(motionClass, visible && 'is-visible', className)}
      style={{ '--motion-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
