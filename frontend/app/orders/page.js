'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { orderService } from '@/services';
import { formatCurrency } from '@/utils/helpers';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getAll()
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold">Order history</h1>
        <p className="mt-2 text-slate-500">Track payment and delivery status for your purchases.</p>

        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <p className="mt-8 text-slate-500">No orders yet.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order._id} className="card">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-bold">{formatCurrency(order.totalPrice)}</p>
                    <p className="text-sm capitalize text-slate-500">
                      {order.status} {order.isPaid ? '• Paid' : '• Unpaid'}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  {order.orderItems.map((item) => (
                    <li key={`${order._id}-${item.product}`}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
