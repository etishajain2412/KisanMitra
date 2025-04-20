import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Package, 
  Truck, 
  IndianRupee, 
  Clock, 
  CheckCircle, 
  Filter, 
  Search,
  PackageOpen,
  Users
} from "lucide-react";
import Input from "../components/ui/input";
import axios from 'axios';
axios.defaults.withCredentials = true;

const SellerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:5000/api/orders/seller/orders');
        setOrders(ordersResponse.data);

        // Fetch dashboard stats
        const statsResponse = await axios.get('http://localhost:5000/api/orders/seller/dashboard-stats');
        setStats(statsResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredOrders = () => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (order.buyerId?.name && order.buyerId.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.orderStatus.toLowerCase() === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredOrders = getFilteredOrders();

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <Clock className="mr-2 h-4 w-4 text-gray-500" />;
      case 'shipped':
        return <Truck className="mr-2 h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <Package className="mr-2 h-4 w-4 text-red-500" />;
      default:
        return <Package className="mr-2 h-4 w-4" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case 'shipped':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case 'delivered':
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case 'cancelled':
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getOrdersCountByStatus = (status) => {
    if (!orders) return 0;
    if (status === 'all') return orders.length;
    return orders.filter(order => order.orderStatus.toLowerCase() === status).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your products, orders, and shop</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/seller/products">
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Link>
          </Button>
          <Button asChild>
            <Link to="/seller/shop-settings">
              Edit Shop
            </Link>
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.todayRevenue?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange || 0}% from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders || '0'}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders || '0'} pending orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers || '0'}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newCustomersThisWeek || '0'} new this week
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="orders" className="mb-8">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <select 
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.buyerId?.name || 'Customer'}</p>
                          {order.shippingAddress && (
                            <p className="text-xs text-muted-foreground">
                              {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.orderedAt)}</TableCell>
                      <TableCell>1 item</TableCell>
                      <TableCell className="font-semibold flex items-center">
                        <IndianRupee className="h-3.5 w-3.5 mr-1" />
                        {order.finalAmount}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusClass(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/seller/orders/${order._id}`}>
                              View
                            </Link>
                          </Button>
                          {order.orderStatus === 'Processing' && (
                            <Button size="sm">Process</Button>
                          )}
                          {order.orderStatus === 'Shipped' && (
                            <Button size="sm">Mark as Delivered</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold">No orders found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try changing your search or filter criteria</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="products">
          {stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProducts || '0'}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-amber-500">Low Stock Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.lowStockProducts || '0'}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-500">Out of Stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.outOfStockProducts || '0'}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Your best performing products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.topSellingProducts?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="text-right">Units Sold</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.topSellingProducts.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-right">{product.quantitySold}</TableCell>
                            <TableCell className="text-right font-semibold flex items-center justify-end">
                              <IndianRupee className="h-3.5 w-3.5 mr-1" />
                              {product.revenue?.toLocaleString() || '0'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No top selling products data available</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <p>Loading product statistics...</p>
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          {stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {stats.todayRevenue?.toLocaleString() || '0'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {stats.weeklyRevenue?.toLocaleString() || '0'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {stats.monthlyRevenue?.toLocaleString() || '0'}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Last 7 days of sales</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.revenueTrend?.length > 0 ? (
                    <div className="h-[200px] mt-1 flex items-end justify-between">
                      {stats.revenueTrend.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 rounded-t w-10 relative" 
                            style={{ 
                              height: `${(day.revenue / Math.max(...stats.revenueTrend.map(d => d.revenue || 1))) * 150}px` 
                            }}
                          >
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                              ₹{day.revenue?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <span className="text-xs font-medium mt-2">{day.date}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No revenue trend data available</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <p>Loading analytics data...</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerDashboard;