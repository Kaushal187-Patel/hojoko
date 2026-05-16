const User = require('../models/User');
const {
  normalizeShippingAddress,
  validateAddressPayload,
  migrateLegacyAddress,
  pruneInvalidAddresses,
} = require('../utils/addressHelpers');

const getUserWithAddresses = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) return null;

  const migrated = migrateLegacyAddress(user);
  const pruned = pruneInvalidAddresses(user);

  if (migrated || pruned || user.isModified('addresses')) {
    await user.save();
  }

  return user;
};

const clearOtherDefaults = (addresses, keepId) => {
  addresses.forEach((item) => {
    item.isDefault = item._id.toString() === keepId.toString();
  });
};

// @desc    List saved addresses
// @route   GET /api/users/addresses
const getAddresses = async (req, res, next) => {
  try {
    const user = await getUserWithAddresses(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Add saved address
// @route   POST /api/users/addresses
const createAddress = async (req, res, next) => {
  try {
    const errors = validateAddressPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const user = await getUserWithAddresses(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const normalized = normalizeShippingAddress(req.body);
    const makeDefault = req.body.isDefault === true || user.addresses.length === 0;

    if (makeDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    user.addresses.push({
      label: (req.body.label || 'Home').trim(),
      houseNumber: normalized.houseNumber,
      streetLine: normalized.streetLine,
      society: normalized.society,
      city: normalized.city,
      state: normalized.state,
      pinCode: normalized.zipCode,
      country: normalized.country,
      isDefault: makeDefault,
    });

    await user.save();

    const created = user.addresses[user.addresses.length - 1];
    res.status(201).json({ success: true, address: created, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Update saved address
// @route   PUT /api/users/addresses/:id
const updateAddress = async (req, res, next) => {
  try {
    const errors = validateAddressPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const user = await getUserWithAddresses(req.user._id);
    const item = user?.addresses.id(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const normalized = normalizeShippingAddress(req.body);
    item.label = (req.body.label || item.label || 'Home').trim();
    item.houseNumber = normalized.houseNumber;
    item.streetLine = normalized.streetLine;
    item.society = normalized.society;
    item.city = normalized.city;
    item.state = normalized.state;
    item.pinCode = normalized.zipCode;
    item.country = normalized.country;

    if (req.body.isDefault === true) {
      clearOtherDefaults(user.addresses, item._id);
    }

    await user.save();
    res.json({ success: true, address: item, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete saved address
// @route   DELETE /api/users/addresses/:id
const deleteAddress = async (req, res, next) => {
  try {
    const user = await getUserWithAddresses(req.user._id);
    const item = user?.addresses.id(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const wasDefault = item.isDefault;
    item.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default address
// @route   PATCH /api/users/addresses/:id/default
const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await getUserWithAddresses(req.user._id);
    const item = user?.addresses.id(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    clearOtherDefaults(user.addresses, item._id);
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
