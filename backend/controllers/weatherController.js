const axios = require("axios");
const mongoose = require("mongoose");
const Polygon = require("../models/Polygon"); // Import Polygon model
const { AGRO_API_KEY } = require("../config/dotenvConfig");

exports.getWeatherAndNDVI = async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required!" });
    }

    console.log("Fetching weather for user:", userId);
    console.log("🔑 AGRO_API_KEY:", AGRO_API_KEY); 
    let query = mongoose.Types.ObjectId.isValid(userId) ? { userId: new mongoose.Types.ObjectId(userId) } : { userId };

    try {
        console.log("🟢 Step 1: Searching for user's polygon...");
        const polygon = await Polygon.findOne(query); // ✅ Correct way to fetch polygon

        if (!polygon) {
            return res.status(404).json({ error: "No polygon found. Fetch weather using direct location." });
        }
        
        if (!polygon.polygonId) {
            return res.status(400).json({ error: "Polygon exists but is missing polygonId!" });
        }
        
        console.log("🟢 Step 2: Fetching weather from Agromonitoring API...");
        const weatherResponse = await axios.get(
            `https://api.agromonitoring.com/agro/1.0/weather?polyid=${polygon.polygonId}&appid=${AGRO_API_KEY}`
        );
        console.log("🟢 Step 3: Fetching available NDVI images...");

// Define a valid time range (last 30 days)
const endTime = Math.floor(Date.now() / 1000)-3600; // Current timestamp
const startTime = endTime - (30 * 24 * 60 * 60); // 30 days ago
const availableImages = await axios.get(
    `https://api.agromonitoring.com/agro/1.0/image/search?polyid=${polygon.polygonId}&start=${startTime}&end=${endTime}&appid=${AGRO_API_KEY}`
);
console.log(availableImages)

// Check if there are images available
if (!availableImages.data.length) {
    console.log("❌ No NDVI data available for this polygon.");
    return res.status(404).json({ error: "No NDVI data available" });
}

// Use the most recent NDVI image
const latestImage = availableImages.data[0];
const lastNDVITimestamp = latestImage.dt;

console.log(`🟢 Latest NDVI available at: ${new Date(lastNDVITimestamp * 1000).toISOString()}`);

// Now fetch NDVI data for that specific time
const ndviResponse = await axios.get(
    `https://api.agromonitoring.com/agro/1.0/image/search?polyid=${polygon.polygonId}&start=${lastNDVITimestamp - (7 * 24 * 60 * 60)}&end=${lastNDVITimestamp}&appid=${AGRO_API_KEY}`
);


console.log("✅ NDVI Data Fetched:", ndviResponse.data);
const latestNDVI = ndviResponse.data[0];



       

console.log("✅ Weather Data Fetched:", weatherResponse.data);

        res.json({
            weather: weatherResponse.data,
            ndvi: latestNDVI.image.ndvi,
            ndviStats: latestNDVI.stats.ndvi,
            vegetationStatus: getNDVIHealthAdvice(latestNDVI)
        });
    }
     catch (error) {
        console.error("❌ Agromonitoring API Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};
// Function to interpret NDVI values
const getNDVIHealthAdvice = (ndviData) => {
    if (!ndviData.stats || !ndviData.stats.ndvi) return "No NDVI statistics available.";

    const ndviValue = ndviData.stats.ndvi.mean;

    if (ndviValue > 0.6) return "🌿 Healthy crops! Keep maintaining irrigation and fertilizers.";
    if (ndviValue >= 0.3 && ndviValue <= 0.6) return "⚠️ Crop stress detected! Check for pests or water issues.";
    return "🚨 Warning: Possible crop failure. Consider replanting or changing practices.";
};
