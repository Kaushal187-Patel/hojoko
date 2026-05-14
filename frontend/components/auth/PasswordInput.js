'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';

function EyeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
      <path d="M6.7 6.7C4.6 8.1 3 10 2 12s3.5 7 10 7c1.8 0 3.4-.4 4.8-1.1" />
      <path d="M17.3 17.3c2.1-1.4 3.7-3.3 4.7-5.3" />
    </svg>
  );
}

export default function PasswordInput({ className, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('input-field password-field-input', className)}
      />
      <button
        type="button"
        className="password-field-toggle"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}
