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
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo linked={false} />
          <p className="mt-4 max-w-sm text-sm leading-7 text-stone-600">{SITE_TAGLINE}</p>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <p className="eyebrow">{title}</p>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-700 transition hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-200">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} HOZOKO</p>
          <p>{SITE_TAGLINE}</p>
        </div>
      </div>
    </footer>
  );
}
