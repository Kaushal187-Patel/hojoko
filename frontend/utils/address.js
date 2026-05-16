export const SELECTED_ADDRESS_KEY = 'hozoko_selected_address_id';

export const emptyAddressForm = () => ({
  label: 'Home',
  houseNumber: '',
  streetLine: '',
  society: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
  isDefault: false,
});

export const buildStreetLine = (address = {}) => {
  const parts = [address.houseNumber, address.streetLine, address.society].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return address.street || '';
};

export const formatSavedAddress = (address) => {
  if (!address) return '';

  const line1 = buildStreetLine(address);
  const line2 = [address.city, address.state, address.pinCode || address.zipCode, address.country]
    .filter(Boolean)
    .join(', ');

  return [line1, line2].filter(Boolean).join(' — ');
};

export const formatSavedAddressShort = (address) => {
  if (!address) return '';
  const parts = [
    address.houseNumber,
    address.society,
    address.city,
    address.pinCode || address.zipCode,
  ].filter(Boolean);
  return parts.join(', ');
};

export const addressToShippingPayload = (address) => ({
  houseNumber: address.houseNumber || '',
  streetLine: address.streetLine || '',
  society: address.society || '',
  street: buildStreetLine(address),
  city: address.city || '',
  state: address.state || '',
  zipCode: address.pinCode || address.zipCode || '',
  country: address.country || 'India',
});

export const getDefaultAddress = (addresses = []) => {
  if (!addresses.length) return null;
  return addresses.find((item) => item.isDefault) || addresses[0];
};

export const getStoredSelectedAddressId = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SELECTED_ADDRESS_KEY);
};

export const setStoredSelectedAddressId = (id) => {
  if (typeof window === 'undefined') return;
  if (id) {
    window.localStorage.setItem(SELECTED_ADDRESS_KEY, id);
  } else {
    window.localStorage.removeItem(SELECTED_ADDRESS_KEY);
  }
};

export const resolveSelectedAddress = (addresses = []) => {
  if (!addresses.length) return null;

  const storedId = getStoredSelectedAddressId();
  if (storedId) {
    const match = addresses.find((item) => item._id === storedId);
    if (match) return match;
  }

  return getDefaultAddress(addresses);
};
