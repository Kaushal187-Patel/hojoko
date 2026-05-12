'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { orderService } from '@/services';
import { formatCurrency } from '@/utils/helpers';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderService.getAll();
      setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, { status });
      toast.success('Order updated');
      loadOrders();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div>
          <h1 className="text-3xl font-bold">Manage orders</h1>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">#{order._id.slice(-8)}</p>
                      <p className="text-sm text-slate-500">{order.user?.name} • {formatCurrency(order.totalPrice)}</p>
                    </div>
                    <select
                      className="input-field max-w-48"
                      value={order.status}
                      onChange={(event) => handleStatusChange(order._id, event.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
