import FeaturedProducts from '@/components/FeaturedProducts';
import HomeHero from '@/components/HomeHero';
import { getFeaturedProducts } from '@/utils/serverApi';

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      <HomeHero />
      <FeaturedProducts products={products} />
      <section className="border-y border-stone-200 bg-white">
        <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Summer occasion capsule</p>
            <h2 className="section-title mt-3">
              Limited <span className="italic">Edition</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Statement pieces, refined textures, and elevated silhouettes designed to move from day to evening with ease.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-stone-200 p-6">
              <p className="eyebrow">Delivery</p>
              <p className="mt-3 font-serif text-2xl text-ink">Fast worldwide shipping</p>
            </div>
            <div className="border border-stone-200 p-6">
              <p className="eyebrow">Rewards</p>
              <p className="mt-3 font-serif text-2xl text-ink">Earn points on every order</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
