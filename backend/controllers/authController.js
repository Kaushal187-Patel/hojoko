const crypto = require('crypto');
const User = require('../models/User');
const { sendTokenCookie, clearTokenCookie } = require('../utils/generateToken');
const { validatePasswordPair } = require('../utils/passwordValidator');
const { sendPasswordResetEmail } = require('../utils/sendPasswordResetEmail');

// @desc    Register user
// @route   POST /api/auth/signup
const signup = async (req, res, next) => {
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
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, phone });

    sendTokenCookie(res, user._id);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    sendTokenCookie(res, user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

const FORGOT_PASSWORD_MESSAGE =
  'If an account exists for that email, you will receive password reset instructions shortly.';

// @desc    Request password reset email / token
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const emailRaw = req.body?.email;
    if (!emailRaw || typeof emailRaw !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const email = emailRaw.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.json({ success: true, message: FORGOT_PASSWORD_MESSAGE });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientBase = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
    const resetUrl = `${clientBase}/reset-password?token=${rawToken}`;

    const sent = await sendPasswordResetEmail(user.email, resetUrl);

    if (process.env.NODE_ENV !== 'production') {
      console.log('[forgot-password] Local — paste reset URL:', resetUrl);
      if (!sent) {
        console.warn('[forgot-password] Email did not send. Set RESEND_API_KEY in backend/.env.');
      }
    } else if (!sent) {
      console.error(
        '[forgot-password] Could not send email. Set RESEND_API_KEY (+ RESEND_FROM) on the backend, or configure SMTP_* as fallback.'
      );
    }

    return res.json({ success: true, message: FORGOT_PASSWORD_MESSAGE });
  } catch (error) {
    next(error);
  }
};

// @desc    Set new password with reset token
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, message: 'Reset token is required' });
    }

    const passwordValidation = validatePasswordPair(password, confirmPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.errors[0],
        errors: passwordValidation.errors,
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link. Please request a new one.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenCookie(res, user._id);

    res.json({
      success: true,
      message: 'Password updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, logout, getMe, forgotPassword, resetPassword };
