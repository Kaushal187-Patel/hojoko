const express = require('express');
const {
  getProducts,
  getProductBySlug,
  getProductById,
  getAdminProducts,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const uploadProduct = require('../middleware/uploadProduct');

const router = express.Router();

router.get('/', getProducts);
router.get('/admin/list', protect, admin, getAdminProducts);
router.post('/upload', protect, admin, uploadProduct.single('image'), uploadProductImage);
router.get('/by-slug/:categorySlug/:productSlug', getProductBySlug);
router.patch('/:id/reorder', protect, admin, reorderProduct);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
