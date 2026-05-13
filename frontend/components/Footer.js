import Link from 'next/link';
import Logo from '@/components/Logo';
import { SITE_TAGLINE } from '@/utils/brand';

const footerLinks = {
  Navigate: [
    { href: '/products', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/dashboard', label: 'Account' },
    { href: '/profile', label: 'Profile' },
  ],
  Support: [
    { href: '/checkout', label: 'Checkout' },
    { href: '/cart', label: 'Cart' },
    { href: '/login', label: 'Sign in' },
    { href: '/signup', label: 'Create account' },
  ],
};

export default function Footer() {
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
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
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
