const mongoose = require("mongoose");
const User = require("./User"); // Assuming user model exists

// Review schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

// Bid schema
const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bidAmount: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now },
});

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ["crop", "fertilizer", "equipment"], required: true },
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  averageRating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  stock: { type: Number, required: true, default: 1 },
  isAvailable: { type: Boolean, default: true },
  isBiddingEnabled: { type: Boolean, default: false },
  bids: [bidSchema],
  minimumBidAmount: { type: Number, default: 0 }, // ✅ Maintain only minimum bid amount
  createdAt: { type: Date, default: Date.now },
});

// Middleware to update availability based on stock
productSchema.pre("save", function (next) {
  this.isAvailable = this.stock > 0;
  next();
});

// Method to place a bid
productSchema.methods.placeBid = async function (userId, bidAmount, quantity) {
  if (!this.isBiddingEnabled) {
    throw new Error("Bidding is not enabled for this product.");
  }
  if (bidAmount < this.minimumBidAmount) {
    throw new Error("Bid amount must be at least the minimum bid amount.");
  }

  this.bids.push({ userId, bidAmount, quantity });
  await this.save();
};

// Method to enable or disable bidding
productSchema.methods.setBidding = async function (isEnabled) {
  this.isBiddingEnabled = isEnabled;
  await this.save();
};

module.exports = mongoose.model("Product", productSchema);
