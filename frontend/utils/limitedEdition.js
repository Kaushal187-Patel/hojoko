export function getLimitedEditionStats(product) {
  if (!product?.isLimitedEdition || !product.limitedEditionRun) {
    return null;
  }

  const total = Math.max(1, Number(product.limitedEditionRun));
  const remaining = Math.max(0, Math.min(Number(product.stock) || 0, total));
  const claimed = total - remaining;
  const percentSold = Math.min(100, Math.round((claimed / total) * 100));
  const percentRemaining = 100 - percentSold;

  return {
    total,
    remaining,
    claimed,
    percentSold,
    percentRemaining,
    isLowStock: remaining > 0 && remaining <= Math.max(1, Math.ceil(total * 0.2)),
    isSoldOut: remaining === 0,
  };
}

export function formatEditionCountdown(endsAt) {
  if (!endsAt) return null;

  const end = new Date(endsAt).getTime();
  if (Number.isNaN(end)) return null;

  const diff = end - Date.now();
  if (diff <= 0) return { label: 'Drop closed', expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return { label: `${days}d ${hours}h left`, expired: false };
  }

  if (hours > 0) {
    return { label: `${hours}h ${minutes}m left`, expired: false };
  }

  return { label: `${minutes}m left`, expired: false };
}

export function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
