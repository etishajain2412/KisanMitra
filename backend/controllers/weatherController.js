const axios = require("axios");
const mongoose = require("mongoose");
const Polygon = require("../models/Polygon"); // Import Polygon model
const { AGRO_API_KEY } = require("../config/dotenvConfig");
const i18n = require("i18n"); // Import i18n

exports.getWeatherAndNDVI = async (req, res) => {

    

    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: res.__("user_id_required") });
    }

    console.log(`${res.__("fetching_weather")} ${userId}`);
    console.log("🔑 AGRO_API_KEY:", AGRO_API_KEY);

    let query = mongoose.Types.ObjectId.isValid(userId) ? { userId: new mongoose.Types.ObjectId(userId) } : { userId };

    try {
        console.log(res.__("fetching_polygon"));
        const polygon = await Polygon.findOne(query);

        if (!polygon) {
            return res.status(404).json({ error: res.__("no_polygon_found") });
        }

        if (!polygon.polygonId) {
            return res.status(400).json({ error: res.__("polygon_missing_id") });
        }

        console.log(res.__("fetching_weather_api"));
        const weatherResponse = await axios.get(
            `https://api.agromonitoring.com/agro/1.0/weather?polyid=${polygon.polygonId}&appid=${AGRO_API_KEY}`
        );

        console.log(res.__("fetching_ndvi"));

        // Define a valid time range (last 30 days)
        const endTime = Math.floor(Date.now() / 1000) - 3600; // Current timestamp
        const startTime = endTime - (30 * 24 * 60 * 60); // 30 days ago
        const availableImages = await axios.get(
            `https://api.agromonitoring.com/agro/1.0/image/search?polyid=${polygon.polygonId}&start=${startTime}&end=${endTime}&appid=${AGRO_API_KEY}`
        );

        if (!availableImages.data.length) {
            console.log("❌", res.__("no_ndvi_data"));
            return res.status(404).json({ error: res.__("no_ndvi_data") });
        }

        // Use the most recent NDVI image
        const latestImage = availableImages.data[0];
        const lastNDVITimestamp = latestImage.dt;

        console.log(`${res.__("latest_ndvi_timestamp")} ${new Date(lastNDVITimestamp * 1000).toISOString()}`);

        // Fetch NDVI data for that specific time
        const ndviResponse = await axios.get(
            `https://api.agromonitoring.com/agro/1.0/image/search?polyid=${polygon.polygonId}&start=${lastNDVITimestamp - (7 * 24 * 60 * 60)}&end=${lastNDVITimestamp}&appid=${AGRO_API_KEY}`
        );

        console.log(res.__("ndvi_data_fetched"), ndviResponse.data);
        const latestNDVI = ndviResponse.data[0];

        console.log(res.__("weather_data_fetched"), weatherResponse.data);

        res.json({
            weather: weatherResponse.data,
            ndvi: latestNDVI.image.ndvi,
            ndviStats: latestNDVI.stats.ndvi,
            vegetationStatus: getNDVIHealthAdvice(latestNDVI, res)
        });
    } catch (error) {
        console.error("❌", res.__("api_error"), error.response?.data || error.message);
        res.status(500).json({ error: res.__("api_error") });
    }
};

// Function to interpret NDVI values
const getNDVIHealthAdvice = (ndviData, res) => {
    console.log("Current locale:", res.getLocale ? res.getLocale() : "Locale not available");

    if (!ndviData.stats || !ndviData.stats.ndvi) return res.__("no_ndvi_data");

    const ndviValue = ndviData.stats.ndvi.mean;

    if (ndviValue > 0.6) return res.__("ndvi_healthy");
    if (ndviValue >= 0.3 && ndviValue <= 0.6) return res.__("ndvi_stressed");
    return res.__("ndvi_warning");
};
