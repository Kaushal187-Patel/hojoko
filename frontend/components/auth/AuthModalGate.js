'use client';

import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

function AuthModalContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const auth = searchParams.get('auth');

  if (auth !== 'login' && auth !== 'signup') {
    return null;
  }

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('auth');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <AuthModal onClose={handleClose}>
      {auth === 'signup' ? <SignupForm /> : <LoginForm />}
    </AuthModal>
  );
}

export default function AuthModalGate() {
  return (
    <Suspense fallback={null}>
      <AuthModalContent />
    </Suspense>
  );
}
