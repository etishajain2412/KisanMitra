const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const razorpayConfig = require('../config/razorpayConfig');
const Order = require('../models/Order');
const Product = require('../models/product');  // Assuming you have the Product model
const crypto = require('crypto');
const verifyToken = require('../middlewares/verifyToken');

const razorpay = new Razorpay({
    key_id: razorpayConfig.key_id,
    key_secret: razorpayConfig.key_secret,
});

// Route to create order
router.post('/create-order', verifyToken, async (req, res) => {
    try {
      const { amount, product,address} = req.body; // product = cartItems

      const buyerId = req.user.id;
      // Validate order data
      if (!amount || !product || product.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid order data" });
      }
  
      // Razorpay order options
      const options = {
        amount: amount * 100, // Convert amount to paise
        currency: 'INR',
        receipt: `order_rcptid_${Math.floor(Math.random() * 1000000)}`,
        payment_capture: 1, // Automatically capture payment
      };
  
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create(options);
  
      // Create an order for each product in the cart
      const orderDocs = await Promise.all(product.map(async (item) => {

        const productDetails = await Product.findById(item.productId._id);
        if (!productDetails) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
  
        const sellerId = productDetails.sellerId;  // Get the sellerId from the product
  
        const newOrder = new Order({
          buyerId,
          sellerId: sellerId,  // Set the sellerId from the product
          productId: item.productId._id, // Correcting usage of productId
          quantity: item.quantity || 1,
          pricePerUnit: item.price,
          totalPrice: item.price * (item.quantity || 1),
          finalAmount: amount,
          isBidOrder: item.isBidOrder || false,
          shippingAddress: address, // Ensure shippingAddress is passed from request body
          paymentMode: "Online",
          razorpayOrderId: razorpayOrder.id,
          paymentStatus: "Pending",
          orderStatus: "Processing",
        });
        return newOrder.save();
      }));
  
      // Send necessary information in the response
      return res.json({
        id: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
        orders: orderDocs.map(order => ({
          _id: order._id,
          productId: order.productId,
          totalPrice: order.totalPrice,
          paymentStatus: order.paymentStatus
        })),
      });
  
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

// Route to verify payment
router.post('/verify-payment', verifyToken, async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;

        // Validate payment details
        if (!paymentId || !orderId || !signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        // Generate expected signature from Razorpay secret key
        const expectedSignature = crypto
            .createHmac("sha256", razorpay.key_secret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        // Verify signature
        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Payment signature verification failed" });
        }

        // Update all orders with this razorpayOrderId
        const updatedOrders = await Order.updateMany(
            { razorpayOrderId: orderId },
            { $set: { paymentStatus: "Paid" } }
        );

        if (updatedOrders.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Orders not found" });
        }

        res.json({ success: true, message: "Payment verified successfully!" });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
