export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-pulse">
          <div className="image-portrait skeleton-block" />
          <div className="mt-4 space-y-3">
            <div className="h-3 w-16 skeleton-block" />
            <div className="h-4 w-3/4 skeleton-block" />
            <div className="h-4 w-1/3 skeleton-block" />
          </div>
        </div>
      ))}
    </div>
  );
}
