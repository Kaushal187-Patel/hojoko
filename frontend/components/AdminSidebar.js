'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

const mainAdminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/hero', label: 'Homepage hero' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/sellers', label: 'Sellers' },
  { href: '/admin/users', label: 'Users' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card h-fit space-y-2 p-4">
      <p className="admin-nav-label">Main Admin</p>
      {mainAdminLinks.map((link) => (
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
