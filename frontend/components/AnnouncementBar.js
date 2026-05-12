const messages = [
  'Free shipping on orders above Rs 999',
  'Fast worldwide shipping',
  'Earn points, enjoy rewards',
  'New arrivals added weekly',
];

export default function AnnouncementBar() {
  const ticker = [...messages, ...messages];

  return (
    <div className="border-b border-stone-200 bg-stone-50 text-stone-700">
      <div className="overflow-hidden py-2.5">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-4">
          {ticker.map((message, index) => (
            <span key={`${message}-${index}`} className="text-[11px] uppercase tracking-[0.24em]">
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
