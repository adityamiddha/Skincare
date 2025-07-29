
const ScanResult = require('../models/scanResultModel');
const mongoose = require('mongoose');

exports.createScanResult = async (req, res) => {
  try {
    const { imageId, aiScores } = req.body;

    if (!imageId || !aiScores) {
      return res.status(400).json({ message: 'Image ID and AI scores are required' });
    }

    const newResult = await ScanResult.create({
      uploadedBy: req.user._id,
      image: imageId,
      aiScores : req.body.aiScores
    });

    res.status(201).json({
      message: 'Scan result saved successfully!',
      data: newResult
    });
  } catch (err) {
    console.error('Error saving scan result:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyScanResults = async (req, res) => {
try{ 
    const results = await ScanResult.find({ uploadedBy: req.user._id}).populate('image').sort({ createdAt: -1});
    
    res.status(200).json({
        status: 'success',
        results: results.length,
        data: results
    });
} catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message});
}
};

exports.compareScanResults = async (req, res) => {
  try {
    const { scanId1, scanId2 } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(scanId1) || !mongoose.Types.ObjectId.isValid(scanId2)) {
      return res.status(400).json({ message: 'Invalid scan ID format' });
    }

    console.log('🧾 scanId1:', scanId1);
    console.log('🧾 scanId2:', scanId2);

    // Fetch both scan results
    const result1 = await ScanResult.findById(scanId1);
    const result2 = await ScanResult.findById(scanId2);

    if (!result1 || !result2) {
      return res.status(404).json({ message: 'One or both scan results not found' });
    }

    console.log('✅ Result 1:', result1);
    console.log('✅ Result 2:', result2);

    const scores1 = result1.aiScores;
    const scores2 = result2.aiScores;

    if (!scores1 || !scores2) {
      return res.status(400).json({ message: 'AI scores missing in one or both scan results' });
    }

    // Calculate improvement for each skin condition
    const comparison = {};
    for (let key in scores1) {
      if (typeof scores1[key] === 'number' && typeof scores2[key] === 'number') {
        comparison[key] = {
          before: scores1[key],
          after: scores2[key],
          difference: scores1[key] - scores2[key], // positive = improvement
        };
      }
    }

    return res.status(200).json({
      message: 'Comparison successful',
      comparison
    });

  } catch (error) {
    console.error('❌ Error comparing scan results:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};