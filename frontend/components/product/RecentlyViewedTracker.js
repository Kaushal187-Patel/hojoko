'use client';

import { useEffect, useRef } from 'react';
import { addRecentlyViewed } from '@/utils/recentlyViewed';

/** Records a product visit for the home page Recently Viewed row. */
export default function RecentlyViewedTracker({ product }) {
  const lastId = useRef(null);

  useEffect(() => {
    if (!product?._id || lastId.current === product._id) {
      return;
    }

    lastId.current = product._id;
    addRecentlyViewed(product);
  }, [product]);

  return null;
}
