'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/ui/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import PasswordInput from '@/components/auth/PasswordInput';
import { adminService } from '@/services';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getSellers();
      setSellers(data.sellers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await adminService.createSeller(form);
      toast.success('Seller account created');
      setForm(emptyForm);
      loadSellers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not create seller');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (seller) => {
    try {
      await adminService.updateUser(seller._id, { isActive: !seller.isActive });
      toast.success('Seller updated');
      loadSellers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Update failed');
    }
  };

  return (
    <ProtectedRoute mainAdminOnly>
      <AdminLayout title="Manage sellers" description="Create seller logins and control account access.">
        <form onSubmit={handleSubmit} className="card mt-8 grid gap-4 md:grid-cols-2">
          <p className="md:col-span-2 font-medium text-ink">Create seller account</p>
          <input
            className="input-field"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <PasswordInput
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <PasswordInput
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            required
          />
          <button type="submit" className="btn-primary md:col-span-2" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create seller'}
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-8 space-y-3">
            {sellers.length === 0 ? (
              <p className="body-muted">No seller accounts yet.</p>
            ) : (
              sellers.map((seller) => (
                <div key={seller._id} className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <p className="text-sm text-slate-500">
                      {seller.email} • {seller.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <button type="button" className="btn-secondary" onClick={() => toggleActive(seller)}>
                    {seller.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
