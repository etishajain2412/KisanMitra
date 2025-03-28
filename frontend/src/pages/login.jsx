import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [formData, setFormData] = useState({
    identifier: '', // Handles either email or username
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation(); // To get query parameters from URL

  // Extract error from URL if redirected after Google login failure
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      setErrorMessage(error);
    }
  }, [location]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // ✅ Important for sending/receiving cookies
      });

      console.log(res.data);
      navigate('/'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error.response);
      setErrorMessage(error.response?.data?.message || 'Login failed');
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    Cookies.set("authState", "login", { expires: 1 });
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 border-0" style={{ width: "22rem", borderRadius: "10px" }}>
        <div className="card-body">
          {/* Title */}
          <h2 className="fw-bold text-center text-dark mb-3">Login</h2>
          <p className="text-muted text-center">Enter your details to sign in</p>

          {/* Error Message */}
          {errorMessage && (
            <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email/Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email or Username</label>
              <input
                type="text"
                name="identifier"
                placeholder="Enter your email or username"
                value={formData.identifier}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-primary btn-lg w-100">
              Login
            </button>
          </form>

          <div className="text-center my-3">OR</div>

          {/* Google Login Button */}
          <div className="d-flex justify-content-center">
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline-primary w-100"
              style={{ backgroundColor: "#4285F4", color: "white" }}
            >
              <i className="bi bi-google me-2"></i> Sign in with Google
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center mt-3">
            <small>Don't have an account? <a href="/register" className="text-primary">Sign up</a></small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
