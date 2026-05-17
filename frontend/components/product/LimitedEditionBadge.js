import { getLimitedEditionStats } from '@/utils/limitedEdition';
import { cn } from '@/utils/cn';

export default function LimitedEditionBadge({ product, compact = false, className }) {
  const stats = getLimitedEditionStats(product);
  if (!stats) return null;

  return (
    <span
      className={cn('badge-limited-edition', compact && 'badge-limited-edition-compact', className)}
      aria-label={`Limited edition, ${stats.remaining} of ${stats.total} remaining`}
    >
      <span className="badge-limited-edition-mark">Limited</span>
      <span className="badge-limited-edition-count">
        {stats.isSoldOut ? 'Sold out' : `${stats.remaining} left`}
      </span>
    </span>
  );
}
