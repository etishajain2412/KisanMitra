import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // To navigate back to the homepage or other page after payment
import Payment from '../components/Payment'
import { FaShoppingCart, FaRupeeSign, FaCreditCard } from "react-icons/fa"; // Import icons

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 };
    
    
    // Retrieve amount and cart items from location state
   

    useEffect(() => {
        if (!cartItems.length) {
            navigate("/");
        }
    }, [cartItems, navigate]);

    return (
        <div className="payment-container">
            <h2 className="payment-title">Payment Page</h2>

            {/* Order Summary */}
            <div className="order-summary">
                <h3 className="summary-title">
                    <FaShoppingCart /> Your Order Summary
                </h3>
               
                    {cartItems.map((item) => (
                        <p key={item.id}>
                        {item.name} - ₹{item.price} x {item.quantity}
                    </p>
                    ))}
                
              
            {/* Payment Amount */}
            <h3>
                Amount: <FaRupeeSign />{totalAmount}
            </h3>
            

            {/* Payment Component with Props */}
            <div>
            <Payment amount={totalAmount} cartItems={cartItems} />
        </div>
            </div>
            </div>
    
    
    );
};

export default PaymentPage;