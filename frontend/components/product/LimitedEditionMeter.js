import { getLimitedEditionStats } from '@/utils/limitedEdition';
import { cn } from '@/utils/cn';

export default function LimitedEditionMeter({ product, showCaption = true, className }) {
  const stats = getLimitedEditionStats(product);
  if (!stats) return null;

  return (
    <div className={cn('limited-edition-meter', className)}>
      <div className="limited-edition-meter-track" aria-hidden>
        <span
          className="limited-edition-meter-fill"
          style={{ width: `${stats.percentSold}%` }}
        />
      </div>
      {showCaption ? (
        <p className="limited-edition-meter-caption">
          <span className="font-medium text-ink">{stats.claimed}</span> claimed ·{' '}
          <span className="font-medium text-ink">{stats.remaining}</span> of {stats.total} pieces left
        </p>
      ) : null}
    </div>
  );
}
