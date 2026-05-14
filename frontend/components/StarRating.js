export default function StarRating({ rating = 0, reviewCount, className = '' }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const fill = Math.min(Math.max(rating - index, 0), 1);
    return (
      <span key={index} className="product-star" aria-hidden="true">
        <svg viewBox="0 0 20 20" className="product-star-icon product-star-empty">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
        <span className="product-star-fill" style={{ width: `${fill * 100}%` }}>
          <svg viewBox="0 0 20 20" className="product-star-icon product-star-filled">
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        </span>
      </span>
    );
  });

  return (
    <div className={`product-rating ${className}`}>
      <div className="product-stars">{stars}</div>
      {reviewCount != null && reviewCount > 0 ? (
        <span className="product-review-count">{reviewCount}</span>
      ) : null}
    </div>
  );
}
