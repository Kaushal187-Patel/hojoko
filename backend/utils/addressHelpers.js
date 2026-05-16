const buildStreetLine = (address = {}) => {
  const parts = [address.houseNumber, address.streetLine, address.society].filter(Boolean);
  if (parts.length) return parts.join(', ');

  return address.street || '';
};

const normalizeShippingAddress = (input = {}) => {
  const street = buildStreetLine(input) || input.street || '';
  const city = (input.city || '').trim();
  const state = (input.state || '').trim();
  const zipCode = (input.pinCode || input.zipCode || '').trim();
  const country = (input.country || 'India').trim();

  return {
    houseNumber: (input.houseNumber || '').trim(),
    streetLine: (input.streetLine || '').trim(),
    society: (input.society || '').trim(),
    street,
    city,
    state,
    zipCode,
    country,
  };
};

const validateAddressPayload = (input = {}) => {
  const errors = [];
  if (!input.houseNumber?.trim()) errors.push('House / flat number is required');
  if (!input.streetLine?.trim()) errors.push('Street / area line is required');
  if (!input.society?.trim()) errors.push('Society / building name is required');
  if (!input.city?.trim()) errors.push('City is required');
  if (!input.state?.trim()) errors.push('State is required');
  if (!(input.pinCode || input.zipCode)?.trim()) errors.push('Pincode is required');
  return errors;
};

const toAddressPayload = (source = {}) => ({
  label: source.label || 'Home',
  houseNumber: source.houseNumber || '',
  streetLine: source.streetLine || source.street || '',
  society: source.society || '',
  city: source.city || '',
  state: source.state || '',
  pinCode: source.pinCode || source.zipCode || '',
  country: source.country || 'India',
});

const isValidAddressPayload = (input = {}) => validateAddressPayload(input).length === 0;

/** Drop incomplete rows saved before stricter validation. */
const pruneInvalidAddresses = (user) => {
  if (!user?.addresses?.length) return false;

  const before = user.addresses.length;
  user.addresses = user.addresses.filter((item) =>
    isValidAddressPayload({
      houseNumber: item.houseNumber,
      streetLine: item.streetLine,
      society: item.society,
      city: item.city,
      state: item.state,
      pinCode: item.pinCode,
    })
  );

  if (user.addresses.length && !user.addresses.some((item) => item.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  return user.addresses.length !== before;
};

const migrateLegacyAddress = (user) => {
  if (!user.address || typeof user.address !== 'object') return false;

  const legacy = user.address;
  const candidate = toAddressPayload(legacy);
  const hasLegacy =
    candidate.streetLine || candidate.city || candidate.state || candidate.pinCode || candidate.houseNumber;

  if (!hasLegacy || !isValidAddressPayload(candidate)) return false;

  const alreadyMigrated = user.addresses?.some(
    (item) =>
      item.houseNumber === candidate.houseNumber &&
      item.city === candidate.city &&
      item.pinCode === candidate.pinCode
  );

  if (alreadyMigrated) return false;

  user.addresses.push({
    ...candidate,
    isDefault: user.addresses.length === 0,
  });

  return true;
};

module.exports = {
  buildStreetLine,
  normalizeShippingAddress,
  validateAddressPayload,
  toAddressPayload,
  isValidAddressPayload,
  pruneInvalidAddresses,
  migrateLegacyAddress,
};
