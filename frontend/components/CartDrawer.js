'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { closeCartDrawer } from '@/redux/slices/cartSlice';
import { formatCurrency, getProductImage } from '@/utils/helpers';

export default function CartDrawer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cart, drawerOpen } = useSelector((state) => state.cart);

  const close = () => dispatch(closeCartDrawer());

  const goToCart = () => {
    close();
    router.push('/cart');
  };

  if (!drawerOpen) {
    return null;
  }

  return (
    <div className="cart-drawer-root" role="dialog" aria-modal="true" aria-label="Cart preview">
      <button type="button" className="cart-drawer-backdrop" onClick={close} aria-label="Close cart" />
      <aside className="cart-drawer-panel">
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Added to cart</h2>
          <button type="button" className="cart-drawer-close" onClick={close} aria-label="Close">
            ×
          </button>
        </div>

        <div className="cart-drawer-body">
          {!cart?.items?.length ? (
            <p className="body-muted">Your cart is empty.</p>
          ) : (
            <ul className="cart-drawer-list">
              {cart.items.map((item) => (
                <li key={item._id} className="cart-drawer-item">
                  <div className="cart-drawer-item-image">
                    <Image
                      src={getProductImage(item.product)}
                      alt={item.product?.name || 'Product'}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{item.product?.name}</p>
                    <p className="text-sm text-stone-500">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatCurrency(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart?.items?.length ? (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-summary">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(cart.totalAmount)}</span>
            </div>
            <button type="button" className="btn-primary w-full" onClick={goToCart}>
              View cart
            </button>
            <Link href="/checkout" className="btn-secondary w-full text-center" onClick={close}>
              Checkout
            </Link>
          </div>
        ) : (
          <div className="cart-drawer-footer">
            <Link href="/products" className="btn-primary w-full text-center" onClick={close}>
              Continue shopping
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
