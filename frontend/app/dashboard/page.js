'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { orderService } from '@/services';
import { formatCurrency } from '@/utils/helpers';
import { isAdminUser } from '@/utils/auth';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const adminUser = isAdminUser(user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getAll()
      .then(({ data }) => setOrders(data.orders.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="page-title">Welcome, {user?.name}</h1>
            <p className="page-subtitle">Manage your shopping activity from one place.</p>
          </div>
          {adminUser && (
            <Link href="/admin" className="btn-primary w-full md:w-auto">
              Open admin dashboard
            </Link>
          )}
        </div>

        <div className="dashboard-stats">
          <div className="card">
            <p className="card-label">Cart items</p>
            <p className="card-value">{cart?.totalItems || 0}</p>
          </div>
          <div className="card">
            <p className="card-label">Cart total</p>
            <p className="card-value">{formatCurrency(cart?.totalAmount || 0)}</p>
          </div>
          <div className="card">
            <p className="card-label">Recent orders</p>
            <p className="card-value">{orders.length}</p>
          </div>
        </div>

        <div className="cart-grid">
          <section className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-heading">Recent orders</h2>
              <Link href="/orders" className="text-sm font-semibold text-brand-600">
                View all
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner label="Loading orders..." />
            ) : orders.length === 0 ? (
              <p className="text-sm text-slate-500">No orders yet. Start shopping to place your first order.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="list-row-lg">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
                      <p className="text-sm capitalize text-slate-500">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card space-y-4">
            <h2 className="section-heading">Quick links</h2>
            <Link href="/products" className="btn-primary w-full">
              Continue shopping
            </Link>
            <Link href="/cart" className="btn-secondary w-full">
              View cart
            </Link>
            <Link href="/profile" className="btn-secondary w-full">
              Edit profile
            </Link>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
