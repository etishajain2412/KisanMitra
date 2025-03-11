// PaymentComponent.js (Frontend React Component)
// components/PaymentComponent.js
import React, { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PaymentComponent = ({ amount, cartItems }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const key_id=import.meta.env.VITE_RAZORPAY_KEY_ID;
  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Create an order from the backend
      const orderResponse = await axios.post(
        "http://localhost:5000/api/payment/create-order", 
        { amount,
          product: cartItems,
         } // Send the payment amount in your request body
      );
      console.log(`response received ${JSON.stringify(orderResponse.data,null,2)}`);

      const { id, currency, amount: orderAmount } = orderResponse.data;
    console.log(key_id);

    // Step 2: Show order summary before payment
    if (!window.confirm("Proceed with payment for the selected products?")) {
      setLoading(false);
      return;
    }
      // Step 3: Initialize Razorpay
      const options = {
        key: key_id, // Use your Razorpay Key here
        amount: orderAmount,
        currency: currency,
        name: "KisanMitra", // Your business name
        description: "Purchase Product",
        order_id: id, // The Razorpay order ID returned by backend
        handler: async (response) => {
          // Step 3: Verify the payment on the backend
          const {razorpay_order_id, razorpay_payment_id,  razorpay_signature } = response;
          console.log("Payment Success Response:", response);

          const paymentResponse = await axios.post(
            "http://localhost:5000/api/payment/verify-payment", // Backend URL to verify the payment
            {
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              signature: razorpay_signature,
              products: cartItems
            }
          );

          console.log("payment response for verification ",JSON.stringify(paymentResponse,null,2))

          if (paymentResponse.data.success) {
            navigate("/payment-success"); // Redirect to success page
        } else {
            navigate("/payment-failure"); // Redirect to failure page
        }
         
        },
        prefill: {
          name: "John Doe", // You can set the user's name here
          email: "johndoe@example.com", // Set the user's email here
          contact: "9876543210", // Set the user's contact number here
        },
        theme: {
          color: "#4caf50", // Your theme color
        },
      };

      // Step 4: Open Razorpay checkout popup
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed, please try again.");
      setLoading(false);
      navigate("/payment-failure"); // Redirect to failure page
    }
  };

  return (
    // <div className="text-center">
    //   <h3>Amount: ₹{amount}</h3>

    //   {/* Display all selected products */}
    //   <h4>Products in Cart:</h4>
    //   <ul>
    //     {cartItems.map((item, index) => (
    //       <li key={index}>{item.name} - ₹{item.price}</li>
    //     ))}
    //   </ul>

      <Button onClick={handlePayment} disabled={loading} variant="success">
        {loading ? "Processing..." : "Pay "}
      </Button>
    
  );
};

export default PaymentComponent;
