import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Input from "../components/ui/input";
import Label from "../components/ui/Label";
import { Separator } from "../components/ui/separator";
import { IndianRupee, Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/seller/orders/${orderId}`);
        setOrder(response.data.order); // Set the order data from the response
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  const getNextActions = () => {
    if (!order) return [];

    const handleStatusUpdate = (newStatus) => async () => {
      try {
        setLoading(true);
        await axios.put(`http://localhost:5000/api/orders/seller/orders/${orderId}`, {
          orderStatus: newStatus,
        });
        setOrder({ ...order, orderStatus: newStatus });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update order status');
        setLoading(false);
      }
    };

    switch (order.orderStatus) {
      case 'Processing':
        return [
          {
            label: 'Mark as Shipped',
            action: handleStatusUpdate('Shipped'),
            variant: 'default',
          },
          {
            label: 'Cancel Order',
            action: handleStatusUpdate('Cancelled'),
            variant: 'destructive',
          },
        ];
      case 'Shipped':
        return [
          {
            label: 'Mark as Delivered',
            action: handleStatusUpdate('Delivered'),
            variant: 'default',
          },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8">Loading order details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="container mx-auto p-8">Order not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Details for order ID: {order._id}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Order ID</Label>
              <Input type="text" value={order._id} readOnly />
            </div>
            <div>
              <Label>Order Date</Label>
              <Input type="text" value={formatDate(order.orderedAt)} readOnly />
            </div>
          </div>

          <Separator />

          <div>
            <Label>Customer Information</Label>
            <div className="grid gap-2">
              <div>
                <Label>Name</Label>
                <Input type="text" value={order.buyerId?.name || 'N/A'} readOnly />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Shipping Address</Label>
            <div className="grid gap-2">
              <Input type="text" value={order.shippingAddress?.address || 'N/A'} readOnly />
              <Input type="text" value={`${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country}`} readOnly />
            </div>
          </div>

          <Separator />

          <div>
            <Label>Order Items</Label>
            <ul className="list-none space-y-2">
              {order.orderItems?.map((item, index) => (
                <li key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    <img src={item.productId?.images[0]} alt={item.productId?.name} className="w-20 h-20 object-cover rounded-md" />
                    <div>
                      <p className="font-semibold">{item.productId?.name || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <p className="font-semibold">
                      <IndianRupee className="inline-block h-4 w-4 mr-1" />
                      {(item.productId?.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.productId?.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <div className={`px-4 py-2 rounded-md ${getStatusClass(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)} {order.orderStatus}
              </div>
            </div>

            <div>
              <Label>Total Price</Label>
              <Input
                type="text"
                value={`${IndianRupee} ${(order.totalPrice).toLocaleString()}`}
                readOnly
              />
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            {getNextActions().map((action, idx) => (
              <Button key={idx} onClick={action.action} variant={action.variant}>
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
