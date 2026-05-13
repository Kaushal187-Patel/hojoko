'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/ui/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { adminService } from '@/services';
import { formatCurrency } from '@/utils/helpers';

const emptyAnalytics = {
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  recentOrders: [],
  lowStock: [],
};

export default function AdminDashboardPage() {
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
        setError(requestError.message || 'Unable to load analytics right now.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout title="Admin dashboard" description="Monitor store performance and recent activity.">

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {error && (
                <p className="alert-warning">
                  {error}
                </p>
              )}

              <div className="stats-grid">
                <div className="card">
                  <p className="card-label">Users</p>
                  <p className="card-value">{analytics.totalUsers}</p>
                </div>
                <div className="card">
                  <p className="card-label">Products</p>
                  <p className="card-value">{analytics.totalProducts}</p>
                </div>
                <div className="card">
                  <p className="card-label">Orders</p>
                  <p className="card-value">{analytics.totalOrders}</p>
                </div>
                <div className="card">
                  <p className="card-label">Revenue</p>
                  <p className="card-value">{formatCurrency(analytics.totalRevenue)}</p>
                </div>
              </div>

              <div className="split-grid">
                <section className="card">
                  <h2 className="section-heading">Recent orders</h2>
                  <div className="mt-4 space-y-3">
                    {analytics.recentOrders.length === 0 ? (
                      <p className="text-sm text-slate-500">No orders yet.</p>
                    ) : (
                      analytics.recentOrders.map((order) => (
                        <div key={order._id} className="list-row">
                          <p className="font-medium">{order.user?.name || 'Customer'}</p>
                          <p className="text-slate-500">
                            {formatCurrency(order.totalPrice)} • {order.status}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="card">
                  <h2 className="section-heading">Low stock</h2>
                  <div className="mt-4 space-y-3">
                    {analytics.lowStock.length === 0 ? (
                      <p className="text-sm text-slate-500">Inventory levels look healthy.</p>
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
      </AdminLayout>
    </ProtectedRoute>
  );
}
