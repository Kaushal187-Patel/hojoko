const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const razorpay = require('../config/razorpay');
const { normalizeShippingAddress, validateAddressPayload } = require('../utils/addressHelpers');

// @desc    Get user orders
// @route   GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images')
      .sort('-createdAt');

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay order and pending DB order
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const addressErrors = validateAddressPayload(shippingAddress);
    if (addressErrors.length) {
      return res.status(400).json({ success: false, message: addressErrors[0], errors: addressErrors });
    }

    const normalizedShipping = normalizeShippingAddress(shippingAddress);

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    for (const item of cart.items) {
      if (!item.product || item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product?.name || 'a product'}`,
        });
      }
    }

    const itemsPrice = cart.totalAmount;
    const shippingPrice = itemsPrice > 999 ? 0 : 49;
    const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || '',
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: normalizedShipping,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: `order_${order._id}`,
    });

    await Payment.create({
      user: req.user._id,
      order: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPrice,
      status: 'created',
    });

    order.paymentResult = { razorpayOrderId: razorpayOrder.id, status: 'created' };
    await order.save();

    res.status(201).json({
      success: true,
      order,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment and finalize order
// @route   POST /api/orders/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: 'Stock unavailable during payment' });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'processing';
    order.paymentResult = {
      id: razorpayPaymentId,
      status: 'captured',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };
    await order.save();

    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'captured',
      }
    );

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalAmount: 0, totalItems: 0 });

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status || order.status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  verifyPayment,
  updateOrderStatus,
};
