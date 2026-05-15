const express = require('express');
const {
  getHeroSlides,
  getHeroSlidesAdmin,
  uploadHeroImage,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlide,
} = require('../controllers/heroController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const uploadHero = require('../middleware/uploadHero');

const router = express.Router();

router.get('/', getHeroSlides);
router.get('/admin', protect, admin, getHeroSlidesAdmin);
router.post('/upload', protect, admin, uploadHero.single('image'), uploadHeroImage);
router.post('/', protect, admin, createHeroSlide);
router.put('/:id', protect, admin, updateHeroSlide);
router.patch('/:id/reorder', protect, admin, reorderHeroSlide);
router.delete('/:id', protect, admin, deleteHeroSlide);

module.exports = router;
