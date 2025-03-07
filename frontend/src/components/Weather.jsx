/*This component fetches the farmer's polygon from the backend and retrieves weather data.*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner, Button } from "react-bootstrap";

const Weather = ({userId}) => {
    if (!userId) {
        console.warn("❌ userId is missing! Falling back to 'defaultUser'.");
         // Prevent errors
      }
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  //const [userId, setUserId] = useState(localStorage.getItem("userId"));
  console.log(`UserID: ${userId}`)

  useEffect(() => {
    console.log("Fetching weather...");
    if (!userId) {
    //   detectLocation();
      return;
    }
    fetchWeather();
  }, [userId]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await axios.post(
                `${backendUrl}/api/polygon/get-or-create`,
                { userId: "12345", lat: 27.2105472, lon: 78.0304384 },  // ✅ Ensure body is not empty
                { headers: { "Content-Type": "application/json" } }  // ✅ Ensure correct headers
            );
            console.log("Polygon created:", response.data);
            fetchWeather();
        } catch (error) {
            console.error("Polygon creation error:", error);
        }
        
      },
      (error) => {
        console.error("Location error:", error);
      }
    );
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/weather/${userId}`);
      setWeather(response.data);
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg text-center p-4">
            {loading ? (
              <Spinner animation="border" />
            ) : weather ? (
              <>
                <h3>📍 {weather.name || "Your Location"}</h3>
                <h4>🌡️ {weather.main.temp}°C</h4>
                <p>🌤 {weather.weather[0].description}</p>
                <p>💨 Wind: {weather.wind.speed} m/s</p>
                <p>💧 Humidity: {weather.main.humidity}%</p>
              </>
            ) : (
              <p>No weather data available.</p>
            )}
          </Card>
          <div className="text-center mt-3">
            <Button onClick={detectLocation}>🔄 Refresh Location</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Weather;
