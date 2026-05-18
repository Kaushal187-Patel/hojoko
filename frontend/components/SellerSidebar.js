'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

const links = [
  { href: '/seller', label: 'Overview' },
  { href: '/seller/products', label: 'My products' },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card h-fit space-y-2 p-4">
      <p className="admin-nav-label">Seller Panel</p>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn('admin-nav-link', pathname === link.href ? 'admin-nav-active' : 'admin-nav-idle')}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
