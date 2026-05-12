const express = require('express');
const {
  getAnalytics,
  getUsers,
  updateUser,
  deleteUser,
  getPayments,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

router.use(protect, admin);

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/payments', getPayments);

module.exports = router;
