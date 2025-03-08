const mongoose = require("mongoose");
const User = require('./user'); // Assuming user model exists

// Review schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

// Bid schema
const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bidAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Product schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: { type: String, enum: ["crop", "fertilizer", "equipment"] },
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  averageRating: { type: Number, default: 0 },
  reviews: [reviewSchema],

  // 🆕 Added Stock Management
  stock: { type: Number, required: true, default: 1 }, // Available quantity
  isAvailable: { type: Boolean, default: true }, // Auto-update based on stock

  // 🆕 Added Bidding
  bids: [bidSchema], // Array of bids placed on this product
  highestBid: { type: Number, default: 0 }, // The highest bid on this product
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user who placed the highest bid

  createdAt: { type: Date, default: Date.now }
});

// Middleware to update availability based on stock
productSchema.pre("save", function(next) {
  this.isAvailable = this.stock > 0;
  next();
});

// Middleware to update highest bid and highest bidder
productSchema.methods.updateHighestBid = function() {
  if (this.bids.length > 0) {
    const highestBid = this.bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max));
    this.highestBid = highestBid.bidAmount;
    this.highestBidder = highestBid.userId;
  }
};

module.exports = mongoose.model("Product", productSchema);
