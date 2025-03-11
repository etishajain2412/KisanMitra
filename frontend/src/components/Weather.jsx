/*This component fetches the farmer's polygon from the backend and retrieves weather data.*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { GiFarmTractor } from "react-icons/gi";
import { WiThermometer, WiHumidity, WiStrongWind } from "react-icons/wi";
import { useTranslation } from "react-i18next";

const Weather = ({ userId }) => {
    const { t } = useTranslation();
    
    if (!userId) {
        console.warn("❌ userId is missing! Falling back to 'defaultUser'.");
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const [weather, setWeather] = useState(null);
    const [ndvi, setNDVI] = useState(null);
    const [ndviStats, setNDVIStats] = useState(null);
    const [vegetationAdvice, setVegetationAdvice] = useState("");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        console.log("Fetching weather...");
        if (!userId) {
            detectLocation();
            return;
        }
        fetchWeather();
    }, [userId]);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert(t("geolocation_not_supported"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`📍 ${t("location_detected")}: ${latitude}, ${longitude}`);

                try {
                    const response = await axios.post(
                        `${backendUrl}/api/polygon/get-or-create`,
                        { userId, lat: latitude, lon: longitude },
                        {
                            headers: {
                                "accept-Language": localStorage.getItem("preferredLanguage"),
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            }
                        }
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
            const response = await axios.get(`${backendUrl}/api/weather/${userId}`, {
            
                headers: {
                    "accept-Language": localStorage.getItem("preferredLanguage"),
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            console.log(response);
            setWeather(response.data.weather);
            setNDVI(response.data.ndvi);
            setNDVIStats(response.data.ndviStats);
            setVegetationAdvice(response.data.vegetationStatus);
        } catch (error) {
            console.error("Weather fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-3">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow p-3 text-center" style={{ backgroundColor: "#f3f6e5", borderRadius: "12px", padding: "15px" }}>
                        <GiFarmTractor size={50} color="#4caf50" className="mb-2" />
                        <h4 className="text-success">{t("agriculture_weather_report")}</h4>
                        {loading ? (
                            <Spinner animation="border" />
                        ) : weather && weather.main ? (
                            <>
                                <h5>📍 {weather.name || t("location")}</h5>
                                <div className="d-flex justify-content-center gap-4">
                                    <h5 className="d-flex align-items-center gap-2">
                                        <WiThermometer size={25} color="red" /> {weather.main?.temp ? (weather.main.temp - 273.15).toFixed(1) : "N/A"}°C
                                    </h5>
                                    <p className="mb-1">🌡️ {t("feels_like")}: {weather.main?.feels_like ? (weather.main.feels_like - 273.15).toFixed(1) : "N/A"}°C</p>
                                    <p className="mb-1">🌤 {weather.weather?.[0]?.description || t("no_description_available")}</p>
                                    <div className="d-flex justify-content-around align-items-center mt-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <WiStrongWind size={25} color="blue" />
                                            <span>{t("wind")}: {weather.wind?.speed} m/s</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <WiHumidity size={25} color="teal" />
                                            <span>{t("humidity")}: {weather.main?.humidity}%</span>
                                        </div>
                                    </div>
                                </div>
                                <h5 className="mt-3">🛰 {t("ndvi_analysis")}</h5>
                                {ndvi ? (
                                    <img 
                                        src={ndvi} 
                                        alt="NDVI Map" 
                                        className="rounded shadow-sm" 
                                        style={{ width: "80%", height: "200px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <p>{t("no_ndvi_data")}</p>
                                )}
                                <h6 className="mt-2 text-danger">{vegetationAdvice}</h6>
                            </>
                        ) : (
                            <p>{t("no_weather_data")}</p>
                        )}
                    </Card>
                    <div className="text-center mt-2">
                        <Button onClick={detectLocation} className="btn btn-success">
                            🔄 {t("refresh_location")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Weather;
