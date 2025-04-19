const Razorpay = require('razorpay');
const razorpayConfig = require('../config/razorpayConfig');
const Order = require('../models/Order');
const Product = require('../models/product');  // Assuming you have the Product model
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, product } = req.body; // product = cartItems
    const buyerId = req.user.id;

    if (!amount || !product || product.length === 0) {
      if (!res.headersSent) {
        return res.status(400).json({ success: false, message: "Invalid order data" });
      }
    }

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000000)}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create an order for each product in the cart
    const orderDocs = await Promise.all(product.map(async (item) => {
      const productDetails = await Product.findById(item._id);
      
      if (!productDetails) {
        if (!res.headersSent) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
      }

      const sellerId = productDetails.sellerId;  // Get the sellerId from the product

      const newOrder = new Order({
        buyerId,
        sellerId: sellerId,  // Set the sellerId from the product
        productId: item._id,
        quantity: item.quantity || 1,
        pricePerUnit: item.price,
        totalPrice: item.price * (item.quantity || 1),
        finalAmount: amount,
        isBidOrder: item.isBidOrder || false,
        shippingAddress: item.shippingAddress,
        paymentMode: "Online",
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "Pending",
        orderStatus: "Processing",
      });

      return newOrder.save();
    }));

    // Send only necessary information in the response
    if (!res.headersSent) {
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
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};


// VERIFY PAYMENT SIGNATURE
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

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
};
