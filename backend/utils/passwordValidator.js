const passwordRules = [
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

const validatePassword = (password = '') => {
  const failedRules = passwordRules.filter((rule) => !rule.test(password));

  return {
    valid: failedRules.length === 0,
    errors: failedRules.map((rule) => rule.message),
    rules: passwordRules.map((rule) => ({
      key: rule.key,
      message: rule.message,
      passed: rule.test(password),
    })),
  };
};

const validatePasswordPair = (password = '', confirmPassword = '') => {
  if (!password || !confirmPassword) {
    return {
      valid: false,
      errors: ['Password and confirm password are required'],
      rules: validatePassword(password).rules,
    };
  }

  if (password !== confirmPassword) {
    return {
      valid: false,
      errors: ['Passwords do not match'],
      rules: validatePassword(password).rules,
    };
  }

  return validatePassword(password);
};

module.exports = {
  passwordRules,
  validatePassword,
  validatePasswordPair,
};
