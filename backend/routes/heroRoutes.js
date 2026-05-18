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
const { mainAdmin } = require('../middleware/roles');
const uploadHero = require('../middleware/uploadHero');

const router = express.Router();

router.get('/', getHeroSlides);
router.get('/admin', protect, mainAdmin, getHeroSlidesAdmin);
router.post('/upload', protect, mainAdmin, uploadHero.single('image'), uploadHeroImage);
router.post('/', protect, mainAdmin, createHeroSlide);
router.put('/:id', protect, mainAdmin, updateHeroSlide);
router.patch('/:id/reorder', protect, mainAdmin, reorderHeroSlide);
router.delete('/:id', protect, mainAdmin, deleteHeroSlide);

module.exports = router;
