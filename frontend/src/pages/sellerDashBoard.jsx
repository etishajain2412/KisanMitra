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
  Users,
  Leaf,
  ShoppingBasket,
  BarChart2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Input from "../components/ui/input";
import axios from 'axios';
import StatusBadge from "../components/ui/StatusBadge";
import { cn } from "../lib/utils";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
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
        const ordersResponse = await axios.get(`${backendUrl}/api/orders/seller/orders`);
        setOrders(ordersResponse.data);

        const statsResponse = await axios.get(`${backendUrl}/api/orders/seller/dashboard-stats`);
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
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-green-800">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-lg border border-green-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Farm Dashboard</h1>
            <p className="text-green-600 mt-1">Manage your farm produce, orders, and sales</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link to="/seller/products">
                <ShoppingBasket className="mr-2 h-4 w-4" />
                Manage Produce
              </Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/seller/shop-settings">
                <Leaf className="mr-2 h-4 w-4" />
                Farm Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Today's Earnings</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">₹{stats.todayRevenue?.toLocaleString() || '0'}</div>
                <p className="text-xs text-green-600">
                  {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange || 0}% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Total Orders</CardTitle>
                <PackageOpen className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">{stats.totalOrders || '0'}</div>
                <p className="text-xs text-green-600">
                  {stats.pendingOrders || '0'} pending orders
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Happy Customers</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">{stats.totalCustomers || '0'}</div>
                <p className="text-xs text-green-600">
                  +{stats.newCustomersThisWeek || '0'} new this week
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Card className="mt-8 border border-green-100">
          <CardContent className="p-6">
            <Tabs defaultValue="orders">
              <TabsList className="bg-green-50">
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Package className="mr-2 h-4 w-4" /> Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <ShoppingBasket className="mr-2 h-4 w-4" /> Produce
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <BarChart2 className="mr-2 h-4 w-4" /> Analytics
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4 mt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-green-600" />
                    <Input
                      placeholder="Search by order ID or customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 border-green-300 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center border-green-300 text-green-700 hover:bg-green-50">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <select 
                      className="px-3 py-2 rounded-md border border-green-300 bg-white text-sm focus:ring-green-500 focus:border-green-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Orders ({getOrdersCountByStatus('all')})</option>
                      <option value="processing">Processing ({getOrdersCountByStatus('processing')})</option>
                      <option value="shipped">Shipped ({getOrdersCountByStatus('shipped')})</option>
                      <option value="delivered">Delivered ({getOrdersCountByStatus('delivered')})</option>
                      <option value="cancelled">Cancelled ({getOrdersCountByStatus('cancelled')})</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length > 0 ? (
                  <div className="rounded-lg border border-green-200 shadow-sm bg-white">
                    <Table>
                      <TableHeader className="bg-green-50">
                        <TableRow>
                          <TableHead className="text-green-800">Order ID</TableHead>
                          <TableHead className="text-green-800">Customer</TableHead>
                          <TableHead className="text-green-800">Date</TableHead>
                          <TableHead className="text-green-800">Items</TableHead>
                          <TableHead className="text-green-800">Total</TableHead>
                          <TableHead className="text-green-800">Status</TableHead>
                          <TableHead className="text-green-800">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order._id} className="hover:bg-green-50/50">
                            <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.buyerId?.name || 'Customer'}</p>
                                {order.shippingAddress && (
                                  <p className="text-xs text-green-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(order.orderedAt)}</TableCell>
                            <TableCell>{order.items?.length || 1} item{order.items?.length !== 1 ? 's' : ''}</TableCell>
                            <TableCell className="font-semibold flex items-center text-green-700">
                              <IndianRupee className="h-3.5 w-3.5 mr-1" />
                              {order.finalAmount}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.orderStatus} />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button asChild size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                  <Link to={`/seller/orders/${order._id}`}>
                                    View
                                  </Link>
                                </Button>
                                {order.orderStatus === 'Processing' && (
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Process</Button>
                                )}
                                {order.orderStatus === 'Shipped' && (
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Mark as Delivered</Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 border border-green-200 rounded-lg bg-white">
                    <ShoppingBasket className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold text-green-800">No orders found</h3>
                    <p className="text-green-600">Try changing your search or filter criteria</p>
                  </div>
                )}
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="mt-6">
                {stats ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card className="border border-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-800">Total Produce Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-800">{stats.totalProducts || '0'}</div>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-800">Low Stock Produce</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-800">{stats.lowStockProducts || '0'}</div>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-800">Out of Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-800">{stats.outOfStockProducts || '0'}</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="border border-green-100">
                      <CardHeader>
                        <CardTitle className="text-green-800">Top Selling Produce</CardTitle>
                        <CardDescription className="text-green-600">Your best performing farm products this month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {stats.topSellingProducts?.length > 0 ? (
                          <Table>
                            <TableHeader className="bg-green-50">
                              <TableRow>
                                <TableHead className="text-green-800">Produce Name</TableHead>
                                <TableHead className="text-green-800 text-right">Units Sold</TableHead>
                                <TableHead className="text-green-800 text-right">Revenue</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.topSellingProducts.map((product, index) => (
                                <TableRow key={index} className="hover:bg-green-50/50">
                                  <TableCell className="font-medium">{product.name}</TableCell>
                                  <TableCell className="text-right">{product.quantitySold}</TableCell>
                                  <TableCell className="text-right font-semibold flex items-center justify-end text-green-700">
                                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                                    {product.revenue?.toLocaleString() || '0'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-center py-4 text-green-600">No top selling produce data available</p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-green-600">Loading produce statistics...</p>
                  </div>
                )}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                {stats ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card className="border border-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-800">Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-center text-green-800">
                            <IndianRupee className="h-5 w-5 mr-1" />
                            {stats.todayRevenue?.toLocaleString() || '0'}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-800">This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-center text-green-800">
                            <IndianRupee className="h-5 w-5 mr-1" />
                            {stats.weeklyRevenue?.toLocaleString() || '0'}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-800">This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-center text-green-800">
                            <IndianRupee className="h-5 w-5 mr-1" />
                            {stats.monthlyRevenue?.toLocaleString() || '0'}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="border border-green-100">
                      <CardHeader>
                        <CardTitle className="text-green-800">Sales Trend</CardTitle>
                        <CardDescription className="text-green-600">Last 7 days of farm sales</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {stats.revenueTrend?.length > 0 ? (
                          <div className="h-[200px] mt-1 flex items-end justify-between">
                            {stats.revenueTrend.map((day, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div 
                                  className="bg-green-200 hover:bg-green-300 rounded-t w-10 relative" 
                                  style={{ 
                                    height: `${(day.revenue / Math.max(...stats.revenueTrend.map(d => d.revenue || 1))) * 150}px` 
                                  }}
                                >
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-800">
                                    ₹{day.revenue?.toLocaleString() || '0'}
                                  </span>
                                </div>
                                <span className="text-xs font-medium mt-2 text-green-600">{day.date}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-4 text-green-600">No sales trend data available</p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-green-600">Loading analytics data...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;