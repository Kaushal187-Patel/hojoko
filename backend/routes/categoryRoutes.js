const express = require('express');
const {
  getCategories,
  uploadCategoryImage,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const uploadCategory = require('../middleware/uploadCategory');

const router = express.Router();

router.get('/', getCategories);
router.post('/upload', protect, admin, uploadCategory.single('image'), uploadCategoryImage);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
