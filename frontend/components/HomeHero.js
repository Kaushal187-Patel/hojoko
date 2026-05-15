'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_TAGLINE } from '@/utils/brand';
import { cn } from '@/utils/cn';
import { getHeroSlideImage } from '@/utils/helpers';

const AUTO_SCROLL_MS = 4000;

const FALLBACK_SLIDES = [
  {
    _id: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=2000&q=80',
    alt: 'HOZOKO special offer',
  },
];

export default function HomeHero({ slides: initialSlides = [] }) {
  const slides = initialSlides.length ? initialSlides : FALLBACK_SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length, paused]);

  return (
    <section
      className="home-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="home-hero-slides" aria-hidden="true">
        {slides.map((slide, index) => (
          <Image
            key={slide._id || slide.image}
            src={getHeroSlideImage(slide)}
            alt={slide.alt || 'HOZOKO special offer'}
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn('home-hero-slide object-cover object-center', index === activeIndex && 'is-active')}
          />
        ))}
      </div>

      <div className="home-hero-overlay" aria-hidden="true" />

      <div className={cn('container-page home-hero-content motion-reveal-fade', heroVisible && 'is-visible')}>
        <div className="max-w-2xl text-white">
          <p className="eyebrow text-white/85">Special offer</p>
          <h1 className="hero-title mt-4">{SITE_TAGLINE}</h1>
          <div className="mt-8">
            <Link href="/products" className="btn-primary border-white bg-white text-ink hover:bg-stone-100">
              Shop now
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="home-hero-dots" role="tablist" aria-label="Hero offers">
          {slides.map((slide, index) => (
            <button
              key={slide._id || `dot-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show offer slide ${index + 1}`}
              className={cn('home-hero-dot', index === activeIndex && 'is-active')}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
