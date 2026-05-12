'use client';

import { getPasswordRuleStatus } from '@/utils/passwordValidation';

export default function PasswordStrength({ password = '' }) {
  const rules = getPasswordRuleStatus(password);

  return (
    <div className="space-y-2 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-600">Password requirements</p>
      <ul className="space-y-2">
        {rules.map((rule) => (
          <li key={rule.key} className={`text-sm ${rule.passed ? 'text-emerald-700' : 'text-stone-500'}`}>
            {rule.passed ? '✓' : '○'} {rule.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
