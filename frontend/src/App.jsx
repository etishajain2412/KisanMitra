import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WeatherPage from "./pages/WeatherPage";
import FarmingTipsPage from "./pages/FarmingTipsPage";
import MyNavbar from "./components/Navbar";

import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Home from './pages/Home';
const App = () => {
  return (
    <Router>
      <MyNavbar />
      <Routes>
        
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/farming-tips" element={<FarmingTipsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};





export default App;
