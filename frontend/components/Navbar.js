'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Logo from '@/components/Logo';
import { logoutUser } from '@/redux/slices/authSlice';
import { clearCartState } from '@/redux/slices/cartSlice';
import { hydrateWishlist, selectWishlistItems } from '@/redux/slices/wishlistSlice';
import { categoryService, userService } from '@/services';
import { isAdminUser } from '@/utils/auth';
import { formatUserAddress } from '@/utils/helpers';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
      <path d="M3 9l2-6h14l2 6" />
      <path d="M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 015 1c0 2-2.5 1.75-2.5 3.5" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WishlistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
      <path d="M12 20.5l-1.1-1C6.5 15.2 3 12.1 3 8.5 3 6 5 4 7.5 4c1.7 0 3.3.9 4.1 2.3.8-1.4 2.4-2.3 4.1-2.3C18 4 20 6 20 8.5c0 3.6-3.5 6.7-7.9 11l-1.1 1z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
      <path d="M6 6h15l-1.5 9H7.5L6 6z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
    </svg>
  );
}

function HeaderIconAction({ href, onClick, label, icon, badge, scroll = true, className }) {
  const actionClass = cn('header-icon-action', className);

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={actionClass} aria-label={label}>
        <span className="relative">
          {icon}
          {badge}
        </span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link href={href} className={actionClass} scroll={scroll} aria-label={label}>
      <span className="relative">
        {icon}
        {badge}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartCount = cart?.totalItems || 0;
  const wishlistCount = wishlistItems.length;
  const adminUser = isAdminUser(user);
  const [query, setQuery] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [categories, setCategories] = useState([]);

  const signInHref = `${pathname}?auth=login`;
  const accountHref = adminUser ? '/admin' : '/dashboard';

  useEffect(() => {
    dispatch(hydrateWishlist(user?._id || null));
  }, [dispatch, user]);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!user) {
      setDeliveryAddress('');
      return;
    }

    userService
      .getProfile()
      .then(({ data }) => setDeliveryAddress(formatUserAddress(data.user?.address)))
      .catch(() => setDeliveryAddress(''));
  }, [user]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCartState());
    dispatch(hydrateWishlist(null));
    toast.success('Logged out successfully');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products');
  };

  return (
    <header className="site-header">
      <div className="site-header-top">
        <Logo />

        <form className="site-header-search" onSubmit={handleSearch} role="search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search for ""'
            className="site-header-search-input"
            aria-label="Search products"
          />
        </form>

        <div className="header-icon-actions">
          {user ? (
            <>
              <HeaderIconAction href={accountHref} label="Account" icon={<ProfileIcon />} />
              <HeaderIconAction label="Logout" icon={<LogoutIcon />} onClick={handleLogout} />
            </>
          ) : (
            <HeaderIconAction href={signInHref} label="Sign In" icon={<ProfileIcon />} scroll={false} />
          )}

          <HeaderIconAction href="/products" label="My Store" icon={<StoreIcon />} />
          <HeaderIconAction href="/#support" label="Support" icon={<SupportIcon />} />
          <HeaderIconAction
            href="/wishlist"
            label="Wishlist"
            icon={<WishlistIcon />}
            badge={wishlistCount > 0 ? <span className="cart-badge">{wishlistCount}</span> : null}
          />
          <HeaderIconAction
            href="/cart"
            label="Cart"
            icon={<CartIcon />}
            badge={cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
          />
        </div>
      </div>

      <div className="site-header-bottom">
        <nav className="site-header-nav" aria-label="Main">
          <div className="site-header-nav-links">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className={cn(
                  'site-header-nav-link',
                  pathname === `/categories/${category.slug}` && 'site-header-nav-link-active'
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <p className="site-header-delivery">
            Delivery to{' '}
            {user ? (
              deliveryAddress ? (
                <Link href="/profile" className="site-header-delivery-link">
                  {deliveryAddress}
                </Link>
              ) : (
                <Link href="/profile" className="site-header-delivery-link">
                  Add your address
                </Link>
              )
            ) : (
              <Link href={signInHref} className="site-header-delivery-link" scroll={false}>
                Sign in to set address
              </Link>
            )}
          </p>
        </nav>
      </div>
    </header>
  );
}
