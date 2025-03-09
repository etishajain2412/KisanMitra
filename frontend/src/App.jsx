import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WeatherPage from "./pages/WeatherPage";
import FarmingTipsPage from "./pages/FarmingTips";
import MyNavbar from "./components/Navbar";

import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

import HomePage from "./pages/HomePage";
const App = () => {
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
      </Routes>
    </Router>
  );
};





export default App;
