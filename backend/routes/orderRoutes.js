const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../middlewares/verifyToken');
const Product=require('../models/product')
// Get all orders for authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ buyerId: userId })
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('productId', 'name images price')
      .populate({
        path: 'shippingAddress',
        select: 'name phone street city state pincode',
      });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order details
router.get("/:id", verifyToken, async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate("buyerId", "name email")
      .populate("sellerId", "name email")
      .populate("productId", "name images price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


    // Authorization check
    if (
      order.buyerId._id.toString() !== req.user.id &&
      order.sellerId._id.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    // Format response to match frontend expectations
    const response = {
      ...order.toObject(),
      productId: {
        ...order.productId.toObject(),
        image: order.productId.images?.[0] || '/placeholder-product.jpg'
      },
      shippingAddress: order.shippingAddress,
      sellerInfo: order.sellerId
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/seller/dashboard-stats', verifyToken,async(req,res)=>{
  try {
    const sellerId = req.user.id;
    
    // Date calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get all relevant orders at once
    const allOrders = await Order.find({ 
      sellerId,
      orderStatus: { $ne: 'Cancelled' }
    }).lean();
    
    // Filter orders by date ranges
    const todayOrders = allOrders.filter(order => 
      new Date(order.orderedAt) >= today && new Date(order.orderedAt) < tomorrow
    );
    
    const weekOrders = allOrders.filter(order => 
      new Date(order.orderedAt) >= startOfWeek
    );
    
    const monthOrders = allOrders.filter(order => 
      new Date(order.orderedAt) >= startOfMonth
    );
    
    // Calculate revenues
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.finalAmount, 0);
    const weeklyRevenue = weekOrders.reduce((sum, order) => sum + order.finalAmount, 0);
    const monthlyRevenue = monthOrders.reduce((sum, order) => sum + order.finalAmount, 0);
    
    // Revenue trend - last 7 days
    const revenueTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dailyOrders = allOrders.filter(order => 
        new Date(order.orderedAt) >= date && new Date(order.orderedAt) < nextDate
      );
      
      const dailyRevenue = dailyOrders.reduce((sum, order) => sum + order.finalAmount, 0);
      
      revenueTrend.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        revenue: dailyRevenue
      });
    }
    
    // Order counts
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(order => 
      order.orderStatus === 'Processing'
    ).length;
    
    // Customer counts
    const uniqueCustomerIds = [...new Set(allOrders.map(order => order.buyerId.toString()))];
    const totalCustomers = uniqueCustomerIds.length;
    
    const newCustomersThisWeek = [...new Set(
      weekOrders.map(order => order.buyerId.toString())
    )].length;
    
    // Product stats
    const products = await Product.find({ seller: sellerId }).lean();
    const totalProducts = products.length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;
    
    // Top selling products
    const productSales = {};
    monthOrders.forEach(order => {
      const productId = order.productId.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          quantitySold: 0,
          revenue: 0
        };
      }
      productSales[productId].quantitySold += order.quantity;
      productSales[productId].revenue += order.finalAmount;
    });
    
    const topSellingProducts = await Promise.all(
      Object.entries(productSales)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 3)
        .map(async ([productId, sales]) => {
          const product = await Product.findById(productId).lean();
          return {
            name: product?.name || 'Unknown Product',
            quantitySold: sales.quantitySold,
            revenue: sales.revenue
          };
        })
    );
    
    // Revenue change calculation
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayOrders = allOrders.filter(order => 
      new Date(order.orderedAt) >= yesterday && new Date(order.orderedAt) < today
    );
    
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.finalAmount, 0);
    const revenueChange = yesterdayRevenue > 0 ?
      Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) :
      0;
    
    res.json({
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      revenueTrend,
      totalOrders,
      pendingOrders,
      totalCustomers,
      newCustomersThisWeek,
      revenueChange,
      totalProducts,
      outOfStockProducts,
      lowStockProducts,
      topSellingProducts
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }

});
router.get('/seller/orders',verifyToken,async(req,res)=>{
  try {
    const sellerId = req.user.id;
    
    const orders = await Order.find({ sellerId })
      .populate('buyerId', 'name email')
      .populate('productId', 'name')
      .sort({ orderedAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }

})
router.get('/seller/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('productId', 'name images price')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name');

    // Log the order to debug and see if populated data is available
    console.log(order); // Debugging output

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify the requesting user is either the seller or buyer
    if (
      order.sellerId._id.toString() !== req.user.id &&
      order.buyerId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// routes/orderRoutes.js

router.put('/seller/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    // Validate status
    if (!orderStatus) {
      return res.status(400).json({ success: false, message: 'orderStatus is required' });
    }

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid orderStatus. Must be one of: Processing, Shipped, Delivered, Cancelled',
      });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify the requesting user is the seller
    if (order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the seller can update order status' });
    }

    // Prevent updating cancelled or delivered orders
    if (['Cancelled', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update status of ${order.orderStatus} orders`,
      });
    }

    // Update the order status
    order.orderStatus = orderStatus;
    await order.save();

    res.json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;