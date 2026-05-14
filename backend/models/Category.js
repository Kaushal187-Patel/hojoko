const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

categorySchema.pre('save', function generateSlug(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

categorySchema.pre('insertMany', function assignSlugs(next, docs) {
  docs.forEach((doc) => {
    if (!doc.slug && doc.name) {
      doc.slug = doc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
