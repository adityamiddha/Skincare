const cloudinary = require('../utils/cloudinary');
const Image = require('../models/imageModel');
const streamifier = require('streamifier');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          {
            folder: 'skinApp',
            resource_type: 'image'
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    // ⬇ Save uploaded image info to DB
    const savedImage = await Image.create({
      imageUrl: result.secure_url,
      uploadedBy: req.user._id // req.user should come from auth middleware
    });

    return res.status(200).json({
      message: 'Image uploaded and saved to DB!',
      url: result.secure_url,
      savedImage
    });

  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getMyImages = async (req, res) => {
  try {
    // find all images where uploadedBy === current user
    const images = await Image.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      count: images.length,
      images,
    });
  } catch (err) {
    console.error('Fetch Images Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};