import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { CreditCard, IndianRupee, LoaderCircle } from "lucide-react";

const PaymentComponent = ({ amount, cartItems }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const key_id = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Add shippingAddress to each item
      const enrichedCartItems = cartItems.map(item => ({
        ...item,
      }));

      const orderResponse = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount,
          product: enrichedCartItems,
         address
        },
        {
          withCredentials: true, // 🔥 Important to send cookie
        }
      );

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
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          } = response;

          const paymentResponse = await axios.post(
            "http://localhost:5000/api/payment/verify-payment",
            {
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              signature: razorpay_signature,
              products: enrichedCartItems,
            },
            {
              withCredentials: true, // 🔥 Important again
            }
          );

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
      navigate("/payment-failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
          <CreditCard className="h-6 w-6" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
          <span className="text-lg font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center">
            <IndianRupee className="h-5 w-5 mr-1" />
            {amount}
          </span>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            Order Details
          </h4>
          <Separator className="my-2" />
          <ul className="space-y-3">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full mt-6 h-12 text-lg"
          variant={loading ? "secondary" : "default"}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pay ₹{amount}
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentComponent;
