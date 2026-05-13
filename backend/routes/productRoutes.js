const express = require('express');
const {
  getProducts,
  getProductById,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const uploadProduct = require('../middleware/uploadProduct');

const router = express.Router();

router.get('/', getProducts);
router.post('/upload', protect, admin, uploadProduct.single('image'), uploadProductImage);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
