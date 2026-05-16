'use client';

import Link from 'next/link';
import useClientAuth from '@/hooks/useClientAuth';
import Logo from '@/components/Logo';
import { SITE_TAGLINE } from '@/utils/brand';
import { isAdminUser } from '@/utils/auth';

function getFooterLinks(user) {
  const navigate = [{ href: '/products', label: 'Shop' }];

  if (user) {
    navigate.push(
      { href: '/orders', label: 'Orders' },
      { href: isAdminUser(user) ? '/admin' : '/dashboard', label: 'Account' },
      { href: '/profile', label: 'Profile' }
    );
  }

  const support = [
    { href: '/support', label: 'Help center' },
    { href: '/cart', label: 'Cart' },
  ];

  if (user) {
    support.push({ href: '/wishlist', label: 'Wishlist' });
  } else {
    support.push({ href: '?auth=login', label: 'Sign in' });
  }

  return { Navigate: navigate, Support: support };
}

export default function Footer() {
  const { user } = useClientAuth();
  const footerLinks = getFooterLinks(user);

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="col-span-2 md:col-span-1">
          <Logo linked={false} />
          <p className="body-copy mt-4 max-w-sm">{SITE_TAGLINE}</p>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <p className="eyebrow">{title}</p>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={`${title}-${link.href}`}>
                  <Link href={link.href} className="footer-link" scroll={link.href.startsWith('?') ? false : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="site-footer-bar">
        <div className="site-footer-bar-inner">
          <p>© {new Date().getFullYear()} HOZOKO</p>
          <p>{SITE_TAGLINE}</p>
        </div>
      </div>
    </footer>
  );
}
