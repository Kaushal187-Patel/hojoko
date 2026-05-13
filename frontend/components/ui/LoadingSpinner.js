import { cn } from '@/utils/cn';

export default function LoadingSpinner({ label = 'Loading...', className }) {
  return (
    <div className={cn('spinner-shell', className)}>
      <div className="spinner-ring" aria-hidden />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
