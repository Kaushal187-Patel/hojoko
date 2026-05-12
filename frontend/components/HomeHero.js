import Image from 'next/image';
import Link from 'next/link';
import { SITE_TAGLINE } from '@/utils/brand';

export default function HomeHero() {
  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-stone-100">
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
        alt="HOZOKO seasonal collection"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/55 md:via-black/25 md:to-transparent" />
      <div className="container-page absolute inset-0 flex items-end pb-14 pt-28 md:items-center md:pb-20">
        <div className="max-w-2xl text-white">
          <p className="eyebrow text-white/80">New arrivals</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] sm:text-5xl md:text-6xl">{SITE_TAGLINE}</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary border-white bg-white text-ink hover:bg-stone-100">
              Shop now
            </Link>
            <Link href="/signup" className="btn-secondary border-white/40 bg-transparent text-white hover:border-white">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
