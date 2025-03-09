import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    identifier: '',  // This will handle either email or username
    password: ''
  });

  const navigate = useNavigate(); // Initialize navigate function

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
      });
      console.log(res.data);
      localStorage.setItem('token', res.data.token); // Save token to localStorage
      navigate('/'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error.response);
      alert('Login failed: ' + error.response.data.message); // Display error message
    }
  };

  return (
    
    
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-4 border-0" style={{ width: "22rem", borderRadius: "10px" }}>
          <div className="card-body">
            {/* Title */}
            <h2 className="fw-bold text-center text-dark mb-3">Login</h2>
            <p className="text-muted text-center">Enter your details to sign in</p>
  
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
