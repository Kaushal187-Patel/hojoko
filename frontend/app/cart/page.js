'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { fetchCart, removeFromCart, updateCartItem } from '@/redux/slices/cartSlice';
import AddressSelector from '@/components/address/AddressSelector';
import { formatCurrency, getProductImage } from '@/utils/helpers';

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (itemId, quantity) => {
    const result = await dispatch(updateCartItem({ id: itemId, quantity }));

    if (updateCartItem.rejected.match(result)) {
      toast.error(result.payload || 'Could not update quantity');
    }
  };

  const confirmRemoveItem = async () => {
    if (!removeTarget) return;
    const idToRemove = removeTarget.id;
    setRemoveLoading(true);
    const result = await dispatch(removeFromCart(idToRemove));
    setRemoveLoading(false);

    if (removeFromCart.fulfilled.match(result)) {
      setRemoveTarget(null);
      toast.success('Item removed');
      return;
    }

    toast.error(result.payload || 'Could not remove item');
  };

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <h1 className="page-title">Your cart</h1>

        {loading ? (
          <LoadingSpinner />
        ) : !cart?.items?.length ? (
          <div className="card mt-8">
            <p className="text-slate-500">Your cart is empty.</p>
            <Link href="/products" className="btn-primary mt-4 inline-flex">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="card flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
                    <Image
                      src={getProductImage(item.product)}
                      alt={item.product?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.product?.name}</h2>
                    <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(item._id, Number(event.target.value))}
                    className="input-field max-w-24"
                  />
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    <button
                      type="button"
                      onClick={() =>
                        setRemoveTarget({ id: item._id, name: item.product?.name || 'this item' })
                      }
                      className="mt-2 text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <AddressSelector onSelect={setSelectedAddress} />

              <div className="card h-fit space-y-4">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{cart.totalAmount > 999 ? 'Free' : formatCurrency(49)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(cart.totalAmount + (cart.totalAmount > 999 ? 0 : 49))}</span>
              </div>
              {selectedAddress ? (
                <Link href="/checkout" className="btn-primary w-full">
                  Proceed to checkout
                </Link>
              ) : (
                <p className="text-center text-sm text-stone-500">Select or save a delivery address to continue.</p>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={!!removeTarget}
        title="Remove from cart?"
        description={
          removeTarget ? `${removeTarget.name} will be removed from your cart.` : ''
        }
        confirmLabel="Remove"
        onCancel={() => !removeLoading && setRemoveTarget(null)}
        onConfirm={confirmRemoveItem}
        loading={removeLoading}
      />
    </ProtectedRoute>
  );
}
