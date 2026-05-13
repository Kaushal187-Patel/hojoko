const messages = [
  'Free shipping on orders above Rs 999',
  'Fast worldwide shipping',
  'Earn points, enjoy rewards',
  'New arrivals added weekly',
];

export default function AnnouncementBar() {
  const ticker = [...messages, ...messages];

  return (
    <div className="announcement-bar">
      <div className="overflow-hidden py-2.5">
        <div className="announcement-track">
          {ticker.map((message, index) => (
            <span key={`${message}-${index}`} className="announcement-text">
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
