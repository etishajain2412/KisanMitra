import React from "react";
import Weather from "../components/Weather";

const WeatherPage = () => {
  const userId = "67cb533d69bfdbc20d15df48"; // Replace with actual user ID from authentication

  return (
    <div>
      <h2 className="text-center mt-4">Weather Information</h2>
      <Weather userId={userId} />
    </div>
  );
};

export default WeatherPage;
