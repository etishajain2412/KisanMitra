import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // Check if the user is logged in (by checking if the token exists)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If there's no token, redirect to the login page
      navigate('/login');
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Optional: remove user data if stored in localStorage

    // Redirect to the login page after logging out
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Welcome to Your Dashboard</h2>
        <p className="text-center text-gray-600 mb-6">You're logged in successfully!</p>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full p-3 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
