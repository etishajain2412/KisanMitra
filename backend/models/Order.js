// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
