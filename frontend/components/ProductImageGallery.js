'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProductImages } from '@/utils/helpers';
import { cn } from '@/utils/cn';

const AUTO_SCROLL_MS = 3500;

export default function ProductImageGallery({ product, name }) {
  const images = getProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(timer);
  }, [images.length, paused]);

  return (
    <div
      className="product-gallery-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="image-portrait product-gallery-stage">
        {images.map((image, index) => (
          <Image
            key={`${image}-${index}`}
            src={image}
            alt={`${name} view ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn('image-cover product-gallery-slide', index === activeIndex && 'is-active')}
          />
        ))}
      </div>

      {images.length > 1 ? (
        <div className="product-gallery-dots" role="tablist" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={`dot-${image}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show image ${index + 1}`}
              className={cn('product-gallery-dot', index === activeIndex && 'is-active')}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
