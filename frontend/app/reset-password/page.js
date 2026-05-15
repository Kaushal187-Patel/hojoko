import { Suspense } from 'react';
import AuthLayout from '@/components/ui/AuthLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset password — HOZOKO',
  description: 'Choose a new password for your HOZOKO account.',
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<p className="body-muted p-6 text-center">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
