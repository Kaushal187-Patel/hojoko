export const ROLES = {
  USER: 'user',
  MAIN_ADMIN: 'mainAdmin',
  SELLER_ADMIN: 'sellerAdmin',
  LEGACY_ADMIN: 'admin',
};

export const isMainAdmin = (user) =>
  user?.role === ROLES.MAIN_ADMIN || user?.role === ROLES.LEGACY_ADMIN;

export const isSellerAdmin = (user) => user?.role === ROLES.SELLER_ADMIN;

export const isPanelAdmin = (user) => isMainAdmin(user) || isSellerAdmin(user);

/** @deprecated Use isPanelAdmin or isMainAdmin */
export const isAdminUser = (user) => isPanelAdmin(user);

export const getAdminHomePath = (user) => {
  if (isMainAdmin(user)) return '/admin';
  if (isSellerAdmin(user)) return '/seller';
  return '/dashboard';
};

export const getAccountPath = (user) => getAdminHomePath(user);
