// controllers/paymentController.js
const Razorpay = require('razorpay');
const razorpayConfig = require('../config/razorpayConfig');
const Order = require('../models/Order'); // If you're saving orders
const crypto = require("crypto"); // Required for signature verification
const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, products } = req.body; // Amount should be in INR (paise)
      console.log(amount);
    // Razorpay order options
    const options = {
      amount: amount * 100,  // Convert to paise (Razorpay expects amount in paise)
      currency: 'INR',
      receipt: `order_rcptid_${Math.random() * 1000000}`,
      payment_capture: 1,  // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    // Save the order in DB if needed (Optional)
    const newOrder = new Order({
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      status: "Pending",
      products,
    });
    await newOrder.save();
   console.log(`saved in db: ${newOrder}`);
    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send('Server error');
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    console.log("Data received for payment verification:", JSON.stringify(req.body, null, 2));

    const { paymentId, orderId, signature, products } = req.body;

    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // Generate Signature using crypto 
    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret) //Creates an HMAC SHA-256 hash using Razorpay’s secret key.
      .update(`${orderId}|${paymentId}`)// Concatenates orderId and paymentId
      .digest("hex");
console.log(expectedSignature)
    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Payment signature verification failed" });
    }

    // ✅ Payment Verified: Update Order Status in Database
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status: "Success" , products},
      { new: true }
    );
    console.log(`updated order ${updatedOrder}`);

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Payment verified successfully!", order: updatedOrder });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
