const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Assuming Order schema is defined in this path

// Create new order
router.post("/", async (req, res) => {
  try {
    const {
      buyerId,
      sellerId,
      productId,
      quantity,
      pricePerUnit,
      shippingAddress,
      paymentMode,
      isBidOrder,
    } = req.body;

    const totalPrice = quantity * pricePerUnit;
    const finalAmount = totalPrice; // Add delivery fee if needed

    const order = new Order({
      buyerId,
      sellerId,
      productId,
      quantity,
      pricePerUnit,
      totalPrice,
      finalAmount,
      shippingAddress,
      paymentMode,
      isBidOrder,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyerId sellerId productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Get orders of a user (buyer)
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.userId })
      .populate("productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

// Get orders for a seller
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.sellerId })
      .populate("productId buyerId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
});

// Update order status (Processing → Shipped → Delivered → Cancelled)
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status, deliveredAt: status === "Delivered" ? new Date() : null },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Update payment status (Pending → Paid → Failed)
router.patch("/:id/payment", async (req, res) => {
  const { status } = req.body;

  if (!["Pending", "Paid", "Failed"].includes(status)) {
    return res.status(400).json({ error: "Invalid payment status" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

// Delete an order (admin only)
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;
