import React, { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

const PlaceOrderButton = ({ cartItems, totalAmount }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // Ensure the cartItems have all required fields
      const validCartItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      // 1. Save the order details to your backend with status 'confirmed' (no payment)
      const orderResponse = await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          items: validCartItems,
          totalAmount,
          status: "confirmed", // No payment handling, status is confirmed
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const orderId = orderResponse.data.orderId;
      
      // 2. Redirect to order confirmation page
      navigate("/order-confirmation", {
        state: {
          orderId,  // Pass the created order ID to confirmation page
        }
      });
      
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePlaceOrder} 
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Placing Order...
        </>
      ) : (
        "Place Order"
      )}
    </Button>
  );
};

export default PlaceOrderButton;
