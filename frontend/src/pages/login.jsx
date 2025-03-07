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
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error.response);
      alert('Login failed: ' + error.response.data.message); // Display error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Username */}
          <div>
            <label className="block text-gray-600">Email or Username</label>
            <input
              type="text"
              name="identifier" // This field will accept either email or username
              placeholder="Enter your email or username"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
