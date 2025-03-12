import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherPage from "./pages/WeatherPage";
import FarmingTipsPage from "./pages/FarmingTips";
import MyNavbar from "./components/Navbar";
import Forum from "./components/Forum.jsx";
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import HomePage from "./pages/HomePage";
import Product from './pages/product';
import DisplayProducts from './pages/DisplayProduct';
import CartPage from "./pages/CartPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentFailure from "./pages/PaymentFailure.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import VideoGallery from "./components/VideoGallery";
import UploadVideo from "./components/UploadVideo";
import {useState} from 'react';
const App = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Product A", price: 500, quantity: 2, image: "https://cdn.agdaily.com/wp-content/uploads/2016/09/wheat.jpg" },
    { id: 2, name: "Product B", price: 300, quantity: 1, image: "https://img.freepik.com/premium-photo/tractor-farmers-field_132358-42627.jpg" },
]);

  return (
    <Router>
      <MyNavbar />
      <Routes>
        
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/farming-tips" element={<FarmingTipsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Dashboard />} />
        
        <Route path="/display" element={<DisplayProducts />} />
        <Route path="/product" element={<Product />} />
        {/* <Route path="/my-products" element={<MyProduct />} /> */}
        <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/payment" element={<PaymentPage />} /> {/* Add PaymentPage route */}
        <Route path="/payment-success" element={<PaymentSuccess  />} /> {/* Add PaymentPage route */}
        <Route path="/payment-failure" element={<PaymentFailure/>} /> {/* Add PaymentPage route */}
        <Route path="/forums"  element={<Forum />} />
        <Route path="/videos" element={<VideoGallery />} />
                <Route path="/videos/upload" element={<UploadVideo />} />
      </Routes>
    </Router>
  );
};





export default App;
