'use client';

import { getPasswordRuleStatus } from '@/utils/passwordValidation';
import { cn } from '@/utils/cn';

export default function PasswordStrength({ password = '' }) {
  const rules = getPasswordRuleStatus(password);

  return (
    <div className="surface-panel space-y-2">
      <p className="field-label">Password requirements</p>
      <ul className="space-y-2">
        {rules.map((rule) => (
          <li key={rule.key} className={cn('text-sm', rule.passed ? 'text-pass' : 'text-fail')}>
            {rule.passed ? '✓' : '○'} {rule.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
