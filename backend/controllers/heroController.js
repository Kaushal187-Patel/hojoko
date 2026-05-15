const HeroSlide = require('../models/HeroSlide');

const sortSlides = { rank: 1, createdAt: 1 };

const buildImageUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/hero/${filename}`;

const normalizeRanks = async () => {
  const slides = await HeroSlide.find({ isActive: true }).sort(sortSlides);
  await Promise.all(slides.map((slide, index) => HeroSlide.findByIdAndUpdate(slide._id, { rank: index })));
};

const getHeroSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort(sortSlides);
    res.json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

const getHeroSlidesAdmin = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find().sort(sortSlides);
    res.json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

const uploadHeroImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const image = buildImageUrl(req, req.file.filename);
    res.status(201).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

const createHeroSlide = async (req, res, next) => {
  try {
    const { image, alt } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const count = await HeroSlide.countDocuments({ isActive: true });
    const slide = await HeroSlide.create({
      image,
      alt: alt?.trim() || `HOZOKO offer ${count + 1}`,
      rank: count,
    });

    res.status(201).json({ success: true, slide });
  } catch (error) {
    next(error);
  }
};

const updateHeroSlide = async (req, res, next) => {
  try {
    const { image, alt } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const slide = await HeroSlide.findByIdAndUpdate(
      req.params.id,
      {
        image,
        alt: alt?.trim() || 'HOZOKO special offer',
      },
      { new: true, runValidators: true }
    );

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    res.json({ success: true, slide });
  } catch (error) {
    next(error);
  }
};

const deleteHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    await normalizeRanks();
    const slides = await HeroSlide.find({ isActive: true }).sort(sortSlides);

    res.json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

const reorderHeroSlide = async (req, res, next) => {
  try {
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ success: false, message: 'Direction must be up or down' });
    }

    const slides = await HeroSlide.find({ isActive: true }).sort(sortSlides);
    const index = slides.findIndex((item) => item._id.toString() === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= slides.length) {
      return res.json({ success: true, slides });
    }

    const reordered = [...slides];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    await Promise.all(reordered.map((item, itemIndex) => HeroSlide.findByIdAndUpdate(item._id, { rank: itemIndex })));

    const slidesResponse = await HeroSlide.find({ isActive: true }).sort(sortSlides);
    res.json({ success: true, slides: slidesResponse });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHeroSlides,
  getHeroSlidesAdmin,
  uploadHeroImage,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlide,
};
