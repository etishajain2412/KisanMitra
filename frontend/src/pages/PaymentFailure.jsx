import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";


const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="status-container failure">
            <FaTimesCircle className="status-icon failure-icon" />
            <h2>Payment Failed!</h2>
            <p>Something went wrong. Please try again.</p>
            <button className="retry-button" onClick={() => navigate("/cart")}>
                Try Again
            </button>
        </div>
    );
};

export default PaymentFailure;
