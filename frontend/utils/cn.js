import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class strings without conflicting utilities. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
