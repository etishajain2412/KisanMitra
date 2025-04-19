const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/product');
const verifyToken = require('../middlewares/verifyToken');
const User = require('../models/User');

// Create new order from user's cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMode } = req.body;

    // 1. Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Validate stock and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      
      if (item.quantity > product.stock) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Only ${product.stock} available` 
        });
      }

      orderItems.push({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        name: item.productId.name,
        images: item.productId.images
      });

      subtotal += item.price * item.quantity;
    }

    // 3. Calculate totals (e.g., no shipping fee for now)
    const shipping = 0;
    const total = subtotal + shipping;

    // 4. Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      subtotal,
      shipping,
      total,
      shippingAddress,
      paymentMethod: paymentMode || 'COD',
      paymentStatus: paymentMode === 'Online' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
    });

    // 5. Update product stock and save order
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    await order.save();
    
    // 6. Clear cart after order
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [], total: 0 } }
    );

    res.status(201).json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order (direct order creation with cartItems in the request)
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { cartItems, shippingAddress, paymentMode } = req.body;

    // Ensure user is authenticated
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Initialize total price
    let totalAmount = 0;

    // Check if all products in the cart exist and calculate total price
    for (let item of cartItems) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.id} not found` });
      }
      totalAmount += product.price * item.quantity;
    }

    // Create a new order
    const newOrder = new Order({
      buyerId: user._id,
      sellerId: cartItems[0].sellerId,  // assuming the seller ID is the same for all items
      productId: cartItems[0].id,  // assuming the productId is the same for all items
      quantity: cartItems[0].quantity,
      pricePerUnit: cartItems[0].price,
      totalPrice: totalAmount,
      finalAmount: totalAmount,  // can include discount or extra charges if applicable
      shippingAddress: shippingAddress,
      paymentMode: paymentMode || 'COD',  // Default to COD
      paymentStatus: paymentMode === 'Online' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
    });

    // Save order to DB
    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
