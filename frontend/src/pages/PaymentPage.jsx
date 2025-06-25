import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { FaShoppingCart, FaRupeeSign, FaCreditCard } from "react-icons/fa";
import { IndianRupee, LoaderCircle, MapPin, Package2, Truck, ShieldCheck, CreditCard as CreditCardIcon } from "lucide-react";
import axios from 'axios';
axios.defaults.withCredentials=true
const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, total, address } = location.state || { cartItems: [], total: 0, address: {} };

  const [loading, setLoading] = useState(false);
  const key_id = import.meta.env.VITE_RAZORPAY_KEY_ID;
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  useEffect(() => {
    if (!cartItems.length) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const orderResponse = await axios.post(`${backendUrl}/api/payment/create-order`, {
        amount: total,
        product: cartItems,
        address,
      });

      const { id, currency, amount: orderAmount } = orderResponse.data;

      if (!window.confirm("Proceed with payment for the selected products?")) {
        setLoading(false);
        return;
      }

      const options = {
        key: key_id,
        amount: orderAmount,
        currency: currency,
        name: "KisanMitra",
        description: "Purchase Product",
        order_id: id,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          const paymentResponse = await axios.post("http://localhost:5000/api/payment/verify-payment", {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature,
            products: cartItems,
            address,
          });

          if (paymentResponse.data.success) {
            navigate("/payment-success");
          } else {
            navigate("/payment-failure");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#4caf50",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed, please try again.");
      setLoading(false);
      navigate("/payment-failure");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Please review your order and delivery details</p>
        </div>

        {/* Order Progress */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Package2 className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm font-medium">Order Review</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Truck className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm font-medium">Delivery Details</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-accent border border-accent/20">
            <CreditCardIcon className="h-6 w-6 mb-2 text-accent-foreground" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column: Order Details */}
          <div className="md:col-span-3 space-y-6">
            {/* Address Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-lg">{address.name}</p>
                  <p className="text-muted-foreground">{address.phone}</p>
                  <p className="text-muted-foreground">
                    {address.street}, {address.city}, 
                    <br />
                    {address.state} - {address.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package2 className="h-5 w-5" />
                  Order Items
                </CardTitle>
                <CardDescription>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={item.id || index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {item.price * item.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment Summary */}
          <div className="md:col-span-2">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>Complete your order securely</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Amount</span>
                    <span className="text-xl">₹{total}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">Secure payment via Razorpay</span>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-12 text-lg font-medium"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5" />
                      Pay ₹{total}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
