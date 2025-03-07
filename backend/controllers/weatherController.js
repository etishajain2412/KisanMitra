const axios = require("axios");
const mongoose = require("mongoose");
const Polygon = require("../models/Polygon"); // Import Polygon model
const { API_KEY } = require("../config/dotenvConfig");

exports.getWeather = async (req, res) => {
    const { userId } = req.params;
    // Convert to ObjectId only if it's valid
    // const query = mongoose.Types.ObjectId.isValid(userId) ? { userId: new mongoose.Types.ObjectId(userId) } : { userId };
    let query;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            query = { userId: new mongoose.Types.ObjectId(userId) }; // MongoDB ObjectId
        } else {
            query = { userId }; // Plain string ID
        }



    try {
        console.log("Fetching weather for user:", userId);
        if (!userId) {
            return res.status(400).json({ error: "User ID is required!" });
        }
        const polygon = await Polygon.findOne(query); // ✅ Correct way to fetch polygon

        if (!polygon) {
            return res.status(404).json({ error: "No polygon found. Fetch weather using direct location." });
        }
        // Simulate API response (replace with actual weather API)
        const fakeWeatherData = { temperature: 25, condition: "Sunny" };
       // const fakeWeatherData = { temperature: 25, condition: "Sunny" };
        
        res.json({ message: "Weather data fetched successfully!", data: fakeWeatherData });
    } 

        // const response = await axios.get(
        //     `https://api.agromonitoring.com/agro/1.0/weather?polyid=${polygon.polygonId}&appid=${API_KEY}`
        // );
        // console.log(response);
        // res.json(response.data);
     catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};
