'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getProductImages } from '@/utils/helpers';
import { cn } from '@/utils/cn';

export default function ProductImageGallery({ product, name }) {
  const images = getProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];
  const gridImages = images.slice(1);
  const visibleGridImages = gridImages.slice(0, 4);
  const hiddenCount = Math.max(gridImages.length - 4, 0);

  return (
    <div className="space-y-4">
      <div className="image-portrait">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="image-cover"
        />
      </div>

      {gridImages.length > 0 && (
        <div className="thumbnail-grid">
          {visibleGridImages.map((image, index) => {
            const imageIndex = index + 1;
            const isLastTile = index === 3 && hiddenCount > 0;
            const isActive = activeIndex === imageIndex;

            return (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                onClick={() => setActiveIndex(imageIndex)}
                className={cn('image-thumb', isActive && 'image-thumb-active')}
                aria-label={isLastTile ? `Show ${hiddenCount} more images` : `Show image ${imageIndex + 1}`}
              >
                <Image
                  src={image}
                  alt={`${name} view ${imageIndex + 1}`}
                  fill
                  sizes="25vw"
                  className={cn('image-cover', isLastTile && 'thumb-dimmed')}
                />
                {isLastTile && (
                  <span className="overlay-dark">
                    +{hiddenCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
