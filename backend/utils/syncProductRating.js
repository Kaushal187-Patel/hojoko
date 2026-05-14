const Review = require('../models/Review');
const Product = require('../models/Product');

const syncProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isVisible: true }).select('rating');
  const numReviews = reviews.length;
  const rating = numReviews
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews) * 10) / 10
    : 0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
  return { rating, numReviews };
};

module.exports = syncProductRating;
