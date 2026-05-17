'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useClientAuth from '@/hooks/useClientAuth';
import Logo from '@/components/Logo';
import { SITE_TAGLINE, SOCIAL_LINKS, SUPPORT_EMAIL } from '@/utils/brand';
import { isAdminUser } from '@/utils/auth';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 8.5h3v11h-3v-11zm1.5-4.5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM10 8.5h2.9v1.5h.05c.4-.75 1.4-1.55 2.9-1.55 3.1 0 3.65 2.05 3.65 4.7v6.4h-3.1v-5.65c0-1.35-.05-3.1-1.9-3.1-1.9 0-2.2 1.5-2.2 3v5.75H10V8.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8.5h2.5V5.5H14c-2.2 0-3.5 1.35-3.5 3.65V11H8v3h2.5v8.5H14V14h3.2l.5-3H14V9.35c0-.85.15-1.85 1.65-1.85z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  email: MailIcon,
};

function getFooterLinks(user, signInHref) {
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
    support.push({ href: signInHref, label: 'Sign in' });
  }

  return { Navigate: navigate, Support: support };
}

export default function Footer() {
  const pathname = usePathname();
  const { user } = useClientAuth();
  const signInHref = `${pathname}?auth=login`;
  const footerLinks = getFooterLinks(user, signInHref);

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="col-span-2 md:col-span-1">
          <Logo linked={false} />
          <p className="body-copy mt-4 max-w-sm">{SITE_TAGLINE}</p>

          <p className="eyebrow mt-6">Connect</p>
          <div className="site-footer-social" role="list" aria-label="Social and contact links">
            {SOCIAL_LINKS.map((item) => {
              const Icon = SOCIAL_ICONS[item.id];
              const external = item.id !== 'email';

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="site-footer-social-link"
                  aria-label={item.label}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  role="listitem"
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          <a href={`mailto:${SUPPORT_EMAIL}`} className="site-footer-email">
            {SUPPORT_EMAIL}
          </a>
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
