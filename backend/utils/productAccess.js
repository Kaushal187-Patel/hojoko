const { isMainAdmin, isSellerAdmin } = require('./roles');

const getProductSellerId = (product) => product?.seller || product?.createdBy;

const userOwnsProduct = (product, user) => {
  const sellerId = getProductSellerId(product);
  return sellerId && sellerId.toString() === user._id.toString();
};

const canAccessProduct = (product, user) => {
  if (!product || !user) {
    return false;
  }

  if (isMainAdmin(user)) {
    return true;
  }

  if (isSellerAdmin(user)) {
    return userOwnsProduct(product, user);
  }

  return false;
};

module.exports = { getProductSellerId, userOwnsProduct, canAccessProduct };
