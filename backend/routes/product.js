const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs to delete files
const verifyToken = require('../middlewares/verifyToken');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/product');

const router = express.Router();

// Multer storage (Temporary storage before Cloudinary upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 🔹 Add Product Route
router.post('/addProduct', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, stock, isBiddingEnabled } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // 🔹 Upload images to Cloudinary
    const imageUploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'agriculture-products',
      });
      // Remove the file from the local uploads folder after Cloudinary upload
      fs.unlinkSync(image.path);
      return result.secure_url;
    });

    const imageUrls = await Promise.all(imageUploadPromises);

    // 🔹 Convert isBiddingEnabled to Boolean (in case it's coming as a string)
    const biddingEnabled = isBiddingEnabled === 'true' || isBiddingEnabled === true;

    // 🔹 Save product in DB
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      sellerId: req.user.id,
      images: imageUrls,
      isBiddingEnabled: biddingEnabled, // Controlled by form input
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


// 🔹 Display Products Route
router.get('/display', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

router.get('/myProducts', verifyToken, async (req, res) => {
  try {
    const  userId  = req.user.id; // Get logged-in user's ID

    const products = await Product.find({ sellerId: userId }); // Fetch user's products

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

router.put('/updateProduct/:id', async (req, res) => {
  try {
    // Destructure the fields from the request body
    const { name, description, price, category, stock, isAvailable } = req.body;

    // Manually convert the 'isAvailable' value from string to Boolean
    const available = isAvailable === 'on'; // Converts "on" to true, others to false

    // Find the product by ID and update it with the provided data
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        description, 
        price, 
        category, 
        stock, 
        isAvailable: available 
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the updated product data as the response
    res.json(updatedProduct);

  } catch (err) {
    // Handle errors and respond with a generic error message
    console.error('Error updating product:', err.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// GET /api/products/bids/:productId
router.get("/bids/:productId", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("bids.userId", "name email");
    if (!product || !product.bids.length) {
      return res.status(404).json({ message: "No bids found for this product." });
    }
    res.status(200).json(product.bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Failed to fetch bids." });
  }
});
// POST /api/products/bid/:productId
router.post('/bid/:productId', verifyToken, async (req, res) => {
  try {
    const amount = req.body.amount; // Ensure you're extracting 'amount' correctly
    const product = await Product.findById(req.params.productId);
console.log(amount,product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (!product.isBiddingEnabled) {
      return res.status(400).json({ message: 'Bidding is not enabled for this product.' });
    }

    // Find the highest bid for the product
    const highestBid = product.bids.sort((a, b) => b.amount - a.amount)[0];

    if (highestBid && amount <= highestBid.amount) {
      return res.status(400).json({ message: 'Your bid must be higher than the current highest bid.' });
    }

    // Create a new bid
    const newBid = {
      userId: req.user.id,
      bidAmount:amount,
    };

    // Add the new bid to the product's bids array
    product.bids.push(newBid);
    await product.save();

    res.status(201).json({ message: 'Bid placed successfully.', bid: newBid });
  } catch (err) {
    console.error('Error placing bid:', err);
    res.status(500).json({ message: 'Failed to place bid.' });
  }
});

router.post("/sellToHighestBidder/:id", verifyToken, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (!product.isBiddingEnabled) {
      return res.status(400).json({ message: "Bidding is not enabled for this product." });
    }

    if (!product.bids || product.bids.length === 0) {
      return res.status(400).json({ message: "No bids available for this product." });
    }

    // Sort bids by amount in descending order
    product.bids.sort((a, b) => b.bidAmount - a.bidAmount);

    let remainingStock = Math.min(stock, product.stock);
    const saleResults = [];
    const buyers = [];

    for (let i = 0; i < product.bids.length && remainingStock > 0; i++) {
      const bid = product.bids[i];
      const quantityToSell = Math.min(1, remainingStock); // Selling 1 product per highest bidder

      // Track buyers who got the product
      buyers.push({ userId: bid.userId, amount: bid.bidAmount });

      remainingStock -= quantityToSell;
    }

    // Update stock after selling
    product.stock = remainingStock;
    product.updateHighestBid();
    await product.save();

    res.status(200).json({ 
      message: "Sale completed successfully!", 
      buyers: buyers.map(buyer => `User ${buyer.userId} got the product at ${buyer.amount}`) 
    });
  } catch (error) {
    console.error("Error completing sale:", error);
    res.status(500).json({ message: "Failed to complete the sale." });
  }
});

module.exports = router;
