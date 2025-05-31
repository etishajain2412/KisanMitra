const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middlewares/verifyToken');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/product');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const productController = require('../controllers/productController');

router.post('/addProduct', verifyToken, upload.array('images', 5), productController.addProduct);
router.get('/getProducts', productController.getProducts);
router.get('/getProduct/:id', productController.getProductById);
router.post('/placeBid/:productId',verifyToken,productController.placeBid);

/* =============================================================
   ✅ GET USER'S PRODUCTS (For My Products page)
================================================================ */
router.get("/myProducts", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's products", error: error.message });
  }
});

/* =============================================================
   ✅ DELETE PRODUCT
================================================================ */
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

/* =============================================================
   ✅ UPDATE PRODUCT DETAILS
================================================================ */

router.put("/update/:id", upload.array("images", 5), async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const { name, description, price, stock, imagesToDelete } = req.body;
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrls = [];

    // Handle new images upload
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, { folder: "agriculture-products" });
          fs.unlinkSync(file.path); // Remove file from local storage after upload
          return result.secure_url;
        } catch (error) {
          console.error("Cloudinary Upload Error:", error);
          return null;
        }
      });

      imageUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);
    }

    // Find the existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedImages = [...existingProduct.images];

    // Delete selected images from Cloudinary if requested
    if (imagesToDelete && imagesToDelete.length > 0) {
      const imagesArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];

      for (let imageUrl of imagesArray) {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
        await cloudinary.uploader.destroy(`agriculture-products/${publicId}`);
        updatedImages = updatedImages.filter((img) => img !== imageUrl);
      }
    }

    // Merge new images with existing ones
    updatedImages = [...updatedImages, ...imageUrls];

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, stock, images: updatedImages },
      { new: true }
    );

    res.json({ product: updatedProduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

/* =============================================================
   ✅ ENABLE/DISABLE BIDDING
================================================================ */
router.put("/toggleBidding/:id", verifyToken, async (req, res) => {
  try {
    const { isBiddingEnabled, minimumBidAmount } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    product.isBiddingEnabled = isBiddingEnabled;
    product.minimumBidAmount = isBiddingEnabled ? minimumBidAmount : 0;

    await product.save();
    res.status(200).json({ message: "Bidding updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating bidding status", error: error.message });
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
// router.get("/bids/:productId", verifyToken, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId)
//       .populate("bids.userId", "name"); // Populate user details

//     if (!product || !product.bids.length) {
//       return res.status(404).json({ message: "No bids found for this product." });
//     }

//     res.status(200).json(product.bids);
//   } catch (error) {
//     console.error("Error fetching bids:", error);
//     res.status(500).json({ error: "Failed to fetch bids." });
//   }
// });


// 🔹 Place or update a bid (inside product schema)
router.post("/bid/:productId", verifyToken, async (req, res) => {
  try {
    const { amount, quantity } = req.body;
    const userId = req.user.id;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (!product.isBiddingEnabled) {
      return res.status(400).json({ error: "Bidding is not enabled for this product" });
    }
    if (!amount || amount <= product.highestBid || quantity <= 0) {
      return res.status(400).json({ error: "Invalid bid amount or quantity" });
    }

    // Check if user already placed a bid
    const existingBid = product.bids.find(bid => bid.userId.toString() === userId);
    
    if (existingBid) {
      // Update bid
      existingBid.bidAmount = amount;
      existingBid.quantity = quantity;
      existingBid.createdAt = new Date();
    } else {
      // Add new bid
      product.bids.push({ userId, bidAmount: amount, quantity });
    }

    // Update highest bid
    product.updateHighestBid();
    await product.save();

    res.status(200).json({ message: "Bid placed successfully", highestBid: product.highestBid });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: "Failed to place bid" });
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
