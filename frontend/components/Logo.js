import Link from 'next/link';

export default function Logo({ className = '', linked = true }) {
  const content = (
    <span className={`font-serif text-2xl tracking-[0.12em] text-ink md:text-3xl ${className}`}>
      HOZOKO
    </span>
  );

  if (!linked) {
    return content;
  }

  return (
    <Link href="/" className="inline-flex items-center" aria-label="HOZOKO home">
      {content}
    </Link>
  );
}
