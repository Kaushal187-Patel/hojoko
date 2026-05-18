'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ProductManager from '@/components/admin/ProductManager';

export default function SellerProductsPage() {
  return (
    <ProtectedRoute sellerOnly>
      <ProductManager variant="seller" />
    </ProtectedRoute>
  );
}
