import HomeCategories from '@/components/HomeCategories';
import HomeHero from '@/components/HomeHero';
import PromoBand from '@/components/home/PromoBand';
import { getCategories, getHeroSlides } from '@/utils/serverApi';

export default async function HomePage() {
  const [categories, heroSlides] = await Promise.all([getCategories(), getHeroSlides()]);

  return (
    <>
      <HomeHero slides={heroSlides} />
      <HomeCategories categories={categories} />
      <PromoBand />
    </>
  );
}
