'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authService } from '@/services';
import { SITE_TAGLINE } from '@/utils/brand';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword({ email });
      toast.success(data.message || 'Check your email');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-form border-0 bg-transparent p-0 shadow-none">
        <div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-3 body-muted">
            If an account exists for <span className="font-medium text-ink">{email}</span>, you will receive a link to
            reset your password. The link expires in one hour.
          </p>
        </div>
        <Link href="/login" className="btn-secondary mt-6 inline-flex w-full items-center justify-center no-underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form border-0 bg-transparent p-0 shadow-none">
      <div>
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-1 body-muted">{SITE_TAGLINE}</p>
        <p className="mt-3 text-sm body-muted">Enter your email and we will send you a reset link if an account exists.</p>
      </div>

      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        autoComplete="email"
      />

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="text-center body-muted">
        <Link href="/login" className="brand-link">
          Back to login
        </Link>
      </p>
    </form>
  );
}
