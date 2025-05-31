const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/product'); // Adjust path as needed

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      isBiddingEnabled,
      minimumBidAmount,
      biddingStartDate,
      biddingEndDate
    } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and category are required fields.'
      });
    }

    const biddingEnabled = isBiddingEnabled === 'true' || isBiddingEnabled === true;
    const stockValue = parseInt(stock) || 1;
    const priceValue = price ? parseFloat(price) : null;
    const minBidAmount = minimumBidAmount ? parseFloat(minimumBidAmount) : null;

    if (biddingEnabled) {
      if (!minBidAmount || minBidAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Minimum bid amount must be a positive number when bidding is enabled.'
        });
      }

      const now = new Date();
      const startDate = biddingStartDate ? new Date(biddingStartDate) : new Date();
      const endDate = new Date(biddingEndDate);

      if (startDate < now) {
        return res.status(400).json({
          success: false,
          message: 'Bidding start date must be in the future.'
        });
      }

      if (!biddingEndDate || endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'Bidding end date must be after the start date.'
        });
      }
    } else {
      if (!priceValue || priceValue <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number when bidding is disabled.'
        });
      }
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file =>
          cloudinary.uploader.upload(file.path, {
            folder: 'agriculture-products',
            quality: 'auto',
            fetch_format: 'auto'
          })
        );

        const results = await Promise.all(uploadPromises);
        imageUrls = results.map(result => result.secure_url);

        req.files.forEach(file => fs.unlinkSync(file.path));
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        throw new Error('Failed to upload product images');
      }
    }

    const productData = {
      name,
      description,
      category,
      stock: stockValue,
      sellerId: req.user.id,
      images: imageUrls,
      isBiddingEnabled: biddingEnabled,
      ...(biddingEnabled
        ? {
            minimumBidAmount: minBidAmount,
            biddingStartDate: biddingStartDate || new Date(Date.now() + 60000),
            biddingEndDate: biddingEndDate
          }
        : {
            price: priceValue
          })
    };

    const newProduct = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error adding product:', error);
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to add product',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      bidding,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (category && ['crop', 'fertilizer', 'equipment'].includes(category)) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.$and = [];
      if (minPrice) {
        query.$and.push({
          $or: [
            { isBiddingEnabled: false, price: { $gte: parseFloat(minPrice) } },
            { isBiddingEnabled: true, minimumBidAmount: { $gte: parseFloat(minPrice) } }
          ]
        });
      }
      if (maxPrice) {
        query.$and.push({
          $or: [
            { isBiddingEnabled: false, price: { $lte: parseFloat(maxPrice) } },
            { isBiddingEnabled: true, minimumBidAmount: { $lte: parseFloat(maxPrice) } }
          ]
        });
      }
    }

    if (bidding === 'true') {
      query.isBiddingEnabled = true;
      query.biddingEndDate = { $gt: new Date() };
    } else if (bidding === 'false') {
      query.isBiddingEnabled = false;
    }

    const validSortFields = ['name', 'price', 'createdAt', 'minimumBidAmount'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const products = await Product.find(query)
      .populate('sellerId', 'name avatar')
      .select('name description price stock images category isBiddingEnabled minimumBidAmount biddingStartDate biddingEndDate averageRating reviews')
      .sort({ [sortField]: sortDirection })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products: Array.isArray(products) ? products : [],
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      products: [],
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name email') // Populate seller's name and email
      .populate('reviews.userId', 'name'); // Populate reviewer's name

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.placeBid = async (req, res) => {
  try {
    const { bidAmount, quantity } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!product.isBiddingEnabled) {
      return res.status(400).json({ message: "Bidding is not enabled for this product" });
    }

    // Check if current time exceeds bidding end time
    const now = new Date();
    if (product.biddingEndTime && now > new Date(product.biddingEndTime)) {
      return res.status(400).json({ message: "Bidding period has ended for this product" });
    }

    if (bidAmount < product.minimumBidAmount) {
      return res.status(400).json({ message: `Bid amount must be at least ₹${product.minimumBidAmount}` });
    }

    const existingBidIndex = product.bids.findIndex(
      (bid) => bid.userId.toString() === req.user.id
    );

    if (existingBidIndex !== -1) {
      product.bids[existingBidIndex].bidAmount = bidAmount;
      product.bids[existingBidIndex].quantity = quantity;
      product.bids[existingBidIndex].updatedAt = new Date();
    } else {
      product.bids.push({
        userId: req.user.id,
        bidAmount,
        quantity,
        createdAt: new Date(),
      });
    }

    await product.save();

    product.bids.sort((a, b) =>
      a.userId.toString() === req.user.id ? -1 : b.bidAmount - a.bidAmount
    );

    res.status(201).json({ message: "Bid placed/updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error placing bid", error: error.message });
  }
};
