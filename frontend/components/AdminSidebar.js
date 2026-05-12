'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card h-fit space-y-2 p-4">
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Admin Panel</p>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block rounded-xl px-3 py-2 text-sm font-medium ${
            pathname === link.href ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
