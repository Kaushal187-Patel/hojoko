import HomeCategories from '@/components/HomeCategories';
import HomeHero from '@/components/HomeHero';
import { getCategories } from '@/utils/serverApi';

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <HomeHero />
      <HomeCategories categories={categories} />
      <section className="promo-band">
        <div className="promo-grid">
          <div>
            <p className="eyebrow">Summer occasion capsule</p>
            <h2 className="section-title mt-3">
              Limited <span className="italic">Edition</span>
            </h2>
            <p className="body-copy mt-4 max-w-xl">
              Statement pieces, refined textures, and elevated silhouettes designed to move from day to evening with ease.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="promo-card">
              <p className="eyebrow">Delivery</p>
              <p className="promo-card-title">Fast worldwide shipping</p>
            </div>
            <div className="promo-card">
              <p className="eyebrow">Rewards</p>
              <p className="promo-card-title">Earn points on every order</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
