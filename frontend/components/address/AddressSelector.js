'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import AddressForm from '@/components/address/AddressForm';
import { userService } from '@/services';
import {
  emptyAddressForm,
  formatSavedAddress,
  resolveSelectedAddress,
  setStoredSelectedAddressId,
} from '@/utils/address';
import { cn } from '@/utils/cn';

export default function AddressSelector({ onSelect, showAddForm = true, className }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddressForm);
  const [saving, setSaving] = useState(false);

  const applySelection = useCallback(
    (list, preferredId) => {
      const resolved = preferredId
        ? list.find((item) => item._id === preferredId) || resolveSelectedAddress(list)
        : resolveSelectedAddress(list);

      if (resolved) {
        setSelectedId(resolved._id);
        setStoredSelectedAddressId(resolved._id);
        onSelect?.(resolved);
      } else {
        setSelectedId(null);
        onSelect?.(null);
      }
    },
    [onSelect]
  );

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userService.getAddresses();
      const list = data.addresses || [];
      setAddresses(list);
      applySelection(list);
      if (!list.length && showAddForm) {
        setShowForm(true);
      }
    } catch (error) {
      toast.error(error.message || 'Could not load addresses');
    } finally {
      setLoading(false);
    }
  }, [applySelection, showAddForm]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleSelect = (address) => {
    setSelectedId(address._id);
    setStoredSelectedAddressId(address._id);
    onSelect?.(address);
  };

  const handleSaveNew = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await userService.createAddress({
        ...form,
        isDefault: form.isDefault || addresses.length === 0,
      });
      const list = data.addresses || [];
      setAddresses(list);
      setForm(emptyAddressForm());
      setShowForm(false);
      applySelection(list, data.address?._id);
      toast.success('Address saved');
    } catch (error) {
      toast.error(error.message || 'Could not save address');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('card', className)}>
        <LoadingSpinner label="Loading addresses..." />
      </div>
    );
  }

  return (
    <div className={cn('card space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Delivery address</h2>
        <Link href="/profile#addresses" className="text-sm brand-link">
          Manage in profile
        </Link>
      </div>

      {addresses.length > 0 ? (
        <ul className="space-y-2" role="radiogroup" aria-label="Saved addresses">
          {addresses.map((address) => (
            <li key={address._id}>
              <label
                className={cn(
                  'flex cursor-pointer gap-3 rounded-xl border p-4 transition',
                  selectedId === address._id
                    ? 'border-ink bg-stone-50 ring-1 ring-ink'
                    : 'border-stone-200 hover:border-stone-300'
                )}
              >
                <input
                  type="radio"
                  name="delivery-address"
                  className="mt-1"
                  checked={selectedId === address._id}
                  onChange={() => handleSelect(address)}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{address.label || 'Home'}</span>
                    {address.isDefault ? (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-600">
                        Default
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm text-stone-600">{formatSavedAddress(address)}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-600">No saved address yet. Add one below for faster checkout.</p>
      )}

      {showAddForm ? (
        <div className="border-t border-stone-100 pt-4">
          {addresses.length > 0 ? (
            <button
              type="button"
              className="btn-secondary mb-4 text-sm"
              onClick={() => setShowForm((open) => !open)}
            >
              {showForm ? 'Cancel new address' : '+ Add another address'}
            </button>
          ) : null}

          {showForm || !addresses.length ? (
            <form onSubmit={handleSaveNew} className="space-y-4">
              <AddressForm value={form} onChange={setForm} idPrefix="cart-addr" />
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save address'}
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
