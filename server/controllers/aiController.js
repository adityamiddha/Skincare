
const ScanResult = require('../models/scanResultModel');
const Image = require('../models/imageModel');

exports.analyzeImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const userId = req.user._id;

    // 1. Check if image exists and belongs to the user
    const image = await Image.findOne({ _id: imageId, uploadedBy: userId });
    if (!image) {
      return res.status(404).json({ message: 'Image not found or unauthorized' });
    }

    // 2. Simulate AI processing (random scores for now)
    const aiScores = {
      wrinkles: Math.floor(Math.random() * 100),
      acne: Math.floor(Math.random() * 100),
      darkSpots: Math.floor(Math.random() * 100),
      hydration: Math.floor(Math.random() * 100)
    };

    // 3. Save to ScanResult collection
    const newResult = await ScanResult.create({
      uploadedBy: userId,
      image: imageId,
      aiScores
    });

    res.status(201).json({
      message: 'AI scan completed and result saved',
      data: newResult
    });

  } catch (err) {
    console.error('AI Scan Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

