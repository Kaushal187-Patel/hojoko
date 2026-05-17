'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productService } from '@/services';
import { getProductUrl } from '@/utils/helpers';
import { addRecentlyViewed } from '@/utils/recentlyViewed';

export default function LegacyProductRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    productService
      .getById(params.id)
      .then(({ data }) => {
        addRecentlyViewed(data.product);
        router.replace(getProductUrl(data.product));
      })
      .catch(() => {
        toast.error('Product not found');
        router.replace('/products');
      });
  }, [params.id, router]);

  return <LoadingSpinner />;
}
