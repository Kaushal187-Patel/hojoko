'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace(`${pathname}?auth=login`);
      return;
    }

    if (adminOnly && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [adminOnly, initialized, pathname, router, user]);

  if (!initialized) {
    return <LoadingSpinner label="Checking session..." />;
  }

  if (!user || (adminOnly && user.role !== 'admin')) {
    return <LoadingSpinner label="Redirecting..." />;
  }

  return children;
}
