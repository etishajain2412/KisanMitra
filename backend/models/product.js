const mongoose = require("mongoose");
const User = require("./User");

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
  status: { type: String, enum: ["active", "won", "lost"], default: "active" }
});

// Product schema
const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 1000
  },
  price: { 
    type: Number, 
    required: function() { return !this.isBiddingEnabled },
    min: 0,
    validate: {
      validator: function(value) {
        return !this.isBiddingEnabled || value === undefined;
      },
      message: "Price should not be set when bidding is enabled"
    }
  },
  category: { 
    type: String, 
    enum: ["crop", "fertilizer", "equipment"], 
    required: true 
  },
  images: { 
    type: [String], 
    validate: [arrayLimit, "You can upload max 5 images"], 
    default: [] 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  averageRating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  reviews: [reviewSchema],
  stock: { 
    type: Number, 
    required: true, 
    default: 1, 
    min: 0 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  isBiddingEnabled: { 
    type: Boolean, 
    default: false 
  },
  bids: [bidSchema],
  minimumBidAmount: { 
    type: Number, 
    min: 0,
    required: function() { return this.isBiddingEnabled },
    validate: {
      validator: function(value) {
        return !this.isBiddingEnabled || value > 0;
      },
      message: "Minimum bid amount must be positive when bidding is enabled"
    }
  },
  biddingStartDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        if (!this.isBiddingEnabled) return true;
        return value && value >= new Date();
      },
      message: "Bidding start date must be in the future when bidding is enabled"
    }
  },
  biddingEndDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        if (!this.isBiddingEnabled) return true;
        return value && value > (this.biddingStartDate || new Date());
      },
      message: "Bidding end date must be after start date when bidding is enabled"
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validate images array length
function arrayLimit(val) {
  return val.length <= 5;
}

// Middleware to update availability and validate bidding
productSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  this.isAvailable = this.stock > 0;
  
  // Clean up fields based on bidding status
  if (this.isBiddingEnabled) {
    this.price = undefined;
  } else {
    this.minimumBidAmount = undefined;
    this.biddingStartDate = undefined;
    this.biddingEndDate = undefined;
    this.bids = [];
  }
  
  next();
});

// Virtual for time remaining in bidding
productSchema.virtual('timeRemaining').get(function() {
  if (!this.isBiddingEnabled || !this.biddingEndDate) return null;
  const now = new Date();
  const end = new Date(this.biddingEndDate);
  return end - now;
});

// Virtual for bidding status
productSchema.virtual('biddingStatus').get(function() {
  if (!this.isBiddingEnabled) return 'disabled';
  const now = new Date();
  const start = new Date(this.biddingStartDate || this.createdAt);
  const end = new Date(this.biddingEndDate);
  
  if (now < start) return 'pending';
  if (now >= start && now <= end) return 'active';
  return 'ended';
});

// Static method to add product
productSchema.statics.addProduct = async function(productData) {
  // Validate and create product
  const product = new this(productData);
  await product.validate(); // Trigger validation
  await product.save();
  return product;
};

// Method to place a bid
productSchema.methods.placeBid = async function(userId, bidAmount, quantity) {
  if (!this.isBiddingEnabled) {
    throw new Error("Bidding is not enabled for this product");
  }
  
  if (this.biddingStatus !== 'active') {
    throw new Error(`Bidding is ${this.biddingStatus} for this product`);
  }
  
  if (bidAmount <= (this.bids[0]?.bidAmount || this.minimumBidAmount)) {
    throw new Error(`Bid amount must be higher than current highest bid (${this.bids[0]?.bidAmount || this.minimumBidAmount})`);
  }
  
  if (quantity > this.stock) {
    throw new Error(`Cannot bid for more than available stock (${this.stock})`);
  }
  
  this.bids.unshift({
    userId,
    bidAmount,
    quantity,
    status: "active"
  });
  
  await this.save();
  return this;
};

module.exports = mongoose.model("Product", productSchema);