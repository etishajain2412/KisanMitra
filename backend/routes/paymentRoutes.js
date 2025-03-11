// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create order
router.post('/create-order', paymentController.createOrder);

// Route to verify payment
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
