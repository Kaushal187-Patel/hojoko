import { cn } from '@/utils/cn';

/** Centered auth form wrapper shared by login and signup. */
export default function AuthLayout({ children, className }) {
  return <div className={cn('auth-shell', className)}>{children}</div>;
}
