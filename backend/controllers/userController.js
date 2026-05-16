const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
const getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
