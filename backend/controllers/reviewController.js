const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const syncProductRating = require('../utils/syncProductRating');

const userHasPurchased = async (userId, productId) =>
  Order.findOne({
    user: userId,
    isPaid: true,
    orderItems: { $elemMatch: { product: productId } },
  });

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
const getProductReviews = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId, isVisible: true })
        .populate('user', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ product: req.params.productId, isVisible: true }),
    ]);

    res.json({
      success: true,
      reviews,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user can review a product
// @route   GET /api/reviews/eligibility/:productId
const getReviewEligibility = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: req.params.productId,
    });

    const purchase = await userHasPurchased(req.user._id, req.params.productId);

    res.json({
      success: true,
      canReview: Boolean(purchase) && !existingReview,
      hasReviewed: Boolean(existingReview),
      existingReview,
      hasPurchased: Boolean(purchase),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment, orderId } = req.body;

    if (!productId || !rating || !comment?.trim()) {
      return res.status(400).json({ success: false, message: 'Product, rating, and comment are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existingReview = await Review.findOne({ user: req.user._id, product: productId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const purchase = await userHasPurchased(req.user._id, productId);
    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: 'Only customers who purchased this product can leave a review',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId || purchase._id,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const stats = await syncProductRating(productId);
    const populated = await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      review: populated,
      productRating: stats,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }
    next(error);
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    if (req.body.rating) review.rating = Number(req.body.rating);
    if (req.body.comment) review.comment = req.body.comment.trim();

    await review.save();
    const stats = await syncProductRating(review.product);
    const populated = await review.populate('user', 'name');

    res.json({ success: true, review: populated, productRating: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (owner or admin)
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'mainAdmin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();
    const stats = await syncProductRating(productId);

    res.json({ success: true, message: 'Review removed', productRating: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  getReviewEligibility,
  createReview,
  updateReview,
  deleteReview,
};
