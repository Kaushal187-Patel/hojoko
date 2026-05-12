'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { userService } from '@/services';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userService
      .getProfile()
      .then(({ data }) => setProfile(data.user))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const { data } = await userService.updateProfile(profile);
      setProfile(data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold">Profile</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} className="card mt-8 max-w-2xl space-y-4">
            <input className="input-field" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
            <input className="input-field" value={profile.email || ''} disabled />
            <input className="input-field" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
            <input
              className="input-field"
              value={profile.address?.street || ''}
              onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
              placeholder="Street"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="input-field"
                value={profile.address?.city || ''}
                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
                placeholder="City"
              />
              <input
                className="input-field"
                value={profile.address?.state || ''}
                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })}
                placeholder="State"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}
