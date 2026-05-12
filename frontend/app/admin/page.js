'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/AdminSidebar';
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
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="mt-2 text-slate-500">Monitor store performance and recent activity.</p>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {error && (
                <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {error}
                </p>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="card">
                  <p className="text-sm text-slate-500">Users</p>
                  <p className="mt-2 text-3xl font-bold">{analytics.totalUsers}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-500">Products</p>
                  <p className="mt-2 text-3xl font-bold">{analytics.totalProducts}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-500">Orders</p>
                  <p className="mt-2 text-3xl font-bold">{analytics.totalOrders}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-500">Revenue</p>
                  <p className="mt-2 text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <section className="card">
                  <h2 className="text-lg font-semibold">Recent orders</h2>
                  <div className="mt-4 space-y-3">
                    {analytics.recentOrders.length === 0 ? (
                      <p className="text-sm text-slate-500">No orders yet.</p>
                    ) : (
                      analytics.recentOrders.map((order) => (
                        <div key={order._id} className="rounded-xl border border-slate-100 p-3 text-sm">
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
                  <h2 className="text-lg font-semibold">Low stock</h2>
                  <div className="mt-4 space-y-3">
                    {analytics.lowStock.length === 0 ? (
                      <p className="text-sm text-slate-500">Inventory levels look healthy.</p>
                    ) : (
                      analytics.lowStock.map((product) => (
                        <div key={product._id} className="rounded-xl border border-slate-100 p-3 text-sm">
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
