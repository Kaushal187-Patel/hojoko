'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import AddressForm from '@/components/address/AddressForm';
import { userService } from '@/services';
import { emptyAddressForm, formatSavedAddress } from '@/utils/address';
import { cn } from '@/utils/cn';

export default function SavedAddressesSection() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyAddressForm());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userService.getAddresses();
      setAddresses(data.addresses || []);
    } catch (error) {
      toast.error(error.message || 'Could not load addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const resetForm = () => {
    setForm(emptyAddressForm());
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await userService.updateAddress(editingId, form);
        toast.success('Address updated');
      } else {
        await userService.createAddress({
          ...form,
          isDefault: form.isDefault || addresses.length === 0,
        });
        toast.success('Address saved');
      }
      resetForm();
      loadAddresses();
    } catch (error) {
      toast.error(error.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setForm({
      label: address.label || 'Home',
      houseNumber: address.houseNumber || '',
      streetLine: address.streetLine || '',
      society: address.society || '',
      city: address.city || '',
      state: address.state || '',
      pinCode: address.pinCode || '',
      country: address.country || 'India',
      isDefault: !!address.isDefault,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      toast.success('Default address updated');
      loadAddresses();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await userService.deleteAddress(deleteTarget.id);
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      toast.success('Address removed');
      loadAddresses();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <section id="addresses" className="mt-10">
      <h2 className="text-xl font-semibold">Saved addresses</h2>
      <p className="mt-1 text-sm text-stone-600">
        Add home, work, or other addresses. Your selection on the cart page is remembered automatically.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 max-w-2xl space-y-4">
        <h3 className="font-medium">{editingId ? 'Edit address' : 'Add new address'}</h3>
        <AddressForm value={form} onChange={setForm} idPrefix="profile-addr" />
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update address' : 'Save address'}
          </button>
          {editingId ? (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      {loading ? (
        <div className="mt-6">
          <LoadingSpinner />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {addresses.map((address) => (
            <li key={address._id} className="card flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold">
                  {address.label || 'Home'}
                  {address.isDefault ? (
                    <span className="ml-2 text-xs font-normal text-stone-500">(Default)</span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-stone-600">{formatSavedAddress(address)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!address.isDefault ? (
                  <button type="button" className="btn-secondary text-sm" onClick={() => handleSetDefault(address._id)}>
                    Set default
                  </button>
                ) : null}
                <button type="button" className="btn-secondary text-sm" onClick={() => handleEdit(address)}>
                  Edit
                </button>
                <button
                  type="button"
                  className={cn('btn-secondary text-sm text-red-600')}
                  onClick={() => setDeleteTarget({ id: address._id, label: address.label })}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {!addresses.length ? <li className="body-muted text-sm">No saved addresses yet.</li> : null}
        </ul>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this address?"
        description={
          deleteTarget
            ? `Remove your ${deleteTarget.label || 'saved'} address? You can add it again anytime.`
            : ''
        }
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </section>
  );
}
