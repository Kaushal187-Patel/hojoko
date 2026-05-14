'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loginUser } from '@/redux/slices/authSlice';
import { fetchCart } from '@/redux/slices/cartSlice';
import PasswordInput from '@/components/auth/PasswordInput';
import { isAdminUser } from '@/utils/auth';
import { SITE_TAGLINE } from '@/utils/brand';

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back');
      await dispatch(fetchCart());
      router.push(isAdminUser(result.payload) ? '/admin' : '/dashboard');
      router.refresh();
      return;
    }

    toast.error(result.payload || 'Login failed');
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form border-0 bg-transparent p-0 shadow-none">
      <div>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 body-muted">{SITE_TAGLINE}</p>
      </div>

      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        required
      />
      <PasswordInput
        placeholder="Password"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        autoComplete="current-password"
        required
      />

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Login'}
      </button>

      <p className="text-center body-muted">
        New here?{' '}
        <Link href={`${pathname}?auth=signup`} className="brand-link" scroll={false}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
