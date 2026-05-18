'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SellerLayout from '@/components/ui/SellerLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { adminService } from '@/services';
import { formatCurrency } from '@/utils/helpers';

const emptyAnalytics = {
  totalProducts: 0,
  lowStock: [],
  recentProducts: [],
};

export default function SellerDashboardPage() {
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    adminService
      .getAnalytics()
      .then(({ data }) => {
        if (!active) return;
        setAnalytics(data.analytics || emptyAnalytics);
        setError('');
      })
      .catch((requestError) => {
        if (!active) return;
        setAnalytics(emptyAnalytics);
        setError(requestError.message || 'Unable to load your dashboard.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ProtectedRoute sellerOnly>
      <SellerLayout title="Seller dashboard" description="Manage your catalog and stock levels.">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {error ? <p className="alert-warning">{error}</p> : null}

            <div className="stats-grid">
              <div className="card">
                <p className="card-label">Your products</p>
                <p className="card-value">{analytics.totalProducts}</p>
              </div>
              <div className="card">
                <p className="card-label">Low stock alerts</p>
                <p className="card-value">{analytics.lowStock?.length || 0}</p>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/seller/products" className="btn-primary">
                Manage products
              </Link>
            </div>

            <div className="split-grid mt-10">
              <section className="card">
                <h2 className="section-heading">Recently added</h2>
                <div className="mt-4 space-y-3">
                  {analytics.recentProducts?.length === 0 ? (
                    <p className="text-sm text-slate-500">No products yet. Add your first item.</p>
                  ) : (
                    analytics.recentProducts.map((product) => (
                      <div key={product._id} className="list-row">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-slate-500">
                          {formatCurrency(product.price)} • {product.stock} in stock
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="card">
                <h2 className="section-heading">Low stock</h2>
                <div className="mt-4 space-y-3">
                  {analytics.lowStock?.length === 0 ? (
                    <p className="text-sm text-slate-500">Stock levels look healthy.</p>
                  ) : (
                    analytics.lowStock.map((product) => (
                      <div key={product._id} className="list-row">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-slate-500">{product.stock} left</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </SellerLayout>
    </ProtectedRoute>
  );
}
