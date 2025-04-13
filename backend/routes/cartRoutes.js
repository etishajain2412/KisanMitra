const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/product');
const verifyToken = require('../middlewares/verifyToken');

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate({
        path: 'items.productId',
        select: 'name category images price' // explicitly select needed fields
      });
    
    res.json(cart || { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Product not available in requested quantity' });
    }

    // Find user's cart or create new one
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      // Update quantity if already in cart
      existingItem.quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ productId, quantity, price: product.price });
    }

    // Calculate totals
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
// In your backend routes/cart.js
// In your backend (routes/cart.js)
router.put('/update/:itemId', verifyToken, async (req, res) => {
    try {
      const { quantity } = req.body;
      
      const cart = await Cart.findOne({ userId: req.user.id })
        .populate({
          path: 'items.productId',
          select: 'name price images category stock'
        });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const item = cart.items.id(req.params.itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      // Backend stock validation
      if (quantity > item.productId.stock) {
        return res.status(400).json({ 
          message: `Only ${item.productId.stock} items available` 
        });
      }
  
      item.quantity = quantity;
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await cart.save();
      
      // Return populated cart
      const updatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.productId',
          select: 'name price images category stock'
        });
        
      res.json(updatedCart);
      
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
// Remove item from cart
router.delete('/remove/:itemId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull({ _id: req.params.itemId });
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [], total: 0 } },
      { new: true }
    );
    res.json(cart || { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;