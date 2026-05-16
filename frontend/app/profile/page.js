'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import SavedAddressesSection from '@/components/address/SavedAddressesSection';
import { userService } from '@/services';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userService
      .getProfile()
      .then(({ data }) => {
        const { name, email, phone } = data.user;
        setProfile({ name: name || '', email: email || '', phone: phone || '' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const { data } = await userService.updateProfile({
        name: profile.name,
        phone: profile.phone,
      });
      const { name, email, phone } = data.user;
      setProfile({ name: name || '', email: email || '', phone: phone || '' });
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <h1 className="page-title">Profile</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="card mt-8 max-w-2xl space-y-4">
              <h2 className="font-medium">Account details</h2>
              <input
                className="input-field"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Name"
              />
              <input className="input-field" value={profile.email || ''} disabled />
              <input
                className="input-field"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Phone"
              />
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save profile'}
              </button>
            </form>

            <SavedAddressesSection />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
