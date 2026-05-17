import HomeCategories from '@/components/HomeCategories';
import HomeHero from '@/components/HomeHero';
import HomeLimitedEdition from '@/components/home/HomeLimitedEdition';
import PromoBand from '@/components/home/PromoBand';
import { getCategories, getHeroSlides, getLimitedEditionProducts } from '@/utils/serverApi';

export default async function HomePage() {
  const [categories, heroSlides, limitedEdition] = await Promise.all([
    getCategories(),
    getHeroSlides(),
    getLimitedEditionProducts(4),
  ]);

  return (
    <>
      <HomeHero slides={heroSlides} />
      <HomeLimitedEdition products={limitedEdition} />
      <HomeCategories categories={categories} />
      <PromoBand />
    </>
  );
}
