'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { orderService } from '@/services';
import { formatCurrency } from '@/utils/helpers';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
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
      <div className="container-page py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="mt-2 text-slate-500">Manage your shopping activity from one place.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card">
            <p className="text-sm text-slate-500">Cart items</p>
            <p className="mt-2 text-3xl font-bold">{cart?.totalItems || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-500">Cart total</p>
            <p className="mt-2 text-3xl font-bold">{formatCurrency(cart?.totalAmount || 0)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-500">Recent orders</p>
            <p className="mt-2 text-3xl font-bold">{orders.length}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent orders</h2>
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
                  <div key={order._id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
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
            <h2 className="text-lg font-semibold">Quick links</h2>
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
