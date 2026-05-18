'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getAdminHomePath, isMainAdmin, isPanelAdmin, isSellerAdmin } from '@/utils/auth';

function userHasAccess(user, { mainAdminOnly, sellerOnly, adminPanel, adminOnly }) {
  if (!user) return false;

  if (mainAdminOnly) return isMainAdmin(user);
  if (sellerOnly) return isSellerAdmin(user);
  if (adminPanel || adminOnly) return isPanelAdmin(user);

  return true;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
  mainAdminOnly = false,
  sellerOnly = false,
  adminPanel = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized } = useSelector((state) => state.auth);

  const needsRole = mainAdminOnly || sellerOnly || adminPanel || adminOnly;
  const allowed = userHasAccess(user, { mainAdminOnly, sellerOnly, adminPanel, adminOnly });

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace(`${pathname}?auth=login`);
      return;
    }

    if (needsRole && !allowed) {
      router.replace(getAdminHomePath(user));
    }
  }, [allowed, initialized, needsRole, pathname, router, user]);

  if (!initialized) {
    return <LoadingSpinner label="Checking session..." />;
  }

  if (!user || (needsRole && !allowed)) {
    return <LoadingSpinner label="Redirecting..." />;
  }

  return children;
}
