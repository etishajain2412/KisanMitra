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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Welcome to the App</h2>
        
        <div className="space-y-4">
          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
