'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/authSlice';
import { clearCartState } from '@/redux/slices/cartSlice';
import { isAdminUser } from '@/utils/auth';
import toast from 'react-hot-toast';

const publicNavLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/products?sort=-createdAt', label: 'New arrivals' },
];

const userNavLinks = [{ href: '/orders', label: 'Orders' }];

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const cartCount = cart?.totalItems || 0;
  const adminUser = isAdminUser(user);
  const navLinks = user ? [...publicNavLinks, ...userNavLinks] : publicNavLinks;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCartState());
    toast.success('Logged out successfully');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-canvas/95 backdrop-blur">
      <div className="container-page grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'text-ink' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {adminUser && (
            <Link href="/admin" className="nav-link">
              Admin
            </Link>
          )}
        </nav>

        <div className="justify-self-center">
          <Logo />
        </div>

        <div className="flex items-center justify-end gap-4 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-700">
          <Link href="/products" className="hidden transition hover:text-ink sm:inline">
            Search
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="hidden transition hover:text-ink sm:inline">
                Account
              </Link>
              <button type="button" onClick={handleLogout} className="hidden transition hover:text-ink sm:inline">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden transition hover:text-ink sm:inline">
              Sign in
            </Link>
          )}

          <Link href="/cart" className="relative transition hover:text-ink">
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
