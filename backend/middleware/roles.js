const { isMainAdmin, isSellerAdmin, isPanelAdmin } = require('../utils/roles');

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const allowed = new Set(roles);

    if (allowed.has('mainAdmin') && isMainAdmin(req.user)) {
      return next();
    }

    if (allowed.has('sellerAdmin') && isSellerAdmin(req.user)) {
      return next();
    }

    if (allowed.has('adminPanel') && isPanelAdmin(req.user)) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Access denied for this role' });
  };

const mainAdmin = authorize('mainAdmin');
const sellerAdmin = authorize('sellerAdmin');
const adminPanel = authorize('adminPanel');

module.exports = { authorize, mainAdmin, sellerAdmin, adminPanel };
