import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { IndianRupee, Truck, Package, CheckCircle, MapPin, ArrowLeft } from "lucide-react";

axios.defaults.withCredentials = true;

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`);
        const data = response.data;
        
        if (!data) {
          throw new Error('Order not found');
        }

        // Format order data with fallbacks
        const formattedOrder = {
          ...data,
          _id: data._id || id,
          productId: data.productId || {
            _id: 'unknown',
            name: 'Unknown Product',
            images: ['/placeholder-product.jpg'],
            price: 0
          },
          sellerId: data.sellerId || {
            _id: 'unknown',
            name: 'Unknown Seller',
            email: ''
          },
          shippingAddress: data.shippingAddress || {
            name: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            pincode: ''
          },
          orderedAt: data.orderedAt || new Date(),
          pricePerUnit: data.pricePerUnit || 0,
          quantity: data.quantity || 1,
          totalPrice: data.totalPrice || 0,
          finalAmount: data.finalAmount || 0,
          paymentMode: data.paymentMode || 'COD',
          paymentStatus: data.paymentStatus || 'Pending',
          orderStatus: data.orderStatus || 'Processing',
          isBidOrder: data.isBidOrder || false
        };

        setOrder(formattedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(error.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusSteps = () => {
    const statusOrder = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const currentStatusIndex = statusOrder.indexOf(order.orderStatus);

    const steps = [
      { name: 'Order Placed', status: 'completed' },
      { name: 'Processing', status: currentStatusIndex >= 0 ? 'completed' : 'pending' },
      { name: 'Shipped', status: currentStatusIndex >= 1 ? 'completed' : 'pending' },
      { name: 'Delivered', status: order.orderStatus === 'Delivered' ? 'completed' : 'pending' }
    ];

    return (
      <div className="flex justify-between w-full mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-sm mt-2">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 self-center ${
                steps[index].status === 'completed' && steps[index + 1].status === 'completed' 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Link to="/orders" className="text-primary underline">Return to orders</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Order not found. <Link to="/orders" className="text-primary underline">Return to orders</Link></p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-8 gap-4">
        <Button asChild variant="outline" size="icon">
          <Link to="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {formatDate(order.orderedAt)}
                </span>
              </CardTitle>
              <CardDescription>
                {order.isBidOrder ? 'Bid Order' : 'Regular Order'} • {order.paymentMode}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getStatusSteps()}

              {order.orderStatus === 'Shipped' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-center mb-4">
                  <Truck className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="font-medium">Your order is on the way!</p>
                    {order.trackingNumber && (
                      <p className="text-sm text-muted-foreground">
                        Tracking ID: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold">Order Summary</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={order.productId.images?.[0] || '/placeholder-product.jpg'} 
                            alt={order.productId.name} 
                            className="h-12 w-12 rounded-md object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                          <div>
                            <span className="font-medium block">{order.productId.name}</span>
                            <span className="text-sm text-muted-foreground">
                              Sold by: {order.sellerId.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{order.quantity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <IndianRupee className="h-4 w-4" />
                          {order.pricePerUnit.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <IndianRupee className="h-4 w-4" />
                          {(order.pricePerUnit * order.quantity).toFixed(2)}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Shipping Address
                </h4>
                <div className="text-sm">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="flex items-center justify-end">
                    <IndianRupee className="h-4 w-4" />
                    {order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Final Amount</p>
                  <p className="flex items-center justify-end font-medium">
                    <IndianRupee className="h-4 w-4" />
                    {order.finalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.orderStatus === 'Processing' && (
                <Button variant="outline" className="w-full">
                  Cancel Order
                </Button>
              )}
              {order.orderStatus === 'Delivered' && (
                <Button className="w-full">
                  Return or Exchange
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Contact Seller
              </Button>
              {order.paymentMode === 'Online' && order.paymentStatus === 'Pending' && (
                <Button className="w-full">
                  Complete Payment
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{order.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'Paid' ? 'text-green-500' : 
                    order.paymentStatus === 'Failed' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;