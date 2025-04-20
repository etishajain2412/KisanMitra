import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  IndianRupee,
  ArrowLeft,
  Loader2
} from 'lucide-react';

axios.defaults.withCredentials = true;

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/seller/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case 'processing':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1"><Truck className="h-3 w-3" /> Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Delivered</Badge>;
      case 'cancelled': 
        return <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextActions = () => {
    if (!order) return [];

    const handleStatusUpdate = (newStatus) => async () => {
      try {
        setUpdating(true);
        const response = await axios.post(
          `http://localhost:5000/api/orders/${orderId}/status`,
          { status: newStatus }
        );
        setOrder(response.data.order);
      } catch (err) {
        console.error('Error updating status:', err.response?.data?.message || err.message);
        alert('Failed to update status');
      } finally {
        setUpdating(false);
      }
    };

    switch (order.orderStatus) {
      case 'Processing':
        return [
          { label: 'Mark as Shipped', action: handleStatusUpdate('Shipped'), variant: 'default' },
          { label: 'Cancel Order', action: handleStatusUpdate('Cancelled'), variant: 'destructive' }
        ];
      case 'Shipped':
        return [
          { label: 'Mark as Delivered', action: handleStatusUpdate('Delivered'), variant: 'default' }
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Package className="h-8 w-8 animate-pulse" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center h-64 gap-4">
        <XCircle className="h-8 w-8 text-red-500" />
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center h-64 gap-4">
        <Package className="h-8 w-8 text-gray-400" />
        <p>Order not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const nextActions = getNextActions();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="ml-auto">
          {order?.orderStatus ? getStatusBadge(order.orderStatus) : <Badge variant="outline">Unknown Status</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Details about the products ordered</CardDescription>
            </CardHeader>
            <CardContent>
              {order.productId ? (
                <div className="flex justify-between border-b py-2">
                  <div>
                    <p className="font-semibold">{order.productId.name}</p>
                    <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <IndianRupee className="w-4 h-4" />
                    {order.productId.price * order.quantity}
                  </div>
                </div>
              ) : (
                <p>No items in the order.</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {order.shippingAddress ? (
                <>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </>
              ) : (
                <p>Shipping address not available.</p>
              )}
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Order Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="font-semibold">Order ID:</span> {order._id}</p>
              <p><span className="font-semibold">Ordered On:</span> {formatDate(order.createdAt)}</p>
              <p><span className="font-semibold">Status:</span> {order.orderStatus}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Order Actions */}
          {nextActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
                <CardDescription>Available actions for this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nextActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      disabled={updating}
                      variant={action.variant}
                      className="w-full"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        action.label
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-1 text-lg font-semibold">
              <IndianRupee className="w-5 h-5" />
              {order.totalPrice || 0}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
              Back to Orders
            </Button>
            <Button variant="secondary" className="flex-1">
              Print Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
