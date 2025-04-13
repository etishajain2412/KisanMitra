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
 import Product from './pages/product';
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
import {useState} from 'react';
 const App = () => {
   const [cartItems, setCartItems] = useState([
     { id: 1, name: "Product A", price: 500, quantity: 2, image: "https://cdn.agdaily.com/wp-content/uploads/2016/09/wheat.jpg" },
     { id: 2, name: "Product B", price: 300, quantity: 1, image: "https://img.freepik.com/premium-photo/tractor-farmers-field_132358-42627.jpg" },
 ]);

   return (
     <Router>
    
     
       <Routes>
        
         <Route path="/weather" element={<WeatherPage />} />
         <Route path="/farming-tips" element={<FarmingTipsPage />} />
         <Route path="/register" element={<Register />} />
         <Route path="/" element={<HomePage />} />
         <Route path="/features" element={<Features />} />
         <Route path="/about" element={<AboutUs />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/login" element={<Login />} />
         <Route path="/profile" element={<Dashboard />} />
         <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/display" element={<ProductsList />} />
         <Route path="/product" element={<Product />} />
         <Route path="/my-products" element={<MyProduct />} />
         <Route path="/cart" element={<CartPage/>}/>
         <Route path="/payment" element={<PaymentPage />} /> {/* Add PaymentPage route */}
         <Route path="/payment-success" element={<PaymentSuccess  />} /> {/* Add PaymentPage route */}
         <Route path="/payment-failure" element={<PaymentFailure/>} /> {/* Add PaymentPage route */}
         <Route path="/stories" element={<SuccessStories/>} /> 
        <Route path="/stories/submit" element={<SubmitStory/>} /> 

        <Route path="/forums"  element={<Forum />} />
        <Route path="/videos" element={<VideoGallery />} />
        <Route path="/videos/upload" element={<UploadVideo />} />                 <Route path='/news' element={<News/>}/>
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