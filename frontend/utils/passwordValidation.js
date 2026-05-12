export const passwordRules = [
  {
    key: 'length',
    message: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    key: 'lowercase',
    message: 'At least one lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    key: 'uppercase',
    message: 'At least one uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: 'number',
    message: 'At least one number',
    test: (password) => /\d/.test(password),
  },
  {
    key: 'special',
    message: 'At least one special character',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export const getPasswordRuleStatus = (password = '') =>
  passwordRules.map((rule) => ({
    key: rule.key,
    message: rule.message,
    passed: rule.test(password),
  }));

export const validatePassword = (password = '') => {
  const failedRules = passwordRules.filter((rule) => !rule.test(password));

  return {
    valid: failedRules.length === 0,
    errors: failedRules.map((rule) => rule.message),
    rules: getPasswordRuleStatus(password),
  };
};

export const validatePasswordPair = (password = '', confirmPassword = '') => {
  if (!password || !confirmPassword) {
    return {
      valid: false,
      errors: ['Password and confirm password are required'],
      rules: getPasswordRuleStatus(password),
    };
  }

  if (password !== confirmPassword) {
    return {
      valid: false,
      errors: ['Passwords do not match'],
      rules: getPasswordRuleStatus(password),
    };
  }

  return validatePassword(password);
};
