import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, MapPin, Thermometer, Droplets, Wind, RefreshCw, Tractor } from "lucide-react";
import { useTranslation } from "react-i18next";

const Weather = ({ userId }) => {
    const { t } = useTranslation();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const [weather, setWeather] = useState(null);
    const [ndvi, setNDVI] = useState(null);
    const [ndviStats, setNDVIStats] = useState(null);
    const [vegetationAdvice, setVegetationAdvice] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            detectLocation();
        } else {
            fetchWeather(userId);
        }
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
                            },
                            withCredentials: true,
                        }
                    );

                    console.log("✅ Polygon created:", response.data);
                    fetchWeather(userId);
                } catch (error) {
                    console.error("Polygon creation error:", error);
                }
            },
            (error) => {
                console.error("Location error:", error.message);
                alert(t("location_access_denied"));
            }
        );
    };

    const fetchWeather = async (userIdParam) => {
        try {
            const response = await axios.get(`${backendUrl}/api/weather/${userIdParam}`, {
                headers: {
                    "accept-Language": localStorage.getItem("preferredLanguage"),
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            console.log("🌤 Weather Response:", response.data);
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
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-soft-lg border border-green-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Tractor size={40} className="text-green-100" />
                        <h2 className="text-2xl font-bold">{t("agriculture_weather_report")}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
                            <p className="text-green-700 font-medium">Loading weather data...</p>
                        </div>
                    ) : weather && weather.main ? (
                        <div className="space-y-6">
                            {/* Location */}
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <MapPin className="text-green-600" size={20} />
                                    <h3 className="text-xl font-semibold text-green-800">
                                        {weather.name || t("location")}
                                    </h3>
                                </div>
                            </div>

                            {/* Main Weather Info */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Temperature */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Thermometer className="text-red-500" size={28} />
                                            <span className="text-3xl font-bold text-green-800">
                                                {(weather.main.temp - 273.15).toFixed(1)}°C
                                            </span>
                                        </div>
                                        <p className="text-green-600 text-sm">
                                            {t("feels_like")}: {(weather.main.feels_like - 273.15).toFixed(1)}°C
                                        </p>
                                        <p className="text-green-700 mt-2 capitalize">
                                            {weather.weather?.[0]?.description || t("no_description_available")}
                                        </p>
                                    </div>

                                    {/* Weather Details */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <Wind className="text-blue-600" size={24} />
                                            <div>
                                                <p className="font-medium text-blue-800">
                                                    {t("wind")}: {weather.wind?.speed} m/s
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                                            <Droplets className="text-teal-600" size={24} />
                                            <div>
                                                <p className="font-medium text-teal-800">
                                                    {t("humidity")}: {weather.main.humidity}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* NDVI Analysis */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                                    🛰️ {t("ndvi_analysis")}
                                </h4>
                                {ndvi ? (
                                    <div className="text-center">
                                        <img
                                            src={ndvi}
                                            alt="NDVI Map"
                                            className="rounded-lg shadow-sm mx-auto max-w-full h-48 object-cover border border-green-200"
                                        />
                                        {vegetationAdvice && (
                                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                <p className="text-amber-800 font-medium">{vegetationAdvice}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-green-600">
                                        <p>{t("no_ndvi_data")}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-green-700 text-lg">{t("no_weather_data")}</p>
                        </div>
                    )}
                </div>

                {/* Refresh Button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={detectLocation}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                    >
                        <RefreshCw size={18} />
                        {t("refresh_location")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Weather;
