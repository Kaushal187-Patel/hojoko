export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-pulse">
          <div className="product-card-image skeleton-block" />
          <div className="mt-4 space-y-3">
            <div className="h-3 w-20 skeleton-block rounded" />
            <div className="h-4 w-full skeleton-block rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-4 skeleton-block rounded" />
              ))}
            </div>
            <div className="h-6 w-16 skeleton-block rounded" />
            <div className="flex gap-2 pt-2">
              <div className="h-10 w-10 skeleton-block rounded-md" />
              <div className="h-10 flex-1 skeleton-block rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
