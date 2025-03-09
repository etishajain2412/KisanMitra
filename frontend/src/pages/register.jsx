import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Send a POST request to register the user
      const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Assuming the backend sends back a token upon successful registration
      // const { token } = res.data;

      // if (token) {
      //   localStorage.setItem('token', token); // Store token in localStorage
      //   navigate('/dashboard'); // Redirect to dashboard after successful registration
      // }

      // setMessage('Registration successful!');
      if (res.status === 201 || res.status === 200) {  // Check for a successful status code
        setMessage('Registration successful!');
        navigate('/'); // Redirect after success
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error.response);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    
  
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-4 border-0" style={{ width: "24rem", borderRadius: "10px" }}>
          <div className="card-body">
            {/* Title */}
            <h2 className="fw-bold text-center text-dark mb-3">Create an Account</h2>
            <p className="text-muted text-center">Join us today and explore the platform!</p>
  
            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
  
              {/* Username */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
  
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
  
              {/* Register Button */}
              <button type="submit" className="btn btn-primary btn-lg w-100">
                Register
              </button>
            </form>
  
            {/* Success Message */}
            {message && (
              <p className="text-center mt-3 text-success fw-bold">{message}</p>
            )}
  
            {/* Already have an account? */}
            <p className="text-center mt-3">
              <small>Already have an account? <a href="/login" className="text-primary">Sign in</a></small>
            </p>
          </div>
        </div>
      </div>
    );
}

export default Register;
