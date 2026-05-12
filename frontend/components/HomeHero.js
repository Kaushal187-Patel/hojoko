import Image from 'next/image';
import Link from 'next/link';

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
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      <div className="container-page relative flex min-h-[72vh] items-end pb-14 pt-28 md:items-center md:pb-20">
        <div className="max-w-2xl text-white">
          <p className="eyebrow text-white/80">New arrivals</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] md:text-7xl">
            Airy <span className="italic">Spring</span> Dressing
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 md:text-base">
            Effortless layers, lightweight textures, and curated essentials designed for work, weekends, and everything in between.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary border-white bg-white text-ink hover:bg-stone-100">
              Shop now
            </Link>
            <Link href="/signup" className="btn-secondary border-white/40 text-white hover:border-white">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
