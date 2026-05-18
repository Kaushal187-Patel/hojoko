const { isPanelAdmin } = require('../utils/roles');

/** Allows main admin, seller admin, and legacy `admin` role. */
const admin = (req, res, next) => {
  if (req.user && isPanelAdmin(req.user)) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Admin access required' });
};

module.exports = { admin };
