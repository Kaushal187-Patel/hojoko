'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const { user, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (adminOnly && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [adminOnly, initialized, router, user]);

  if (!initialized) {
    return <LoadingSpinner label="Checking session..." />;
  }

  if (!user || (adminOnly && user.role !== 'admin')) {
    return <LoadingSpinner label="Redirecting..." />;
  }

  return children;
}
