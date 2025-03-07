const express = require('express');
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middlewares/verifyToken');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const Product = require('../models/product');

const router = express.Router();

// Multer configuration: Storing images temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files are temporarily stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const upload = multer({ storage: storage });

// Route to add a product with Cloudinary image upload
router.post('/addProduct', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const { userId } = req.user; // Assuming you have userId from the token
    const images = req.files; // Access the uploaded files

    // Check if images are provided
    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Upload images to Cloudinary and store URLs
    const imageUploadPromises = images.map((image) =>
      cloudinary.uploader.upload(image.path, {
        folder: 'agriculture-products', // Optionally specify a folder in Cloudinary
      })
    );

    const cloudinaryResults = await Promise.all(imageUploadPromises);

    // Prepare the image URLs from Cloudinary response
    const imageUrls = cloudinaryResults.map((result) => result.secure_url);

    // Create new product with image URLs
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      sellerId: userId,
      images: imageUrls, // Store Cloudinary image URLs
    });

    await newProduct.save();
    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});
router.get('/display', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from DB
    res.status(200).json(products); // Send response with products
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});
module.exports = router;
