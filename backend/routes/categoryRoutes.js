const express = require('express');
const {
  getCategories,
  uploadCategoryImage,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { mainAdmin } = require('../middleware/roles');
const uploadCategory = require('../middleware/uploadCategory');

const router = express.Router();

router.get('/', getCategories);
router.post('/upload', protect, mainAdmin, uploadCategory.single('image'), uploadCategoryImage);
router.post('/', protect, mainAdmin, createCategory);
router.put('/:id', protect, mainAdmin, updateCategory);
router.patch('/:id/reorder', protect, mainAdmin, reorderCategory);
router.delete('/:id', protect, mainAdmin, deleteCategory);

module.exports = router;
