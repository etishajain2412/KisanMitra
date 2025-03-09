import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Home from './pages/Home';
import Product from './pages/product';
import DisplayProducts from './pages/DisplayProduct';
import MyProduct from './pages/MyProduct'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/display" element={<DisplayProducts />} />
        <Route path="/product" element={<Product />} />
        <Route path="/my-products" element={<MyProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
