'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loginUser } from '@/redux/slices/authSlice';
import { fetchCart } from '@/redux/slices/cartSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back');
      await dispatch(fetchCart());
      router.push(result.payload.role === 'admin' ? '/admin' : '/dashboard');
      return;
    }

    toast.error(result.payload || 'Login failed');
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-1 text-sm text-slate-500">Access your account to shop and track orders.</p>
        </div>

        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-slate-500">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-brand-600">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
