const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
const path = require("path");

// Add new product (with image upload to Cloudinary)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    // Upload images to Cloudinary and get the URLs
    const imageUrls = [];
    for (const image of images) {
      // Upload each image to Cloudinary
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "products", // Define a folder to organize the uploads
        public_id: path.parse(image.originalname).name, // Unique name for each file
      });
      imageUrls.push(result.secure_url); // Store the image URL
    }

    // Create new product in MongoDB with image URLs
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images: imageUrls, // Array of Cloudinary image URLs
    });

    // Save product to database
    await product.save();

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding product. Please try again." });
  }
};

module.exports = { addProduct };
