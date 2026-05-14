const Category = require('../models/Category');

const sortCategories = { rank: 1, createdAt: 1 };

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort(sortCategories);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

const uploadCategoryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const image = `${req.protocol}://${req.get('host')}/uploads/categories/${req.file.filename}`;
    res.status(201).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const count = await Category.countDocuments({ isActive: true });
    const category = await Category.create({ ...req.body, rank: count });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const remaining = await Category.find({ isActive: true }).sort(sortCategories);
    await Promise.all(remaining.map((item, index) => Category.findByIdAndUpdate(item._id, { rank: index })));

    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Move category up or down in display order
// @route   PATCH /api/categories/:id/reorder
const reorderCategory = async (req, res, next) => {
  try {
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ success: false, message: 'Direction must be up or down' });
    }

    const categories = await Category.find({ isActive: true }).sort(sortCategories);
    const index = categories.findIndex((item) => item._id.toString() === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= categories.length) {
      const unchanged = await Category.find({ isActive: true }).sort(sortCategories);
      return res.json({ success: true, categories: unchanged });
    }

    const reordered = [...categories];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    await Promise.all(reordered.map((item, itemIndex) => Category.findByIdAndUpdate(item._id, { rank: itemIndex })));

    const categoriesResponse = await Category.find({ isActive: true }).sort(sortCategories);
    res.json({ success: true, categories: categoriesResponse });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  uploadCategoryImage,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategory,
};
