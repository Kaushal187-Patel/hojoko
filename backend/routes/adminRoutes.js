const express = require('express');
const {
  getAnalytics,
  createSeller,
  getSellers,
  getUsers,
  updateUser,
  deleteUser,
  getPayments,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { mainAdmin } = require('../middleware/roles');

const router = express.Router();

router.use(protect);

router.get('/analytics', admin, getAnalytics);

router.get('/sellers', mainAdmin, getSellers);
router.post('/sellers', mainAdmin, createSeller);

router.get('/users', mainAdmin, getUsers);
router.put('/users/:id', mainAdmin, updateUser);
router.delete('/users/:id', mainAdmin, deleteUser);

router.get('/payments', mainAdmin, getPayments);

module.exports = router;
