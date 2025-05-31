import React, { useEffect, useState } from "react";
import Weather from "../components/Weather";
import {jwtDecode} from "jwt-decode";  
import axios from "axios";
import { useTranslation } from "react-i18next";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const WeatherPage = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      // Get token from localStorage
      const fetchUser = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/users/me`, {
                withCredentials: true,
            });

            const user = response.data.user;
            console.log("👤 Logged-in user:", user);

            setUser(user?._id);
           
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    fetchUser();
   

    }, []);
  
    return (
      <div>
        <h2 className="text-center mt-4">{t("weather_info")}</h2>
        {user? (
          <Weather userId={user} />
        ) : (
          <p className="text-center text-danger">{t("login_to_view_weather")}</p>
        )}
      </div>
    );
  };
  
  export default WeatherPage;