export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[3/4] bg-stone-200" />
          <div className="mt-4 space-y-3">
            <div className="h-3 w-16 bg-stone-200" />
            <div className="h-4 w-3/4 bg-stone-200" />
            <div className="h-4 w-1/3 bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
