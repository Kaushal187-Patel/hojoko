const Product = require('../models/Product');
const Category = require('../models/Category');
const { generateUniqueSlug } = require('../utils/slug');

const ensureProductSlug = async (product) => {
  if (!product || product.slug) {
    return product;
  }

  product.slug = await generateUniqueSlug(Product, product.name, product._id);
  await product.save();
  return product;
};

const sortProducts = { rank: 1, createdAt: 1 };

const getSortOption = (sortKey) => {
  if (!sortKey || sortKey === 'rank') {
    return sortProducts;
  }

  return sortKey;
};

// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }

    if (req.query.categoryId) {
      query.category = req.query.categoryId;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const sort = getSortOption(req.query.sort);

    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    await Promise.all(
      products
        .filter((product) => !product.slug)
        .map(async (product) => {
          product.slug = await generateUniqueSlug(Product, product.name, product._id);
          await product.save();
        })
    );

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by category slug and product slug
// @route   GET /api/products/by-slug/:categorySlug/:productSlug
const getProductBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug, isActive: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findOne({
      slug: req.params.productSlug,
      category: category._id,
      isActive: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await ensureProductSlug(product);

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const image = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    res.status(201).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { rating, numReviews, ...productData } = req.body;
    const count = await Product.countDocuments({ isActive: true, category: productData.category });
    const product = await Product.create({
      ...productData,
      rank: count,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { rating, numReviews, ...productData } = req.body;
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (productData.category && productData.category.toString() !== existing.category.toString()) {
      const count = await Product.countDocuments({ isActive: true, category: productData.category });
      productData.rank = count;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const remaining = await Product.find({ isActive: true, category: product.category }).sort(sortProducts);
    await Promise.all(remaining.map((item, index) => Product.findByIdAndUpdate(item._id, { rank: index })));

    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

const reorderProduct = async (req, res, next) => {
  try {
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ success: false, message: 'Direction must be up or down' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const products = await Product.find({ isActive: true, category: product.category }).sort(sortProducts);
    const index = products.findIndex((item) => item._id.toString() === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= products.length) {
      const unchanged = await Product.find({ isActive: true, category: product.category })
        .populate('category', 'name slug')
        .sort(sortProducts);
      return res.json({ success: true, products: unchanged });
    }

    const reordered = [...products];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    await Promise.all(reordered.map((item, itemIndex) => Product.findByIdAndUpdate(item._id, { rank: itemIndex })));

    const productsResponse = await Product.find({ isActive: true, category: product.category })
      .populate('category', 'name slug')
      .sort(sortProducts);

    res.json({ success: true, products: productsResponse });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProduct,
};
