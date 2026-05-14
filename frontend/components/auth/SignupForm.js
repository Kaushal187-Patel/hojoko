'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PasswordStrength from '@/components/PasswordStrength';
import PasswordInput from '@/components/auth/PasswordInput';
import { signupUser } from '@/redux/slices/authSlice';
import { fetchCart } from '@/redux/slices/cartSlice';
import { validatePasswordPair } from '@/utils/passwordValidation';
import { SITE_TAGLINE } from '@/utils/brand';

export default function SignupForm() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const validation = validatePasswordPair(form.password, form.confirmPassword);
    if (!validation.valid) {
      setFormError(validation.errors[0]);
      toast.error(validation.errors[0]);
      return;
    }

    const result = await dispatch(
      signupUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
    );

    if (signupUser.fulfilled.match(result)) {
      toast.success('Account created successfully');
      await dispatch(fetchCart());
      router.push('/dashboard');
      router.refresh();
      return;
    }

    toast.error(result.payload || 'Signup failed');
    setFormError(result.payload || 'Signup failed');
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form border-0 bg-transparent p-0 shadow-none">
      <div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 body-muted">{SITE_TAGLINE}</p>
      </div>

      <input
        className="input-field"
        placeholder="Full name"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        required
      />
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
        placeholder="Phone"
        value={form.phone}
        onChange={(event) => setForm({ ...form, phone: event.target.value })}
      />
      <PasswordInput
        placeholder="Password"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        autoComplete="new-password"
        required
      />
      <PasswordInput
        placeholder="Re-enter password"
        value={form.confirmPassword}
        onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
        autoComplete="new-password"
        required
      />

      <PasswordStrength password={form.password} />

      {form.confirmPassword && form.password !== form.confirmPassword && (
        <p className="danger-text">Passwords do not match.</p>
      )}

      {formError && <p className="danger-text">{formError}</p>}

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign up'}
      </button>

      <p className="text-center body-muted">
        Already have an account?{' '}
        <Link href={`${pathname}?auth=login`} className="brand-link" scroll={false}>
          Login
        </Link>
      </p>
    </form>
  );
}
