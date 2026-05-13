'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/authSlice';
import { clearCartState } from '@/redux/slices/cartSlice';
import { isAdminUser } from '@/utils/auth';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

const publicNavLinks = [{ href: '/products', label: 'Shop' }];

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
    <header className="site-header">
      <div className="site-header-inner">
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn('nav-link', pathname === link.href && 'nav-link-active')}
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

        <div className="header-actions">
          <Link href="/products" className="header-action hidden lg:inline">
            Search
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="header-action hidden md:inline">
                Account
              </Link>
              <button type="button" onClick={handleLogout} className="header-action hidden md:inline">
                Logout
              </button>
            </>
          ) : (
            <Link href={`${pathname}?auth=login`} className="header-action hidden md:inline" scroll={false}>
              Sign in
            </Link>
          )}

          <Link href="/cart" className="header-action relative">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {adminUser && (
            <Link href="/admin" className="header-action md:hidden">
              Admin
            </Link>
          )}

          {user ? (
            <Link
              href={adminUser ? '/admin' : '/dashboard'}
              aria-label={adminUser ? 'Admin dashboard' : 'Dashboard'}
              className="profile-button"
            >
              <ProfileIcon />
            </Link>
          ) : (
            <Link href={`${pathname}?auth=login`} className="header-action md:hidden" scroll={false}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
