'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import { orderService } from '@/services';
import { formatCurrency, loadRazorpayScript } from '@/utils/helpers';

const initialAddress = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'India',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(initialAddress);
  const [processing, setProcessing] = useState(false);

  const shipping = cart?.totalAmount > 999 ? 0 : 49;
  const total = (cart?.totalAmount || 0) + shipping;

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const { data } = await orderService.create({ shippingAddress: address });
      const { order, razorpayOrder } = data;

      const options = {
        key: razorpayOrder.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'HOZOKO',
        description: `Order ${order._id}`,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await orderService.verify({
              orderId: order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful');
            router.push('/orders');
          } catch (error) {
            toast.error(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: '#4f46e5' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', () => toast.error('Payment failed'));
      paymentObject.open();
    } catch (error) {
      toast.error(error.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handlePayment} className="card space-y-4">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <input
            className="input-field"
            placeholder="Street address"
            value={address.street}
            onChange={(event) => setAddress({ ...address, street: event.target.value })}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="input-field"
              placeholder="City"
              value={address.city}
              onChange={(event) => setAddress({ ...address, city: event.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="State"
              value={address.state}
              onChange={(event) => setAddress({ ...address, state: event.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="input-field"
              placeholder="ZIP code"
              value={address.zipCode}
              onChange={(event) => setAddress({ ...address, zipCode: event.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Country"
              value={address.country}
              onChange={(event) => setAddress({ ...address, country: event.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={processing}>
            {processing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </form>

        <div className="card h-fit space-y-3">
          <h2 className="text-lg font-semibold">Summary</h2>
          <div className="flex justify-between text-sm">
            <span>Items</span>
            <span>{cart?.totalItems || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(cart?.totalAmount || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
