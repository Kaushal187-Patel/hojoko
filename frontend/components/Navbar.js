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

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" />
    </svg>
  );
}

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
      <div className="container-page flex h-16 items-center justify-between gap-4 md:grid md:h-20 md:grid-cols-[1fr_auto_1fr]">
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

        <div className="md:justify-self-center">
          <Logo />
        </div>

        <div className="flex items-center justify-end gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink md:gap-5">
          <Link href="/products" className="hidden transition hover:text-stone-600 lg:inline">
            Search
          </Link>

          {user ? (
            <>
              <Link
                href="/profile"
                aria-label="Profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-ink transition hover:border-ink md:hidden"
              >
                <ProfileIcon />
              </Link>
              <Link href="/dashboard" className="hidden transition hover:text-stone-600 md:inline">
                Account
              </Link>
              <button type="button" onClick={handleLogout} className="hidden transition hover:text-stone-600 md:inline">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="transition hover:text-stone-600">
              Sign in
            </Link>
          )}

          <Link href="/cart" className="relative transition hover:text-stone-600">
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
