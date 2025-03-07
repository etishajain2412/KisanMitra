import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WeatherPage from "./pages/WeatherPage";
import FarmingTipsPage from "./pages/FarmingTipsPage";
import MyNavbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/farming-tips" element={<FarmingTipsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
