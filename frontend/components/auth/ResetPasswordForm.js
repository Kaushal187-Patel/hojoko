'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import PasswordStrength from '@/components/PasswordStrength';
import PasswordInput from '@/components/auth/PasswordInput';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { fetchCart } from '@/redux/slices/cartSlice';
import { authService } from '@/services';
import { isAdminUser } from '@/utils/auth';
import { validatePasswordPair } from '@/utils/passwordValidation';
import { SITE_TAGLINE } from '@/utils/brand';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const validation = validatePasswordPair(form.password, form.confirmPassword);
    if (!validation.valid) {
      setFormError(validation.errors[0]);
      toast.error(validation.errors[0]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.resetPassword({
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success(data.message || 'Password updated');
      await dispatch(fetchCurrentUser());
      await dispatch(fetchCart());
      const user = data.user;
      router.push(user && isAdminUser(user) ? '/admin' : '/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-form border-0 bg-transparent p-0 shadow-none">
        <h1 className="text-2xl font-bold">Invalid link</h1>
        <p className="mt-3 body-muted">This reset link is missing a token. Request a new link from the login page.</p>
        <Link
          href="/forgot-password"
          className="btn-primary mt-6 inline-flex w-full items-center justify-center no-underline"
        >
          Request reset link
        </Link>
        <p className="mt-4 text-center body-muted">
          <Link href="/login" className="brand-link">
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form border-0 bg-transparent p-0 shadow-none">
      <div>
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="mt-1 body-muted">{SITE_TAGLINE}</p>
      </div>

      <PasswordInput
        placeholder="New password"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        autoComplete="new-password"
        required
      />
      <PasswordInput
        placeholder="Confirm new password"
        value={form.confirmPassword}
        onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
        autoComplete="new-password"
        required
      />
      {(form.password || form.confirmPassword) && formError ? (
        <p className="text-sm text-red-600">{formError}</p>
      ) : null}
      <PasswordStrength password={form.password} confirmPassword={form.confirmPassword} />

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Updating…' : 'Update password'}
      </button>

      <p className="text-center body-muted">
        <Link href="/login" className="brand-link">
          Back to login
        </Link>
      </p>
    </form>
  );
}
