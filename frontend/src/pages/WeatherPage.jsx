import React, { useEffect, useState } from "react";
import Weather from "../components/Weather";
import {jwtDecode} from "jwt-decode";  

const WeatherPage = () => {
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      // Get token from localStorage
      const token = localStorage.getItem("token");
  
      if (token) {
        try {
          const decoded = jwtDecode(token); // Decode the JWT token
          setUserId(decoded.id);  // Extract user ID from token
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    }, []);
  
    return (
      <div>
        <h2 className="text-center mt-4">Weather Information</h2>
        {userId ? (
          <Weather userId={userId} />
        ) : (
          <p className="text-center text-danger">Please log in to view weather data.</p>
        )}
      </div>
    );
  };
  
  export default WeatherPage;