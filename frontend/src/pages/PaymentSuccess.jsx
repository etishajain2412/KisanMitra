import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="status-container success">
            <FaCheckCircle className="status-icon success-icon" />
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            <button className="home-button" onClick={() => navigate("/")}>
                Go to Home
            </button>
        </div>
    );
};

export default PaymentSuccess;
