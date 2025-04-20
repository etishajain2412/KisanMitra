const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const razorpayConfig = require('../config/razorpayConfig');
const Order = require('../models/Order');
const Product = require('../models/product');
const crypto = require('crypto');
const verifyToken = require('../middlewares/verifyToken');

const razorpay = new Razorpay({
    key_id: razorpayConfig.key_id,
    key_secret: razorpayConfig.key_secret,
});

// Route to create Razorpay order (not our database order yet)
router.post('/create-order', verifyToken, async (req, res) => {
    try {
        const { amount, product, address } = req.body;
        const buyerId = req.user.id;

        // Validate order data
        if (!amount || !product || product.length === 0 || !address) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        // Verify all products exist and get seller info
        const productDetails = await Promise.all(
            product.map(item => Product.findById(item.productId._id))
        );

        if (productDetails.some(p => !p)) {
            return res.status(404).json({ success: false, message: "One or more products not found" });
        }

        // Razorpay order options
        const options = {
            amount: amount * 100, // Convert amount to paise
            currency: 'INR',
            receipt: `order_rcptid_${Math.floor(Math.random() * 1000000)}`,
            payment_capture: 1, // Automatically capture payment
            notes: {
                buyerId,
                productData: JSON.stringify(product),
                address: JSON.stringify(address)
            }
        };

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create(options);

        // Return only the Razorpay order details
        return res.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to verify payment and create orders
router.post('/verify-payment', verifyToken, async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;

        // Validate payment details
        if (!paymentId || !orderId || !signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac("sha256", razorpay.key_secret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Payment signature verification failed" });
        }

        // Get Razorpay order details to retrieve our notes
        const razorpayOrder = await razorpay.orders.fetch(orderId);
        const { buyerId, productData, address } = razorpayOrder.notes;
        const parsedProductData = JSON.parse(productData);
        const parsedAddress = JSON.parse(address);

        // Create orders in our database only after successful payment
        const orderDocs = await Promise.all(parsedProductData.map(async (item) => {
            const productDetails = await Product.findById(item.productId._id);
            
            const newOrder = new Order({
                buyerId,
                sellerId: productDetails.sellerId,
                productId: item.productId._id,
                quantity: item.quantity || 1,
                pricePerUnit: item.price,
                totalPrice: item.price * (item.quantity || 1),
                finalAmount: razorpayOrder.amount / 100, // Convert back from paise
                isBidOrder: item.isBidOrder || false,
                shippingAddress: parsedAddress,
                paymentMode: "Online",
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentId,
                paymentStatus: "Paid", // Mark as paid immediately
                orderStatus: "Processing",
            });
            return newOrder.save();
        }));

        res.json({ 
            success: true, 
            message: "Payment verified and orders created successfully!",
            orders: orderDocs.map(order => ({
                _id: order._id,
                productId: order.productId,
                totalPrice: order.totalPrice,
                paymentStatus: order.paymentStatus
            }))
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;