const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  verifyPayment,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { mainAdmin } = require('../middleware/roles');

const router = express.Router();

router.use(protect);

router.get('/', getOrders);
router.post('/', createOrder);
router.post('/verify', verifyPayment);
router.get('/:id', getOrderById);
router.put('/:id', mainAdmin, updateOrderStatus);

module.exports = router;
