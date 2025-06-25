import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/profile");
    }
    const params = new URLSearchParams(location.search);
    const errorMessage = params.get("error");
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      return "All fields are required.";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Enter a valid email address.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
          `${backendUrl}/api/auth/register`,
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setSuccessMessage(response.data.message || "Registration successful! Redirecting...");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    Cookies.set("authState", "register", { expires: 1, sameSite: "Strict" });
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 p-8 flex-col justify-center items-center bg-gradient-to-br from-green-500 to-green-700 text-white">
        <div className="max-w-md text-center">
          <div className="text-4xl font-bold mb-2 text-white">KisanMitra</div>
          <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl mb-8">Empowering farmers with technology.</p>
        </div>
      </div>
      
      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
            </form>
            <div className="text-center my-3">OR</div>
            <Button onClick={handleGoogleAuth} className="w-full bg-blue-600 text-white">Register with Google</Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-gray-600">Already have an account? <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold">Login</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;