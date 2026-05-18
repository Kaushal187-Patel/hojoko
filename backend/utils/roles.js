const ROLES = {
  USER: 'user',
  MAIN_ADMIN: 'mainAdmin',
  SELLER_ADMIN: 'sellerAdmin',
  LEGACY_ADMIN: 'admin',
};

const isMainAdmin = (user) =>
  user?.role === ROLES.MAIN_ADMIN || user?.role === ROLES.LEGACY_ADMIN;

const isSellerAdmin = (user) => user?.role === ROLES.SELLER_ADMIN;

const isPanelAdmin = (user) => isMainAdmin(user) || isSellerAdmin(user);

const canManageProducts = (user) => isPanelAdmin(user);

module.exports = {
  ROLES,
  isMainAdmin,
  isSellerAdmin,
  isPanelAdmin,
  canManageProducts,
};
