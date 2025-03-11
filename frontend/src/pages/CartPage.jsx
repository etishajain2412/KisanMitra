import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";


const CartPage = ({ cartItems, setCartItems }) => {
    const navigate = useNavigate();

    // Remove item from cart
    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    // Update quantity of an item
    const updateQuantity = (id, delta) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            )
        );
    };

    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-container">
            <h2><FaShoppingCart /> Your Cart</h2>

            {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty. Add some products!</p>
            ) : (
                <div>
                    <ul className="cart-list">
                        {cartItems.map((item) => (
                            <li key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>₹{item.price}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">
                                            <FaMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                                <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="cart-summary">
                        <h3>Total Amount: ₹{totalAmount}</h3>
                        <button className="checkout-button" onClick={() => navigate("/payment", { state: { cartItems, totalAmount } })}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
