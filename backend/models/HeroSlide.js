const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Hero image is required'],
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
      default: 'HOZOKO special offer',
    },
    rank: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

heroSlideSchema.index({ rank: 1 }, { unique: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
