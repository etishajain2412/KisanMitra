const mongoose = require("mongoose");
const User = require("./user"); // Assuming user model exists

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
  isBiddingEnabled: { type: Boolean, default: false }, // New field to control bidding
  bids: [bidSchema],
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

// Middleware to update availability based on stock
productSchema.pre("save", function (next) {
  this.isAvailable = this.stock > 0;
  next();
});

// Method to update highest bid and highest bidder
productSchema.methods.updateHighestBid = function () {
  if (this.bids.length > 0) {
    const highestBid = this.bids.reduce((max, bid) =>
      bid.bidAmount > max.bidAmount ? bid : max, this.bids[0]
    );
    this.highestBid = highestBid.bidAmount;
    this.highestBidder = highestBid.userId;
  } else {
    this.highestBid = 0;
    this.highestBidder = null;
  }
};

// Method to place a new bid
productSchema.methods.placeBid = async function (userId, bidAmount) {
  if (!this.isBiddingEnabled) {
    throw new Error("Bidding is not enabled for this product.");
  }
  if (bidAmount <= this.highestBid) {
    throw new Error("Bid must be higher than the current highest bid.");
  }

  this.bids.push({ userId, bidAmount });
  this.updateHighestBid();
  await this.save();
};

// Method to enable or disable bidding (for sellers)
productSchema.methods.setBidding = async function (isEnabled) {
  this.isBiddingEnabled = isEnabled;
  await this.save();
};

// Method to sell products to the highest bidders
productSchema.methods.sellToHighestBidders = async function (stockToSell) {
  if (!this.isBiddingEnabled) {
    throw new Error("Bidding must be enabled to sell to highest bidders.");
  }

  let remainingStock = stockToSell;
  const sortedBids = this.bids.sort((a, b) => b.bidAmount - a.bidAmount); // Sort bids by amount, descending

  const saleResults = [];

  for (let i = 0; i < sortedBids.length && remainingStock > 0; i++) {
    const bid = sortedBids[i];
    const quantityToSell = Math.min(1, remainingStock); // Selling 1 product per bidder
    saleResults.push({
      userId: bid.userId,
      bidAmount: bid.bidAmount,
      quantity: quantityToSell,
    });

    remainingStock -= quantityToSell;
  }

  // Update stock and highest bid
  this.stock = remainingStock;
  this.updateHighestBid(); // Ensure highest bid and bidder are updated after selling
  await this.save();

  return saleResults; // Return who got what quantity at what price
};

module.exports = mongoose.model("Product", productSchema);
