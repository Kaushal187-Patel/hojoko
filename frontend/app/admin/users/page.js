'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/ui/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { adminService } from '@/services';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getUsers();
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleActive = async (user) => {
    try {
      await adminService.updateUser(user._id, { isActive: !user.isActive });
      toast.success('User updated');
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const removeUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout title="Manage users">

{loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-8 space-y-3">
              {users.map((user) => (
                <div key={user._id} className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-slate-500">
                      {user.email} • {user.role} • {user.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {user.role !== 'admin' ? (
                      <button type="button" className="btn-secondary" onClick={() => toggleActive(user)}>
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span className="inline-flex items-center text-sm text-stone-500">Always active</span>
                    )}
                    {user.role !== 'admin' && (
                      <button type="button" className="btn-secondary text-red-600" onClick={() => removeUser(user._id)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
