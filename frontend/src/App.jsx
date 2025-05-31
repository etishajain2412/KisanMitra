import React from "react";
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import WeatherPage from "./pages/WeatherPage";
 import FarmingTipsPage from "./pages/FarmingTips";
 import Forum from "./components/Forum.jsx";
 import Register from './pages/register';
 import Login from './pages/login';
 import Contact from "./pages/Contact.jsx";
 import Dashboard from './pages/dashboard';
 import HomePage from "./pages/HomePage"; 
 import AddProduct from './pages/AddProduct';
import MyProduct from './pages/MyProduct';
import ProductsList from './pages/ProductsList.jsx';
import CartPage from "./pages/CartPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import SuccessStories from "./pages/SuccessStories.jsx";
import SubmitStory from "./pages/SubmitStory";
import PaymentFailure from "./pages/PaymentFailure.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import VideoGallery from "./components/VideoGallery";
import ProductDetails from "./pages/ProductDetails";
import UploadVideo from "./components/UploadVideo";
import AboutUs from "./pages/AboutUs.jsx";
import News from "./pages/News.jsx";
import Features from "./pages/Features.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import {useState} from 'react';
import OrdersPage from "./pages/OrderPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import SellerDashboard from "./pages/sellerDashBoard.jsx";
import OrderDetailsPage from "./pages/sellerDetailed.jsx";
 const App = () => {


   return (
     <Router>
    
     
       <Routes>
      
         <Route path="/register" element={<Register />} />
         <Route path='/news' element={<News/>}/>
         <Route path="/" element={<HomePage />} />
         <Route path="/features" element={<Features />} />
         <Route path="/about" element={<AboutUs />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/login" element={<Login />} />
         <Route path="/payment" element={<PaymentPage />} /> {/* Add PaymentPage route */}
         <Route path="/payment-success" element={<PaymentSuccess  />} /> {/* Add PaymentPage route */}
         <Route path="/payment-failure" element={<PaymentFailure/>} /> {/* Add PaymentPage route */}
         <Route path="/profile" element={<Dashboard />} />
         <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/weather" element={<WeatherPage />} />
         <Route path="/farming-tips" element={<FarmingTipsPage />} />
         <Route path="/display" element={<ProductsList />} />
         <Route path="/product" element={<AddProduct />} />
         <Route path="/my-products" element={<MyProduct />} />
         <Route path="/cart" element={<CartPage/>}/>

         <Route path="/stories" element={<SuccessStories/>} /> 
        <Route path="/stories/submit" element={<SubmitStory/>} /> 
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/forums"  element={<Forum />} />
        <Route path="/seller/dashboard" element={<SellerDashboard/>}/>
        <Route path="/seller/orders/:orderId" element={<OrderDetailsPage/>}/>
        <Route path="/videos" element={<VideoGallery />} />
        <Route path="/videos/upload" element={<UploadVideo />} />   
        <Route path="/orders" element={<OrdersPage/>}/>     
        <Route path="/orders/:id" element={<OrderDetailPage/>}/>     

      </Routes>
    </Router>
   )
};
  





// // export default App;
// import Header from "./components/Header";
// import HomePage from "./pages/HomePage";
// import Footer from "./components/Footer";

// const App = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <HomePage />
//       </main>
//       <Footer />
//     </div>
//   );
// };

export default App;