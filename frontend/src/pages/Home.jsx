import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // Handle navigation to Login page
  const handleLogin = () => {
    navigate('/login');
  };

  // Handle navigation to Register page
  const handleRegister = () => {
    navigate('/register');
  };

  
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-4 border-0" style={{ width: "22rem", borderRadius: "10px" }}>
          <div className="card-body text-center">
            {/* App Title */}
            <h2 className="fw-bold text-dark mb-3">Welcome to the App</h2>
            <p className="text-muted">Login or register to continue</p>
  
            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="btn btn-primary btn-lg w-100 mb-2"
            >
              Login
            </button>
  
            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="btn btn-success btn-lg w-100"
            >
              Register
            </button>
          </div>
        </div>
      </div>
  );
}

export default Home;
