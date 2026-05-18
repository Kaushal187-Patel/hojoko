const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { validatePasswordPair } = require('../utils/passwordValidator');
const { ROLES, isMainAdmin, isSellerAdmin } = require('../utils/roles');

const isProtectedAdminRole = (role) =>
  role === ROLES.MAIN_ADMIN || role === ROLES.LEGACY_ADMIN || role === ROLES.SELLER_ADMIN;

// @desc    Dashboard analytics (main admin = global, seller = own products)
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    if (isSellerAdmin(req.user)) {
      const sellerFilter = { $or: [{ seller: req.user._id }, { createdBy: req.user._id }] };
      const [totalProducts, lowStock, recentProducts] = await Promise.all([
        Product.countDocuments(sellerFilter),
        Product.find({ ...sellerFilter, stock: { $lte: 5 }, isActive: true })
          .select('name stock price')
          .limit(10),
        Product.find(sellerFilter).select('name price stock createdAt').sort('-createdAt').limit(5),
      ]);

      return res.json({
        success: true,
        analytics: {
          scope: 'seller',
          totalProducts,
          lowStock,
          recentProducts,
        },
      });
    }

    const [totalUsers, totalSellers, totalProducts, totalOrders, revenueAgg, recentOrders, lowStock] =
      await Promise.all([
        User.countDocuments({ role: ROLES.USER }),
        User.countDocuments({ role: ROLES.SELLER_ADMIN }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { isPaid: true } },
          { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        ]),
        Order.find().populate('user', 'name email').sort('-createdAt').limit(5),
        Product.find({ stock: { $lte: 5 }, isActive: true }).select('name stock price').limit(10),
      ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      success: true,
      analytics: {
        scope: 'main',
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        lowStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create seller account (main admin only)
// @route   POST /api/admin/sellers
const createSeller = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and confirm password are required',
      });
    }

    const passwordValidation = validatePasswordPair(password, confirmPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.errors[0],
        errors: passwordValidation.errors,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    const seller = await User.create({
      name,
      email,
      password,
      phone,
      role: ROLES.SELLER_ADMIN,
      isActive: true,
      createdByAdmin: req.user._id,
    });

    res.status(201).json({
      success: true,
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
        phone: seller.phone,
        isActive: seller.isActive,
        createdAt: seller.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List seller accounts
// @route   GET /api/admin/sellers
const getSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({ role: ROLES.SELLER_ADMIN })
      .select('-password')
      .populate('createdByAdmin', 'name email')
      .sort('-createdAt');

    res.json({ success: true, sellers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status/role
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isMainAdmin(target) && req.body.isActive === false) {
      return res.status(400).json({ success: false, message: 'Main admin accounts cannot be deactivated' });
    }

    if (req.body.role && req.body.role !== target.role) {
      if (isMainAdmin(target)) {
        return res.status(400).json({ success: false, message: 'Main admin role cannot be changed' });
      }
      if (![ROLES.USER, ROLES.SELLER_ADMIN].includes(req.body.role)) {
        return res.status(400).json({ success: false, message: 'Invalid role for this account' });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isProtectedAdminRole(target.role)) {
      return res.status(400).json({ success: false, message: 'Admin accounts cannot be deleted' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('order')
      .sort('-createdAt');

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  createSeller,
  getSellers,
  getUsers,
  updateUser,
  deleteUser,
  getPayments,
};
