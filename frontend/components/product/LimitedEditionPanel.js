'use client';

import { useEffect, useState } from 'react';
import LimitedEditionMeter from '@/components/product/LimitedEditionMeter';
import { formatEditionCountdown, getLimitedEditionStats } from '@/utils/limitedEdition';

export default function LimitedEditionPanel({ product }) {
  const stats = getLimitedEditionStats(product);
  const [countdown, setCountdown] = useState(() => formatEditionCountdown(product.limitedEditionEndsAt));

  useEffect(() => {
    if (!product.limitedEditionEndsAt) return undefined;

    const tick = () => setCountdown(formatEditionCountdown(product.limitedEditionEndsAt));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [product.limitedEditionEndsAt]);

  if (!stats) return null;

  return (
    <aside className="limited-edition-panel" aria-label="Limited edition details">
      <div className="limited-edition-panel-head">
        <p className="limited-edition-panel-eyebrow">HOZOKO · Numbered drop</p>
        <p className="limited-edition-panel-title">
          Edition of <span>{stats.total}</span>
        </p>
        {countdown ? (
          <p className={countdown.expired ? 'limited-edition-panel-closed' : 'limited-edition-panel-timer'}>
            {countdown.label}
          </p>
        ) : null}
      </div>

      <LimitedEditionMeter product={product} />

      {product.limitedEditionStory ? (
        <p className="limited-edition-panel-story">{product.limitedEditionStory}</p>
      ) : null}

      {stats.isLowStock && !stats.isSoldOut ? (
        <p className="limited-edition-panel-alert">Final pieces — once they are gone, this run will not return.</p>
      ) : null}
    </aside>
  );
}
